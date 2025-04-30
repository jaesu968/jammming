// This is the javascript file that will be used to make API calls to the Spotify API
// Search the API for track information based on search terms 
// and save the playlist to the user's Spotify account and to the App 

// client id for spotify API 
const clientId = '5fc8733a17574f7a843cc4179ba48f1b'; // the client id is used to identify the app to the Spotify API
const redirectUri = 'http://127.0.0.1:3000'; // the redirect uri is used to redirect the user back to the app after authorization
const tokenKey = 'spotify_auth_token'; // the token key is used to store the access token in the local storage
const scope = 'playlist-modify-public playlist-modify-private'; // the scope is used to request permissions from the user

// generating a code verifier and code challenge since we will use PKCE flow to authenticate with Spotify
// code verifier is a random string that is used to generate the code challenge
// code challenge is a hash of the code verifier
// code verifier and code challenge are used to authenticate with Spotify
function generateCodeVerifier(length = 128){
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'; // possible characters to use in the code verifier
    let codeVerifier = ''; // code verifier is a random string that is used to generate the code challenge
    // loop through the length of the code verifier
    for (let i = 0; i < length; i++){
        codeVerifier += 
        possible.charAt(Math.floor(Math.random() * possible.length)); // generate a random character from the possible characters
    }
    return codeVerifier; // return the code verifier
}
// use async function for the code challenge 
// convert verifier to a SHA256 challenge 
async function generateCodeChallenge(codeVerifier) {
    const encoder = new TextEncoder(); // create a new text encoder to encode the code verifier
    const data = encoder.encode(codeVerifier); // encode the code verifier
    const digest = await crypto.subtle.digest('SHA-256', data); // hash the code verifier using SHA-256
    return btoa(String.fromCharCode(...new Uint8Array(digest))) // convert the hash to a base64 string
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); // replace the + and / characters with - and _ to make it URL safe
  }

// this is the component that will be used to make API calls to the Spotify API,
// it  will be used to search for tracks and save playlists to the user's Spotify account
const Spotify = {
    async getAccessToken(){
        const urlParams = new URLSearchParams(window.location.search); // get the URL parameters from the current URL
        const code = urlParams.get('code'); // get the code from the URL parameters
        

        // check if the access token is already stored in the local storage
        if (localStorage.getItem(tokenKey)){
            return localStorage.getItem(tokenKey); // return the access token from the local storage
        }
        // check if the code is already stored in the URL parameters
        // if no code is found, redirect the user to Spotify to authorize the app
        if (!code){
            // Step 1:  redirect the user to Spotify for authorization  
            const verifier = generateCodeVerifier(); // generate the code verifier
            const challenge = await generateCodeChallenge(verifier); // generate the code challenge
            localStorage.setItem('code_verifier', verifier); // store the code verifier in the local storage
        // make authorization URL  
        const authUrl = `https://accounts.spotify.com/authorize?` +
            `client_id=${encodeURIComponent(clientId)}` +
            `&response_type=code` + // set the response type to code
            `&redirect_uri=${encodeURIComponent(redirectUri)}` +
            `&scope=${encodeURIComponent(scope)}` +
            'code_challenge_method=S256' +
            `&code_challenge=${challenge}`; 
        // redirect the user to Spotify with code challenge 
        window.location.href = authUrl; // redirect the user to the authorization URL
        return; // return nothing since the user is redirected to Spotify
        } else {
            // Step 2:  exchange code for the access token 
            const verifier = localStorage.getItem('code_verifier'); // get the code verifier from the local storage
            const body = new URLSearchParams({ // create a new URLSearchParams object with the code and code verifier
                client_id: clientId, // set the client id to the client id
                grant_type: 'authorization_code', // set the grant type to authorization code
                code: code, // set the code to the code from the URL parameters
                redirect_uri: redirectUri, // set the redirect uri to the redirect uri
                code_verifier: verifier // set the code verifier to the code verifier from the local storage}
            }); 

            // make a request using await fetch to the Spotify API to exchange the code for the access token
            const response = await fetch('https://accounts.spotify.com/api/token', { // make a POST request to the Spotify API)
                method: 'POST', // set the method to POST
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, // set the content type to application/x-www-form-urlencoded
                body: body.toString() // set the body to the URLSearchParams object
            }); 
            // try to get data from the response
            const data = await response.json(); // parse the response as a JSON object
            // check if the response contains an access token
            if (data.access_token) { 
                localStorage.setItem(tokenKey, data.access_token); // store the access token in the local storage
                window.history.replaceState({}, document.title, '/'); // replace the current URL with the root URL
                return data.access_token; // return the access token
            } else {
                throw new Error('Failed to get access token'); // throw an error if the response does not contain an access token
            }
        }
    },  
    // this function will be used to search for tracks and playlists in the Spotify API
        async search(term){ 
        const token = Spotify.getAccessToken(); // get the access token , used to make API calls to the Spotify API
        if (!token) return []; // if the token is not available, return an empty array

        // use a try catch block to handle errors
        try {
            const response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(term)}`,{
            headers: { // set the headers for the API call 
                Authorization: `Bearer ${token}` // set the authorization header to the access token} 
            }
        }); 
        if (!response.ok) {
            throw new Error('Spotify search failed'); // throw an error if the response is not ok
        }
        const jsonResponse = await response.json(); // parse the response as a JSON object

        // check if the response contains tracks
        if (!jsonResponse.tracks) return []; // if no tracks are found, return an empty array 
        // return the tracks and associated data in an array of objects
            return jsonResponse.tracks.items.map(track => ({ // map the tracks to an array of objects   
                id: track.id, // set the id to the track id
                name: track.name, // set the name to the track name
                artist: track.artists[0].name, // set the artist to the first artist in the track
                album: track.album.name, // set the album to the album name
                uri: track.uri // set the uri to the track uri 
            })); // return the array of objects 
    } catch (error) {
        console.error('Spotify search error:', error); // log the error to the console 
        return []; // return an empty array if an error occurs
    }
}, // end of search function,

// function to save the playlist to the user's Spotify account
async savePlaylist(name, trackUris) {
        if (!name || !trackUris.length) {
            return;
        }

        const token = Spotify.getAccessToken();
        if (!token) return;

        const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
        
        try { 
            const userResponse = await fetch('https://api.spotify.com/v1/me', { headers });
            if (!userResponse.ok) throw new Error('Failed to get user info from Spotify');
            const userData = await userResponse.json();

            const playlistResponse = await fetch(`https://api.spotify.com/v1/users/${userData.id}/playlists`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ name })
            }); 

            if (!playlistResponse.ok) throw new Error('Failed to create playlist');
            const playlistData = await playlistResponse.json();

            const trackResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistData.id}/tracks`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ uris: trackUris })
            });
            
            if (!trackResponse.ok) throw new Error('Failed to add tracks to playlist');
        } catch (error) {
            console.error('Spotify playlist error:', error);
        }
    }
}; // closing bracket for Spotify object

export default Spotify;
