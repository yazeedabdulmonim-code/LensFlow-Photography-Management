// Cloud Sync Service using a secure public Key-Value Store for Real-Time Multi-Device Synchronization
// fallbacks gracefully to localStorage if offline or if the service is unavailable.

const BUCKET_ID = 'td_ahed_lensflow_prod_98723491823';
const TEAM_KEY = 'team';
const CLOUD_URL = `https://kvdb.io/${BUCKET_ID}/${TEAM_KEY}`;

// Load team data from cloud
export const fetchTeamFromCloud = async () => {
  try {
    const response = await fetch(CLOUD_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (error) {
    console.warn('Cloud sync load failed, using local storage fallback:', error);
  }
  return null;
};

// Save team data to cloud
export const saveTeamToCloud = async (teamData) => {
  if (!Array.isArray(teamData) || teamData.length === 0) return false;
  
  try {
    const response = await fetch(CLOUD_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(teamData)
    });
    
    return response.ok;
  } catch (error) {
    console.warn('Cloud sync save failed, changes saved locally:', error);
    return false;
  }
};
