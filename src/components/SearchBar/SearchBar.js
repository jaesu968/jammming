// this compoonent is for the search bar
// it will incldue  a search button and a search input
import React, { useState, useCallback } from 'react';
import './SearchBar.css';

// this is the search bar component
const SearchBar = (props) => {
    const [term, setTerm] = useState(""); // set it to an empty string 
    // loading state to handle serch in progress
    const [isSearching, setIsSearching] = useState(false); // set it to false by default

    // handle the change in the input field
    // use callback function to set the term to the value of the input field
    const handleTermChange = useCallback((event) => {
        setTerm(event.target.value); // set the term to the value of the input field
    }, []); // no dependendcies, so it will only run once

    // define the search funciton 
    const search = useCallback(async () => {
        // if the term is empty, warn the user and return 
        if (!term.trim()){
            console.warn('Search term is empty'); // warn the user 
            return; // return to avoid calling the onSearch function
        }
        // use try catch to handle errors
        try {
            setIsSearching(true); // set the loading state to true
            console.log('Searching for: ' + term); // log the search term (see if search is working)
            await props.onSearch(term); // call the onSearch function passed from the parent component
         } catch (error) {
            console.error('Search error: ' + error); // log the error
        } finally {
            setIsSearching(false); // set the loading state to false
        }
    }, [props.onSearch, term]); // dependendcies, so it will run every time the term or onSearch changes)

    // add keyboard support for support (the enter key)
    const handleKeyPress = useCallback((event) => {
        if (event.key === 'Enter') { // if the key pressed is the enter key
            search(); // call the search function
        }
    }, [search]); 

    return (
        <div className="SearchBar">
            <input placeholder="Enter Artist, Song, or Album" 
            onChange={handleTermChange}
            onKeyPress={handleKeyPress}
            value={term}
            disabled={isSearching} /> {/* set the value of the input field to the term */}
            <button className="SearchButton" 
            onClick={search}
            disabled={isSearching || !term.trim()}
            >
                {isSearching ? 'SEARCHING...' : 'SEARCH'}
            </button> {/* call the search function when the button is clicked */}
        </div>
    ); 
}; 

export default SearchBar; // export the search bar component
