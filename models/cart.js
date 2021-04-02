module.exports=function cart(oldCart){

this.items=oldCart.items||{};
this.totalQantity=oldCart.totalQantity||0;
this.totalPrice=oldCart.totalPrice||0;

this.add= function(item,id){
	var storedItem=this.items[id];
	if(!storedItem){
		storedItem=this.items[id]={item:item,qty:0,price:0};
	}
	storedItem.qty++;
	storedItem.price=storedItem.price+item.price;
	this.totalQantity++;
	this.totalPrice+=item.price;

};



};