//-------------------------------------------------------//
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var fs = require("fs");
var path = require('path');
var formidable = require('formidable');
//-------------------------------------------------------//
// Setting environment
app.set('views', __dirname + '/html');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(session({
    secret: '@#@$MYSIGN#@$#$',
    resave: false,
    saveUninitialized: true
}));
app.use(express.static('html'));
//-------------------------------------------------------//
var port = process.env.PORT || 4500;
var server = app.listen(port, function(){
    console.log("Live Video Chat Server has started on port " + port);
});

//-------------------------------------------------------//
//-------------------------------------------------------//
//-------------------------------------------------------//
app.get('/', function(req, res) {
    console.log( "/"+ JSON.stringify(req.params) );
    res.render('index.html');
});
//-------------------------------------------------------//
app.get('/:page', function(req, res) {
    console.log( JSON.stringify(req.params) );
    var filename = req.params.page;
    if( filename == null ) {
        return;
    }
    filename = '' + req.params.page;
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
    console.log("photo:upload->" );

    let guid = req.body.guid;
  
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
        outfilename = Date.now() + '_' + file.name;
        fs.rename(file.path, path.join(form.uploadDir, outfilename));
    });
    // log any errors that occur
    form.on('error', function(err) {
        res.json({success:false,error:'fail'});
        console.log('An error has occured: \n' + err);
    });
    // once all the files have been uploaded, send a response to the client
    form.on('end', function() {
        res.json({success:true,data: { filename:outfilename}});
    });
    // parse the incoming request containing the form data
    form.parse(req);
});


module.exports.upload = function(req, res) {
    console.log("photo:upload->" );
    let guid = req.body.guid;
  
    if (validate(guid) == false) {
        guid = "";
    }
    console.log( guid );
    
    var outfilename = "";
    // create an incoming form object
    var form = new formidable.IncomingForm();
    // specify that we want to allow the user to upload multiple files in a single request
    form.multiples = true;
    form.uploadDir = 'photos';
    // every time a file has been uploaded successfully,
    // rename it to it's orignal name
    form.on('file', function(field, file) {
        //   outfilename = "photo_" + String(guid) + "_" + Date.now();
        outfilename = "photo_" + Date.now();
        fs.rename(file.path, path.join(form.uploadDir, outfilename));
    });
    // log any errors that occur
    form.on('error', function(err) {
        // return { success: false, errors: error };
        console.log('An error has occured: \n' + err);
        // return { success: false, errors: error };
    });
    // once all the files have been uploaded, send a response to the client
    form.on('end', co.wrap(function*() {
        try {
            let photo_url = outfilename;
            res.end ({success:true,data:{photo_name: outfilename}});
            //res.end(outfilename);
        } catch (error) {
            res.end( { success: false, errors: error });
        }
    }));
    // parse the incoming request containing the form data
    form.parse(req.raw.req);
    return;
  };
  
  
