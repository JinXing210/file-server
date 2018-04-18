//-------------------------------------------------------//
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var fs = require("fs");
var path = require('path');
var formidable = require('formidable');
//-------------------------------------------------------//
app.set('views', __dirname + '/html');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(''));
//-------------------------------------------------------//
var port = process.env.PORT || 4500;
var server = app.listen(port, function(){
    console.log("Live Video Chat Server has started on port " + port);
});

validate = function(param) {
    if (  !param || param === '' ) {
        return false;
    }
    return true;
}

isEmpty = function(obj) { 
    for (var x in obj) { return false; }
    return true;
}

//-------------------------------------------------------//
//-------------------------------------------------------//
//-------------------------------------------------------//
app.get('/', function(req, res) {
    console.log( "/"+ JSON.stringify(req.params) );
    res.render('html/index.html');
});
//-------------------------------------------------------//
app.get('/photo/:page', function(req, res) {
    console.log( JSON.stringify(req.params) );
    var filename = req.params.page;
    if( filename == null ) {
        return;
    }
    filename = './client/photos/' + req.params.page;
    if( !fs.existsSync(filename) ) { 
        res.send('done');
        return;
    } 
    console.log( filename );
    try {
        res.render(filename);
    } catch (e) {
        console.log('         error loading page-' + req.params.page );
        res.send('done');
    }
});

//----------------------------------------------------------------------//
// upload
app.post('/upload', function(req, res) {
    console.log(req.query);

    var guid = req.query.guid;
  
    if (validate(guid) == false) {
        guid = "";
    }
    console.log( guid );
    var outfilename = "";
    // create an incoming form object
    var form = new formidable.IncomingForm();
    // specify that we want to allow the user to upload multiple files in a single request
    form.multiples = true;
    // store all uploads in the /uploads directory
//        form.uploadDir = path.join(__dirname, '/uploads');
    form.uploadDir = 'client/photos';
    // every time a file has been uploaded successfully,
    // rename it to it's orignal name
    form.on('file', function(field, file) {
        console.log( field );
        console.log( file );
        outfilename = Date.now() + '_' + file.name;
        console.log( outfilename );
        fs.rename(file.path, path.join(form.uploadDir, outfilename));
    });
    // log any errors that occur
    form.on('error', function(err) {
        console.log('An error has occured: \n' + err);
        res.json({success:false,error:'fail'});
    });
    // once all the files have been uploaded, send a response to the client
    form.on('end', function() {
        res.json({success:true,data: { filename:outfilename}});
    });
    // parse the incoming request containing the form data
    form.parse(req);
});
