// Cloud Sync Service using a secure public Key-Value Store for Real-Time Multi-Device Synchronization
// fallbacks gracefully to localStorage if offline or if the service is unavailable.

const BLOB_ID = '019fef62-04c9-76e0-a76d-da0bbb6af325';
const CLOUD_URL = `https://jsonblob.com/api/jsonBlob/${BLOB_ID}`;

// Load app state from cloud
export const fetchAppFromCloud = async () => {
  try {
    const response = await fetch(CLOUD_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data) {
        // Migration: If data is an array, it's the old team-only structure
        if (Array.isArray(data)) {
          return { team: data };
        }
        // Otherwise, it's the full app state object
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
    const response = await fetch(CLOUD_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(appData)
    });
    
    return response.ok;
  } catch (error) {
    console.warn('Cloud sync save failed, changes saved locally:', error);
    return false;
  }
};
