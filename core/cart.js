const pool= require('./pool');



function cart(){};



cart.prototype={

//find user data by username.. here mobno or email id
find: function(cart=null,callback){

var field='productId';

let sql=`SELECT * FROM products WHERE ${field}=?`;

pool.query(sql,cart,function(err,result){
	if(err) throw err

		if(result.length){callback(result[0]);}
	else{callback(null);}
});


},


findproductsOfSameUser: function(userId,callback){

let sql=`SELECT * FROM cart WHERE userid=?`;

pool.query(sql,userId,function(err,result){
	if(err) throw err

		if(result.length){callback(result);
		}else{callback(null);}
});

},


clearTheUser:function(userId,callback){
let sql=`DELETE FROM cart WHERE userid=?`;

pool.query(sql,userId,function(err,result){
	// console.log(">>>>"+result+"++++++========   >>>>><<<<<<<<<<<"+result.affectedRows);
	if(err) throw err

		if(result.affectedRows){
			
			// console.log(">>>>"+result+"    >>>>><<<<<<<<<<<");
			callback(result.affectedRows);}
	else{callback(null);}
});
},




create: function(body,callback){
	
// console.log(">>>>>>>>>>>database<<<<<<<<<<<<<<");
	var bind=[];
	bind.push(body['name']);
	bind.push(body['price']);
	bind.push(body['quantity']);
	bind.push(body['imgPath']);
	bind.push(body['userId']);
	bind.push(body['productID']);
console.log(bind);



	//sql query
	let sql=`INSERT INTO cart(name,price,quantity,filePath,userid,productId) VALUES (?,?,?,?,?,?)`;
	// call the query
	pool.query(sql,bind,function(err,result){
		if(err) throw err;
		else{
			// console.log(result);
		callback(result.affectedRows);}
	});
},




login: function(mobNo,password,callback){

this.find(mobNo,function(cart){
	if(cart){
		if(bcrypt.compareSync(password,cart.password)){
			callback(cart);
			return;
		}
	}
	callback(null);
});

},








removeTheProduct:function(productId,userMobNo,callback){
	var sql=`DELETE FROM cart WHERE productId=? AND userid=?;`
	pool.query(sql,[productId,userMobNo],function(err,result){
	if(err) throw err

		if(result.affectedRows){
			
			callback(result.affectedRows);}
	else{callback(null);}
});

}








}

module.exports=cart;