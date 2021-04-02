//main page

const express = require('express');
const path=require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger=require('morgan');
const app = express();
const session = require('express-session');
const crypto = require('crypto');
 const     fs = require("fs");
   // const   http = require("http");


app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());


// app.use('/css',express.static('assets'));
// app.use(express.static(__dirname + '/css'));
app.use('/public',express.static(__dirname +'/public'));
app.use('core',express.static(__dirname +'/core'));
// app.use('/partials',express.static(__dirname +'/views/partials'));
app.use('/img',express.static(__dirname +'/img'));






// ['mySecret-ujjal-byer-creator-mySecret#Agentdontknow','abcdefghijklab23cd#$mnopqrstuvwxyz','ab23j87t@h*kik%m&l98cd#$']
const redis = require('redis');
let RedisStore = require('connect-redis')(session);
let redisClient = redis.createClient();

redisClient.on('error', (err) => {
  console.log('Redis error: ', err);
});


app.use(session({secret:['mySecret-ujjal-byer-creator-mySecret#Agentdontknow','abcdefghijklab23cd#$mnopqrstuvwxyz','ab23j87t@h*kik%m&l98cd#$'] ,
name:'__uidSerial.r.ss_ga',
 resave: false, saveUninitialized: false, 

 

 	store: new RedisStore({ client: redisClient ,ttl: 86400})

}));


// cookie: { 
//  	maxAge: 120000 },




app.use(function(req, res, next) {
	var maxtime=1000*60*10 ;
    if(req.session.otp) {
        req.session.cookie.maxAge = maxtime ;

    }
    if(req.session.forgetPassword_mobNo) {
        req.session.cookie.maxAge = maxtime ;
    }

    if(req.session.ForgetUserType) {
        req.session.cookie.maxAge = maxtime ;
    }
    

    // save the session
    req.session.save()

    // add next at the end of middleware 
    // so it can pas data edited to another middleware
    next()
});













app.get('/join_us',function(req,res){
	res.render('join_us');
});




var index=require('./routes/index');
app.use('/home',index);

/* changes here*/
var btobroute=require('./routes/btobroute');
app.use('/b2b',btobroute);

var byerRoute=require('./routes/byerRoute');
app.use('/byer_mitra',byerRoute);


var approachroute=require('./routes/approachRoute');
app.use('/approach',approachroute);



var about=require('./routes/about');
app.use('/about',about);




var login=require('./routes/login');
app.use('/login',login);

var user=require('./routes/user');
app.use('/user',user);


var register=require('./routes/register');
app.use('/register',register);


var join=require('./routes/join');
app.use('/join',join);

var partner=require('./routes/partner');
app.use('/partner',partner);


var products=require('./routes/products');
app.use('/products',products);


var productsView=require('./routes/productView');
app.use('/productView',productsView);




var cart=require('./routes/cart');
app.use('/cart',cart);


var forget=require('./routes/forget');
app.use('/forget',forget);


var deliver=require('./routes/productDelivery');
app.use('/deliver',deliver);




var shg=require('./routes/sellerPartner/sellerPartner');
app.use('/seller',shg);




var deliveryxx=require('./routes/deliveryBoy/deliveryBoy');
app.use('/delivery',deliveryxx);












// var db=require('./routes/database');
// app.use('/db',db);



app.get('/',function(req,res){
	// res.sendFile(__dirname+'/index.html');
	console.log("helo helo")
	res.setHeader("Set-Cookie", "HttpOnly;Secure;SameSite=Strict");
	res.redirect('home');
});





//handling error page not found

app.use((req,res,next)=>{
	var err= new Error('Page is not found 404');
	err.status=404;
	next(err);
});
//handling errors
app.use((err,req,res,next)=>{
	res.status(err.status||500);
	console.log(err.message,'##$$$$');
	// res.send(err.message);
	res.render('error-404');
	if(req.session.partner){
		console.log("partner hai be");
		res.render('error-404',{loginLink:'',login:"",registerLink:'partner',register:req.session.partner.name,joinLink:'',join:'',session:'partner',join_us:'join_us'});
	}else if(req.session.user){
		console.log("user hai be");
		res.render('error-404',{loginLink:'',login:'',registerLink:'user',register:req.session.user.name,joinLink:'',join:'',session:'user',join_us:'join_us'});
	}else{
		res.render('error-404',{loginLink:'login',login:'Login',registerLink:'register',register:'Register',joinLink:'join',join:'Join Us',session:'none',join_us:'join_us'});
	}


	
});

















app.listen(3011, () => {
  console.log('Example app listening on port 3011!')
});