const pool= require('./pool');
const bcrypt= require('bcryptjs');


function partner(){};



partner.prototype={

//find user data by username.. here mobno or email id
find: function(user=null,callback){

var field='mobNo';

let sql=`SELECT * FROM sellerLogin WHERE ${field}=?`;

pool.query(sql,user,function(err,result){
	if(err) throw err

		if(result.length){callback(result[0]);}
	else{callback(null);}
});


},











resetPassword:function(mobNo,pass,callback){

	console.log('going to reset >>>>>>>>><<<<<<<<<<<the password',mobNo);
	var password=bcrypt.hashSync(pass,10);

let sql=`UPDATE sellerLogin
SET password = ? 
WHERE mobNo = ?`;

var arraydata=[password,mobNo];
pool.query(sql,arraydata,function(err,result){
		
		if(err) console.log(err.message);
		else{
			console.log(result);
		callback(result.affectedRows);}
	});


},









create: function(body,callback){
	var password=body.password;
	body.password=bcrypt.hashSync(password,10);

	//array to contain the value of the field

	var bind=[];
	// to put everything of body in the array
	// for(item in body){
	// 	bind.push(body[item]);
	// }
	bind.push(body['mobNo']);
	bind.push(body['password']);
	bind.push(body['name']);
	bind.push(body['email']);



	//sql query
	let sql=`INSERT INTO sellerLogin(mobNo,password,name,email) VALUES (?,?,?,?)`;
	// call the query
	pool.query(sql,bind,function(err,result){
		if(err) throw err;
		else{
			console.log(result);
		callback(result.affectedRows);}
	});
},




login: function(mobNo,password,callback){

this.find(mobNo,function(user){
	if(user){
		if(bcrypt.compareSync(password,user.password)){
			callback(user);
			return;
		}
	}
	callback(null);
});

},


updateProductList : function(mobNo,productList,callback){

	if(productList.length){

	let sql=`UPDATE sellerLogin SET products =? WHERE mobNo = ?;`;
pool.query(sql,[productList,mobNo],function(err,result){
	if(err) throw err;
		else{
			console.log(result);
		callback(result.affectedRows);}
});
}


else{
	let sql=`UPDATE sellerLogin SET products =NULL WHERE mobNo = ?;`;
pool.query(sql,[mobNo],function(err,result){
	if(err) throw err;
		else{
			console.log(result);
		callback(result.affectedRows);}
});

}


}
// ,









// getOrders:function(products,callback){
// 	var productList=[products]
// 	let sql=`SELECT * FROM orderItems where productId IN (?)`
// 	pool.query(sql,productList,function(err,result){
// 	if(err) throw err
		
// 		if(result.length){callback(result);}
// 	else{callback([]);}
// });
// }















}

module.exports=partner;