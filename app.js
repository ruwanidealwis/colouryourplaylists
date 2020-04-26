
//require all modules
let express = require('express');
let index = require('./routes/index')

//require created modules
let app = express();
//set view engine
app.set('view engine', 'jade');

//require node module for the spotify api

//set up listening on local host
let port = 3000;
app.listen(port, () => console.log(`app listening on port ${port}`)); //app is now listening on port

index(app);
