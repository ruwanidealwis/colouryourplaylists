$(document).ready(function() {

//let spotifyController = require('../controllers/spotifyController'); //get the spotifyController modules

$('.playlistList').on('click', function() 
{
   window.alert("hi");
   let id = $(this).attr("id");
   window.alert(id);
   


$.ajax({
    type: 'GET',
    url: '/playlistColours/' + id,
    success: function(data){
      window.alert("success")
     // window.alert(data.palette[0]);
      $('.box').css('border','none');
      $('.card').css('visibility','visible');
      window.alert(data.colourInfo[0].name);
      let colourInformation = data.colourInfo;
      window.alert("This Colour is " + colourInformation[0].name + "because the songs have " + colourInformation[0].energy + " energy and the intensitiy of your colour is " + colourInformation[0].danceability+ "because the danceability of your songs is " + colourInformation[0].danceability);
      let intenseString = "dull";
      if(colourInformation[0].danceability === "high")
      {
        intenseString = "intense"
      }
      
      //Add information about the playlists
      let colour1Text = "This Colour is a " + intenseString + " " +  colourInformation[0].name + " because the majority of songs  have " + colourInformation[0].energy + " energy and " + colourInformation[0].danceability+ " danceability" ;
      let colour2Text = "This Colour is " + colourInformation[1].name + " because the playlist has " + colourInformation[1].valence + " sad/angry songs";
      let colour3Text = "This Colour is " + colourInformation[2].name + " because most of the songs of this playlist are in " + colourInformation[2].mode + " mode";
      let colour = "This colour helps create a more visually pleasing palette";
    
     
      window.alert(data.coverImage);
      $('#name').text(data.playlistName);
      $('#description').text("a playlist by " + data.name);
      $("#colour1").css( {'background-color':'rgb('+ data.palette[0] + ')'} );
      $("#colour2").css( {'background-color':'rgb('+ data.palette[1] + ')'} );
      $("#colour3").css( {'background-color': 'rgb('+ data.palette[2] + ')'} );
      $("#colour4").css( {'background-color': 'rgb('+ data.palette[3] + ')'} );
      $("#colour5").css( {'background-color': 'rgb('+ data.palette[4] + ')'} );
      $("#cover").attr("src",data.coverImage);
      $("#Colour1Info").text(colour1Text); 
      $("#Colour2Info").text(colour);
      $("#Colour3Info").text(colour2Text);
      $("#Colour4Info").text(colour);
      $("#Colour5Info").text(colour3Text);
      history.pushState({}, null, "/" +id);

    },
    error: function ()
    {
        window.alert("there was an errror");
    }
  });
  return false;

});

$('.songList').on('click', function() 
{
    window.alert("hi");
   let songId = $(this).attr("id"); //gets the id of the song
   let id= $(this).parent().parent().find('.playlistList').attr('id');
   window.alert(songId);
   window.alert($(this).parent().parent().find('.playlistList').attr('id'));


$.ajax({
    type: 'GET',
    url: '/playlistColours/'+ id + '/' + songId,
    success: function(data){
      //do something with the data via front-end framework
      let palette = data.palette;
      let artistString= "By "; 
      let colourInformation = data.colourInfo;
      window.alert(colourInformation);
      window.alert(data.artist);
      window.alert(data.coverImage);
     data.artist.forEach( (artist,i) => 
      {
        artistString = artistString + artist
          if(data.artist.length-i!=1)
          {
            artistString=artistString + " & ";
          }
      });
      $('.box').css('border','none');
      $('.card').css('visibility','visible');
      window.alert(data.coverImage);
      $('#name').text(data.songName);
      $("#cover").attr("src",data.coverImage);
      $('#description').text( artistString);
     
      let intenseString = "dull";
      if(colourInformation[0].danceability === "high")
      {
        intenseString = "intense"
      }
      //Add information about the playlists
      //let colour1Text = "This Colour is " + colourInformation[0].name + " because the song has " + colourInformation[0].energy + " energy and the intensitiy of your colour is " + colourInformation[0].danceability+ "because the danceability of your songs is " + colourInformation[0].danceability ;
      let colour1Text = "This Colour is a " + intenseString +  colourInformation[0].name + " because the song has " + colourInformation[0].energy + " energy and " + colourInformation[0].danceability+ " danceability" ;
      let colour2Text = "This Colour is " + colourInformation[1].name + " because the song evokes " + colourInformation[1].valence + "sad/angry feeling(s)";
      let colour3Text = "This Colour is " + colourInformation[2].name + " because the song is " + colourInformation[2].mode + "mode";
      let colour = "This colour helps create a more visually pleasing palette"
      window.alert(colour1Text);
      window.alert(colour2Text);
      $("#Colour1Info").text(colour1Text);
      $("#Colour2Info").text(colour);
      $("#Colour3Info").text(colour2Text);
      $("#Colour4Info").text(colour);
      $("#Colour5Info").text(colour3Text);

      $("#colour1").css( {'background-color':'rgb('+ data.palette[0] + ')'} );
      $("#colour1").css( {'border-color':'rgb('+ data.palette[0] + ')'} );
      $("#colour2").css( {'background-color':'rgb('+ data.palette[1] + ')'} );
      $("#colour2").css( {'border-color':'rgb('+ data.palette[1] + ')'} );
      $("#colour3").css( {'background-color': 'rgb('+ data.palette[2] + ')'} );
      $("#colour3").css( {'border-color':'rgb('+ data.palette[2] + ')'} );
      $("#colour4").css( {'background-color': 'rgb('+ data.palette[3] + ')'} );
      $("#colour4").css( {'border-color':'rgb('+ data.palette[3] + ')'} );
      $("#colour5").css( {'background-color': 'rgb('+ data.palette[4] + ')'} );
      $("#colour5").css( {'border-color':'rgb('+ data.palette[4] + ')'} );
      


      let newUrl = `/${id}/${songId}`;
      window.alert(newUrl);
      //window.history.pushState("object or string", "Title", "/new-url");
      history.pushState({}, null, newUrl);
     
    }
  });
  return false;

});
});