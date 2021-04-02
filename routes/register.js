var  express = require('express');
// var mysql=require('mysql');
const User=require('../core/user');
var router=express.Router();

const AWS_sns_sms=require('../Services/awsSNS');



const user = new User();




router.get('/',function(req,res,next){

	var step=req.query.step;
var preExist=req.query.exist;
var prevUser=req.query.user;
var broken=req.query.broken;

console.log('broken  ',broken,step);

	if(step==undefined){
	req.session.newUserMobNo=undefined;
	req.session.newUserName=undefined;
	req.session.newUserPassword=undefined;
	req.session.otp=undefined;

console.log("where  ",preExist,preExist=='true',prevUser!=undefined,preExist==true & prevUser!=undefined);

	
	res.render('register',{loginLink:'login',login:'Login',registerLink:'register',register:'Register',joinLink:'join',join:'Join Us',step:0,mobNo:'',preExist:preExist,userMob:prevUser,broken:broken});

	console.log("in register page");}





else if(step=='register' && req.session.newUserMobNo!=undefined){

	res.render('register',{loginLink:'login',login:'Login',registerLink:'register',register:'Register',joinLink:'join',join:'Join Us',step:1,mobNo:req.session.newUserMobNo,preExist:preExist,userMob:prevUser,broken:broken});

}

else{
	res.redirect('register');
}


});























router.post('/',(req,res,next)=>{


console.log('session otp===:',req.session.otp);




	var step=req.query.step;





if(step=='register' && req.body.mobNo!=undefined){


user.find(req.body.mobNo,function(data){
	console.log('session otp===:',data);

if(data==null){
	req.session.newUserMobNo=req.body.mobNo;
	req.session.newUserName=req.body.name;
	req.session.newUserPassword=req.body.password;
var otp=Math.floor(Math.random() * (999999 - 100000) + 100000);
console.log("otp",otp)
AWS_sns_sms(req.body.mobNo,otp);
req.session.otp=otp;
	// res.render('register',{step:1,mobNo:req.session.newUserMobNo});
	res.redirect('register?step=register');
}else{
	res.redirect('register?exist=true&user='+req.body.mobNo);
}

});



}







else if(step=='confirm'&& req.body.otp!=undefined){
	var otp=req.body.otp;
	console.log("otp",otp)
	if(otp!=undefined&&req.session.otp!=undefined){
	if(otp==req.session.otp){


let userInput={
mobNo:req.session.newUserMobNo,
name:req.session.newUserName,
password:req.session.newUserPassword
};
user.create(userInput,function(lastId){

console.log("kya hai ye last id>>>");
console.log(lastId);

req.session.newUserMobNo=undefined;
	req.session.newUserName=undefined;
	req.session.newUserPassword=undefined;
	req.session.otp=undefined;

if(lastId){

	
	res.redirect('/login');
}else{
	console.log("Error in creating the user");
	res.redirect('register?broken=true');
}

});
}else{
	res.redirect('register?step=register');
}}else{
	res.redirect('register?broken=true');
}



}


else{
	res.redirect('register?broken=false');
}



}


);






module.exports = router;