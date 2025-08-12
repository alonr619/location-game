// Supabase client setup
let supabase;

// Initialize Supabase (this will be called when the page loads)
function initSupabase() {
  if (typeof window !== 'undefined' && window.supabase) {
    supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
    return supabase;
  } else {
    console.error('Supabase library not loaded');
    return null;
  }
}

// Authentication functions
async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });
  return { data, error };
}

async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });
  return { data, error };
}

async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
}

// Database functions for user locations
async function updateUserLocation(userId, latitude, longitude, gridX, gridY) {
  const { data, error } = await supabase
    .from('user_locations')
    .upsert({
      user_id: userId,
      latitude: latitude,
      longitude: longitude,
      grid_x: gridX,
      grid_y: gridY,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id'
    });
  
  return { data, error };
}

async function getUserLocation(userId) {
  const { data, error } = await supabase
    .from('user_locations')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  return { data, error };
}

// Database functions for game state
async function updateGameState(userId, gameState, score, level) {
  const { data, error } = await supabase
    .from('user_games')
    .upsert({
      user_id: userId,
      game_state: gameState,
      score: score,
      level: level,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id'
    });
  
  return { data, error };
}

async function getUserGame(userId) {
  const { data, error } = await supabase
    .from('user_games')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  return { data, error };
}

// Real-time subscriptions
function subscribeToLocationUpdates(userId, callback) {
  return supabase
    .channel('location-updates')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'user_locations',
      filter: `user_id=eq.${userId}`
    }, callback)
    .subscribe();
}

function subscribeToGameUpdates(userId, callback) {
  return supabase
    .channel('game-updates')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'user_games',
      filter: `user_id=eq.${userId}`
    }, callback)
    .subscribe();
}
