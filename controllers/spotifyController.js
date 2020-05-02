let SpotifyWebApi = require("spotify-web-api-node");
crypto = require("crypto");
config = require("../config.js");
let clientId = process.env.CLIENTID;
let clientSecret = process.env.CLIENTSECRET;
let redirectUri = "https://colouryourplaylists.herokuapp.com/callback";
//running locally
if (process.env.PORT == null) {
  clientId = config.clientID;
  clientSecret = config.clientSecret;
  redirectUri = "http://localhost:8000/callback";
}
let scopes = ["playlist-read-private", "user-read-email"]; //get the users account and their private playlists
let state = crypto.randomBytes(15).toString("hex"); //random state generator
let userInfo = {};
//let playListArray = [];
//let songArray = [];
let playListArray = []; //empty array for playlists

class playListInfo {
  //get the basic music information for both songs and playlist
  //playlists have their own audio audioFeatures
  //songs also have their own audio features
  constructor(name, id, songs, coverUrl) {
    this.__name = name;
    this.__id = id;
    this.__songs = songs;
    this.__audioFeatures;
    this.__coverUrl = coverUrl;
  }
  set songs(newSongs) {
    this.__songs = newSongs;
  }
  get songs() {
    return this.__songs;
  }
  set audioFeatures(newAudioFeatures) {
    this.__audioFeatures = newAudioFeatures;
  }
  get name() {
    return this.__name;
  }
  get id() {
    return this.__id;
  }
  get audioFeatures() {
    return this.__audioFeatures;
  }
  get coverUrl() {
    return this.__coverUrl;
  }
}

class songInfo {
  constructor(name, id, artist, duration, coverUrl) {
    this.__name = name;
    this.__id = id;
    this.__audioFeatures;
    this.__artist = artist;
    this.__duration = duration;
    this.__coverUrl = coverUrl;
  }

  get id() {
    return this.__id;
  }
  get coverUrl() {
    return this.__coverUrl;
  }
  get name() {
    return this.__name;
  }
  get artist() {
    return this.__artist;
  }

  set audioFeatures(newAudioFeatures) {
    this.__audioFeatures = newAudioFeatures;
  }
  get audioFeatures() {
    return this.__audioFeatures;
  }
  get id() {
    return this.__id;
  }
}

//class for all the audio features

class audioFeatures {
  constructor(valence, energy, mode, danceability) {
    this.__valence = valence;
    this.__energy = energy;
    this.__mode = mode;
    this.__dancability = danceability;
  }

  get valence() {
    return this.__valence;
  }
  get energy() {
    return this.__energy;
  }
  get mode() {
    return this.__mode;
  }
  get danceability() {
    return this.__dancability;
  }
}
var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret,
  redirectUri: redirectUri //will have to change this later
});

let authorizeURL = spotifyApi.createAuthorizeURL(scopes, state); //generated
exports.authorizeURL = authorizeURL; //export the value

// Retrieve an access token and a refresh token
exports.callbackMethod = (req, res) => {
  spotifyApi
    .authorizationCodeGrant(req.query.code)
    .then(
      //promise function
      data => {
        console.log("The token expires in " + data.body["expires_in"]);
        console.log("The access token is " + data.body["access_token"]);
        console.log("The refresh token is " + data.body["refresh_token"]);

        // Set the access token on the API object to use it in later calls
        spotifyApi.setAccessToken(data.body["access_token"]);
        spotifyApi.setRefreshToken(data.body["refresh_token"]);

        return getUserInformation();
      }
    )
    .then(
      data => {
        return getPlaylistInformation(data);
      },
      function (err) {
        console.log("Something went wrong!", err);
      }
    )
    .then(
      data => {
        return getAveragePlaylistInfo(data);
      },
      function (err) {
        console.log("Something went wrong!", err);
      }
    )
    .then(
      data => {
        req.session.exportData = data; //export all the data of the playlists..
        exports.exportData = data;
        req.session.username = userInfo.id;
        res.redirect("playlistColours");
      },
      function (err) {
        console.log("Something went wrong!", err);
      }
    );
};

function getUserInformation() {
  return spotifyApi.getMe().then(
    data => {
      userInfo.id = data.body.id;
      userInfo.email = data.body.email;
      return userInfo;
    },
    function (err) {
      console.log("Something went wrong!", err);
    }
  );
}
function getAveragePlaylistInfo(playlistArray) {
  //get the average valence, danceability, mode, energy for a playlist...
  let avgValence = 0;
  let avgDanceability = 0;
  let avgEnergy = 0;
  let avgMode = -3;
  let majorCount = 0;
  let minorCount = 1;
  playlistArray.forEach(playlist => {
    playlist.songs.forEach(song => {
      avgValence = avgValence + song.audioFeatures.valence;

      avgDanceability = avgDanceability + song.audioFeatures.danceability;
      avgEnergy = avgEnergy + song.audioFeatures.danceability;
      if (song.audioFeatures.mode == 1) {
        majorCount++;
      }
      if (song.audioFeatures.mode == 0) {
        minorCount++;
      }
    });

    avgValence = avgValence / playlist.songs.length;
    avgDanceability = avgDanceability / playlist.songs.length;
    avgEnergy = avgEnergy / playlist.songs.length;
    if (minorCount > majorCount) {
      avgMode = 0;
    } else {
      avgMode = 1;
    }
    playlist.audioFeatures = new audioFeatures(
      avgValence,
      avgEnergy,
      avgMode,
      avgDanceability
    );
    majorCount = 0;
    minorCount = 0; //clear for next playlist
  });

  return playlistArray;
}

async function getPlaylistAudioFeatures(songsID, playlistObj) {
  let returnVal = spotifyApi.getAudioFeaturesForTracks(songsID).then(
    function (data) {
      let index = 0;
      data.body.audio_features.forEach(audioInfo => {
        playlistObj.songs[index].audioFeatures = new audioFeatures(
          audioInfo.valence,
          audioInfo.energy,
          audioInfo.mode,
          audioInfo.danceability
        ); //need to add more information

        index++;
      });
      return playlistObj;
    },
    function (err) {
      consolg.log("something went wrong", err);
    }
  );

  return returnVal;
}

//use userData to get the list of playlists of the currentUser
async function getPlaylistInformation(userData) {
  let returnVal = async function (userData) {
    let playListArray = [];
    let completedPlaylist = spotifyApi
      .getUserPlaylists(userData.id, { limit: 50 })
      .then(
        async function (data) {
          let playlist = data.body.items;
          if (playlist != null) {
            for (let i = 0; i < data.body.items.length; i++) {
              var objReturn = async function (userData, playlist) {
                return getMusicInfo(
                  userData.id,
                  playlist[i].id,
                  playlist[i].name,
                  playlist[i].images[0].url
                ).then(
                  async function (playlistObj) {
                    if (playlistObj.songs.length != 0) {
                      songIdArray = [];

                      for (let i = 0; i < playlistObj.songs.length; i++) {
                        songIdArray.push(playlistObj.songs[i].id);
                      }
                      return getPlaylistAudioFeatures(songIdArray, playlistObj);
                    } else {
                      return null;
                    }
                  },
                  function (err) {
                    console.log("Something went wrong!", err);
                  }
                ); //gets array of the songs
              };
              let completedPlayListObject = await objReturn(userData, playlist);
              if (completedPlayListObject != null) {
                playListArray.push(completedPlayListObject);
              }
            }
          }

          //add to completed playlist
          return playListArray;
        },
        function (err) {
          console.log("Something went wrong!", err);
        }
      );
    return completedPlaylist;
  };

  let returnArray = await returnVal(userData);
  return returnArray;
}
async function getMusicInfo(userId, playlistId, playlistName, imageURL) {
  let songArray = []; //empty array
  let returnVal = spotifyApi
    .getPlaylistTracks(playlistId, {
      offset: 1,
      limit: 100,
      fields: "items"
    })
    .then(
      function (data) {
        data.body.items.forEach(songItem => {
          if (
            songItem.is_local != true &&
            songItem.track != null &&
            typeof songItem.track !== "undefined"
          ) {
            if (
              songItem.track.name != null &&
              songItem.track.type === "track"
            ) {
              //only take audio analysis if its not a local file
              let artistArray = [];
              //add code to get the audio features for each song
              songItem.track.artists.forEach(artistInfo =>
                artistArray.push(artistInfo.name)
              );
              if(songItem.track.album.images[0]==undefined)
              {
                console.log(songItem.track.name);
              }
              let song = new songInfo(
                songItem.track.name,
                songItem.track.id,
                artistArray,
                songItem.track.duration_ms,
                songItem.track.album.images[0].url
              );
              artistArray = []; //empty the array so it can be reassigned
              songArray.push(song);
            }
          }
        });

        let playlistObj = new playListInfo(
          playlistName,
          playlistId,
          songArray,
          imageURL
        );
        return playlistObj; //return a new playlist object}
      },
      function (err) {
        console.log("Something went wrong!", err);
      }
    );
  return returnVal;
}
//call the get tracks method and create the song array for that and return the song array
