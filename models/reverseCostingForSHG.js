module.exports=function totalCost(productCost){

// console.log('>>>>>>>>>>>inside the costing model');
// this.variable='hahaha';
// 	this.price=function(productCost){

var qualityManagementCost=0.05;
var plateformCost=0.05;
var marketingCost=0.05;
var logisticCost=0.15;
var paymentGateway=0.01;
var retailerDistribution=0.15


var byerCost=qualityManagementCost+plateformCost+marketingCost+logisticCost+paymentGateway+retailerDistribution;

var totalCost=Math.floor(productCost/(1+byerCost));

return totalCost;};