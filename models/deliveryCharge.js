module.exports=function deliveryCost(totalCost,category=null){

var charge=0
//for caneFurniture
if(category=='caneFurniture'){
if(totalCost>=5000){
	
	charge=500;
}else if(totalCost>1000){
	
	charge=300;
}else{charge=200;}

}


//for handloom
else if(category=='handloom'){
	if(totalCost<500){charge=50;}
	else if(totalCost<1000){charge=35;}
	else if(totalCost<1500){charge=20;}

}




return charge;};