// This component is used for displaying the list of tracks that are returned from the Spotify API
import React from 'react';
import './TrackList.css'; // import the css file for the track list component
import Track from '../Track/Track'; // import the track component
// this is the track list component 

// function to render the track list component 
const TrackList = (props) => {
    return (
        <div className="TrackList">
            {props.tracks.map((track) =>{
                return (
                    <Track
                        track={track}
                        key={track.id}
                        onAdd={props.onAdd}
                        onRemove={props.onRemove}
                        isRemoval={props.isRemoval}
                    />
                )
            })}
        </div>
    );
}; 

export default TrackList; // export the track list component
