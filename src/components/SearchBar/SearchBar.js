// this compoonent is for the search bar
// it will incldue  a search button and a search input
import React, { useState, useCallback } from 'react';
import './SearchBar.css';

// this is the search bar component
const SearchBar = (props) => {
    const [term, setTerm] = useState(""); // set it to an empty string 

    // handle the change in the input field
    // use callback function to set the term to the value of the input field
    const handleTermChange = useCallback((event) => {
        setTerm(event.target.value); // set the term to the value of the input field
    }, []); // no dependendcies, so it will only run once

    // define the search funciton 
    const search = useCallback(() => {
        props.onSearch(term); // call the onSearch function passed from the parent component
    }, [props.onSearch, term]); // dependendcies, so it will run every time the term or onSearch changes)

    return (
        <div className="SearchBar">
            <input placeholder="Enter A Song Title" onChange={handleTermChange} /> {/* set the value of the input field to the term */}
            <button className="SearchButton" onClick={search}>SEARCH</button> {/* call the search function when the button is clicked */}
        </div>
    ); 
}; 

export default SearchBar; // export the search bar component
