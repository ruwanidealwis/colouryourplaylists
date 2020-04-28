//main controller
//control all the app handling and routes
let spotifyController = require('../controllers/spotifyController'); //get the spotifyController modules
let colourGenerator = require('../controllers/colorGenerator');
let express = require('express');

//handles all the possible routes
module.exports =  function(app)
{
  app.get('/', (req,res)=>
{
  res.render('main.pug'); //redirect to authorization url
});


  app.get('/login', (req,res)=>
{
  res.redirect(spotifyController.authorizeURL); //redirect to authorization url
});

  app.get('/callback', (req,res) =>
{
  spotifyController.callbackMethod(req,res);

});

app.get("/playlistColours", (req,res)=>
{
 let allPlaylistInfo = spotifyController.exportData;
 res.render('playlistColours.pug', {playListArray:allPlaylistInfo});
  //get all the iformation about all the playlists along with an empty side screen
  //when ajax clicks on the playlist, its a post request that his to redirect to the tab with the playlist Id,

});
app.get('/playlistColours/:id', (req,res) =>
{
  let allPlaylistInfo = spotifyController.exportData; //data returned from spotify controller
  console.log(allPlaylistInfo);
  let playlistQueried = {};
  allPlaylistInfo.forEach(playlist => {
    //console.log(req.params.id);
      if(req.params.id===playlist.id){
        console.log("hi");
        playlistQueried = playlist;
      }
});

colourGenerator.getPalette(playlistQueried.audioFeatures.valence,playlistQueried.audioFeatures.energy,playlistQueried.audioFeatures.mode,playlistQueried.audioFeatures.danceability).then(
  palette => {
    console.log(palette);
    res.render('playlistColours.pug', {playListArray:allPlaylistInfo, palette: palette });
    //res.send(palette);
  }
);
//console.log(palette);
});

app.get('/playlistColours/:id/:songId', (req,res) =>
{
  let allPlaylistInfo = spotifyController.exportData; //data returned from spotify controller
  //console.log(allPlaylistInfo);
  let playlistQueried = {};
  let songQueried = {};
  allPlaylistInfo.forEach(playlist => {
    //console.log(req.params.id);
      if(req.params.id===playlist.id){
        console.log("hi");
        playlistQueried = playlist;
      }

});

playlistQueried.songs.forEach(
  song => {
    //console.log(req.params.id);
      if(req.params.songId===song.id){
        songQueried = song;
      }
});
//move everything above to the jquery,ajax page 
colourGenerator.getPalette(songQueried.audioFeatures.valence,songQueried.audioFeatures.energy,songQueried.audioFeatures.mode,songQueried.audioFeatures.danceability).then(
  palette => {
    console.log(palette);
    res.render('playlistColours.pug', {playListArray:allPlaylistInfo, palette: palette });
    //res.send(palette);
  }
);
});

};
