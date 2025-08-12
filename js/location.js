// Location utilities

// Convert real-world coordinates to grid coordinates
function coordsToGrid(latitude, longitude) {
  const bounds = GAME_CONFIG.bounds;
  
  // Normalize coordinates to 0-1 range
  const normalizedLat = (latitude - bounds.south) / (bounds.north - bounds.south);
  const normalizedLng = (longitude - bounds.west) / (bounds.east - bounds.west);
  
  // Convert to grid coordinates (0-4)
  const gridX = Math.floor(Math.max(0, Math.min(4, normalizedLng * GAME_CONFIG.gridSize)));
  const gridY = Math.floor(Math.max(0, Math.min(4, normalizedLat * GAME_CONFIG.gridSize)));
  
  return { x: gridX, y: gridY };
}

// Get current location using browser geolocation API
function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
}

// Watch location changes
function watchLocation(callback) {
  if (!navigator.geolocation) {
    throw new Error('Geolocation is not supported by this browser.');
  }

  return navigator.geolocation.watchPosition(
    (position) => {
      callback({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp
      });
    },
    (error) => {
      console.error('Error watching location:', error);
      callback(null, error);
    },
          {
        enableHighAccuracy: true,
        timeout: 5000, // Reduced timeout for faster response
        maximumAge: 0 // Always get fresh location data
      }
  );
}

// Calculate distance between two coordinates (in meters)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
}
