var  express = require('express');
var router=express.Router();
const User= require('../core/user');
const Partner= require('../core/partner');
var session = require('express-session');

const cartDB= require('../core/cart');
const cartModel= require('../models/cart');


const AWS_sns_sms=require('../Services/awsSNS');


const user= new User();
const partner= new Partner();



const Seller=require('../core/seller');
const seller = new Seller();





router.get('/',function(req,res,next){
	req.session.forgetPassword_mobNo=undefined;
	req.session.otp=undefined;

var incorrect=false;
if(req.query.incorrect!=undefined && req.query.incorrect=='sessionExpired'){
	console.log('%%%%%%%%%%%%%%%%%%%%%%%%%');
	incorrect='sessionExpired';
}

	var type= req.query.type;
	var action="/forget?type="+type;
	console.log("%%%%%%%%%",action);

//var incorrect=req.query.incorrect;
// var action=req.query.action;
var forgetPass=req.query.forgetPassword;

	// res.send('password send karna hai inko');
	res.render('forget',{loginLink:'login',login:'Login',registerLink:'register',register:'Register',joinLink:'join',join:'Join Us',
incorrect:incorrect,action:action,forgetPass:true,mobNo:''});




});







router.post('/',(req,res,next)=>{

	var step=req.query.step;
	var action=req.query.action;



	if(step==undefined && req.body.mobNo!=undefined ){
var type=req.query.type;
req.session.ForgetUserType=type;

var mob=req.body.mobNo;

var otp=Math.floor(Math.random() * (999999 - 100000) + 100000);
AWS_sns_sms(mob,otp);
req.session.otp=otp;
req.session.forgetPassword_mobNo=mob;
console.log(req.session.otp);

//res.send(mob);
console.log('otp wala section')

res.render('forget',{loginLink:'login',login:'Login',registerLink:'register',register:'Register',joinLink:'join',join:'Join Us',
incorrect:false,forgetPass:true,action:'otpVerification',mobNo:req.session.forgetPassword_mobNo});

}


else if(step=='confirm' && req.session.forgetPassword_mobNo!=undefined && req.session.otp!=undefined){

var otp=req.body.otp;
if(otp==req.session.otp){
res.render('forget',{loginLink:'login',login:'Login',registerLink:'register',register:'Register',joinLink:'join',join:'Join Us',
incorrect:false,forgetPass:true,action:'resetPassword',mobNo:req.session.forgetPassword_mobNo});
}else{
res.render('forget',{loginLink:'login',login:'Login',registerLink:'register',register:'Register',joinLink:'join',join:'Join Us',
incorrect:true,action:"/login/user",forgetPass:true,action:'otpVerification',mobNo:req.session.forgetPassword_mobNo});
}

}



else if(action=='reset' && req.session.forgetPassword_mobNo!=undefined && req.session.otp!=undefined && req.session.ForgetUserType!=undefined  && req.body.password!=undefined ){

var password=req.body.password;
var mob=req.session.forgetPassword_mobNo;
console.log('reset>>>>>>>>>>>>>>>>>>>>>>',req.session.ForgetUserType);
if(req.session.ForgetUserType=='user'){

	user.resetPassword(mob,password,function(affectedRow){
		console.log('rweee@@@@',affectedRow);
		if(affectedRow){
			res.redirect('login');
		}else{res.redirect('forget?incorrect=sessionExpired')}
	});

}else if(req.session.ForgetUserType=='partner'){
//res.send('partner hai');
partner.resetPassword(mob,password,function(affectedRow){
		console.log('rweee@@@@',affectedRow);
		if(affectedRow){
			res.redirect('login');
		}else{res.redirect('forget?incorrect=sessionExpired')}
	});

}



else if(req.session.ForgetUserType=='seller'){
//res.send('partner hai');
seller.resetPassword(mob,password,function(affectedRow){
		console.log('rweee@@@@',affectedRow);
		if(affectedRow){
			res.redirect('login');
		}else{res.redirect('forget?incorrect=sessionExpired')}
	});

}









else{
	res.redirect('forget?incorrect=sessionExpired');	
}

}






else{
	res.redirect('forget?incorrect=sessionExpired');
}


});










router.post('/partners',(req,res,next)=>{
	console.log('>>>>>>>>'+req.session.message);
	//res.send(req.body);


	let userInput={
		mobNo:req.body.mobNo,
		password:req.body.password
	};

	partner.login(userInput.mobNo,userInput.password,function(user){

		if(user!=null){

				req.session.partner =user ;
				req.session.user=undefined;
				req.session.cart=undefined;
			// req.app.set('user', user);

			res.redirect('/partner');


		}else{
// 				res.render('login',{loginLink:'login',login:'Login',registerLink:'register',register:'Register',joinLink:'join',join:'Join Us',
// incorrect:true,action:"/login/partners"

// });
res.redirect('/login?incorrect=true&action=partners');
		}

	});


});











router.post('/user',(req,res,next)=>{


var forget=req.query.forgetPass;
if(forget=='true'){

var mob=req.body.mobNo;
var otp=Math.floor(Math.random() * (1000000 - 0) + 0);
AWS_sns_sms(mob,otp);
req.session.otp=otp;
req.session.forgetPassword_mobNo=mob;


}else{





	//res.send(req.body);

	let userInput={
		mobNo:req.body.mobNo,
		password:req.body.password
	};

	user.login(userInput.mobNo,userInput.password,function(user){

		if(user!=null){

			req.session.user =user ;
			req.session.partner=undefined;

			var cartdb=new cartDB();
			var cart=new cartModel({});
			cartdb.findproductsOfSameUser(user.mobNo,function(result){
				// console.log(result);
				if(result!=null){
				for(var i=0;i<result.length;i++){
					// console.log(result[i]);
					var product={productId:result[i].productId,price:parseInt(result[i].price),name:result[i].name,filePath:result[i].filePath};
					// console.log(product);
					cart.add(product,result[i].productId);
					req.session.cart=cart;
					console.log(req.session.cart);
					if(i+1==result.length){
						res.redirect('/cart');
					}
				}}else{
					res.redirect('/user');
				}
				
			});

			
			
		}else{
// 				res.render('login',{loginLink:'login',login:'Login',registerLink:'register',register:'Register',joinLink:'join',join:'Join Us',
// incorrect:true,action:"/login/user"
// });
				res.redirect('/forget?incorrect=true&action=user')
		}

	});
}

});


module.exports = router;