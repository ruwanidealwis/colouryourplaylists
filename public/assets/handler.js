$(document).ready(function(){

    typeWriter();
    console.log("hi");

$('#loginId').on('click', function() 
{
    console.log("hi");
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