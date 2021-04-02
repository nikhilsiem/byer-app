const addDeliveryCharge=require('./deliveryCharge');


module.exports=function totalCost(productCost,category=null){

// console.log('>>>>>>>>>>>inside the costing model');
// this.variable='hahaha';
// 	this.price=function(productCost){

	console.log("\n\n\n\n",category);

var qualityManagementCost=0.05;
var plateformCost=0.05;
var marketingCost=0.05;
var logisticCost=0.15;
var paymentGateway=0.01;
var retailerDistribution=0.15


var byerCost=qualityManagementCost+plateformCost+marketingCost+logisticCost+paymentGateway+retailerDistribution;

if(category=='caneFurniture'){byerCost=0.1;}
else if(category=='handloom'){byerCost=0.2;}

var totalCost=Math.floor((1+byerCost)*productCost);

totalCost+=addDeliveryCharge(totalCost,category);

// if(category=='caneFurniture'){
// if(totalCost>=5000){
// 	totalCost+=500;
// }else if(totalCost>1000){
// 	totalCost+=300;
// }else{totalCost+=200;}

// }


// //for handloom
// else if(category=='handloom'){
// 	if(totalCost<500){totalCost+=50;}
// 	else if(totalCost<1000){totalCost+=35;}
// 	else if(totalCost<1500){totalCost+=20;}

// }




return totalCost;};

// };