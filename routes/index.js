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
    console.log("on login");
    res.redirect(spotifyController.authorizeURL); //redirect to authorizaton url
  });

  app.get("/callback", (req, res) => {
    spotifyController.callbackMethod(req, res);
  });

  app.get("/playlistColours", (req, res) => {
    let allPlaylistInfo = req.session.exportData;
    let username = req.session.username;

    if (allPlaylistInfo == null || allPlaylistInfo == undefined) {
      res.redirect("/login");
    } else {
      res.render("playlistColours.pug", {
        playListArray: allPlaylistInfo,
        name: username
      });
    }
    //get all the iformation about all the playlists along with an empty side screen
    //when ajax clicks on the playlist, its a post request that his to redirect to the tab with the playlist Id,
  });
  app.get("/playlistColours/:id", (req, res) => {
    let allPlaylistInfo = req.session.exportData; //data returned from spotify

    let playlistQueried = {};
    allPlaylistInfo.forEach(playlist => {
      if (req.params.id === playlist.__id) {
        playlistQueried = playlist;
      }
    });

    if (JSON.stringify(playlistQueried) === "{}") {
      res.status(404).send("Wrong Page");
    } else {
      colourGenerator
        .getPalette(
          playlistQueried.__audioFeatures.__valence,
          playlistQueried.__audioFeatures.__energy,
          playlistQueried.__audioFeatures.__mode,
          playlistQueried.__audioFeatures.__danceability
        )
        .then(palette => {
          //onsole.log(allPlaylistInfo);
          //res.send({palette: palette, urlID:req.params.id });
          let colourInfo = colourGenerator.colourInfo;
          let username = req.session.username;
          res.json({
            playListArray: allPlaylistInfo,
            palette: palette,
            playlistName: playlistQueried.__name,
            coverImage: playlistQueried.__coverUrl,
            name: username,
            colourInfo: colourInfo
          });

          //res.send(palette);
        });
    }
  });

  app.get("/playlistColours/:id/:songId", (req, res) => {
    let allPlaylistInfo = req.session.exportData; //data returned from spotify controller

    let playlistQueried = {};
    let songQueried = {};
    allPlaylistInfo.forEach(playlist => {
      if (req.params.id === playlist.__id) {
        playlistQueried = playlist;
      }
    });
    if (JSON.stringify(playlistQueried) === "{}") {
      res.status(404).send("Wrong Page");
    } else {
      playlistQueried.__songs.forEach(song => {
        if (req.params.songId === song.__id) {
          songQueried = song;
        }
      });
      if (JSON.stringify(songQueried) === "{}") {
        res.status(404).send("Wrong Page");
      } else {
        //move everything above to the jquery,ajax page
        colourGenerator
          .getPalette(
            playlistQueried.__audioFeatures.__valence,
            playlistQueried.__audioFeatures.__energy,
            playlistQueried.__audioFeatures.__mode,
            playlistQueried.__audioFeatures.__danceability
          )
          .then(palette => {
            let colourInfo = colourGenerator.colourInfo;
            res.json({
              playListArray: allPlaylistInfo,
              palette: palette,
              songName: songQueried.__name,
              coverImage: songQueried.__coverUrl,
              artist: songQueried.__artist,
              colourInfo: colourInfo
            });
            //res.send(palette);
          });
      }
    }
  });
  app.get("*", function (req, res) {
    res.status(404).send("Wrong Page");
  });
};
