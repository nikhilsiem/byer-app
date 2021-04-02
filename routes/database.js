var  express = require('express');
var mysql=require('mysql');
var router=express.Router();


const app=express();

//Create Connection

const db=mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'huhaha',
	database:'byer'
});



db.connect((err) => {

	if(err){
		// throw err;
		console.log(err);
	}
	console.log('MYSQL Connected........');
});


//create DB
// router.get('/',(req,res) =>{

// let sql='CREATE DATABASE byer';
// db.query(sql,(err,result)=>{
// 	if(err) throw err;
// 	console.log(result);
// 	res.send('Database created..........');
// });

// });






//create table
// router.get('/',(req,res)=>{

// let sql='CREATE TABLE userLog(mobNo varchar(255) NOT NULL,password varchar(255) NOT NULL,PRIMARY KEY (mobNo))';
// db.query(sql,(err,results)=>{
// 	if(err) console.log(err);
// 	console.log(results);
// 	res.send('Table is created');
// })

// });





//insert values
// router.get('/',(req,res)=>{
// let values={mobNo:'1',password:'1'};
// let sql='INSERT INTO userLog SET ?';
// db.query(sql, values,(err,results)=>{
// 	if(err) console.log(err);
// 	console.log(results);
// 	res.send('value is added to the table');
// })

// });


//collect values
router.get('/',(req,res)=>{
// let values={mobNo:'1',password:'1'};
let sql="SELECT * FROM userLog WHERE mobNo=1";
db.query(sql,(err,results)=>{
	if(err) console.log(err);
	console.log(results);
	res.send('value is fetched..........');
})

});





module.exports = router;