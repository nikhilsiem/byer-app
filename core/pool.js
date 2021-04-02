const util= require('util');
const mysql=require('mysql');


// const pool=mysql.createPool({


const pool=mysql.createConnection({

	host:'localhost',
	user:'root',
	port     : '3306',
	password:'Root@123',
	database:'byer'

	//aws data base dont have password all default

// host:'byer.cgqk2e22g8x6.ap-south-1.rds.amazonaws.com',
// user:'root',
// password:'byerDBpassword',
// database:'byer'


});



pool.connect(function(err) {
    // if (err) throw err;
    if(err){console.log(err.message);}
    console.log("Connected!");
    // pool.end();
});
















// pool.getConnection((err,connection)=>{
// 	if(err){console.error("Something Went Wrong connection to the database");}


//   let cart = `create table if not exists cart(
//   id int(11) NOT NULL AUTO_INCREMENT,
//   userid varchar(255) NOT NULL,
//   productId varchar(255) NOT NULL,
//   quantity int(11) NOT NULL,
//   filePath varchar(255) NOT NULL,
//   price int(11) NOT NULL,
//   name varchar(255) NOT NULL,
//   PRIMARY KEY (id)
// ) `;
 
//   connection.query(cart, function(err, results, fields) {
//     if (err) {
//       console.log(err.message);
//     }
//   });



//     let user = `create table if not exists userLog (
//   mobNo varchar(255) NOT NULL,
//   password varchar(255) NOT NULL,
//   name varchar(250) DEFAULT NULL,
//   addressName varchar(255) DEFAULT NULL,
//   addressMobNo varchar(45) DEFAULT NULL,
//   addressPincode varchar(45) DEFAULT NULL,
//   addressStreetAddress varchar(255) DEFAULT NULL,
//   addressLandMark varchar(255) DEFAULT NULL,
//   addressCity varchar(255) DEFAULT NULL,
//   addressState varchar(255) DEFAULT NULL,
//   PRIMARY KEY (mobNo)
// ) `
//  ;
 
//   connection.query(user, function(err, results, fields) {
//     if (err) {
//       console.log(err.message);
//     }
//   });





//     let partner = `create table if not exists partnersLogin (
//   mobNo varchar(255) NOT NULL,
//   email varchar(255) DEFAULT NULL,
//   password varchar(255) NOT NULL,
//   name varchar(255) DEFAULT NULL,
//   products varchar(255) DEFAULT NULL,
//   PRIMARY KEY (mobNo),
//   UNIQUE KEY mobNo (mobNo),
//   UNIQUE KEY mobNo_UNIQUE (mobNo)
// )`
// ;
 
//   connection.query(partner, function(err, results, fields) {
//     if (err) {
//       console.log(err.message);
//     }
//   });



//     let product = `create table if not exists  products (
//   productId int(11) NOT NULL AUTO_INCREMENT,
//   name varchar(255) NOT NULL,
//   price int(11) NOT NULL,
//   about varchar(255) NOT NULL,
//   filePath varchar(255) NOT NULL,
//   category int(11) NOT NULL,
//   PRIMARY KEY (productId)
// )`;

 
//   connection.query(product, function(err, results, fields) {
//     if (err) {
//       console.log(err.message);
//     }
//   });





//     let order = `create table if not exists  orders (
//   orderId int(11) NOT NULL AUTO_INCREMENT,
//   mobNo varchar(255) NOT NULL,
//   address varchar(255) NOT NULL,
//   totalPrice varchar(255) NOT NULL,
//   orderStatus varchar(255) NOT NULL,
//   note varchar(255) NOT NULL,
//   itemsId varchar(255) NOT NULL,
//   PRIMARY KEY (orderId)
// )
// `;

 
//   connection.query(order, function(err, results, fields) {
//     if (err) {
//       console.log(err.message);
//     }
//   });





//       let orderItem = `create table if not exists orderItems (
//   id int(11) NOT NULL AUTO_INCREMENT,
//   name varchar(255) NOT NULL,
//   quantity varchar(255) NOT NULL,
//   totalPrice varchar(255) NOT NULL,
//   filePath varchar(255) NOT NULL,
//   productId varchar(255) NOT NULL,
//   PRIMARY KEY (id)
// )
// `;

 
//   connection.query(orderItem, function(err, results, fields) {
//     if (err) {
//       console.log(err.message);
//     }
//   });











// 	if(connection){connection.release();}
// 	return;
// });

// try{
// pool.query=util.promisify(pool.query);}catch(err){next(err);}
pool.query=util.promisify(pool.query);

module.exports=pool;