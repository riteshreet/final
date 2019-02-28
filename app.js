var express           = require('express');
var mongoose          = require('mongoose');
var bodyParser        = require('body-parser');
var path              = require('path');
var port              = process.env.PORT || 8001;
var app               = express();
var session           = require('express-session');
var formidable        = require('formidable');
var File              = require('./model/upload');

mongoose.connect('mongodb://localhost:27017/Utility',{useNewUrlParser:true});
const mongoURI = 'mongodb://localhost:27017/Utility';
var conn = mongoose.createConnection(mongoURI);

conn.on('error', console.error.bind(console, 'connection error:'));
conn.once('open', function (err, db) {
    if(err)
    {
        console.log(err);
    }
    else
    {
        console.log("connected to MongoDB...");
    }
});


    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.static(path.join(__dirname, 'public')));
	app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'html');
    app.use(session({
        secret: "wah wah wah wah",
        resave: false,
        saveUninitialized: true
    }));

    app.get('/', function(req,res){
        res.render('login');
    });


    app.post('/login',function(req, res){
        const email    = req.body.email;
        const password = req.body.password;
        var admins = conn.collection('admin');
       admins.findOne({ email : email , password : password }, function(err, adm){

        if(err) throw err;

        if(adm)
        {
            res.render('upload');
        }
        
            
       });
    });

    app.get('/logout', function(req, res) {
        req.session.destroy(function(err){  
              if(err){  
                  console.log(err); 
                  Response.errorResponse(err.message,res); 
              }  
              else  
              {  
                  Response.successResponse('User logged out successfully!',res,{}); 
              }  
          });
      });


    app.get('/upload', function(req,res){
        
            res.render('upload');
        });


    app.post('/upload',function(req, res){
       
        const uname = req.body.name;
        const pienam = req.body.selectPie;
        const fileName = req.body.filename;
        
       
        console.log('uname = '+uname);
        console.log('pienam = '+pienam);
        console.log('fileName = '+fileName);
        
		var form = new formidable.IncomingForm();
            form.parse(req, function(files){

                var check = conn.collection('file');

            check.findOne({name:uname,pieName:pienam},function(err, avai){
                if(!avai)
                {
					
				check.insertOne({userName:uname, pieName:pienam,name:fileName, file:files});
                console.log('inserted');
                res.render('upload');

                }  
                else
                {
						
                    check.updateOne({userName:uname, pieName:pienam},{$set: {name:fileName,file:files}}); 
                   console.log('updated');
                   res.send('Updated');
                   	
                 }
            });
           
        });
           
            
    });

app.use(function (req, res, next) {
    var err = new Error('File Not Found');
    err.status = 404;
    next(err);
  });

  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send(err.message);
  });

app.listen(port);
console.log('Listening  to  port ' + port);