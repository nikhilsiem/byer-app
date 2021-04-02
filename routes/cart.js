var  express = require('express');
var router=express.Router();

const Order =require('../core/orders');
const order= new Order();



const cartDB= require('../core/cart');
const cartdb=new cartDB();




router.get('/',function(req,res,next){
	// console.log(req.app.get('user'));
	// res.render('aboutUS');


var cart=req.session.cart;
var carDetails={};

if(cart){
	// console.log(cart);
	// console.log("++++++++++++"+cart.items+Object.keys(cart.items));
	var carItems=cart.items;
	


// console.log("++++++++++++"+cart.items+Object.keys(cart.items));

var keys=Object.keys(carItems);
	for (var k=0;k<keys.length;k++){
		console.log(carItems[keys[k]]);
		// console.log(carItems[keys[k]].item);
	}

}






	if(req.session.partner){
		console.log("partner hai be");
		res.render('cart',{loginLink:'',login:"",registerLink:'partner',register:req.session.partner.name,joinLink:'',join:'',cart:req.session.cart,session:'partner'});
	}
	else if(req.session.user){
		console.log("user hai be");
		res.render('cart',{loginLink:'',login:'',registerLink:'user',register:req.session.user.name,joinLink:'',join:'',cart:req.session.cart,session:'user'});
	}else{

console.log("sending>>>>"+req.session.cart);
	res.render('cart',{loginLink:'login',login:'Login',registerLink:'register',register:'Register',joinLink:'join',join:'Join  Us',cart:cart,session:'none'});}
});













router.get('/order',function(req,res,next){
	
	// res.render('aboutUS');

	// console.log(req.session.cart);



	if(!req.session.user){
		res.send("please logiin then try");
	}else{
		if(req.session.cart){
			var cart=req.session.cart;


var curUser=req.session.user;

			cart.address=curUser.addressName+";"+curUser.addressMobNo+";"+curUser.addressPincode+";"+curUser.addressStreetAddress+";"+curUser.addressLandMark+";"+curUser.addressCity+";"+curUser.addressState ;
			cart.mobNo=req.session.user.mobNo;
			cart.passcode=Math.floor(Math.random() * (999999 - 100000) + 100000);

			// console.log(cart);
			// console.log(req.session.cart);
			order.create(req.session.cart,function(affectedRows){
				console.log("eman ahi palo"+affectedRows);
				if(affectedRows!=null){
					// req.session.cart=undefined;
					req.session.cart=undefined;
			// res.redirect("/products");
			return;

				}
				else{
					res.send("something went wrong");
				}
			});
			helpeTocleantheCart(req);
						res.redirect("/user");//due to the loop inside it wont work

			// res.render("cart",{loginLink:'login',login:'Login',registerLink:'register',register:'Register',joinLink:'join',join:'Join',cart:req.session.cart});

		}
// res.redirect("/");
	}

	
});

function helpeTocleantheCart(req){
	req.session.cart=undefined;
}







router.get('/remove',function(req,res,next){
	var productId=req.query.id;
	if(productId!=undefined && req.session.user!=undefined && req.session.cart!=undefined){

var userMob=req.session.user.mobNo;


cartdb.removeTheProduct(productId,userMob,function(result){

	if(result==null){
		res.redirect('/cart');
	}
	// if(result.length){
		else{
		//remove the product from local cart

		var removalQuant=req.session.cart.items[productId].qty;
		var removalPrice=req.session.cart.items[productId].price;
		if(removalQuant!=undefined){
			req.session.cart.totalPrice=req.session.cart.totalPrice-removalPrice;
			req.session.cart.totalQantity=req.session.cart.totalPrice-removalQuant;
		}
		
		delete req.session.cart.items[productId];
		
		res.redirect('/cart');

	}


});


	}else{
		res.redirect('/login');
	}



});












module.exports = router;