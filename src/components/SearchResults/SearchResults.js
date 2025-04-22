// This component is to get the search results from the Spotify API
import React from 'react';
import './SearchResults.css';

import TrackList from '../TrackList/TrackList'; // import the track list component

 

//  this is the search results component
const SearchResults = (props) => {
    return (
        <div className="SearchResults">
            <h2>Results</h2>
            <TrackList tracks={props.searchResults} onAdd={props.onAdd} />
            </div>
    );
}; 

export default SearchResults; // export the search results component