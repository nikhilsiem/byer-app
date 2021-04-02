//about
var  express = require('express');
var router=express.Router();

var User=require('../core/user');
const user= new User();


var Order= require('../core/orders');
const order= new Order();

const StringBuilder = require('node-stringbuilder');







router.get('/',function(req,res,next){


	var curUser=req.session.user;
	console.log(curUser);


var deliveredOrder=[];

	if(curUser==undefined){
		res.redirect('login');
	}

	order.find(curUser.mobNo,function(data){
		console.log(data); 
		if(data==null){
			data=[];
		}else{
//filter the order on differnt category like newly placed delivered etc

for(var index=0;index<data.length;index++){
	var tOrder=data[index];
	if(tOrder.status=='delivered' || tOrder.status=='cancelled'){
		deliveredOrder.push(tOrder);
		//remove the order from the over all order which consider as new order
		data.splice(index, 1);
		index--;
	}
}


		}







		res.render('user',{userName:curUser.name,data:data,loginLink:'',login:'',registerLink:'user',register:req.session.user.name,joinLink:'',join:'',session:'user',

addressName:curUser.addressName,
addressMobNo:curUser.addressMobNo,
addressPincode:curUser.addressPincode,
addressStreetAddress:curUser.addressStreetAddress,
addressLandMark:curUser.addressLandMark,
addressCity:curUser.addressCity,
addressState:curUser.addressState,deliveredOrder:deliveredOrder,curUser:curUser


	});
	});

	
});














router.get('/logout',function(req,res,next){
	req.session.user=undefined;
	req.session.partner=undefined;
	req.session.seller=undefined;

	res.redirect('/home');

	
});








router.post('/editAddress',(req,res,next)=>{
	// res.json(req.body);
	// console.log(req.body.name);
	// console.log(res);

let userInput=[];
userInput.push(req.body.name);
userInput.push(String(req.body.mobNo));
userInput.push(String(req.body.pin));
userInput.push(req.body.streetAddress);
userInput.push(req.body.landmark);
userInput.push(req.body.city);
userInput.push(req.body.state);


user.editAddress(userInput,req.session.user.mobNo,function(affectedRows){
	
		if(affectedRows){


	

// req.session.user
req.session.user['addressName']=req.body.name;
req.session.user['addressMobNo']=req.body.mobNo;
req.session.user['addressPincode']=req.body.pin;
req.session.user['addressStreetAddress']=req.body.streetAddress;
req.session.user['addressLandMark']=req.body.landmark;
req.session.user['addressCity']=req.body.city;
req.session.user['addressState']=req.body.state;
console.log('after edit>>>>>',req.session.user);
res.redirect('/user');
//req.session.user=req.session.user;
}else{res.redirect('/user');}
});



});








router.post('/bulkPurchaser',(req,res,next)=>{
	// res.json(req.body);
	console.log(req.body.name);
	// console.log(res);

	var organizationName=req.body.name;
	var GSTnumber=req.body.GST;
	var businessType=req.body.businessType;
	var bind=[];
	bind.push('update');
	bind.push(organizationName);
	bind.push(GSTnumber);
	bind.push(businessType);
	bind.push(req.session.user.mobNo);


	user.bulkPurchaser(bind,function(result){
		if(result){

			req.session.user.bulkPurchaser='update';
			req.session.user.organization=organizationName;
			req.session.user.GST=GSTnumber;
			req.session.user.businessType=businessType;
			

			res.redirect('/user');}


		else{res.redirect('/user');}

	});






});








router.get('/cancelOrder',function(req,res,next){


var orderId=req.query.orderId;

console.log(orderId);

order.updateStatus(orderId,'cancelled',function(result){
	res.redirect('/user');
});




});





router.get('/renewOrder',function(req,res,next){


var orderId=req.query.orderId;

console.log(orderId);

order.updateStatus(orderId,'placed',function(result){
	res.redirect('/user');
});




});






module.exports = router;