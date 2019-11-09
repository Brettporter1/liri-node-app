require('dotenv').config();
const keys = require('./keys.js');
const Spotify = require('node-spotify-api');
const axios = require('axios')
const fs = require('fs')

const searchType = process.argv[2];
const searchTerm = process.argv.slice(3).join(' ')
let txtArr = []

// Switch function for user input
const searchSwitch = (switchTerm, funcTerm) => {
    switch (switchTerm) {
        case 'concert-this':
            concertThis(funcTerm);
            break;
        case 'spotify-this-song':
            spotThis(funcTerm);
            break;
        case 'movie-this':
            checkMovie(funcTerm);
            break;
        case 'do-a-thing':
            doThing();
            break;
        default:
            console.log('Not sure what you want');
    }
}
// ============================

// Concert Function
const concertThis = (band) =>{
    let concertURL = `https://rest.bandsintown.com/artists/${band}/events?app_id=codingbootcamp`

    axios.get(concertURL).then(function(response){
        console.log(response);
    })
}

// Spotify functions
const artistName = (artist) => {return artist.name}
const spotThis = (songSearch) => {
    if (!songSearch) {
        songSearch = 'The Sign';
    }
    let spotify = new Spotify(keys.spotify)
    spotify.search({ type: 'track', query: songSearch }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        } else {
            let songs = data.tracks.items
            for (let i = 0; i < songs.length; i++) {
                console.log(`
Artist: ${songs[i].artists.map(artistName)}
Song: ${songs[i].name}
Preview: ${songs[i].preview_url}
Album: ${songs[i].album.name}
_______________________________
          `)
            }
        }

    });
}
// ==============================

// OMDB Functon
const movieThis = (movie) => {
    let movieURL = `http://www.omdbapi.com/?t=${movie}&y=&plot=short&tomatoes=true&apikey=trilogy`;
    axios.get(movieURL).then(
    function(response) {
    let newMovie = response.data
    console.log(`
____________________________

Title: ${newMovie.Title}
Year: ${newMovie.Year}
IMDB Rating: ${newMovie.imdbRating}
Rotten Tomatoes Rating:${newMovie.tomatoRating}
Country: ${newMovie.Country}
Language: ${newMovie.Language}
Plot: ${newMovie.Plot}
Actors: ${newMovie.Actors}
____________________________
    `);
  }
);
}
const checkMovie = (movie) => {
    if(!movie){
        movie = 'Mr. Nobody'
        movieThis(movie)
        console.log(`
If you haven't watched "Mr. Nobody," then you should: http://www.imdb.com/title/tt0485947/

It's on Netflix!`)
    }else{movieThis(movie)}
}
// ============================

// Do a Thing Function

const doThing = () => {
    fs.readFile('random.txt', 'utf8', function(err,data){
        if(err){
            return err
        }
        txtArr = data.split(', ');
        newType = txtArr[0];
        newSearch = txtArr.slice(1).join(' ')
        searchSwitch(newType,newSearch);
    })
}

searchSwitch(searchType,searchTerm)