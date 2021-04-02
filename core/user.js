const pool= require('./pool');
const bcrypt= require('bcryptjs');


function User(){};











User.prototype={

//find user data by username.. here mobno or email id
find: function(user=null,callback){

var field='mobNo';

let sql=`SELECT * FROM userLog WHERE ${field}=?`;

pool.query(sql,user,function(err,result){
	console.log("---------------result ",result);
	
	if(err) {
		console.log("---------------error ",err);
	}

		if(result && result!="" && result!=null && result!=undefined){console.log(">>>>>>><<"+result[0].password);callback(result[0]);}
	else{callback(null);}
});


},




resetPassword:function(mobNo,pass,callback){

	console.log('going to reset the password',mobNo);
	var password=bcrypt.hashSync(pass,10);

let sql=`UPDATE userLog
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



	//sql query
	let sql=`INSERT INTO userLog(mobNo,password,name) VALUES (?,?,?)`;
	// call the query
	pool.query(sql,bind,function(err,result){
		
		if(err) console.log(err.message);
		else{
			
		callback(result.affectedRows);}
	});
},




login: function(mobNo,password,callback){

this.find(mobNo,function(user){
	if(user){
		console.log("hahahhahahhahaala");
		if(bcrypt.compareSync(password,user.password)){
			console.log("eeeeeeeeeeeee"+user.password);
			callback(user);
			return;
		}
	}
	callback(null);
});

},






editAddress: async function(arraydata,userMobNo,callback){



let sql=`UPDATE userLog
SET addressName = ?, addressMobNo= ?, addressPincode= ?, addressStreetAddress= ?, addressLandMark= ?, addressCity= ?, addressState= ?
WHERE mobNo = ?`;


arraydata.push(userMobNo);
pool.query(sql,arraydata,function(err,result){
		
		if(err) console.log(err.message);
		else{
			
		callback(result.affectedRows);}
	});


},








bulkPurchaser:function(bind,callback){

	
	
	
	

let sql=`UPDATE userLog
SET bulkPurchaser = ? , organization=?,GST=?,businessType=?
WHERE mobNo = ?`;


pool.query(sql,bind,function(err,result){
		
		if(err) console.log(err.message);
		else{
			console.log(result);
		callback(result.affectedRows);}
	});


},








}

module.exports=User;