//about
const pool= require('../core/pool');

var  express = require('express');
var router=express.Router();
const path = require("path");
const fs=require('fs');
const Product=require('../core/products');
const Partner=require('../core/partner');
const StringBuilder = require('node-stringbuilder');


const product= new Product();
const partner= new Partner();


var multer  = require('multer')
var webp=require('webp-converter');



var shgProductCost=require('../models/reverseCostingForSHG');


//TODO: we need the the partner database data


function getOrderExcessInfo(ItemsCommonCode,callback){
	// excess info like address
	// console.log('\n\n',ItemsCommonCode,'\n\n');
	var sql=`SELECT * FROM orders WHERE ItemsCommonCode=?`;
	pool.query(sql,[ItemsCommonCode],function(err,result){
	if(err) throw err

		if(result.length){callback(result);}
	else{callback(result);}
});
}








//making recursion
function getAllOrder(data,i,checked,result,callback){
	console.log('get all order');
	if(i==data.length){
		callback(result);
	}




else if(!(i in checked)){
// count=count+1;
	checked.push(i);
	var t_list={};

	var commonOrder=data[i].commonOrder;
	
	getOrderExcessInfo(commonOrder,function(orderData){

		if(orderData.length){

			
console.log('\norderData\n',orderData,'\n\n');


// orderId: 72,
//     mobNo: '9583222425',
//     address: 'Ujjal Das;9583222425;752050;room no 401,SHR, IIT Bhubaneswar;;Bhubaneswar;Orissa',
//     totalPrice: '25',
//     orderStatus: 'placed',
//     note: 'for now there is no note',


		t_list['address']=orderData[0].address;
		t_list['mobNo']=orderData[0].mobNo;
		t_list['orderStatus']=orderData[0].orderStatus;
		t_list['note']=orderData[0].note;
		t_list['orderId']=orderData[0].orderId;

// console.log('>>>>tlist>>>>>',t_list);
	t_list['items']=[data[i]];
	
for(var j=i+1;j<data.length;j++){
		if(!(j in checked)){
			if(data[j].commonOrder==commonOrder){
				// count=count+1;
				t_list['items'].push(data[j]);
				checked.push(j);
			}
		}
	}


	console.log('>>>>tlist>>>>>',t_list.items);




	result.push(t_list);

	// if(count==data.length)
	// callback(result);
	callback(getAllOrder(data,i+1,checked,result,callback));


		}else{
			callback(getAllOrder(data,i+1,checked,result,callback));
		}
	});

	


}else{

callback(getAllOrder(data,i+1,checked,result,callback));

}



}






function orderCustering(data,callback){
console.log('#####$$$$$$$$$$$$$',data);

var count=0;
	var result=[];
	var checked=[];

if(data.length==0){
	callback(result); 
}


getAllOrder(data,0,checked,result,function(order){
	callback(order);
});



// console.log('\n\nResult:\n',result,'\n\n\n')

// if(count==data.length)
// 	callback(result);
	
}














router.get('/',function(req,res,next){

	

	// console.log(req.app.get('user'));
	req.session.user=undefined;

	var curUser=req.session.partner;

	if(curUser==undefined){
			res.redirect('login');
		}


	console.log("#################",curUser);

	var address={};
	address['name']=curUser.addressName;
	address['mobNo']=curUser.addressMobNo;
	address['pincode']=curUser.addressPincode;
	address['streetAddress']=curUser.addressStreetAddress;
	address['landmark']=curUser.addressLandmark;
	address['city']=curUser.addressCity;
	address['state']=curUser.addressState;



var deliveredOrder=[];

if(curUser.products==null){

res.render('partner',{userName:curUser.name,
						register:'',
						pageTitle:'Byer Partners',

products:[],orders:[],

loginLink:'',login:'',registerLink:'partner',register:curUser.name,joinLink:'',join:'',session:'partner',
userDetails:curUser,deliveredOrder:deliveredOrder,address:address

					});

}









else{

	var productIds=curUser.products.split(',');
	var productDetails=[];






partner.getOrders(productIds,function(allOrder){

// var ordercluster=orderCustering(allOrder);

orderCustering(allOrder,function(ordercluster){

if(ordercluster!=undefined){

console.log('............................................................')
console.log(ordercluster,'oriderids',productIds);
console.log('............................................................')







// only shg product cost is manuculated
//past ordercreated

for(var order=0;order<ordercluster.length;order++){ 

	var t_list=ordercluster[order];
for(var i=0;i<t_list.items.length;i++){

		var quant=t_list.items[i].quantity;
		var indivitualPrice=shgProductCost(t_list.items[i].totalPrice/quant)

		t_list.items[i].totalPrice=Math.floor(indivitualPrice*quant);
	

	}


	//adding to the past order
	if(t_list.orderStatus=='delivered'){
		deliveredOrder.push(t_list);
		//remove the order from the over all order which consider as new order
		ordercluster.splice(order, 1);
		order--;

	}



}









	for(var i=0;i<productIds.length;i++){
		console.log("aallalal");
		product.find(productIds[i],function(newProduct,pID){ 


			// console.log(newProduct);

			console.log('\n',pID,'>>>>>>>>>>>>>>',newProduct);


			var productproductDetails={};
			if(newProduct!=null){
				productproductDetails['name']=newProduct.name;
				productproductDetails['price']=newProduct.price;
				productproductDetails['path']=newProduct.filePath;
				productproductDetails['about']=newProduct.about;
				productproductDetails['category']=newProduct.category;
				productproductDetails['productId']=newProduct.productId;

				productproductDetails['about1']=newProduct.about1;
				productproductDetails['about2']=newProduct.about2;
				productproductDetails['about3']=newProduct.about3;
				productproductDetails['about4']=newProduct.about4;
				productproductDetails['about5']=newProduct.about5;
				productproductDetails['support']=newProduct.support;

			}
			else{
				productproductDetails['name']="ERROR IN RETRIVING";
				productproductDetails['price']="ERROR";
				productproductDetails['path']="ERROR IN RETRIVING";
				productproductDetails['about']="ERROR IN RETRIVING";
				productproductDetails['category']="ERROR IN RETRIVING";
				productproductDetails['productId']=pID;

			}


				// console.log(productproductDetails);

				 productDetails.push(productproductDetails);


		

			
			if(productDetails.length==productIds.length){
				// console.log(productDetails);
				res.render('partner',{userName:curUser.name,
						register:'',
						pageTitle:'Byer Partners',

products:productDetails,orders:ordercluster,

loginLink:'',login:'',registerLink:'partner',register:curUser.name,joinLink:'',join:'',session:'partner',
userDetails:curUser,deliveredOrder:deliveredOrder,address:address

					});
			}

			

		});
		// console.log(productDetails);
		

	}


}


});




});





	}










});

















// const upload = multer({dest: __dirname + '/uploads/images'});
const upload=multer({dest:'public/img/products'});



 
//pass input image(.jpeg,.pnp .....) path ,output image(give path where to save and image file name with .webp extension)
//pass option(read  documentation for options)
 
//cwebp(input,output,option,result_callback)
 




router.post('/newProduct', upload.single('img1'), (req, res) => {

console.log('\n\n',req.body,'\n\n\n');


    if(req.file) {
    	var resData={title:req.file};
    	// res.send(resData);
    	console.log(req.body.title);
    	// req.body[img]=req.file;
        console.log('>>>>>>>>>>>>>>>',req.body);



webp.cwebp(req.file.path,req.file.path,"-q 50",function(status,error)
  {
  	 //if conversion successful status will be '100'
  	//if conversion fails status will be '101'
  	console.log(">>>>\n\n\n",status,error,">>>>\n\n\n");

if(status==100){
	     var databasedata={
     	name:req.body.name,
     	price:req.body.price,
     	about:req.body.about,
     	imgPath:req.file.path,
     	category:req.body.category,
     	ownerMobNo:req.session.partner.mobNo,
     	about1:req.body.about1,
     	about2:req.body.about2,
     	about3:req.body.about3,
     	about4:req.body.about4,
     	about5:req.body.about5,
     	support:req.body.support

     };
     console.log(databasedata);


product.create(databasedata,function(lastId,productId){
// if the creation of the user goes well we should get an integer (id of the inserted user)

console.log("kya hai ye last id>>>");
console.log(lastId,productId);

if(lastId){
	//update the productIds in the user ids


var partnerMobileNo=req.session.partner.mobNo;
var oldProductList=new StringBuilder('');
;
	partner.find(partnerMobileNo,function(user){
		console.log(user);
		console.log("productList>><<<<<<<<<<<<<<>>>>>>>>>>>>>>  "+user.products);
		// if(user.oldProductList!=null){
		// oldProductList=user.products+",";}
		oldProductList.append(user.products);
		if(oldProductList.length()){
			oldProductList.append(',');
		}
		oldProductList.append(productId);
		console.log("productList>><<<<<<<<<<<<<<>>>>>>>>>>>>>>  "+oldProductList.toString());




partner.updateProductList(partnerMobileNo,oldProductList.toString(),function(affectedRows){
		// partner.updateProductList(partnerMobileNo,"27,25,34",function(affectedRows){

		if(affectedRows){
			req.session.partner.products=oldProductList.toString();
			res.redirect('/partner');

		}else{
			res.send("ERROR IN creating the user please try again");
		}

	});

	});

console.log("productList>><<<<<<<<<<<<<<>>>>>>>>>>>>>>  "+oldProductList.toString());

console.log("productList>><<<<<<<<<<<<<<>>>>>>>>>>>>>>  "+oldProductList.toString());



	



	
}else{
	console.log("Error in creating the user");
	res.send("ERROR IN creating the user please try again");
}

});
}
	





//if failed to convert to webp format

	else{
res.render('error-404',{loginLink:'',login:"",registerLink:'partner',register:req.session.partner.name,joinLink:'',join:'',session:'partner'});
}


  });

     





    }else res.send("error aa gaya upload me");
    
});




































router.get('/removeProduct',function(req,res,next){

	//remove product id from the partner
	//remove the product from product along with the file

	var productId=req.query.productId;
	var filepath=req.query.path;

	var products=req.session.partner.products;
	productList=products.split(",");

const index = productList.indexOf(productId);
if (index > -1) {
  productList.splice(index, 1);
}

products=productList.join(',');


var partnerMobileNo=req.session.partner.mobNo;
partner.updateProductList(partnerMobileNo,products,function(affectedRows){
		// partner.updateProductList(partnerMobileNo,"27,25,34",function(affectedRows){

		if(affectedRows){

			req.session.partner.products=undefined;
			if(products.length)
			req.session.partner.products=products;




product.removeProduct(productId,function(data){
	if(data){
		var fs = require('fs');

// var filename = "D:\\temp\\temp.zip";
var tempFile = fs.openSync(filepath, 'r');
// try commenting out the following line to see the different behavior
fs.closeSync(tempFile);

fs.unlinkSync(filepath);


			res.redirect('/partner');
		}else{
			res.redirect('/partner');
		}
});




		



		}else{
			res.send("ERROR IN creating the user please try again");
		}

	});
	
	// console.log(productList);
	// res.send(products);

	




});














router.post('/editProductDetails', upload.single('img1'), (req, res,next) => {

var productId=req.query.productId;
var pName=req.body.name;
var price=parseInt(req.body.price);
var status=req.body.status;
var about=req.body.about;


var bind=[pName,price,about,status];

if(req.body.about1==''){bind.push(null);}else{bind.push(req.body.about1);}

	if(req.body.about2==''){bind.push(null);}else{bind.push(req.body.about2);}

	if(req.body.about3==''){bind.push(null);}else{bind.push(req.body.about3);}

	if(req.body.about4==''){bind.push(null);}else{bind.push(req.body.about4);}

	if(req.body.about5==''){bind.push(null);}else{bind.push(req.body.about5);}

	if(req.body.support==''){bind.push(null);}else{bind.push(req.body.support);}

	bind.push(productId);


console.log("aahi palo aami",productId,pName, about,price,status);
// res.redirect('/partner');
// res.send(productId,pName, about,price,status);



partner.editProductDetails(bind,function(result){
	res.redirect('/partner')
});




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


partner.editAddress(userInput,req.session.partner.mobNo,function(affectedRows){
	
		if(affectedRows){


	

// req.session.user
req.session.partner['addressName']=req.body.name;
req.session.partner['addressMobNo']=req.body.mobNo;
req.session.partner['addressPincode']=req.body.pin;
req.session.partner['addressStreetAddress']=req.body.streetAddress;
req.session.partner['addressLandmark']=req.body.landmark;
req.session.partner['addressCity']=req.body.city;
req.session.partner['addressState']=req.body.state;
console.log('after edit>>>>>',req.session.user);
res.redirect('/partner');
//req.session.user=req.session.user;
}else{res.redirect('/partner');}
});



});



// address['name']=curUser.addressName;
// 	address['mobNo']=curUser.addressMobNo;
// 	address['pincode']=curUser.addressPincode;
// 	address['streetAddress']=curUser.addressStreetAddress;
// 	address['landmark']=curUser.addressLandmark;
// 	address['city']=curUser.addressCity;
// 	address['state']=curUser.addressState;














module.exports = router;