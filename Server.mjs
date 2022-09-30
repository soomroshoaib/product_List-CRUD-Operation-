import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'



const ProductSchema = new mongoose.Schema({
    productName: String,
    productprice: Number,
    currencyCode :String,
    numberofsale: Number,
    rating : Number,
    isFreeShipping : Boolean,
    ShopName: String,

    createOn: { type: Date, default: Date.now },
  });
const ProductModel = mongoose.model('Product', ProductSchema);




const app = express();
app.use(express.json())
app.use(cors())

const PORT = process.env.PORT || 3000;

app.get("/products", async(req, res)=>{
    let result = await ProductModel.find({}).exec()
})

app.post('/product', async(req, res)=>{
    let body = req.body;

    if(
        ! body.productName
        || !body.productprice
        || !body.currencyCode
        || !body.numberofsale
        || !body.rating
        || !body.isFreeShipping
        || !body.ShopName
    ){
        res.status(400).send({
            message: `require field missing, All field are required 
        productName,
        productprice,
        currencyCode,
        numberofsale,
        rating,
        isFreeShipping,
        ShopName
        `
        })
        return;  
    }
    let result = await ProductModel.create({
        productName: body.productName,
        productprice: body.productprice,
        currencyCode: body.currencyCode,
        numberofsale: body.numberofsale,
        rating: body.rating,
        isFreeShipping: body.isFreeShipping,
        ShopName: body.ShopName

    }).catch(e =>{
        console.log("err in your db", e)
        res.status(500).send({message: "error your saveing Product "})

    })
    console.log("result", result);
    res.status().send({message: "product is add in database"})
})


app.listen(PORT,()=>{
    console.log(`your server is working ${PORT}`)
})



let  dburl = "mongodb+srv://down:12345@cluster0.kyfnktu.mongodb.net/ecommerce?retryWrites=true&w=majority"
mongoose.connect(dburl)
//connection 

mongoose.connection.on("connected", function(){
    console.log("mongodb is connected");

});
// 2 dissconnected 
mongoose.connection.on('disconnected', function(){
    console.log("your database is disconnected ");
    process.exit(1)
});

mongoose.connection.on("error", function(err){
    console.log("your data conection error please your connection ", err  );
    process.exit(1)
})
// this function will return just before closeing

process.on('SIGINT', function(){
    console.log("app is terminting ")
    mongoose.connection.close(function(){
        console.log("mongoose defult connection close")
        process.exit(0)
    })
})


