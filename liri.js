const dotenv = require('dotenv').config();
const request = require('request');
const fs = require('fs');
const inquirer = require('inquirer');
const keys = require('./keys.js');
const Spotify = require('node-spotify-api');
const Twitter = require('twitter');
const spotify = new Spotify(keys.spotify);
const twitter = new Twitter(keys.twitter);
const omddKey = keys.omdd; 

 // If args are not passed, prompt user 
 // Otherwise, go forward with argument checking
if( !process.argv[2] ){
	console.log('Aha! Silence is golden. Unless it comes to instructions');
	getArgs();
} else {
	checkArgs(process.argv[2]);
}

// Used when arguments are not passed
// Prompts user for aguements then continues
function getArgs(){
	inquirer.prompt([
		{
			type: 'list',
			name: 'choice',
			message: 'Choose a valid action please',
			choices: ['my-tweets', 'spotify-this-song', 'movie-this', 'do-what-it-says']
		},
		{
			type: 'input',
			name: 'title',
			message: 'What title shall we search for?',
			validate: function(value){
				return value ? true : 'Reading your mind is\'t my speciality. Please enter a title';
			},
			when: function(answers){
				return answers.choice === 'spotify-this-song' || answers.choice === 'movie-this';
			}
		}
	]).then( answers => {
		process.argv[2] = answers.choice;
		process.argv[3] = answers.title || '';
		checkArgs( process.argv[2] );
	});
}

// Decide which request to make based on input 
function checkArgs( val ){
	switch ( val ){
		case 'my-tweets':
			tweetSearch();
			break;
		case 'spotify-this-song':
			if( !process.argv[3] ){ 
				console.log('Blank songs aren\'t any fun -- how about passing a song title in?');
				getTitle( 'song' );
			} else {
				songSearch( process.argv[3] );
			}
			break;
		case 'movie-this':
			if( !process.argv[3] ){ 
				console.log('Movie what? Try again with a movie title please');
				getTitle( 'movie' );
			} else {
				movieSearch( process.argv[3] );
			}
			break;
		case 'do-what-it-says':
			saysDoer();
			break;
		default:
			console.log('Whoops! Something is up with what you entered - let\'s try again');
			getArgs();
			break;
	}
}

// If movie or song title is ommited, prompt user 
function getTitle( type ){
	inquirer.prompt([
	{
		type: 'input',
		name: 'title',
		message: 'What title shall we search for?'
	}
	]).then( answers =>{ 
		process.argv[3] = answers.title;
		if(type === 'song'){ songSearch( process.argv[3] ); }
		if(type === 'movie'){ movieSearch( process.argv[3] ); }
	});
}


// Ask omdd to give us movie info 
function movieSearch( title = 'Mr+Nobody' ) {
	title = title.replace(/[^\w||\s]/gi, '').replace(' ','+');
	request(`http://www.omdbapi.com/?apikey=${omddKey.key}&t=${title}`, function(err, res, body){
		if(!err && res.statusCode === 200){
			let movie = JSON.parse(body), imbbRate, rottenRate;
	  		console.log('Pop your popcorn, the movie reel is rolling for...\n');
	  		console.log('Title: ', movie.Title);
	  		console.log('Year: ', movie.Year);
	  		if(imbbRate = movie.Ratings.filter( i => i.Source === ('Internet Movie Database')[0].Value || '') ){ console.log('IMBB Rating: ', imbbRate); }
	  		if(rottenRate = movie.Ratings.filter( i => i.Source === ('Rotten Tomatoes')[0].Value || '') ){ console.log('Rotten Tomatoes Rating: ', rottenRate); }
	  		console.log('Plot: ', movie.Plot);
	  		console.log('--');
	  		console.log('You need to know the country it was produced in? Okay...: ', movie.Country);
	  		console.log('And the language too? This is getting... we... fine...: ', movie.Language);
	  		console.log(`Actors AND Actresses (the movie was made in ${movie.Year} but it's 2018 now): `, movie.Actors);
		} else {
			console.log('That status code was an not cool about being 200 -- here are some deets', res.statusCode, res.statusMessage);
		}
	});
}

 // Ask spotify to give us song info 
function songSearch( title ) {
	spotify.search(
	{ 
		type: 'track', 
		query: title 
	}, function(err, data) {
  		if (err) {return console.log('Error occurred: ' + err); }
  		let artists = data.tracks.items[0].artists.map((i) => i.name ).join(', ');
  		console.log('Beep beep badoop, here is info about your tunes\n');
  		console.log('Artist: ', artists);
  		console.log('Song Name: ', data.tracks.items[0].name);
  		console.log('Album: ', data.tracks.items[0].album.name);
  		console.log('Preview Link: ', data.tracks.items[0].external_urls.spotify);
	});
}


// Get twitter info 
function tweetSearch( ) { 
	let params = {screen_name: 'Trilogyedu'};
	console.log('here we gooooo. twitter - what could go wrong? \n');
	twitter.get('statuses/user_timeline', params, function(err, tweets, res){
		if(!err && res.statusCode === 200 && tweets.length > 0){
			console.log(`Here is what ${tweets[0].user.screen_name} has been twittering about:`);
			let i = 1;
			for(let tweet of tweets){
				tweet.formatted_date = new Date(tweet.created_at).toDateString();
				console.log( `${i} - ${tweet.formatted_date} - ${tweet.text}` );
				i++;
			}
		} else {
			console.log('That status\'s hashtag is NOT 200 -- here are some deets', res.statusCode, res.statusMessage);
		}
	});
}


// Read file and do things 
function saysDoer( ) {
	fs.readFile('random.txt', 'utf8', function(err, data){
		if(err){ return console.log('Someone needs to check that random file because this error was thrown', err); }
		songSearch( data.split(',')[1].replace('"','') );
	});
}