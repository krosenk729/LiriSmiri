# Liribot Homework

### Prerequisites

You must have nodejs and npm installed on your computer

### Installation & Running

```sh
git clone https://github.com/krosenk729/LiriSmiri.git
cd LiriSmiri
npm install
node liri.js
```

You'll need some environment variables set up...
```sh
touch .env
```

...so open that file and fill in the blanks...

```sh
# Spotify API keys

SPOTIFY_ID=_____________
SPOTIFY_SECRET=_____________

# Twitter API keys

TWITTER_CONSUMER_KEY=_____________
TWITTER_CONSUMER_SECRET=_____________
TWITTER_ACCESS_TOKEN_KEY=_____________
TWITTER_ACCESS_TOKEN_SECRET=_____________

# OMDD key

OMDD_KEY= _____________
```

### You can run some of these commands
 
 ```sh
node liri.js my-tweets
node liri.js movie-this 'Mean Girls'
node liri.js spotify-this-song 'Closer'
node liri.js do-what-it-says
```

Or you can just run it and do your own thing -- the prompts will take care of things 👌

