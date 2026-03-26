// this component is used to display the playlist of songs
// it will display the songs in a list format
import React, { useCallback } from "react";

import "./Playlist.css"; // import the css file for the playlist component

import TrackList from "../TrackList/TrackList"; // import the track list component

// this is the playlist component 
const Playlist = (props) => {
    const { onNameChange, playlistTracks, onRemove, onSave } = props;

    // function to handle name changes in the playlist
    const handleNameChange = useCallback( 
        (event) => {
            onNameChange(event.target.value); // call the onNameChange function passed as a prop
        }, [onNameChange] // the dependencies are the onNameChange function that is passed as a prop
    ); 

    // render the playlist component
    // it will include the playlist name, the track list, and the save button
    return (
        <div className="Playlist">
            <input onChange={handleNameChange} defaultValue={"New Playlist"} />
            <TrackList 
                tracks={playlistTracks} // pass the playlist tracks as a prop
                isRemoval={true} // set isRemoval to true so that the remove button is displayed
                onRemove={onRemove} // pass the onRemove function as a prop
            />
            <button className="Playlist-save" onClick={onSave}>
                SAVE TO Spotify
                </button> 
        </div>
    ); 
}; 

// export the playlist component
export default Playlist; // export the playlist component