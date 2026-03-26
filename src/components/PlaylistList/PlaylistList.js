// This component is respoonsible for displaying the list of playlists
// associated with the user
// and allowing them to select a playlist to view or edit (make changes)
import React, { useState } from "react"; 
import "./PlaylistList.css"; // import the css file for the playlist list component

// this is the playlist list component 
// it will take props from the App component and display the list of playlists
const PlaylistList = (props) => {
    const { playlists, onSelect } = props; // destructure the playlists and onSelect function from the props

    // state to keep track of the selected playlist
    const [selectedPlaylist, setSelectedPlaylist] = useState(null); // initialize the state with null

    
    // function to handle playlist selection
    const handleSelect = (playlist) => {
        setSelectedPlaylist(playlist); // update the selected playlist state
        onSelect(playlist); // call the onSelect function passed as a prop with the selected playlist
    }
    
    // render the playlist list component
    // it will display the list of playlists and allow the user to select one
    return (
        <div className="PlaylistList">
            <h2>Your Playlists</h2>
            <ul>
                {playlists.map((playlist) => (
                    <li
                        key={playlist.id}
                        onClick={() => handleSelect(playlist)}
                        className={selectedPlaylist?.id === playlist.id ? "selected" : ""}
                    >
                        {playlist.name}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default PlaylistList;
