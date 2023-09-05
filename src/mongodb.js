const mongoose = require("mongoose")
// mongoose.connect("mongodb://localhost:27017/LoginSignUpTutorial") why not connects
mongoose.connect("mongodb://127.0.0.1:27017/LoginSignUpTutorial")
.then(()=>{
    console.log("Mongodb connected")
}).catch((err)=>{
    console.log("Failed to connect",err)
})

const LoginSchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    email : {
        type : String,   
    },
    address : {
        type : String,   
    },
    phoneNumber : {
        type : Number,   
    },
    altNumber : {
        type : Number,   
    }
})
const ProductSchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    short_description : {
        type : String,
        required : true
    },
    
    long_description : {
        type : String,
        required : true
    },

    price : {
        type : String,   
    },
    // image : {
    //     type : Buffer,   
    // }
    available : {
        type : Number
    }

})
const CartSchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    price : {
        type : String,   
    },
    // image : {
    //     type : Buffer,   
    // }
    quantity : {
        type : Number,
    },
    amount : {
        type : Number
    }
})


const collection = new mongoose.model("LoginSignUpTutorial",LoginSchema)
// const collection = new mongoose.model("LoginSignUpTuto",LoginSchema)
const productCollection = new mongoose.model("Product",ProductSchema)
const CartCollection = new mongoose.model("Cart",CartSchema)

module.exports={collection,productCollection,CartCollection}