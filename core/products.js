const pool= require('./pool');



function User(){};



User.prototype={

//find user data by username.. here mobno or email id
find: function(ID=null,callback){

var field='productId';

let sql=`SELECT * FROM products WHERE ${field}=?`;

pool.query(sql,ID,function(err,result){
	if(err) throw err

		if(result.length){callback(result[0],ID);}
	else{callback(null,ID);}
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




create: function(body,callback){
	// var password=body.password;
	// body.password=bcrypt.hashSync(password,10);

	//array to contain the value of the field

	var bind=[];
	// to put everything of body in the array
	// for(item in body){
	// 	bind.push(body[item]);
	// }
	bind.push(body['name']);
	bind.push(body['price']);
	bind.push(body['about']);
	bind.push(body['imgPath']);
	bind.push(body['category']);
	bind.push(body['ownerMobNo']);

	if(body['about1']==''){bind.push(null);}else{bind.push(body['about1']);}

	if(body['about2']==''){bind.push(null);}else{bind.push(body['about2']);}

	if(body['about3']==''){bind.push(null);}else{bind.push(body['about3']);}

	if(body['about4']==''){bind.push(null);}else{bind.push(body['about4']);}

	if(body['about5']==''){bind.push(null);}else{bind.push(body['about5']);}

	if(body['support']==''){bind.push(null);}else{bind.push(body['support']);}


	
	





	//sql query
	let sql=`INSERT INTO products(name,price,about,filePath,category,ownerMobNo,about1,about2,about3,about4,about5,support) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`;
	// call the query
	pool.query(sql,bind,function(err,result){
		if(err) throw err;
		else{
			console.log(result);
			var productId=result.insertId;
		callback(result.affectedRows,productId);}
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




removeProduct:function(productId,callback){
	var sql=`DELETE  FROM products WHERE productId=?`
	pool.query(sql,[productId],function(err,result){
		if(err) throw err;
		else{
			// console.log(result);
			// var productId=result.insertId;
		callback(result.affectedRows);}
	});

}



}

module.exports=User;