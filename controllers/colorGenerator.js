
//we need the data from the spotify module
let spotifyController = require('../controllers/spotifyController');
let XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
// get the alogrithm for the playlistColours
//sample API call to colour mind Io
let apiURL = "http://colormind.io/api/";

//colour object to make it easier
class colour{
  constructor(name,rgbCode){
    this.__name = name;
    this.__rgbCode = rgbCode;
  }
  get name(){
    return this.__name;
  }
  get rgbCode(){
    return this.__rgbCode;
  }
}

//there are three possible options for a very low valence
let valenceColourOptionVeryLow = [new colour("brown", [51,51,0]), new colour("green grey",[44,45,49]),new colour("cadet grey",[91,96,115] )];
let valenceColourOptionSomehwatLow = [new colour("dull green", [75,102,84]), new colour("charcoal blue",[46,61,104]),new colour("dried plum",[110, 96, 120] )];
let valenceColourOptionSomehwatHigh = [new colour("ultramarine blue", [51,119,255]), new colour("Viridian",[84,134,95]),new colour("satin sheet gold",[209, 199, 54]) ];
let valenceColourOptionVeryHigh = [new colour("champagne", [255,221,153]), new colour("pastel-magenta",[255,153,187]),new colour("yellow",[235, 205, 9]) ];

let energyColourOptionVeryLow = [new colour("Cinerious", [146,136,125]), new colour("Camaflouge Brown",[125,117,108] ),new colour("mauve",[99,54,63] ) ]
let energyColourOptionSomehwatLow = [new colour("copper", [174,124,67]), new colour("hunter green",[39,104,53]),new colour("dark slate blue",[51,74,129] )  ] //make mostly blues/greens
let energyColourOptionSomehwatHigh = [new colour("copper rose", [165,91,105]), new colour("Plum", [140,79,146]), ,new colour("steel blue",[61,150,155] ) ] //purples/reds/pinks
let energyColourOptionVeryHigh = [new colour("fuschia",[188,88,197]), new colour("violet",[135,36,194]),new colour("fire engine red",[195,37,37]) ]

let majorColour = [new colour("pastel blue", [204,230,255]), new colour("pastel purple",[236, 195, 255] ),new colour("pastel pink",[255,230,234]),new colour("peach",[255, 212, 156])];
let minorColor = [new colour("oxford blue", [0,0,51]), new colour("black",[31, 29, 25]),new colour("dark green",[0,51,26]),new colour("seal brown",[51,0,9])];

//the blue yellow option

//determine colours with the

function changeIntensity(colourObject,constant){

  colourObject.rgbCode.forEach( (value,index) => {

    value = value*constant;
    colourObject.rgbCode[index]=value;

  });
};

exports.getPalette = (valence,energy,mode,danceability) =>
{
  coloursArray = getInitialValues(valence,energy,mode,danceability);
   let returnVal =  makeAPIRequest(coloursArray).then(function (posts) {
		console.log('Success!', posts);
    return posts;
	})
	.catch(function (error) {
		console.log('Something went wrong', error);
	});


  return returnVal;
 };

function getInitialValues(valence,energy,mode,danceability)
{

  let colours = []; let palette = [];

  if(energy>0 && energy<=0.25){
    let energyColor = energyColourOptionVeryLow[Math.floor(Math.random() * energyColourOptionVeryLow.length)];
    colours.push(energyColor);
  }
  else if(energy<=0.50){
    let energyColor = energyColourOptionSomehwatLow[Math.floor(Math.random() * energyColourOptionSomehwatLow.length)];
    colours.push(energyColor);
  }
  else if(energy<=0.75){
    let energyColor = energyColourOptionSomehwatHigh[Math.floor(Math.random() * energyColourOptionSomehwatHigh.length)];
    //console.log("hi");
    console.log(energyColor);
    colours.push(energyColor);
  }
  else {
    let energyColor = energyColourOptionVeryHigh[Math.floor(Math.random() * energyColourOptionVeryHigh.length)];
    colours.push(energyColor);
  }
  if(danceability<=0.5){
    colours.forEach(colorObj =>
    {
      console.log(colorObj);
      changeIntensity(colorObj,0.5);
        console.log(colorObj);
    });
  }
  else {
    colours.forEach(colorObj =>
    {
      console.log(colorObj);
      changeIntensity(colorObj,1.5);
      console.log(colorObj);
    });

  }
  if(valence>0 && valence<=0.25){
     let valenceColor = valenceColourOptionVeryLow[Math.floor(Math.random() * valenceColourOptionVeryLow.length)];
     colours.push(valenceColor);
  }
  else if(valence<=0.50){
    let valenceColor = valenceColourOptionSomehwatLow[Math.floor(Math.random() * valenceColourOptionSomehwatLow.length)];
    colours.push(valenceColor);
  }
  else if(valence<=0.75){
    let valenceColor = valenceColourOptionSomehwatHigh[Math.floor(Math.random() * valenceColourOptionSomehwatHigh.length)];
    colours.push(valenceColor);
  }
  else {
    let valenceColor = valenceColourOptionVeryHigh[Math.floor(Math.random() * valenceColourOptionVeryHigh.length)];
    colours.push(valenceColor);

  }
  if(mode==1){
    let modeColor = majorColour[Math.floor(Math.random() * majorColour.length)];
    colours.push(modeColor);
  }
  else {
    let modeColor = minorColor[Math.floor(Math.random() * minorColor.length)];
    colours.push(modeColor);
  }

  return colours;

};

  let makeAPIRequest = (colourObjArray) =>
{
  let input = [];
//code from colormind.io
 colourObjArray.forEach(colourObj =>
 {
   input.push(colourObj.rgbCode)
 });

  let data = {
  	model : "default",
  	input : [input[0],"N", input[1],"N",input[2]]
  }

  var http = new XMLHttpRequest();
  return new Promise(function (resolve, reject) {

    http.onreadystatechange =  function() {

    if (http.readyState !== 4) return;  
  	if(http.status >= 200 && http.status <300) {
  		console.log("made request");
      let value = JSON.parse(http.responseText).result;
      console.log(value);
       resolve(value);
      //callbackFunction(palette);
  	}
    else {
				// If failed
				reject({
					status: http.status,
					statusText: http.statusText
				});
			}
  };
  console.log(data);
  http.open("POST", apiURL, true);
  http.send(JSON.stringify(data));
});
};






function returnResults(value)
{
  //after the palette has been filled export this value;
  exports.palette = value;

}


/*
if Valence is between 0.0 - 0.25 (grey)--> very sad, 0.26-0.5 (duller green) --> mostly sad/angry, 0.51-0.75 --> somewhat happy,
0.76-1 is (a yellow green) very happy (yellow)
(grey different shade from other one), grey blue, a tuorquise ish colour, bright yellow (different from other shade)

if energy is 0-0.25 (use beige), 0.26-0.5 use a desert brown , 0.5-0.75 use an orange (milder), 0.76-0.1 a red
- if energy is low: use off white, blush pink ,  magenta, purple (randomly pick between these 2)
- depending on the danceability increase the intensity hue for the rest of the colors colours by a certain amount
- 0-0.5 if danceability is low, decrease intensity
- 0.51-1, increase intensity of danceability colours
- if the key is major: use a pastel colour (pastel purple, pastel blue, and pastel pink, peach (chosen randomly))
- if the key is a minor: use navy blue, khaki green, blue
- supply 3 colours to the API and it will generate a similar colour palette...
*/
