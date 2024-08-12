//delBuddyModel
const mongoose=require('mongoose');

const Schema = mongoose.Schema;

const delBuddySchema = new Schema({
     fname:{
        type:String,
        required:true
     },
     experience:{
        type:String,
        required:true
     },

     availability:{
        type:String,
        required:true
     },

     location:{
        type:String,
        required:true
     },

     email:{
        type:String,
        required:true
     },

    phone:{
        type:String,
        required:true
     },

     picture: { 
        type: Object, 
        required: true },

})

const DelBuddy = mongoose.model("DelBuddy", delBuddySchema);

module.exports = DelBuddy;