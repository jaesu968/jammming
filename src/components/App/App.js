// this component is what is used to display the app in the browser
import React from 'react';
import './App.css';

import SearchBar from '../SearchBar/SearchBar'; // import the search bar component
import SearchResults from '../SearchResults/SearchResults'; // import the search results component 


function App() {
  // store state of search results 
  const [searchResults, setSearchResults] = useState([]);
  // define the search function 
  const search = (term) => {
    // add search logic here 
    console.log(term); // log the term to the console
  }; 

  return (
    <div>
    <h1>
      Ja<span className="highlight">mmm</span>ing
    </h1>
    <div className="App">
      <SearchBar onSearch={search} /> {/* pass the search function to the search bar component */}
      <div className="App-playlist">
        <SearchResults searchResults={searchResults} onAdd={addTrack} /> {/* pass the search results and add track function to the search results component */}
        </div> 
      </div>
      <footer>Background Image comes from Adobe Firefly AI Image Generation</footer>
    </div>
  );
}

export default App;
