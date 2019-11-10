require('dotenv').config();
const keys = require('./keys.js');
const Spotify = require('node-spotify-api');
const axios = require('axios')
const fs = require('fs')
const moment = require('moment')

const searchType = process.argv[2];
const searchTerm = process.argv.slice(3).join(' ')
let txtArr = []

// Switch function for user input
const searchSwitch = (switchTerm, funcTerm) => {
    
    switch (switchTerm) {
        case 'concert-this':
            logEntry(switchTerm,funcTerm);
            concertThis(funcTerm);
            break;
        case 'spotify-this-song':
            logEntry(switchTerm,funcTerm);
            spotThis(funcTerm);
            break;
        case 'movie-this':
            logEntry(switchTerm,funcTerm);
            checkMovie(funcTerm);
            break;
        case 'do-what-it-says':
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
        let concerts = response.data
        for(let i = 0;i < concerts.length;i++)
        console.log(`Venue: ${concerts[i].venue.name}
Location: ${concerts[i].city}, ${concerts[i].region}
Date: ${moment(concerts[i].datetime).format('MM/DD/YYYY')}
_________________________________
        `);
    })
}

// Spotify functions
const artistName = (artist) => {return artist.name}
const spotThis = (songSearch) => {
    if (!songSearch) {
        songSearch = '"The Sign"';
    }
    let spotify = new Spotify(keys.spotify)
    spotify.search({ type: 'track', query: songSearch, limit:10 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        } else {
            let songs = data.tracks.items
            for (let i = 0; i < songs.length; i++) {
                console.log(`${parseInt([i])+1}
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
    // tomatoes=true within the api url doesn't actually give the Rotten Tomatoes rating, had to pull it from the Ratings key
    console.log(`
Title: ${newMovie.Title}
Year: ${newMovie.Year}
IMDB Rating: ${newMovie.imdbRating}
Rotten Tomatoes Rating:${newMovie.Ratings[1].Value}
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
        movieThis('Mr. Nobody')
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
// =============================

// Log function
const logEntry = (term1, term2) => {
    let newEntry = `${term1}, ${term2}\n`
    fs.appendFile('log.txt', newEntry, function(err){
        if (err){
            throw 'Error'
        }
    })
}
searchSwitch(searchType,searchTerm)