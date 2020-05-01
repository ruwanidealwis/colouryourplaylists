//we need the data from the spotify module
let spotifyController = require("./spotifyController");
let XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
// get the alogrithm for the playlistColours
//sample API call to colour mind Io
let apiURL = "http://colormind.io/api/";
let overallIinfo = {};
//colour object to make it easier
class colour {
  constructor(name, rgbCode) {
    this.__name = name;
    this.__rgbCode = rgbCode;
  }
  get name() {
    return this.__name;
  }
  get rgbCode() {
    return this.__rgbCode;
  }
}

//there are three possible options for a very low valence
let valenceColourOptionVeryLow = [
  new colour("brown", [51, 51, 0]),
  new colour("green grey", [44, 45, 49]),
  new colour("cadet grey", [91, 96, 115]),
];
let valenceColourOptionSomehwatLow = [
  new colour("dull green", [75, 102, 84]),
  new colour("charcoal blue", [46, 61, 104]),
  new colour("dried plum", [110, 96, 120]),
];
let valenceColourOptionSomehwatHigh = [
  new colour("ultramarine blue", [51, 119, 255]),
  new colour("Viridian", [84, 134, 95]),
  new colour("satin sheet gold", [209, 199, 54]),
];
let valenceColourOptionVeryHigh = [
  new colour("champagne", [255, 221, 153]),
  new colour("pastel-magenta", [255, 153, 187]),
  new colour("yellow", [235, 205, 9]),
];

let energyColourOptionVeryLow = [
  new colour("Cinerious", [146, 136, 125]),
  new colour("Camaflouge Brown", [125, 117, 108]),
  new colour("mauve", [99, 54, 63]),
];
let energyColourOptionSomehwatLow = [
  new colour("copper", [174, 124, 67]),
  new colour("hunter green", [39, 104, 53]),
  new colour("dark slate blue", [51, 74, 129]),
]; //make mostly blues/greens
let energyColourOptionSomehwatHigh = [
  new colour("copper rose", [165, 91, 105]),
  new colour("Plum", [140, 79, 146]),
  new colour("aqua", [61, 150, 155]),
  new colour("papaya", [235, 94, 52]),
]; //purples/reds/pinks
let energyColourOptionVeryHigh = [
  new colour("fuschia", [188, 88, 197]),
  new colour("violet", [135, 36, 194]),
  new colour("fire engine red", [195, 37, 37]),
];

let majorColour = [
  new colour("pastel blue", [159, 203, 245]),
  new colour("pastel purple", [236, 195, 255]),
  new colour("pastel pink", [255, 196, 206]),
  new colour("peach", [255, 212, 156]),
];
let minorcolour = [
  new colour("oxford blue", [0, 0, 51]),
  new colour("black", [31, 29, 25]),
  new colour("dark green", [0, 51, 26]),
  new colour("seal brown", [51, 0, 9]),
];

//the blue yellow option

//determine colours with the
let infoAboutColours = function (colours, valence, energy, danceability, mode) {
  let arrayColourInfo = [];

  arrayColourInfo[0] = {
    name: colours[0].__name,
    danceability: overallIinfo.danceability,
    energy: overallIinfo.energy,
  };
  arrayColourInfo[1] = {
    name: colours[1].__name,
    valence: overallIinfo.valence,
  };
  arrayColourInfo[2] = { name: colours[2].__name, mode: overallIinfo.mode };

  return arrayColourInfo;
};

function changeIntensity(colourObject, constant) {
  colourObject.__rgbCode.forEach((value, index) => {
    value = value * constant;
    colourObject.__rgbCode[index] = value;
  });
}

exports.getPalette = (valence, energy, mode, danceability) => {
  coloursArray = getInitialValues(valence, energy, mode, danceability);
  let returnVal = makeAPIRequest(coloursArray)
    .then(function (posts) {
      exports.colourInfo = infoAboutColours(
        coloursArray,
        valence,
        energy,
        danceability,
        mode
      );
      return posts;
    })
    .catch(function (error) {
      console.log("There was an error", error);
    });

  return returnVal;
};

function getInitialValues(valence, energy, mode, danceability) {
  let colours = [];

  if (energy > 0 && energy <= 0.25) {
    let energycolour =
      energyColourOptionVeryLow[
        Math.floor(Math.random() * energyColourOptionVeryLow.length)
      ];
    let colourToAdd = JSON.parse(JSON.stringify(energycolour));
    overallIinfo.energy = "very low";
    colours.push(colourToAdd);
  } else if (energy <= 0.5) {
    let energycolour =
      energyColourOptionSomehwatLow[
        Math.floor(Math.random() * energyColourOptionSomehwatLow.length)
      ];
    let colourToAdd = JSON.parse(JSON.stringify(energycolour));
    overallIinfo.energy = "somewhat low";
    colours.push(colourToAdd);
  } else if (energy <= 0.75) {
    let energycolour =
      energyColourOptionSomehwatHigh[
        Math.floor(Math.random() * energyColourOptionSomehwatHigh.length)
      ];
    overallIinfo.energy = "somewhat high";
    let colourToAdd = JSON.parse(JSON.stringify(energycolour));
    colours.push(colourToAdd);
  } else {
    let energycolour =
      energyColourOptionVeryHigh[
        Math.floor(Math.random() * energyColourOptionVeryHigh.length)
      ];
    let colourToAdd = JSON.parse(JSON.stringify(energycolour));
    overallIinfo.energy = "very high";
    colours.push(colourToAdd);
  }
  if (danceability <= 0.5) {
    colours.forEach((colourObj) => {
      overallIinfo.danceability = "low";

      changeIntensity(colourObj, 0.5);
    });
  } else {
    colours.forEach((colourObj) => {
      overallIinfo.danceability = "high";
      changeIntensity(colourObj, 1.5);
    });
  }
  if (valence > 0 && valence <= 0.25) {
    let valencecolour =
      valenceColourOptionVeryLow[
        Math.floor(Math.random() * valenceColourOptionVeryLow.length)
      ];
    overallIinfo.valence = "mostly";
    let colourToAdd = JSON.parse(JSON.stringify(valencecolour));
    colours.push(colourToAdd);
  } else if (valence <= 0.5) {
    let valencecolour =
      valenceColourOptionSomehwatLow[
        Math.floor(Math.random() * valenceColourOptionSomehwatLow.length)
      ];
    let colourToAdd = JSON.parse(JSON.stringify(valencecolour));

    overallIinfo.valence = "several";
    colours.push(colourToAdd);
  } else if (valence <= 0.75) {
    let valencecolour =
      valenceColourOptionSomehwatHigh[
        Math.floor(Math.random() * valenceColourOptionSomehwatHigh.length)
      ];
    let colourToAdd = JSON.parse(JSON.stringify(valencecolour));

    overallIinfo.valence = "some";
    colours.push(colourToAdd);
  } else {
    let valencecolour =
      valenceColourOptionVeryHigh[
        Math.floor(Math.random() * valenceColourOptionVeryHigh.length)
      ];

    let colourToAdd = JSON.parse(JSON.stringify(valencecolour));
    overallIinfo.valence = "barely any ";
    colours.push(colourToAdd);
  }
  if (mode == 1) {
    let modecolour =
      majorColour[Math.floor(Math.random() * majorColour.length)];
    let colourToAdd = JSON.parse(JSON.stringify(modecolour));
    overallIinfo.mode = "major";
    colours.push(colourToAdd);
  } else {
    let modecolour =
      minorcolour[Math.floor(Math.random() * minorcolour.length)];
    let colourToAdd = JSON.parse(JSON.stringify(modecolour));
    colours.push(colourToAdd);
    overallIinfo.mode = "minor";
  }
  return colours;
}

let makeAPIRequest = (colourObjArray) => {
  let input = [];
  //code from colourmind.io
  colourObjArray.forEach((colourObj) => {
    input.push(colourObj.__rgbCode);
  });

  let data = {
    model: "default",
    input: [input[0], "N", input[1], "N", input[2]],
  };

  var http = new XMLHttpRequest();
  return new Promise(function (resolve, reject) {
    http.onreadystatechange = function () {
      if (http.readyState !== 4) return;
      if (http.status >= 200 && http.status < 300) {
        let value = JSON.parse(http.responseText).result;
        resolve(value);
        //callbackFunction(palette);
      } else {
        // If failed
        reject({
          status: http.status,
          statusText: http.statusText,
        });
      }
    };

    http.open("POST", apiURL, true);
    http.send(JSON.stringify(data));
  });
};

/*
if Valence is between 0.0 - 0.25 (grey)--> very sad, 0.26-0.5 (duller green) --> mostly sad/angry, 0.51-0.75 --> somewhat happy,
0.76-1 is (a yellow green) very happy (yellow)
(grey different shade from other one), grey blue, a tuorquise ish colour, bright yellow (different from other shade)

if energy is 0-0.25 (use beige), 0.26-0.5 use a desert brown , 0.5-0.75 use an orange (milder), 0.76-0.1 a red
- if energy is low: use off white, blush pink ,  magenta, purple (randomly pick between these 2)
- depending on the danceability increase the intensity hue for the rest of the colours colours by a certain amount
- 0-0.5 if danceability is low, decrease intensity
- 0.51-1, increase intensity of danceability colours
- if the key is major: use a pastel colour (pastel purple, pastel blue, and pastel pink, peach (chosen randomly))
- if the key is a minor: use navy blue, khaki green, blue
- supply 3 colours to the API and it will generate a similar colour palette...
*/
