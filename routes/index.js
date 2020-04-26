//main controller
//control all the app handling and routes
let spotifyController = require('../controllers/spotifyController'); //get the spotifyController modules
let express = require('express');

//handles all the possible routes
module.exports =  function(app)
{
  app.get('/login', (req,res)=>
{
  res.redirect(spotifyController.authorizeURL); //redirect to authorization url
});

  app.get('/callback', (req,res) =>
{
  spotifyController.callbackMethod(req,res);

});

app.get('/playlistColours', (req,res) =>
{

});

};
