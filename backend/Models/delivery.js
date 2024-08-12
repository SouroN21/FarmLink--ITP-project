const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const deliverySchema=new Schema({
     fname:{
        type:String,
        required:true
     },
     address:{
        type:String,
        required:true
     },

     city:{
        type:String,
        required:true
     },
     postalCode:{
        type:String,
        required:true
     },

    phone:{
        type:String,
        required:true
     }

})

const Delivery = mongoose.model("Delivery",deliverySchema);

module.exports = Delivery;