let SpotifyWebApi = require('spotify-web-api-node');
let crypto = require('crypto');
let clientId= 'eb8c8baf926b4a2996986cd21794f34f';
let clientSecret= 'a3ddbd0186b04085988a1eb73777e501';
let redirectUri= 'http://localhost:3000/callback';
let scopes = ['playlist-read-private', 'user-read-email']; //get the users account and their private playlists
let state = crypto.randomBytes(15).toString('hex'); //random state generator
let userInfo = {};
//let playListArray = [];
//let songArray = [];
 let playListArray = []; //empty array for playlists

class playListInfo {
//get the basic music information for both songs and playlist
//playlists have their own audio audioFeatures
//songs also have their own audio features
  constructor(name,id,songs)  {
    this.__name=name;
    this.__id=id;
    this.__songs=songs;
    this.__audioFeatures;

  }
  set songs(newSongs){
    this.__songs=newSongs;
  }
  get songs(){
    return this.__songs;
  }
  set audioFeatures(newAudioFeatures){
    this.__audioFeatures=newAudioFeatures;
  }
  get name(){
    return this.__name;
  }
  get id(){
    return this.__id;
  }
  get audioFeatures(){
    return this.__audioFeatures;
  }
};

class songInfo {
  constructor(name,id,artist,duration)
  {
    this.__name=name;
    this.__id=id;
    this.__audioFeatures;
    this.__artist = artist;
    this.__duration = duration;
  }

  get id(){
    return this.__id;
  }
  get name(){
    return this.__name;
  }

  set audioFeatures(newAudioFeatures){
    this.__audioFeatures=newAudioFeatures;
  }
  get audioFeatures(){
    return this.__audioFeatures;
  }
  get id(){
    return this.__id;
  }
}

//class for all the audio features

class audioFeatures {

constructor(valence,energy,mode,danceability)
{
  this.__valence=valence;
  this.__energy=energy;
  this.__mode=mode;
  this.__dancability=danceability;
}

get valence(){
  return this.__valence;
}
get energy(){
  return this.__energy;
}
get mode(){
  return this.__mode;
}
get danceability(){
  return this.__dancability;
}

};
var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret,
  redirectUri: redirectUri, //will have to change this later
});

let authorizeURL = spotifyApi.createAuthorizeURL(scopes, state); //generated
exports.authorizeURL=authorizeURL; //export the value
//console.log(authorizeURL); //the authorization url;;

// Retrieve an access token and a refresh token
exports.callbackMethod = (req,res)=> {
spotifyApi.authorizationCodeGrant(req.query.code).then
( //promise function
  data=> {
    console.log('The token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);
    console.log('The refresh token is ' + data.body['refresh_token']);

    // Set the access token on the API object to use it in later calls
    spotifyApi.setAccessToken(data.body['access_token']);
    spotifyApi.setRefreshToken(data.body['refresh_token']);

    return getUserInformation();


  }).
 then (data => {
   //console.log("hiya");
   return getPlaylistInformation(data);
 }).
 then ( data => {
   //console.log("hi");
   //console.log(data);
  return getAveragePlaylistInfo(data);
 }).then ( data =>
   {
     exports.exportData = data; //export all the data of the playlists..
     //console.log(data);
     res.redirect('playlistColours');
   }
 );
};



function getUserInformation()
{
  return spotifyApi.getMe().then(data=> {
     //console.log(data.body.id);
     userInfo.id=data.body.id;
     userInfo.email=data.body.email;
     //console.log(userInfo);
     return userInfo;

   });

  //console.log(returnVal);
  //return returnVal;
};
function getAveragePlaylistInfo(playlistArray)
{
 //get the average valence, danceability, mode, energy for a playlist...
 let avgValence=0;
 let avgDanceability=0;
 let avgEnergy=0;
 let avgMode=-3;
 let majorCount=0;
 let minorCount=1;
 playlistArray.forEach(playlist =>
   {
     //console.log(playlist);
     //avgValence = playlist.songs => playlist.songs.reduce((a,b) => a + b, 0) / playlist.songs.length
    playlist.songs.forEach( song =>
   {
     avgValence = avgValence + song.audioFeatures.valence;

     avgDanceability = avgDanceability + song.audioFeatures.danceability;
     avgEnergy = avgEnergy +  song.audioFeatures.danceability;
     if(song.audioFeatures.mode==1)
     {
       majorCount++
     }
     if(song.audioFeatures.mode==0)
     {
       minorCount++;
     }
   });
 //console.log(avgValence);console.log(avgDanceability);console.log(avgEnergy);
  avgValence =  avgValence/playlist.songs.length;
  avgDanceability =  avgDanceability/playlist.songs.length;
  avgEnergy =  avgEnergy/playlist.songs.length;
  //console.log(minorCount);
  //console.log(majorCount);
  if(minorCount>majorCount)  {
    avgMode = 0;
  }
  else {
      avgMode=1;
  }
  playlist.audioFeatures = new audioFeatures(avgValence,avgEnergy,avgMode,avgDanceability);
  majorCount=0; minorCount=0; //clear for next playlist
});

return playlistArray;


}

async function getPlaylistAudioFeatures(songsID,playlistObj)
{
  //console.log(songsID);
  //console.log(playlistObj);
  let returnVal = spotifyApi.getAudioFeaturesForTracks(songsID)
  .then(function(data) {
    //console.log(data.body);
    let index=0;
    data.body.audio_features.forEach(audioInfo => {
    //console.log(audioInfo);
    if(audioInfo==null)
    {
      //console.log(playlistObj.name);
    }
    playlistObj.songs[index].audioFeatures = new audioFeatures(audioInfo.valence,audioInfo.energy,audioInfo.mode,audioInfo.danceability); //need to add more information
    //console.log(playlistObj.songs[index].audioFeatures);
    //console.log(`done ${playlistObj.name} and ${playlistObj.songs[index].name}`);
    index++;
    }

    )
    //playlistObj.audioFeatures = new audioFeatures(data.body.valence,data.body.energy,data.body.key);
    //console.log(playlistObj);
    return playlistObj;
  }, function(err) {
    console.log("oops");
  });

  return returnVal;



};




//use userData to get the list of playlists of the currentUser
async function getPlaylistInformation(userData)
{
    //console.log(userData);
   let returnVal = async function(userData)
   {  let playListArray = [];
     let completedPlaylist = spotifyApi.getUserPlaylists(userData.id, {limit:50}).then(
    async function(data)  {


      let playlist = data.body.items;
      //console.log(playlist);
       for(let i=0;i< data.body.items.length;i++){
            //console.log(data.body.items.length);
            var objReturn = async function(userData,playlist)
            {
              return getMusicInfo(userData.id,playlist[i].id,playlist[i].name).
              then ( async function(playlistObj)
            { songIdArray =[];

              for(let i=0;i < playlistObj.songs.length;i++) {
                songIdArray.push(playlistObj.songs[i].id);
              };
                return getPlaylistAudioFeatures(songIdArray,playlistObj)
            }); //gets array of the songs
          };
          let completedPlayListObject = await objReturn(userData,playlist);
           //console.log(completedPlayListObject);
          playListArray.push(completedPlayListObject);
        };

  //add to completed playlist
  //console.log(playListArray);
  return playListArray;
  });
  //console.log(completedPlaylist);
 return completedPlaylist;
};

let  returnArray = await returnVal(userData);
//console.log(returnArray);
return returnArray;
};
 async function getMusicInfo(userId,playlistId,playlistName)
{

 let songArray = []; //empty array
 //console.log(userId);
 //onsole.log(playlistId);
 let returnVal= spotifyApi.getPlaylistTracks(playlistId, {
    offset: 1,
    limit:  100,
    fields: 'items'
  }).then(function(data) {
      //console.log('The playlist contains these tracks', data.body);
      data.body.items.forEach( songItem => {
        if(songItem.is_local!=true){
          //only take audio analysis if its not a local file
        let artistArray = [];
        //add code to get the audio features for each song
        songItem.track.artists.forEach (artistInfo => artistArray.push(artistInfo.name));
        let song = new songInfo(songItem.track.name, songItem.track.id, artistArray,songItem.track.duration_ms);
        artistArray = []; //empty the array so it can be reassigned
        //console.log(song);
        songArray.push(song);
        }
      }
      );
      let playlistObj = new playListInfo(playlistName,playlistId,songArray);
              //console.log(playlistObj);
    return playlistObj; //return a new playlist object}

    },
    function(err) {
      console.log('Something went wrong!', err);
    }
  );
 return returnVal;
};
//call the get tracks method and create the song array for that and return the song array
