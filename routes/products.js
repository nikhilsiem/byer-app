var  express = require('express');
var router=express.Router();

const Product= require('../core/products');
const product = new Product();

const Cart=require('../models/cart');


const cartDB= require('../core/cart');
const cartdb=new cartDB();


const byerCost=require('../models/costingModel');
const MRP=require('../models/mrpSetter');
// const byerCost= new Cost();


const Partner = require('../core/partner');
const partner = new Partner();





function addOwnerDetails(curIndex,productData,callback){

if(curIndex==productData.length){
	callback(productData);
	// return productData
}

else{

	var ownerMob=productData[curIndex].ownerMobNo;
	console.log(ownerMob);
	if(ownerMob==null){
		productData[curIndex]['SHGName']='unknown';
		addOwnerDetails(curIndex+1,productData,callback);
	}else{
		

partner.find(ownerMob ,function(data){
	if(data!=null){
		// console.log(data);
		productData[curIndex]['SHGName']=data.name;

		addOwnerDetails(curIndex+1,productData,callback);
	}
});

	}
	

}



}









router.get('/',function(req,res,next){

	var category=req.query.category;
	if(category==undefined){
		category='caneFurniture';
	}

console.log(category);

	product.findproductsOfSameCategory(category,function(result){

if(result==null){
	result={};
}else{

//add our byer plateform cost over the pateform cost
//adding MRP of the PRODUCT if null

for(var i=0;i<result.length;i++){
	result[i].price=byerCost(result[i].price,result[i].category);
	if(result[i].MRP==null){
		result[i].MRP=MRP(result[i].price,result[i].category);
	}
}

}



// if(result.length){result=addOwnerDetails(0,result);}



addOwnerDetails(0,result,function(productData){
console.log('\n products:',productData,'\n products:');

if(req.session.partner){
		console.log("partner hai be");
		res.render('shgProducts',{loginLink:'',login:"",registerLink:'partner',register:req.session.partner.name,joinLink:'',join:'',products:productData,title:'Products',session:'partner'});
	}else if(req.session.user){
		console.log("user hai be");
		res.render('shgProducts',{loginLink:'',login:'',registerLink:'user',register:req.session.user.name,joinLink:'',join:'',products:productData,title:'Products',session:'user'});
	}

else{

	res.render('shgProducts',{loginLink:'login',login:'Login',registerLink:'register',register:'Register',joinLink:'join',join:'Join Us',products:productData,title:'Products',session:'none'});



}


});

		//console.log(result);
		// res.render('shgProducts',{products:result,title:'Products'});
	});



	
});










router.get('/view',function(req, res, next){

var productid=req.query.productID;

product.find(productid,function(productDetails){

	console.log('\n\n\n\n',productDetails.filePath,'\n\n\n\n');
	res.render('productView',{loginLink:'/login',login:'Login',registerLink:'/register',register:'Register',joinLink:'/join',join:'Join Us',session:'none','productDetails':productDetails});
	// res.send(productDetails);
})


});










router.get('/cart',function(req,res,next){
	var productId=req.query.id;
	var productPrice=req.query.price;
	var productName=req.query.name;
	var filePath=req.query.filePath;

	var product={productId:productId,price:parseInt(productPrice),name:productName,filePath:filePath};
	
	var cart= new Cart(req.session.cart?req.session.cart:{});
	console.log(cart);
	cart.add(product,productId);
	req.session.cart=cart;
	console.log(">>>>>>>>>>>>>>>>PRODUCT ID WE GET<<<<<<<<<<    "+cart);

if(req.session.user){
var data={name:productName,
	price:productPrice,
	quantity:1,
	imgPath:filePath,
	userId:req.session.user.mobNo,
	productID:productId
};

	cartdb.create(data,function(affectedRows){
		console.log("affected rows><<<"+affectedRows);
		if(affectedRows==1){
			console.log("here I am");
			res.clearCookie('products');
			// res.send(200);
			//have to change
			res.redirect('/cart');
		}else{
		res.redirect('/products');}
	});
	

}else{
	res.redirect('/login');
}

	

	

// 

	



	
});



module.exports = router;