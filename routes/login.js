var  express = require('express');
var router=express.Router();
const User= require('../core/user');
const Partner= require('../core/partner');
var session = require('express-session');

const cartDB= require('../core/cart');
const cartModel= require('../models/cart');





const user= new User();
const partner= new Partner();



const Seller=require('../core/seller');
const seller = new Seller();






router.get('/',function(req,res,next){

//for resetting password
	req.session.forgetPassword_mobNo=undefined;
	req.session.otp=undefined;
	
var incorrect=req.query.incorrect;
var action=req.query.action;
var forgetPass=req.query.forgetPassword;

if(forgetPass=='true'){
	// res.send('password send karna hai inko');
// 	res.render('login',{loginLink:'login',login:'Login',registerLink:'register',register:'Register',joinLink:'join',join:'Join Us',
// incorrect:false,action:"/login/user",forgetPass:true});
res.redirect('forget');
}else{



	var curUser=req.session.user;
	var curPartner=req.session.partner;


console.log("action>>",action,incorrect);



	if(curUser!=undefined){
		res.redirect('user');
	}else if(curPartner!=undefined){
		res.redirect('partner');
	}

if(incorrect==undefined){

	res.render('login',{loginLink:'login',login:'Login',registerLink:'register',register:'Register',joinLink:'join',join:'Join Us',
incorrect:false,action:"/login/user",forgetPass:false
});

}else if(!(incorrect==true) & (action=="partners" ||action=="user")){
	res.render('login',{loginLink:'login',login:'Login',registerLink:'register',register:'Register',joinLink:'join',join:'Join Us',
incorrect:true,action:"/login/"+action,forgetPass:false
});
}else{
	res.redirect('login');
}




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




router.post('/seller',(req,res,next)=>{
	console.log('>>>>>>>>'+req.session.message);
	//res.send(req.body);


	let userInput={
		mobNo:req.body.mobNo,
		password:req.body.password
	};

	seller.login(userInput.mobNo,userInput.password,function(user){

		if(user!=null){

				req.session.seller=user;
				req.session.partner =undefined ;
				req.session.user=undefined;
				req.session.cart=undefined;
			// req.app.set('user', user);
			console.log('seller login successfully');

			res.redirect('/seller');


		}else{
// 				res.render('login',{loginLink:'login',login:'Login',registerLink:'register',register:'Register',joinLink:'join',join:'Join Us',
// incorrect:true,action:"/login/partners"

// });
res.redirect('/login?incorrect=true&action=partners');
		}

	});


});







router.post('/user',(req,res,next)=>{
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
				res.redirect('/login?incorrect=true&action=user')
		}

	});


});


module.exports = router;