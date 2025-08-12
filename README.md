# 🌍 Location Game

A real-world movement controlled video game where your physical location controls a character in a virtual 5x5 grid.

## 🎮 How It Works

1. **Mobile Device**: Use your phone to track your real-world location
2. **Desktop/Computer**: View the game state and watch your character move in real-time
3. **Real-time Updates**: Your position updates every 500ms as you move around
4. **5x5 Grid Mapping**: Your real-world coordinates are mapped to a virtual 5x5 grid

## 🚀 Setup Instructions

### 1. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings → API to get your project URL and anon key
3. Create the required database tables by running these SQL commands in the Supabase SQL editor:

```sql
-- Create user_locations table
CREATE TABLE user_locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  latitude DECIMAL NOT NULL,
  longitude DECIMAL NOT NULL,
  grid_x INTEGER NOT NULL,
  grid_y INTEGER NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create user_games table
CREATE TABLE user_games (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  game_state JSONB DEFAULT '{}',
  score INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE user_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_games ENABLE ROW LEVEL SECURITY;

-- Create policies for user_locations
CREATE POLICY "Users can view own location" ON user_locations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own location" ON user_locations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can upsert own location" ON user_locations
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policies for user_games
CREATE POLICY "Users can view own game" ON user_games
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own game" ON user_games
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can upsert own game" ON user_games
  FOR UPDATE USING (auth.uid() = user_id);

-- Enable real-time subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE user_locations;
ALTER PUBLICATION supabase_realtime ADD TABLE user_games;
```

### 2. Configure the Application

1. Open `js/config.js`
2. Replace the placeholder values with your Supabase credentials:

```javascript
const SUPABASE_CONFIG = {
  url: 'YOUR_SUPABASE_PROJECT_URL',
  anonKey: 'YOUR_SUPABASE_ANON_KEY'
};
```

3. Adjust the game bounds to match your physical play area:

```javascript
const GAME_CONFIG = {
  // ... other config
  bounds: {
    north: YOUR_NORTH_LATITUDE,
    south: YOUR_SOUTH_LATITUDE,
    east: YOUR_EAST_LONGITUDE,
    west: YOUR_WEST_LONGITUDE
  }
};
```

### 3. Run the Application

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:8000`

## 📱 Usage

### Setup
1. **Create Account**: Visit the signup page and create an account
2. **Login**: Sign in with your credentials

### Mobile Device (Movement Controller)
1. Visit `/pages/move.html` on your phone
2. Login if not already logged in
3. Enable location tracking
4. Walk around in your defined play area
5. Your position will update every 500ms

### Desktop/Computer (Game View)
1. Visit `/pages/game.html` on your computer
2. Login if not already logged in
3. Watch your character move in real-time as you walk around
4. See your score increase with each movement

## 🛠️ Project Structure

```
location-game/
├── index.html              # Home page
├── css/
│   └── styles.css          # All CSS styles
├── js/
│   ├── config.js           # Configuration (Supabase, game settings)
│   ├── supabase.js         # Supabase client and database functions
│   ├── location.js         # Geolocation utilities
│   └── game.js             # Game logic and state management
└── pages/
    ├── login.html          # Login page
    ├── signup.html         # Sign up page
    ├── move.html           # Mobile movement controller
    └── game.html           # Desktop game view
```

## 🎯 Features

- **Real-time Location Tracking**: Uses browser geolocation API
- **Grid Mapping**: Converts GPS coordinates to 5x5 grid positions
- **Real-time Updates**: Supabase real-time subscriptions for instant updates
- **Cross-device Play**: Use phone for movement, computer for viewing
- **User Authentication**: Secure user accounts with Supabase Auth
- **Responsive Design**: Works on both mobile and desktop

## 🔧 Customization

### Adjusting the Play Area
Modify the bounds in `js/config.js` to match your physical play area:

```javascript
bounds: {
  north: 37.7749 + 0.001,  // Northern boundary
  south: 37.7749 - 0.001,  // Southern boundary  
  east: -122.4194 + 0.001, // Eastern boundary
  west: -122.4194 - 0.001  // Western boundary
}
```

### Changing Update Frequency
Modify the `updateInterval` in `js/config.js`:

```javascript
updateInterval: 500, // milliseconds (500ms = 0.5 seconds)
```

### Adding Game Mechanics
The `GameState` class in `js/game.js` is designed to be extended. You can add:
- Collectible items
- Obstacles
- Multiple players
- Different game modes

## 🚨 Important Notes

- **Location Permissions**: Users must grant location access for the game to work
- **HTTPS Required**: Modern browsers require HTTPS for geolocation API (except localhost)
- **Accuracy**: GPS accuracy varies by device and environment
- **Battery Usage**: Continuous location tracking will drain battery faster

## 🔒 Security

- Row Level Security (RLS) is enabled on all database tables
- Users can only access their own data
- Supabase handles authentication securely

## 🐛 Troubleshooting

### Location Not Updating
1. Check browser location permissions
2. Ensure you're in the defined play area bounds
3. Check browser console for errors
4. Verify Supabase configuration

### Real-time Updates Not Working
1. Check Supabase real-time is enabled for your tables
2. Verify your Supabase plan includes real-time features
3. Check browser console for subscription errors

### Database Errors
1. Verify RLS policies are correctly set up
2. Check that tables exist and have correct structure
3. Ensure user is properly authenticated

## 📞 Support

This is a demonstration project. For issues:
1. Check the browser console for error messages
2. Verify your Supabase setup matches the instructions
3. Ensure location permissions are granted
4. Test with a simple coordinate within your defined bounds

## 🚀 Future Enhancements

- Multiplayer support
- Game objectives and challenges
- Different grid sizes
- Indoor positioning support
- Mobile app versions
- Advanced game mechanics
