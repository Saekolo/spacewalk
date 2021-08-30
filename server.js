var http = require('http');
const express = require ('express')
const mongoose = require ('mongoose')
const morgan = require ('morgan')
var crypto = require("crypto");
const router = express.Router();
const path = require("path");
var bodyParser = require('body-parser');
const { db } = require('./user');
const app = express()

const PORT = process.env.PORT

var server = app.listen(process.env.PORT || 5000, () => {
  console.log('Server is started on 127.0.0.1:'+ (process.env.PORT || 5000))
})

var DB_URL = 'mongodb://localhost:27017/spacewalk'
mongoose.connect(DB_URL);

db.once('open', () => {
	console.log('Database connection established!')
})

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}))

http.createServer(function (req, res) {
	if(req.url === "/login"){
		console.log("loading the login page")
		sendFileContent(res, "login.html", "text/html");
		
	} else if(req.url === "/gallery"){
		sendFileContent(res, "gallery.html", "text/html");
	}});



// user registration

app.post('/login', function (req, res) {
	
	res.setHeader('Content-type','application/json;charset=utf-8')
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
	res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
	res.header("X-Powered-By",' 3.2.1')
	 
	// check if the user is in the record 
	var UserName = req.body.name;
	var UserEmail = req.body.email;
	var UserPassword = req.body.password;
	
	//encrypted the password
	var md5 = crypto.createHash("md5");
	var newPas = md5.update(UserPsw).digest("hex");

	// verification
	var updatestr = {username: UserName};
	  if(UserName == ''){
		 res.send({status:'success',message:'The username or password is incorrect'}) ;
	  }
	  res.setHeader('Content-type','application/json;charset=utf-8')
	  userSchema.find(updatestr, function(err, obj){
		  if (err) {
			  console.log("Error:" + err);
		  }
		  else {
			  if(obj.length == 0){
				
				// Insert the information into the database if record not found
				  insert(UserName,UserEmail, UserPassword); 
			
				  res.send({status:'success',message:true}) 
			  }else if(obj.length !=0){
				  res.send({status:'success',message:false}) 
			  }else{
				  res.send({status:'success',message:false}) 
			  }
		  }
	  })  
  });

  


function signup (name, email, password) {
    var user =  new userSchema({
		name : name,
		email : email,
		password : password,
		logindate : new Date()
	});

	user.save(function(err,res){
        if(err){
            console.log("An error occured");
        }
        else{
            console.log(res);
        }
    })
}


// Login
app.post('/login', function (req, res, next) {

// check any record found
	console.log("req.body"+req.body);
	var UserName = req.body.name;
	var UserPassword = req.body.password;

// encrypted the password
	var md5 = crypto.createHash("md5");
	var newPas = md5.update(UserPsw).digest("hex");

// verification
	var updatestr = {username: UserName,userpsw:newPas};

	  res.setHeader('Content-type','application/json;charset=utf-8')
	  res.header("Access-Control-Allow-Origin", "*");
	  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
	  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
	  res.header("X-Powered-By",' 3.2.1')
	  
	  userSchema.find(updatestr, function(err, obj){
		  if (err) {
			  console.log("Error:" + err);
		  }
		  else {
			  if(obj.length == 1){
				  console.log('Successful login');
				  res.send({status:'success',message:true,data:obj}); 
			  }else{
				  console.log('No record found, please sign up'); 
				  res.send({status:'success',message:false}); 
			  }
		  }
	  })
  })
