$(document).ready(function(){

    typeWriter();
   

$('#loginId').on('click', function() 
{
    
    window.location.replace('/login');


});
});
//taken from w3 schools
let i=0;
function typeWriter() {
    let txt = "Color Your Playlists"
    
    if (i < txt.length) {
      document.getElementById("title").innerHTML += txt.charAt(i);
      i++;
      setTimeout(typeWriter, 100);
    }
  }