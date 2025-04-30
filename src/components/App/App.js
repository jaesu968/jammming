// this component is what is used to display the app in the browser
import React, { useState, useCallback, useEffect } from 'react';
import './App.css';

import Playlist from '../Playlist/Playlist'; // import the playlist component
import SearchBar from '../SearchBar/SearchBar'; // import the search bar component
import SearchResults from '../SearchResults/SearchResults'; // import the search results component 
import Spotify from '../../util/Spotify'; // import the spotify class


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

  // useEffect hook to intialize Spotify API when the component mounts
  useEffect(() => {
    Spotify.getAccessToken(); // call the getAccessToken function from the Spotify class
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
      // check if the track is already in the playlist
      if (playlistTracks.some((savedTrack) => savedTrack.id === track.id))
        return; // if the track is already in the playlist, return
      // call back the setPlaylistTracks function with the new track added to the array
      setPlaylistTracks((prevTracks) => [...prevTracks, track]); // 
    }, [playlistTracks] // the dependencies are the playlistTracks array
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
      </div>
      <footer>Background Image comes from Adobe Firefly AI Image Generation</footer>
    </div>
  );
}

export default App;
