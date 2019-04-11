const express = require('express')
const SpotifyWebApi = require('spotify-web-api-node')

const app = express()

app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')
app.use(express.static(__dirname + '/public'))


// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId : "", // <---------- WRITE YOUR CREDENTIALS HERE
  clientSecret : "" // <---------- WRITE YOUR CREDENTIALS HERE
})

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token'])
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error)
  })


app.get('/', (req,res,next) => {
  res.render('index')
})

// If the URL is http://localhost:3000/artists?search=bob
// req.query.search = "bob"
app.get('/artists', (req,res,next) => {
  console.log("Search =", req.query.search)
  spotifyApi.searchArtists(req.query.search)
    .then(data => {
      console.log("The received data from the API: ", data.body.artists.items)
      res.render('list-artists', {
        artists: data.body.artists.items,
        search: req.query.search
      })
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err)
    })
})

// If the URL is http://localhost:3000/albums/4gzpq5DPGxSnKTe4SA8HAU
// req.params.artistId = "4gzpq5DPGxSnKTe4SA8HAU"
app.get('/albums/:artistId', (req,res,next) => {
  // If it was with our own database, we would replace the following line by:
  // Album.find({ _artist: req.params.artistId})
  spotifyApi.getArtistAlbums(req.params.artistId)
    .then(data => {
			console.log("TCL: data.body", data.body)
      res.render('albums', {
        albums: data.body.items
      })
    })
    .catch(err => {
      console.log("The error while searching albums occurred: ", err)
    })
})

app.get('/tracks/:albumId', (req,res,next) => {
  spotifyApi.getAlbumTracks(req.params.albumId)
    .then(data => {
			console.log("TCL: data.body", data.body)
      res.render('list-tracks', {
        tracks: data.body.items
      })
    })
    .catch(err => {
      console.log("The error while searching tracks occurred: ", err)
    })
})


app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"))
