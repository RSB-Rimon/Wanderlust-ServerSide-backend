import express from 'express'
import { MongoClient, ObjectId } from 'mongodb';
import 'dotenv/config'
import cors from 'cors'

const app = express();

const PORT = 5000
// cors add 
app.use(cors())
app.use(express.json())
// connect to mongodb 
const client = new MongoClient(process.env.MONGODB_URL);
export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}
const mongoClient = await connectToMongoDB();
const db = mongoClient.db('wanderlust');
const destinationCollection = db.collection("destination");
const bookingCollection = db.collection('booking')




// post method use to serveer
app.post('/add-destination', async (req,res)=>{
  const data = req.body
  const result = await destinationCollection.insertOne(data)
  console.log(result)
  res.send(result)
})
// backend theke data ane fortend a show koranur api

app.get('/destinations', async (req,res)=>{
  const result = await destinationCollection.find().toArray()
  res.send(result)
});
// detalis er jonno api

app.get('/destinations/:id',async (req,res)=>{
  const {id} = req.params
 const result = await destinationCollection.findOne({_id: new ObjectId(id)})
  res.send(result)
});

// edit/update data's API
app.patch('/destinations/:id',async (req,res)=>{
  const {id}= req.params
  const updatedData = req.body
  const result =  await destinationCollection.updateOne(
    { _id: new ObjectId(id)},
    {$set: updatedData}
)
res.json(result)

})

// delete api

app.delete('/destinations/:id',async (req,res)=>{
  const {id}= req.params
  const result = await destinationCollection.deleteOne({_id: new ObjectId(id)});
  res.json(result)
})

// booking er joono post api make kora holo akhane 

app.post('/booking', async(req,res)=>{
    const data = req.body
  const result = await bookingCollection.insertOne(data)
  console.log(result)
  res.send(result)
})  

// my-bookings page er jonno api ready korar code 
// this url http://localhost:5000/my-bookings/
app.get('/my-bookings/:email', async (req,res)=>{
  const {email}= req.params;
  const result = await bookingCollection.find({email:email}).toArray();
  res.send(result)
})

// cancel er jonno API ready korar code 
// http://localhost:5000/my-bookings/
app.delete('/my-bookings/:id', async (req, res)=>{
  const {id } = req.params;
  const result = await bookingCollection.deleteOne({_id:new ObjectId(id)});
  res.send(result)
})



//  http://localhost:5000/booking
app.get('/',(req,res)=>[
   res.send('hello world I comming soon')
])
app.listen(PORT,()=>{
    console.log(`Server is running at ${PORT}`)
})