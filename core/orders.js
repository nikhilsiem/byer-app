const pool= require('./pool');
const Cart=require('../core/cart');
const cart= new Cart();
var randomstring = require("randomstring");

const StringBuilder = require('node-stringbuilder');



function order(){};



function createItems(bind,callback){

	let sql=`INSERT INTO orderItems(name,quantity,totalPrice,filePath,productId,commonOrder) VALUES (?,?,?,?,?,?)`;
pool.query(sql,bind,function(err,result){
		if(err) throw err;
		else{
			// console.log(result);
			var productId=result.insertId;
		callback(productId);}
	});


}



function findOrderItems(itemId=null,callback){
	var field='id';
	let sql=`SELECT * FROM orderItems WHERE ${field}=?`;
	pool.query(sql,itemId,function(err,result){
		if(err) throw err

			if(result.length){
				// console.log(result);
				callback(result);
			}else{callback(null);}
	});
}






function findOneOrder(results,data,requiredLength,curIndex,callback){

var i=curIndex;

				data[i]={};
				data[i].totalPrice=results[i].totalPrice;
				data[i].status=results[i].orderStatus;
				data[i].note=results[i].note;
				data[i].address=results[i].address;
				data[i].orderId=results[i].orderId;
				data[i].items=[];
				data[i].passcode=results[i].passcode;

				var items=results[i].itemsId.split(",");

				for(var j=0;j<items.length;j++){
					var itemId=parseInt(items[j]);
					findOrderItems(itemId,function(itemdata){
						var newItem={
							name:itemdata[0].name,
							quantity:itemdata[0].quantity,
							totalPrice:itemdata[0].totalPrice,
							filePath:itemdata[0].filePath,
							productId:itemdata[0].productId

						};
						
						data[i].items.push(newItem);
						
						if(data[i].items.length==items.length){
							// data.push(result);
							console.log(i);
							// console.log(data[i].items);

							if(data.length==requiredLength){
								// console.log("hahahah");
								// console.log(data);
							callback(data);
							}else{
								findOneOrder(results,data,requiredLength,curIndex+1,callback);
							}

						}

						

					});
				}




}









order.prototype={





updateStatus: function(orderId,status,callback){

	var sql=`UPDATE orders SET orderStatus = ? WHERE orderId=?`;

	pool.query(sql,[status,orderId],function(err,results){
	if(err) throw err


if(results){callback(results.affectedRows);}
	else{callback(null);}



});

},





findByOrderId: function(orderId,callback){

let sql=`SELECT * FROM orders WHERE orderId=?`;

pool.query(sql,orderId,function(err,results){
	if(err) throw err


if(results.length){callback(results);}
	else{callback(null);}



});


},














find: function(userId=null,callback){
var field='mobNo';
// console.log(userId);
let sql=`SELECT * FROM orders WHERE ${field}=?`;

pool.query(sql,userId,function(err,results){
	if(err) throw err



		if(results.length){

			var data=[];
			var requiredLength=results.length;
			var curIndex=0
			

			findOneOrder(results,data,requiredLength,curIndex,function(result){
				if(result.length==requiredLength){
					callback(result);
				}else{
					callback(null);
				}
			});




		}else{callback(null);}


});

},


























findproductsOfSameCategory: function(category,callback){

let sql=`SELECT * FROM products WHERE category=?`;

pool.query(sql,category,function(err,result){
	if(err) throw err

		if(result.length){callback(result);}
	else{callback(null);}
});

},












findMaxId:function(callback){
	let sql=`SELECT MAX(orderId) FROM orders`;
	var tableName=['orders'];
	pool.query(sql,function(err,result){
		if(err) throw err
		if(result.length){callback(result[0]['MAX(orderId)']);}
	else{callback(null);}

	});

},









create: function(body,callback){
	
// console.log(">>>>>>>>>yaha pe toh aya"+body['address']);
	var bind=[];
	bind.push(body['mobNo']);
	bind.push(body['address']);
	bind.push(body['totalPrice']);
	bind.push("placed");
	bind.push("for now there is no note");//note
	bind.push(body['passcode'].toString())

	

	var cartItems=body.items;

  var keys=Object.keys(cartItems);
  var totalitems=keys.length;



var orderItems=[];



this.findMaxId(function(maxID){

	
	const commonOrderId=randomstring.generate()+maxID+randomstring.generate();

	

	for(var i=0;i<totalitems;i++){


	var name=cartItems[keys[i]].item.name;
    var price=cartItems[keys[i]].price;
    var perHeadPrice=cartItems[keys[i]].item.price;
    var quantity=cartItems[keys[i]].qty;
    var imgpath=cartItems[keys[i]].item.filePath;

    var getProductID=keys[i];

		var data=[name,quantity,price,imgpath,getProductID,commonOrderId];


		createItems(data,function(itemId){
			if(itemId){
				// console.log(itemId);

				orderItems.push(itemId.toString());
				// console.log(orderItems);
				


if(orderItems.length==totalitems){
	
	bind.push(orderItems.toString());
	// console.log(orderItems.toString()+">>>>>>><<<<<<<<<<<<<<"+bind);
	//sql query
	bind.push(commonOrderId);
	let sql=`INSERT INTO orders(mobNo,address,totalPrice,orderStatus,note,passcode,itemsId,ItemsCommonCode) VALUES (?,?,?,?,?,?,?,?)`;
	// call the query
	pool.query(sql,bind,function(err,result){
		if(err) throw err;
		else{
			// console.log(result);
			var productId=result.insertId;
			
			cart.clearTheUser(body['mobNo'],function(rows){
				if(rows){
					// console.log("hahahah");
					callback(rows);
				}else{
					callback(null);
				}
			});
			callback(result.affectedRows);
		}
	});
}



			}
		});



}});





}





















}

module.exports=order;