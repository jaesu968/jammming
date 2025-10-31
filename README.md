# Jammming - Spotify Playlist Creator

Jammming is a web application that allows users to search for songs on Spotify and create custom playlists that are saved directly to their Spotify account. Built with React and integrated with the Spotify Web API, Jammming provides an intuitive interface for discovering and organizing music.

## About the Project

Jammming is a full-stack music discovery and playlist management application. Users can:
- Search for songs by title, artist, or album using the Spotify API
- View detailed track information including artist name and album
- Add tracks to a custom playlist
- Rename their playlist before saving
- Save completed playlists directly to their Spotify account
- Remove tracks from the playlist before saving

## Technologies Used

### Frontend
- **React** (v19.1.0) - A JavaScript library for building user interfaces with component-based architecture
- **React DOM** (v19.1.0) - React package for working with the DOM
- **CSS** - Custom styling for responsive UI design

### Backend/APIs
- **Spotify Web API** - For track search and playlist management functionality
- **PKCE OAuth 2.0 Flow** - Secure authentication method for accessing Spotify user data

### Development Tools
- **React Scripts** (5.0.1) - Build and development scripts
- **Testing Library** - For component testing (@testing-library/react, @testing-library/dom, @testing-library/jest-dom)
- **Create React App** - Project bootstrapping and configuration

## Key Components & Concepts

### Architecture
The application follows a **component-based architecture** with React hooks for state management:

### Core Components

1. **App Component** (`App.js`)
   - Main container managing global state (search results, playlist, playlist name)
   - Uses React Hooks: `useState`, `useCallback`, `useEffect`
   - Handles all core application logic and state updates

2. **SearchBar** (`SearchBar.js`)
   - Input field for users to enter search terms
   - Triggers search queries to the Spotify API

3. **SearchResults** (`SearchResults.js`)
   - Displays tracks returned from Spotify search
   - Allows users to add tracks to their playlist

4. **Track** (`Track.js`)
   - Individual track component showing track details (name, artist, album)
   - Provides add/remove buttons for playlist management

5. **TrackList** (`TrackList.js`)
   - Container component for displaying multiple tracks
   - Used by both SearchResults and Playlist components

6. **Playlist** (`Playlist.js`)
   - Shows currently selected tracks for the new playlist
   - Allows renaming the playlist
   - Provides save functionality

### Spotify Integration (`Spotify.js`)

The Spotify utility module handles:

- **PKCE OAuth 2.0 Authentication Flow**
  - Generates code verifier and code challenge (SHA-256 hashing)
  - Securely redirects users to Spotify authorization
  - Exchanges authorization code for access token
  - Stores token in localStorage with expiration tracking

- **Track Search** - Queries Spotify's `/v1/search` endpoint with track filtering

- **Playlist Management**
  - Creates new playlist under user's Spotify account
  - Adds tracks to the created playlist
  - Uses Spotify track URIs for accurate track identification

### State Management

The app uses **React Hooks** for state management:
- `searchResults` - Stores tracks from search queries
- `playlistName` - Current playlist name
- `playlistTracks` - Array of tracks added to the playlist

### Key Features

- **Real-time Search** - Search Spotify's database for tracks as you type
- **Playlist Customization** - Add/remove tracks and name your playlist
- **Persistent Authentication** - Token caching with expiration handling
- **Spotify Integration** - Direct playlist saving to user's Spotify account
- **Responsive Design** - Background image from Adobe Firefly AI

## Getting Started

### Prerequisites
- Node.js and npm installed
- Spotify developer account (for API credentials)

### Spotify API Setup

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account
3. Click "Create an App"
4. Fill in the app name and description
5. Set the redirect URI to `http://127.0.0.1:3000` (or your local development URL)
6. Copy the Client ID from your app dashboard
7. Update the `clientId` variable in `src/util/Spotify.js` with your Client ID

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd jammming
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm start
   ```

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://127.0.0.1:3000](http://127.0.0.1:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.


