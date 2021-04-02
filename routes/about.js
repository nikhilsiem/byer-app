//about
var  express = require('express');
var router=express.Router();

router.get('/',function(req,res,next){
	console.log(req.app.get('user'));
	// res.render('aboutUS');

	if(req.session.partner){
		console.log("partner hai be");
		// res.render('aboutUS',{loginLink:'',login:"",registerLink:'partner',register:req.session.partner.name,joinLink:'',join:'',session:'partner'});
		res.render('aboutUS',{loginLink:'',login:"",registerLink:'partner',register:req.session.partner.name,joinLink:'',join:'',session:'partner'});
	}else if(req.session.user){
		console.log("user hai be");
		res.render('aboutUS',{loginLink:'',login:'',registerLink:'user',register:req.session.user.name,joinLink:'',join:'',session:'user'});
	}


	res.render('aboutUS',{loginLink:'login',login:'Login',registerLink:'register',register:'Register',joinLink:'join',join:'Join Us',session:'none'});
	// res.render('aboutUS',{user:req.session.user,partner:req.session.partner});
});












module.exports = router;