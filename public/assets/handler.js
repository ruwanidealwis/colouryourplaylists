$(document).ready(function () {
  typeWriter();

  $("#loginId").on("click", function () {
    window.location.replace("/login");
  });
});
//taken from w3 schools: https://www.w3schools.com/howto/howto_js_typewriter.asp
let i = 0;
function typeWriter() {
  let txt = "Colour Your Playlists";

  if (i < txt.length) {
    document.getElementById("title").innerHTML += txt.charAt(i);
    i++;
    setTimeout(typeWriter, 100);
  }
}
