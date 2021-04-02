var  express = require('express');
var router=express.Router();


var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: false,
  auth: {
    user: 'customer.byer@gmail.com',
    pass: 'customerQuery@1'
  }
});




router.get('/',function(req,res,next){

	if(req.session.partner){
		console.log("partner hai be");
		res.render('index',{loginLink:'',login:"",registerLink:'partner',register:req.session.partner.name,joinLink:'',join:'',session:'partner'});
	}else if(req.session.user){
		console.log("user hai be",req.session.user);
    console.log(req.session.user.name);
		res.render('index',{loginLink:'',login:'',registerLink:'user',register:req.session.user.name,joinLink:'',join:'',session:'user'});
	}else{


	res.render('index',{loginLink:'login',login:'Login',registerLink:'register',register:'Register',joinLink:'join',join:'Join Us',session:'none'});}
});



router.post('/mail',(req,res,next)=>{
	// res.json(req.body);
	// console.log(req.body.name);
	// console.log(res);

	// res.send(req.body);
	


var name=req.body.name;
var mobNo=req.body.mobNo.toString();
var email=req.body.email;
var message=req.body.message;

var fullMessage='name: '+name+"\n mobile: "+mobNo+"\n email:  "+email+"\n message: "+message;


var mailOptions = {
  from: 'customer.byer@gmail.com',
  to: 'customer.byer@gmail.com',
  subject: 'Customer Query',
  text: fullMessage
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
    res.redirect('/home#contactid');
  } else {
    console.log('Email sent: ' + info.response);
    res.redirect('/home');
  }
});








});












module.exports = router;