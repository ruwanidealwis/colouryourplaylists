//main controller
//control all the app handling and routes
let spotifyController = require("../controllers/spotifyController"); //get the spotifyController modules
let colourGenerator = require("../controllers/colourGenerator");
let express = require("express");

//handles all the possible routes
module.exports = function (app) {
  
  app.get("/", (req, res) => {
    res.render("main.pug"); //redirect to authorization url
  });

  app.get("/login", (req, res) => {
    res.redirect(spotifyController.authorizeURL); //redirect to authorizaton url
  });

  app.get("/callback", (req, res) => {
    spotifyController.callbackMethod(req, res);
  });

  app.get("/playlistColours", (req, res) => {
    let allPlaylistInfo = req.session.exportData;
    let username = req.session.username;
    console.log(allPlaylistInfo);
    //console.log(spotifyController.exportData);
    console.log(username);
    if (allPlaylistInfo == null) {
      res.redirect("/login");
    }

    res.render("playlistColours.pug", {
      playListArray: allPlaylistInfo,
      name: username,
    });
    //get all the iformation about all the playlists along with an empty side screen
    //when ajax clicks on the playlist, its a post request that his to redirect to the tab with the playlist Id,
  });
  app.get("/playlistColours/:id", (req, res) => {
    let allPlaylistInfo = req.session.exportData; //data returned from spotify 
    //console.log(allPlaylistInfo);
    let playlistQueried = {};
    allPlaylistInfo.forEach((playlist) => {
      //console.log(req.params.id);
      if (req.params.id === playlist.__id) {
        console.log("hi");
        playlistQueried = playlist;
      }
    });

    colourGenerator
      .getPalette(
        playlistQueried.__audioFeatures.__valence,
        playlistQueried.__audioFeatures.__energy,
        playlistQueried.__audioFeatures.__mode,
        playlistQueried.__audioFeatures.__danceability
      )
      .then((palette) => {
        console.log(palette);
        //onsole.log(allPlaylistInfo);
        //res.send({palette: palette, urlID:req.params.id });
        console.log(playlistQueried.coverUrl);
        let colourInfo = colourGenerator.colourInfo;
        console.log(colourInfo);
        let username = req.session.username;
        res.json({
          playListArray: allPlaylistInfo,
          palette: palette,
          playlistName: playlistQueried.__name,
          coverImage: playlistQueried.__coverUrl,
          name: username,
          colourInfo: colourInfo,
        });

        //res.send(palette);
      });
    //console.log(palette);
  });

  app.get("/playlistColours/:id/:songId", (req, res) => {
    let allPlaylistInfo = req.session.exportData; //data returned from spotify controller
    //console.log(allPlaylistInfo);
    let playlistQueried = {};
    let songQueried = {};
    allPlaylistInfo.forEach((playlist) => {
      //console.log(req.params.id);
      if (req.params.id === playlist.__id) {
        console.log("hi");
        playlistQueried = playlist;
      }
    });

    playlistQueried.__songs.forEach((song) => {
      //console.log(req.params.id);
      if (req.params.songId === song.__id) {
        songQueried = song;
      }
    });
    //move everything above to the jquery,ajax page
    colourGenerator
      .getPalette(
        playlistQueried.__audioFeatures.__valence,
        playlistQueried.__audioFeatures.__energy,
        playlistQueried.__audioFeatures.__mode,
        playlistQueried.__audioFeatures.__danceability
      )
      .then((palette) => {
        console.log(songQueried.coverUrl);
        let colourInfo = colourGenerator.colourInfo;
        console.log(colourInfo);
        res.json({
          playListArray: allPlaylistInfo,
          palette: palette,
          songName: songQueried.__name,
          coverImage: songQueried.__coverUrl,
          artist: songQueried.__artist,
          colourInfo: colourInfo,
        });
        //res.send(palette);
      });
  });
};
