// this component is what is used to display the app in the browser
import React, { useState, useCallback, useEffect } from 'react';
import './App.css';

import Playlist from '../Playlist/Playlist'; // import the playlist component
import SearchBar from '../SearchBar/SearchBar'; // import the search bar component
import SearchResults from '../SearchResults/SearchResults'; // import the search results component 
import Spotify from '../../util/Spotify'; // import the spotify class
import PlaylistList from '../PlaylistList/PlaylistList'; // import the playlist list component
import TrackList from '../TrackList/TrackList'; // import the track list component


function App() {
  // store state of search results 
  // initialize the state with an empty array
  const [searchResults, setSearchResults] = useState([]);
  // store state of a playlist 
  // initialize the state with an "New Playlist" string 
  const [playlistName, setPlaylistName] = useState("New Playlist");
  // store the state of the playlist tracks 
  // initialize the state with an empty array
  const [playlistTracks, setPlaylistTracks] = useState([]);
  // store the user's existing Spotify playlists
  const [userPlaylists, setUserPlaylists] = useState([]);
  // store the selected playlist from the playlist list component
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  // store tracks from the selected existing Spotify playlist
  const [selectedPlaylistTracks, setSelectedPlaylistTracks] = useState([]);
  // get the selected playlist's tracks and name when a playlist is selected from the playlist list component
  const handleSelectPlaylist = useCallback((playlist) => {
    setSelectedPlaylist(playlist); // update the selected playlist state
    Spotify.getPlaylistTracks(playlist.id) // call the getPlaylistTracks function from the Spotify class with the selected playlist's id
    .then(tracks => {
      setSelectedPlaylistTracks(tracks); // update the selected playlist track list in the bottom right pane
    })
    .catch(error => console.error('Error fetching playlist tracks:', error)); // log any errors that occur while fetching the playlist tracks
  }, []);

  const removeFromSelectedPlaylist = useCallback((track) => {
    if (!selectedPlaylist) return;

    Spotify.removeTrackFromPlaylist(selectedPlaylist.id, track.uri)
    .then((removed) => {
      if (!removed) return;
      setSelectedPlaylistTracks((prevTracks) =>
        prevTracks.filter((savedTrack) => savedTrack.id !== track.id)
      );
    })
    .catch((error) => console.error('Error removing track from playlist:', error));
  }, [selectedPlaylist]);

  // useEffect hook to intialize Spotify API when the component mounts
  useEffect(() => {
    Spotify.getAccessToken().then(token => {
      if (token) Spotify.getUserPlaylists().then(setUserPlaylists);
    });
  }, []);

  // define the search function  // this will use a callback function to search for tracks \
  // through the Spotify API 
  const search = useCallback((term) => {
    Spotify.search(term) // call the search function from the Spotify class
    .then(results => {
      console.log('Search results: ' + results); // log actual results from Spotify API 
      setSearchResults(results); // set the search results to the state 
    })
    .catch(error => console.error('Search error:' + error)); // see what results are returned 
  }, []); // 0 dependencies since the search function is not dependent on any other state

  // define the add track function 
  const addTrack = useCallback(
    (track) => {
      if (selectedPlaylist) {
        if (selectedPlaylistTracks.some((savedTrack) => savedTrack.id === track.id)) {
          return;
        }

        Spotify.addTrackToPlaylist(selectedPlaylist.id, track.uri)
        .then((added) => {
          if (!added) return;
          setSelectedPlaylistTracks((prevTracks) => [...prevTracks, track]);
        })
        .catch((error) => console.error('Error adding track to selected playlist:', error));
        return;
      }

      // check if the track is already in the playlist
      if (playlistTracks.some((savedTrack) => savedTrack.id === track.id))
        return; // if the track is already in the playlist, return
      // call back the setPlaylistTracks function with the new track added to the array
      setPlaylistTracks((prevTracks) => [...prevTracks, track]); // 
    }, [playlistTracks, selectedPlaylist, selectedPlaylistTracks] // dependencies for draft and selected playlist flows
  ); 

  // define the remove track function
  const removeTrack = useCallback((track) => {
    // call back the setPlaylistTracks function with the track removed from the array
    setPlaylistTracks((prevTracks) => 
      prevTracks.filter((savedTrack) => savedTrack.id !== track.id)); // filter out the track from the array
  }, []); // no dependencies, as the function does not depend on any state or props)

  // define an update playlist name function 
  // because people want to create their own playlist names
  const updatePlaylistName = useCallback((name) => {
    setPlaylistName(name); // call back the setPlaylistName function with the new name
  }, []); // no dependencies, as it is only checking for the name to change once a user types in the input field

  // define a save playlist function 
  const savePlaylist = useCallback(() => {
    // mock save logic here until API is implemented
    const trackUris = playlistTracks.map((track) => track.uri); // map the playlist tracks to an array of track uris
    if(playlistName && trackUris.length){
      Spotify.savePlaylist(playlistName, trackUris)
      .then(() => {
        setPlaylistName('New Playlist'); // reset the playlist name
        setPlaylistTracks([]); // reset the playlist tracks
      })
      .catch(error => console.error('Save Playlist error', error)); 
    }

  }, [playlistName, playlistTracks]); // the dependencies are the playlistName and playlistTracks arrays


  // render the app component
  return (
    <div>
    <h1>
      Ja<span className="highlight">mmm</span>ing
    </h1>
    <div className="App">
      <SearchBar onSearch={search} /> {/* pass the search function to the search bar component */}
      <div className="App-playlist">
        <SearchResults searchResults={searchResults} onAdd={addTrack} /> {/* pass the search results and add track function to the search results component */}
        <Playlist 
        playlistName={playlistName} // pass the playlist name to the playlist component
        playlistTracks={playlistTracks} // pass the playlist tracks to the playlist component
        onNameChange={updatePlaylistName} // pass the update playlist name function to the playlist component
        onRemove={removeTrack} // pass the remove track function to the playlist component
        onSave={savePlaylist} // pass the save playlist function to the playlist component
        />
      </div>

      <div>
        <h1>Your Playlists</h1>
      </div>

      <section className="App-user-playlists">
        <PlaylistList 
        playlists={userPlaylists} 
        onSelect={handleSelectPlaylist} 
        />

        <div className="App-selected-playlist">
          <h2>{selectedPlaylist ? selectedPlaylist.name : 'Select a playlist'}</h2>
          <TrackList
            tracks={selectedPlaylistTracks}
            isRemoval={true}
            onRemove={removeFromSelectedPlaylist}
            showAction={!!selectedPlaylist}
          />
        </div>
      </section>
    </div>
      <footer>Background Image comes from Adobe Firefly AI Image Generation</footer>
    </div>
  );
}

export default App;
