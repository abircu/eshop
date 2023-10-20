const express=require('express')
const cors=require('cors');
const app=express()
const {connectDB} = require("./config/db");
const { ObjectId } = require('mongodb');

const port=process.env.PORT || 5000;

require('dotenv').config();
const db = connectDB()
// midleware
app.use(cors());
app.use(express.json());

//for getting all brand
app.get('/',async(req,res)=>{
  const allBarnds = (await db).collection('Brands').find();
  const result= await allBarnds.toArray();
  res.send(result)
})
// get single products
app.get('/product/single/:id',async(req,res)=>{
  console.log("backend e request asce")
  const id=req.params.id;
  console.log("id ",id)
  const query={_id: new ObjectId(id)}
  console.log("qouery ",query)
  const result = (await db).collection('products').findOne(query);
  const response = await result;
  console.log("result is ",response)
  res.send(response);
})

//create product 
app.post('/product',async(req,res)=>{
  console.log("reqest body ",req.body);
  const productData = req.body;
  const userCollection= (await db).collection('products');
  const result= userCollection.insertOne(productData)
  res.send(result)
})
//get product with brand name
app.get('/product/:brandname',async(req,res)=>{
  const brandName = req.params.brandname;
  const productCollection= (await db).collection('products');
  const productData = await productCollection.find({brand:brandName});
  const response = await productData.toArray()
  console.log("params ",brandName)
  res.send(response)
})

//for getting all products
app.get('/product',async(req,res)=>{
  const productCollection= (await db).collection('products');
  const productData = await productCollection.find();
  const response = await productData.toArray()
  res.send(response)

})
app.put('/product/update/:id',async(req,res)=>{
  console.log("backend e request asce")
  const id=req.params.id;
  console.log("id ",id)
  const filter={_id: new ObjectId(id)}
  const options={upsert:true};
  const updateProduct=req.body;
  const payload={
    $set:{
      brand:updateProduct.brand,
      image:updateProduct.image,
      name:updateProduct.name, 
      type:updateProduct.type,
      price:updateProduct.price,
      description:updateProduct.description,
      rating:updateProduct.rating
    }
  }
  const result = (await db).collection('products').updateOne(filter,payload,options);
  const productUpdated=await result;
  res.send(productUpdated)
})
//delete single product
app.delete('/product/:id',(req,res)=>{
    
  res.send('coffe making server is running.....');
})

//create order 
app.post('/order',async(req,res)=>{
  console.log("reqest body ",req.body);
  const orderData = req.body;
  const orderCollection= (await db).collection('orders');
  const result= orderCollection.insertOne(orderData)
  res.send(result)
})
app.get('/order',async(req,res)=>{
  const OrdersList = (await db).collection('orders').find();
  const result= await OrdersList.toArray();
  res.send(result)
})
app.delete('/order/:id',async(req,res)=>{
  const orderCollection= (await db).collection('orders');
  const id=req.params.id;
  const query={_id: new ObjectId(id)}
  const result=orderCollection.deleteOne(query)
  res.send(result)
})
app.delete('/user/:id',async(req,res)=>{
  const userCollection= (await db).collection('user');
  const id=req.params.id;
  const query={_id: new ObjectId(id)}
  const result=userCollection.deleteOne(query)
  res.send(result)
})


// for sending data front-end to backend througth the server
app.post('/coffee',async(req,res)=>{
  const user=req.body;
  const collection = (await db).collection('coffee')
  console.log('new user',user);
  // const result=await usersCollection.insertOne(user);
  // res.send(result);
  const result=await collection.insertOne(user);
  res.send(result);
})
// update in database
app.put('/coffee/:id', async(req,res)=>{
  const id=req.params.id;
  const filter={_id: new ObjectId(id)}
  const options={upsert:true};
  const updatedCoffee=req.body;
  const coffee={
    $set:{
      name:updatedCoffee.name,
      suplier:updatedCoffee.suplier,
      taste:updatedCoffee.taste, 
      category:updatedCoffee.category,
      details:updatedCoffee.details,
      photo:updatedCoffee.photo
    }
  }
  const result = (await db).collection('coffee').updateOne(filter,coffee,options);
  const coffeeUpdate=await result;
  res.send(coffeeUpdate)
})
// Delete operation
app.delete('/coffee/:id', async(req, res)=>{
  const id=req.params.id;
  const query={_id:new ObjectId(id)}
  const result=(await db).collection('coffee').deleteOne(query)
  res.send(result)
})

app.listen(port,()=>{
    console.log(`coffe server is running on port: ${port}`)
})

// mongodb password  2cOJHki8proIoYFq