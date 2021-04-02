var  express = require('express');
var router=express.Router();
const AWS_sns_sms=require('../Services/awsSNS');
const User=require('../core/partner');
const user = new User();


const Seller=require('../core/seller');
const seller = new Seller();


router.get('/',function(req,res,next){

	var step=req.query.step;
	var preExist=req.query.exist;
var prevUser=req.query.user;
var broken=req.query.broken;
var success=req.query.success;

var who=req.query.who;

if (success!=undefined){
	success=true;
	who=req.query.type;
}else{success=false;}



// if(who=undefined){
// 	who = req.query.type;
// }
// if()


console.log('###########sucess',success);

	
	if(step==undefined){
	req.session.newUserMobNo=undefined;
	req.session.newUserName=undefined;
	req.session.newUserPassword=undefined;
	req.session.otp=undefined;
	req.session.newUserEmail=undefined;
	console.log('>>>>>>>>>>>>>>>>>>><<<<<<<<',step);
	res.render('join',{loginLink:'login',login:'Login',registerLink:'register',register:'Register',joinLink:'join',join:'Join Us',step:0,
		mobNo:'',preExist:preExist,userMob:prevUser,broken:broken,success:success,who:who});
}else if(step=='register' && req.session.newUserMobNo!=undefined){

	res.render('join',{loginLink:'login',login:'Login',registerLink:'register',register:'Register',joinLink:'join',join:'Join Us',
		step:1,mobNo:req.session.newUserMobNo,preExist:preExist,userMob:prevUser,broken:broken,success:success,who: who});

}else{
	res.redirect('join');
}


});









router.post('/',(req,res,next)=>{

	var step=req.query.step;
	var type=req.query.type;
	console.log('>>>>>>>>>>>>>>>>>>><<<<<<<<',step,type);

	// res.json(req.body);
	console.log(req.body.name);
	// console.log(res);

	// res.send(req.body);
	if(step=='register' && req.body.mobNo!=undefined&&type!=undefined){





		if(type!='sellingPartner'){

		seller.find(req.body.mobNo,function(data){


			if(data==null){
				req.session.newUserType=type;
				req.session.newUserMobNo=req.body.mobNo;
	req.session.newUserName=req.body.name;
	req.session.newUserPassword=req.body.password;
	req.session.newUserEmail=req.body.email;
	console.log(req.body.name);
var otp=Math.floor(Math.random() * (999999 - 100000) + 100000);
AWS_sns_sms(req.session.newUserMobNo,otp);
console.log(otp);
req.session.otp=otp;
console.log(req.body.name);
	// res.render('join',{loginLink:'login',login:'Login',registerLink:'register',register:'Register',joinLink:'join',join:'Join Us',step:1,mobNo:req.session.newUserMobNo});
res.redirect('?step=register');
			}

else{res.redirect('join?exist=true&user='+req.body.mobNo);}


		});
	}









	else{
		seller.find(req.body.mobNo,function(data){


			if(data==null){
				req.session.newUserType=type;
				req.session.newUserMobNo=req.body.mobNo;
	req.session.newUserName=req.body.name;
	req.session.newUserPassword=req.body.password;
	req.session.newUserEmail=req.body.email;
	console.log(req.body.name);
var otp=Math.floor(Math.random() * (999999 - 100000) + 100000);
AWS_sns_sms(req.session.newUserMobNo,otp);
console.log(otp);
req.session.otp=otp;
console.log(req.body.name);
	// res.render('join',{loginLink:'login',login:'Login',registerLink:'register',register:'Register',joinLink:'join',join:'Join Us',step:1,mobNo:req.session.newUserMobNo});
res.redirect('?step=register');
			}

else{res.redirect('join?exist=true&user='+req.body.mobNo);}


		});
	}

}















else if(step=='confirm'&& req.body.otp!=undefined){
	var otp=req.body.otp;

	console.log('otp>>>>  ',otp);

	if(otp!=undefined&&req.session.otp!=undefined){
	if(otp==req.session.otp){


let userInput={
mobNo:req.session.newUserMobNo,
name:req.session.newUserName,
password:req.session.newUserPassword,
email:req.session.newUserEmail
};



if(req.session.newUserType=='shgPartner'){

user.create(userInput,function(lastId){

console.log("kya hai ye last id>>>");
console.log(lastId);

req.session.newUserMobNo=undefined;
	req.session.newUserName=undefined;
	req.session.newUserPassword=undefined;
	req.session.otp=undefined;

if(lastId){

	res.redirect('/join?success=true&type=shgPartner');
	// res.redirect('/login');
}else{
	console.log("Error in creating the user");
	res.redirect('join?broken=true');

}
});


}



else if(req.session.newUserType=='sellingPartner'){



seller.create(userInput,function(lastId){

console.log("kya hai ye last id>>>");
console.log(lastId);

req.session.newUserMobNo=undefined;
	req.session.newUserName=undefined;
	req.session.newUserPassword=undefined;
	req.session.otp=undefined;

if(lastId){

	res.redirect('/join?success=true&type=sellingPartner');
	// res.redirect('/login');
}else{
	console.log("Error in creating the user");
	res.redirect('join?broken=true');

}
});
	

}





else{res.redirect('join?broken=true');}



}



else{
res.redirect('?step=register');}
}else{
	res.redirect('join?broken=true');
}
}


else{
	res.redirect('join');
}


});
















module.exports = router;