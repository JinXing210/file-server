//-------------------------------------------------------//
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var fs = require("fs");
var path = require('path');
var formidable = require('formidable');
//-------------------------------------------------------//
app.set('view cache',true)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static(__dirname + '/html'));
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

upload = function(req,res,dir) {
    console.log(req.query);

    var guid = req.query.guid;
  
    if (validate(guid) == false) {
        guid = "none";
    }
    console.log( guid );
    var outfilename = "";
    // create an incoming form object
    var form = new formidable.IncomingForm();
    // specify that we want to allow the user to upload multiple files in a single request
    form.multiples = true;
    // store all uploads in the /uploads directory
//        form.uploadDir = path.join(__dirname, '/uploads');
    form.uploadDir = "./client/image";//+dir;
    // every time a file has been uploaded successfully,
    // rename it to it's orignal name
    form.on('file', function(field, file) {
        outfilename = guid + "_" + Date.now() + '_' + file.name;
        fs.rename(file.path, path.join(form.uploadDir, outfilename));
    });
    // log any errors that occur
    form.on('error', function(err) {
        console.log('An error has occured: \n' + err);
        res.json({success:false,error:'fail'});
    });
    // once all the files have been uploaded, send a response to the client
    form.on('end', function() {
        console.log(outfilename);
        res.json({success:true,data: { filename:outfilename}});
    });
    // parse the incoming request containing the form data
    form.parse(req,function(err,fields,files){

    });
};

//-------------------------------------------------------//
//-------------------------------------------------------//
//-------------------------------------------------------//
app.get('/', function(req, res) {
    console.log( "/"+ JSON.stringify(req.params) );
    res.render('index.html');
});

//-------------------------------------------------------//
app.get('/avatar/:page', function(req, res) {
    console.log( JSON.stringify(req.params) );
    var filename = req.params.page;
    if( filename == null ) {
        return;
    }
    filename = './client/avatar/' + req.params.page;
    if( !fs.existsSync(filename) ) { 
        res.send('done');
        return;
    } 
    console.log( filename );
    try {
        res.sendfile(filename);
    } catch (e) {
        console.log('         error loading page-' + req.params.page );
        res.send('done');
    }
});

app.get('/image/:page', function(req, res) {
    console.log( JSON.stringify(req.params) );
    var filename = req.params.page;
    if( filename == null ) {
        return;
    }
    setImmediate(function() {
        var filename = './client/image/' + req.params.page;
        if( !fs.existsSync(filename) ) { 
            res.send('done');
            return;
        } 
        console.log( filename );
        try {
            res.sendfile(filename);
        } catch (e) {
            console.log('         error loading page-' + req.params.page );
            res.send('done');
        }
    
    })
});

app.get('/audio/:page', function(req, res) {
    console.log( JSON.stringify(req.params) );
    var filename = req.params.page;
    if( filename == null ) {
        return;
    }
    setImmediate(function() {
        var filename = './client/audio/' + req.params.page;
        if( !fs.existsSync(filename) ) { 
            res.send('done');
            return;
        } 
        console.log( filename );
        try {
            res.sendfile(filename);
        } catch (e) {
            console.log('         error loading page-' + req.params.page );
            res.send('done');
        }
    
    })
});

app.get('/video/:page', function(req, res) {
    console.log( JSON.stringify(req.params) );
    var filename = req.params.page;
    if( filename == null ) {
        return;
    }
    setImmediate(function() {
        var filename = './client/video/' + req.params.page;
        if( !fs.existsSync(filename) ) { 
            res.send('done');
            return;
        } 
        console.log( filename );
        try {
            res.sendfile(filename);
        } catch (e) {
            console.log('         error loading page-' + req.params.page );
            res.send('done');
        }
    
    })
});
app.get('/file/:page', function(req, res) {
    console.log( JSON.stringify(req.params) );
    var filename = req.params.page;
    if( filename == null ) {
        return;
    }
    setImmediate(function() {
        var filename = './client/file/' + req.params.page;
        if( !fs.existsSync(filename) ) { 
            res.send('done');
            return;
        } 
        console.log( filename );
        try {
            res.sendfile(filename);
        } catch (e) {
            console.log('         error loading page-' + req.params.page );
            res.send('done');
        }
    
    })
});

//----------------------------------------------------------------------//
// upload
app.post('/upload_avatar', function(req, res) {
    console.log(req.query);
    upload(req,res,"avatar")

});

app.post('/upload_image', function(req, res) {
    upload(req,res,"image")
});

app.post('/upload_audio', function(req, res) {
    upload(req,res,"audio")
});
app.post('/upload_video', function(req, res) {
    upload(req,res,"video")
});
app.post('/upload_file', function(req, res) {
    upload(req,res,"file")
});
