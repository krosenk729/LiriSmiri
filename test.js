var Spotify = require('node-spotify-api');
 
var spotify = new Spotify({
  id: '9d8adda11a7b4a4e9c388e58366c07e2',
  secret: 'c384158409f94839838a912e1f08b623'
});

spotify.search({ type: 'track', query: 'All the Small Things' }, function(err, data) {
  if (err) {
    return console.log('Error occurred: ' + err);
  }
 
console.log(data.tracks.items[0].external_urls.spotify ); 
});