module.exports=function MRP(productCostAfterByerAddition,category=null){

// console.log('>>>>>>>>>>>inside the costing model');
// this.variable='hahaha';
// 	this.price=function(productCost){

var discountOnTheCost=0.2;
if(category=='caneFurniture'){discountOnTheCost=0.2;}

var MRP=Math.ceil((1+discountOnTheCost)*productCostAfterByerAddition);

return MRP;};