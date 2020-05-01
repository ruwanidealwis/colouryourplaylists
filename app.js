//require all modules
let express = require("express");
let index = require("./routes/index");

//require created modules
let app = express();
//set view engine
app.set("view engine", "pug");
//app.set('views', path.join(__dirname, 'views'));
//middleware function to redirect to login if user goes to a link
/*app.use(function(req, res, next) {
    if (req.session.user == null){
// if user is not logged-in redirect back to login page //
        alert("redirected to main");
        res.redirect('/login');
    }   else{
        next();
    }
});*/
//require node module for the spotify api
app.use(express.static("./public"));
//set up listening on local host
let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port, () => console.log(`app listening on port ${port}`)); //app is now listening on port

index(app);
