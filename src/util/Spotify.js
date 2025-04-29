// This is the javascript file that will be used to make API calls to the Spotify API
// Search the API for track information based on search terms 
// and save the playlist to the user's Spotify account and to the App 

// the statekey is used to store the state of the app
const stateKey = 'spotify_auth_state'; // the state key is used to store the state of the app
// generate a random string function 
const generateRandomString = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; // the possible characters to be used in the random string
    let text = ''; // the text variable is used to store the random string
    for (let i = 0; i < length; i++) { // loop through the length of the random string
        text += possible.charAt(Math.floor(Math.random() * possible.length)); // generate a random character from the possible characters and add it to the text variable
    }
    return text; // return the random string
}

var client_id = '5fc8733a17574f7a843cc4179ba48f1b'; // your client id 
var redirect_uri = 'http://127.0.0.1:3000'; // your redirect uri
let accessToken; // global variable to store the access token

// generate a random string to be used as the state parameter
var state = generateRandomString(16);

// function to generate a random string of a given length
localStorage.setItem(stateKey, state);
// set the scope of the API call to read the user's private information
var scope = 'user-read-private user-read-email playlist-modify-public'; 
// build the URL for the API call
var url = 'https://accounts.spotify.com/authorize';
url += '?response_type=token';
url += '&client_id=' + encodeURIComponent(client_id);
url += '&scope=' + encodeURIComponent(scope);
url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
url += '&state=' + encodeURIComponent(state);

// this is the component that will be used to make API calls to the Spotify API,
// it  will be used to search for tracks and save playlists to the user's Spotify account
const Spotify = {
    getAccessToken(){
        // check if the access token is already stored in the local storage
        if (accessToken){
            return accessToken; 
        }
        // check if the access token is in the URL 
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/); // match the access token from the URL
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/); // match the expiration time from the URL
        // use a conditional to check if the access token is in the URL 
        if (accessTokenMatch && expiresInMatch){
            accessToken = accessTokenMatch[1]; // set the access token to the value of the access token in the URL
            const expiresIn = Number(expiresInMatch[1]); // set the expiration time to the value of the expiration time in the URL
            // set the expiration time to the current time plus the expiration time
            window.setTimeout(() => accessToken = '', expiresIn * 1000); // set the access token to an empty string after the expiration time
            window.history.pushState('Access Token', null, '/'); // set the URL to the root of the website
            return accessToken; // return the access token
        } else {
            // if the access token is not in the URL, redirect the user to the Spotify authorization page
            window.location = url; // redirect the user to the Spotify authorization page
        }
    }, // end of getAccessToken function 

    // function to search for tracks 
    // the term parameter is the search term the user enters in the search bar 
    search (term) { 
        const accessToken = Spotify.getAccessToken(); // get the access token , used to make API calls to the Spotify API
        console.log(accessToken); // see if the access token is working

        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,{
            headers: { // set the headers for the API call 
                Authorization: `Bearer ${accessToken}` // set the authorization header to the access token} 
            }
        }).then(response => { // make the API call to the Spotify API
            console.log('API response:', response); // log the response from the API call
            return response.json(); // return the response as a JSON object
        }).then(jsonResponse => { // parse the JSON response})
            console.log('JSON response:', jsonResponse); // log the JSON response from the API call
            if (!jsonResponse.tracks) { // check if the response contains tracks
                return []; // if not, return an empty array 
            }
            return jsonResponse.tracks.items.map(track => ({ // map the tracks to an array of objects   
                id: track.id, // set the id to the track id
                name: track.name, // set the name to the track name
                artist: track.artists[0].name, // set the artist to the first artist in the track
                album: track.album.name, // set the album to the album name
                uri: track.uri // set the uri to the track uri 
            })); // return the array of objects 
    }); 
}, // end of search function 

// function to save the playlist to the user's Spotify account
savePlaylist(name, trackUris){
    // check if the user has entered a name for the play list 
    // and if the trackUris array is not empty
    if (!name || !trackUris.length){
        return; // if not, return 
    }

    // get the access token again 
    const accessToken = Spotify.getAccessToken(); // get the access token
    const headers = { Authorization: `Bearer ${accessToken}` }; // set the headers for the API call
    let userId; // variable to store the user id
    
    // make the API call to the Spotify API to get the user id 
    return fetch('https://api.spotify.com/v1/me', {headers: headers} // make a call to the Spotify API to get the user's playlist      
    ).then(response => response.json() // parse the response as a JSON object)
    ).then(jsonResponse => { // parse the JSON response})
        userId = jsonResponse.id; // set the user id to the user id in the response
        return fetch('https://api.spotify.com/v1/users/${userId}/playlists', { // make a call to the Spotify API to create a new playlist)
            headers: headers, 
            method: 'POST', 
            body: JSON.stringify({ name: name}) // set the body of the request to the name of the playlist
        }).then(response => response.json() // parse the response as a JSON object
        ).then(jsonResponse => { // parse the JSON response}
            const playlistId = jsonResponse.id; // set the playlist id to the id in the response
            return fetch('https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks', { // make a call to the Spotify API to add tracks to the playlist)   
                headers: headers, 
                method: 'POST', 
                body: JSON.stringify({ uris: trackUris}) // set the body of the request to the track uris
                }); 
            }); 
        });
    } 
}; 

// export the Spotify object
export default Spotify; // export the Spotify object 
