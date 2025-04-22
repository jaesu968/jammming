// This component is used to manipulate individual tracks
import React, { useCallback, useState } from "react";
import "./Track.css"; // import the css file for the track component

// this is the track component 
const Track = (props) => {
    // add track function 
    // the useCallback hook is used to memorize the function so that it is not recreated on every render
    // this is used to optimize performance and avoid unnecessary re-renders
    // the useCallback hook takes two arguments, the function to be called and an array of dependencies
    // the function will only be recreated if the dependencies change
    // in this case, the dependencies are the onAdd and onRemove functions that are passed as props to the component
    // the depenencies are the tracks you are adding and the function that is being called
    const addTrack = useCallback((event) => {
        props.onAdd(props.track);
    }, [props.onAdd, props.track]); 
    // remove track function
    const removeTrack = useCallback((event) => {
        props.onRemove(props.track);
    }, [props.onRemove, props.track]);
    // a function to render the adding or removal of a track
    const renderAction = () => {
        if (props.isRemoval) {
            return (
                <button className="Track-action" onClick={removeTrack}>
                    -
                </button>
            );
        }
        return (
            <button className="Track-action" onClick={addTrack}>
                +
            </button>
        );
    };
    // render the track component 
    // it will inclue the track name, artist, and album
    return (
        <div className="Track">
            <div className="Track-information">
                <h3>{props.track.name}</h3>
                <p>
                    {props.track.artist} | {props.track.album}
                </p>
            </div>
            {renderAction()}
        </div>
    )
};
    
// export the track component 
export default Track; 