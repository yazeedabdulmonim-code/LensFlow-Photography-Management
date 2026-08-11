import LZString from 'lz-string';

// We use 5 fixed blob IDs to store chunks of our compressed data.
// 5 blobs * ~9KB per blob = 45KB compressed data limit (approx 500KB uncompressed JSON limit)
const CHUNK_BLOBS = [
  '019fef8c-8208-7283-ab69-a2406e1a5134',
  '019fef8c-8467-7977-b3b7-2f45467cb080',
  '019fef8c-85ca-778b-9a9d-512864e77c4c',
  '019fef8c-8744-7913-bbbe-dc41e9c87843',
  '019fef8c-88a8-7b75-bcbc-9b8fde521d4b'
];

// Safe limit under JSONBlob's 10KB restriction
const CHUNK_SIZE = 9000; 

// Load app state from cloud
export const fetchAppFromCloud = async () => {
  try {
    let fullCompressed = '';
    
    // Fetch all chunks concurrently
    const promises = CHUNK_BLOBS.map(id => 
      fetch(`https://jsonblob.com/api/jsonBlob/${id}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      }).then(r => r.ok ? r.json() : null)
    );
    
    const results = await Promise.all(promises);
    
    // Concatenate chunks
    for (const res of results) {
      if (res && typeof res.chunk === 'string') {
        fullCompressed += res.chunk;
      }
    }
    
    if (fullCompressed) {
      const decompressed = LZString.decompressFromBase64(fullCompressed);
      if (decompressed) {
        const data = JSON.parse(decompressed);
        // Migration: If data is an array, it's the old team-only structure
        if (Array.isArray(data)) {
          return { team: data };
        }
        return data;
      }
    }
  } catch (error) {
    console.warn('Cloud sync load failed, using local storage fallback:', error);
  }
  return null;
};

// Save app state to cloud
export const saveAppToCloud = async (appData) => {
  if (!appData) return false;
  
  try {
    const jsonStr = JSON.stringify(appData);
    const compressed = LZString.compressToBase64(jsonStr);
    
    const chunks = [];
    for (let i = 0; i < compressed.length; i += CHUNK_SIZE) {
      chunks.push(compressed.substring(i, i + CHUNK_SIZE));
    }
    
    if (chunks.length > CHUNK_BLOBS.length) {
      console.warn('App data is too large for current cloud sync configuration.');
    }
    
    // Upload chunks concurrently
    const promises = CHUNK_BLOBS.map((id, index) => {
      const chunkData = index < chunks.length ? chunks[index] : "";
      return fetch(`https://jsonblob.com/api/jsonBlob/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ chunk: chunkData })
      });
    });
    
    const results = await Promise.all(promises);
    return results.every(r => r.ok);
  } catch (error) {
    console.warn('Cloud sync save failed, changes saved locally:', error);
    return false;
  }
};
