var  express = require('express');
var router=express.Router();


router.get('/',function(req,res){
    if(req.session.partner){
		console.log("partner hai be");
		res.render('byer',{loginLink:'',login:"",registerLink:'partner',register:req.session.partner.name,joinLink:'',join:'',session:'partner'});
	}else if(req.session.user){
		console.log("user hai be",req.session.user);
    console.log(req.session.user.name);
		res.render('byer',{loginLink:'',login:'',registerLink:'user',register:req.session.user.name,joinLink:'',join:'',session:'user'});
	}else{


	res.render('byer',{loginLink:'login',login:'Login',registerLink:'register',register:'Register',joinLink:'join',join:'Join Us',session:'none'});}
});
        
    
module.exports = router;