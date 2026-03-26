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
  // Keep a snapshot of the original selected playlist so we can stage edits locally.
  // We only commit these edits to Spotify when the user clicks SAVE CHANGES.
  const [originalSelectedTrackUris, setOriginalSelectedTrackUris] = useState([]);
  const [pendingAddedUris, setPendingAddedUris] = useState([]);
  const [pendingRemovedUris, setPendingRemovedUris] = useState([]);
  const [isSavingSelected, setIsSavingSelected] = useState(false);
  // get the selected playlist's tracks and name when a playlist is selected from the playlist list component
  const handleSelectPlaylist = useCallback((playlist) => {
    setSelectedPlaylist(playlist); // update the selected playlist state
    Spotify.getPlaylistTracks(playlist.id) // call the getPlaylistTracks function from the Spotify class with the selected playlist's id
    .then(tracks => {
      setSelectedPlaylistTracks(tracks); // update the selected playlist track list in the bottom right pane
      // Reset staged change state every time a different playlist is selected.
      setOriginalSelectedTrackUris(tracks.map((track) => track.uri));
      setPendingAddedUris([]);
      setPendingRemovedUris([]);
    })
    .catch(error => console.error('Error fetching playlist tracks:', error)); // log any errors that occur while fetching the playlist tracks
  }, []);

  const removeFromSelectedPlaylist = useCallback((track) => {
    if (!selectedPlaylist) return;

    // Stage removal in UI immediately so the user can review pending edits.
    setSelectedPlaylistTracks((prevTracks) =>
      prevTracks.filter((savedTrack) => savedTrack.id !== track.id)
    );

    if (originalSelectedTrackUris.includes(track.uri)) {
      // Track existed originally, so mark it as a pending removal.
      setPendingRemovedUris((prevUris) =>
        prevUris.includes(track.uri) ? prevUris : [...prevUris, track.uri]
      );
    } else {
      // Track was added during this session, so remove it from pending adds instead.
      setPendingAddedUris((prevUris) => prevUris.filter((uri) => uri !== track.uri));
    }
  }, [selectedPlaylist, originalSelectedTrackUris]);

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
        // Prevent duplicate tracks in the currently selected playlist view.
        if (selectedPlaylistTracks.some((savedTrack) => savedTrack.id === track.id)) {
          return;
        }

        // Stage addition locally; save button will persist to Spotify.
        setSelectedPlaylistTracks((prevTracks) => [...prevTracks, track]);
        setPendingRemovedUris((prevUris) => prevUris.filter((uri) => uri !== track.uri));

        if (!originalSelectedTrackUris.includes(track.uri)) {
          setPendingAddedUris((prevUris) =>
            prevUris.includes(track.uri) ? prevUris : [...prevUris, track.uri]
          );
        }

        return;
      }

      // check if the track is already in the playlist
      if (playlistTracks.some((savedTrack) => savedTrack.id === track.id))
        return; // if the track is already in the playlist, return
      // call back the setPlaylistTracks function with the new track added to the array
      setPlaylistTracks((prevTracks) => [...prevTracks, track]); // 
    }, [playlistTracks, selectedPlaylist, selectedPlaylistTracks, originalSelectedTrackUris] // dependencies for draft and selected playlist flows
  ); 

  const saveSelectedPlaylistChanges = useCallback(async () => {
    if (!selectedPlaylist || isSavingSelected) return;

    if (!pendingAddedUris.length && !pendingRemovedUris.length) {
      return;
    }

    setIsSavingSelected(true);

    try {
      // Apply deletions first, then additions, to keep playlist state predictable.
      const removeResults = await Promise.all(
        pendingRemovedUris.map((trackUri) => Spotify.removeTrackFromPlaylist(selectedPlaylist.id, trackUri))
      );

      const addResults = await Promise.all(
        pendingAddedUris.map((trackUri) => Spotify.addTrackToPlaylist(selectedPlaylist.id, trackUri))
      );

      if (removeResults.some((result) => !result) || addResults.some((result) => !result)) {
        console.error('Some playlist changes failed to save.');
      }

      // Refresh from Spotify so UI reflects the source of truth after save.
      const refreshedTracks = await Spotify.getPlaylistTracks(selectedPlaylist.id);
      setSelectedPlaylistTracks(refreshedTracks);
      setOriginalSelectedTrackUris(refreshedTracks.map((track) => track.uri));
      setPendingAddedUris([]);
      setPendingRemovedUris([]);
    } catch (error) {
      console.error('Error saving selected playlist changes:', error);
    } finally {
      setIsSavingSelected(false);
    }
  }, [selectedPlaylist, isSavingSelected, pendingAddedUris, pendingRemovedUris]);

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
    // Save the "New Playlist" editor panel as a brand new Spotify playlist.
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

  const hasPendingSelectedChanges = pendingAddedUris.length > 0 || pendingRemovedUris.length > 0;
  const pendingSelectedSummary = `Pending changes: +${pendingAddedUris.length} / -${pendingRemovedUris.length}`;


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
          {selectedPlaylist && (
            <p className="App-selected-pending">{pendingSelectedSummary}</p>
          )}
          <TrackList
            tracks={selectedPlaylistTracks}
            isRemoval={true}
            onRemove={removeFromSelectedPlaylist}
            showAction={!!selectedPlaylist}
          />
          <button
            className="App-selected-save"
            onClick={saveSelectedPlaylistChanges}
            disabled={!selectedPlaylist || !hasPendingSelectedChanges || isSavingSelected}
          >
            {isSavingSelected ? 'SAVING CHANGES...' : 'SAVE CHANGES'}
          </button>
        </div>
      </section>
    </div>
      <footer>Background Image comes from Adobe Firefly AI Image Generation</footer>
    </div>
  );
}

export default App;
