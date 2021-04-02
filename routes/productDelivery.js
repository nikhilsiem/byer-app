var  express = require('express');
var router=express.Router();


var Order=require('../core/orders');
const order= new Order();


router.get('/',function(req,res,next){
	console.log('\n>>>>>',req.query.orderID,req.query.count);
	var orderID=req.query.orderID;
	var success=req.query.success;
	var count=parseInt(req.query.count);
	// res.render('productdelivery');
	if(count==undefined){count=10000;}
	if(success==undefined){success='pending';}

	if(req.session.partner && orderID!=undefined && count<5){
		console.log("partner hai be");
		// res.render('aboutUS',{loginLink:'',login:"",registerLink:'partner',register:req.session.partner.name,joinLink:'',join:'',session:'partner'});
		res.render('productdelivery',{loginLink:'',login:"",registerLink:'partner',register:req.session.partner.name,joinLink:'',join:'',session:'partner',orderID:orderID,error:'no',count:count,success:success});
	}else{


	res.render('productdelivery',{loginLink:'login',login:'Login',registerLink:'register',register:'Register',joinLink:'join',join:'Join Us',session:'none',orderID:orderID,error:'yes',count:count,success:success});
	
	}
	// res.render('aboutUS',{user:req.session.user,partner:req.session.partner});
});














router.post('/',function(req,res,next){

var orderID=req.query.orderId;
var count=req.query.count;

console.log('\n>>>>>',orderID,req.body.passcode,typeof(req.body.passcode));
var passcode=req.body.passcode;

order.findByOrderId(orderID,function(orderDATA){
	console.log(orderDATA);

	if(orderDATA!=null){
		var originalPasscode=orderDATA[0].passcode;
		if(originalPasscode==passcode){


			order.updateStatus(orderID,'delivered',function(affectedRow){




				if(affectedRow!=null && affectedRow==1){console.log('\n\n\n',affectedRow,'\n\n\n');res.redirect('/deliver?orderID='+orderID+'&count='+(parseInt(count)+1).toString()+'&success=achieved');}
				else{ res.redirect('/deliver');}
			});

			
		}else{
			console.log('not similar',typeof(originalPasscode));
			res.redirect('/deliver?orderID='+orderID+'&count='+(parseInt(count)+1).toString()+'success=pending');
		}
	}else{
		res.redirect('/deliver');
	}
});


// res.redirect('/deliver')

});












module.exports = router;