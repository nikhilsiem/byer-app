var  express = require('express');
var router=express.Router();
jwt = require("jsonwebtoken");


const KEY='hhheeeeeeeeerrrrrrrrrrr';





router.get('/',function(req,res,next){
	console.log(req.sessionID);
	console.log(req.session.byerDeliver);
	var data=[{'name':'Ujjal Das','age':16,'gender': 'Male'},{'name':'Ujjal Das Das','age':16,'gender': 'Male'},{'name':'Ujjal Das Das Das','age':16,'gender': 'Male'}]

var otp=Math.floor(Math.random() * (2 - 0) + 0);


var token = jwt.sign(data[otp], KEY, {algorithm: 'HS256', expiresIn: 60});

console.log(token);
res.send(token);

// 	if(req.session.byerDeliver!=undefined){
// 		res.json(data);

// 	}
// 	else{

// req.session.byerDeliver='hello';

// res.json({'name':'Ujjal byer Das','age':16,'gender': 'Male'});
// 	}

	});




router.post('/',function(req,res,next){
	console.log('\n\n\n post');
	console.log(req.body.jwt);
	var token=req.body.jwt;


	jwt.verify(token,KEY,  (err, decoded)=>{
		if(decoded!=undefined){
			console.log('\n\n',decoded.name,'\n',decoded);
			res.send('hello');
		}
		else{
			console.log('\n\n\n error hai ');
		}
	});

	// var decoded = jwt.verify(token, KEY);
	
});


router.post('/register', function(req, res, next){
console.log(req.body);

});















module.exports = router;