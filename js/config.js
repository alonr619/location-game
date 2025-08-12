// Supabase Configuration
// Replace these with your actual Supabase project credentials
const SUPABASE_CONFIG = {
  url: 'https://sfblzywyckhclrvgyqng.supabase.co', // Replace with your Supabase project URL
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmYmx6eXd5Y2toY2xydmd5cW5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTk0NzcsImV4cCI6MjA3MDUzNTQ3N30.UVxP7lgbjR8BVuXJQQ9QycPqCf0vmrfmyogg0-bLnmM' // Replace with your Supabase anon key
};

// Game Configuration
const GAME_CONFIG = {
  gridSize: 5,
  updateInterval: 100, // milliseconds - much faster updates!
  // Define the real-world bounds of your 5x5 grid
  // Example values - you'll need to adjust these based on your actual play area
  bounds: {
    north: 37.782182 + 0.0002,  // San Francisco latitude + small offset
    south: 37.782182 - 0.0002,
    east: -122.391254 + 0.0002, // San Francisco longitude + small offset
    west: -122.391254 - 0.0002
  }
};

// Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SUPABASE_CONFIG, GAME_CONFIG };
}
