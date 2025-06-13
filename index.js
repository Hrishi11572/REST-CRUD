const express = require("express");
// const users = require("./MOCK_DATA.json"); // an array of objects
const fs = require("fs");
const mongoose = require("mongoose"); 
const PORT = 8080;

const app = express();

// connect with mongo
mongoose.connect("mongodb://127.0.0.1:27017/practice-app1")
.then (()=> console.log("MongoDB Connected!"))
.catch((err) => console.log("Mongo err" , err)); 

// schema 
const userSchema = new mongoose.Schema({
  first_name : {
     type : String, 
     required : true
  },
  last_name : {
    type : String, 
    required : false
  },
  email : {
    type : String, 
    required : true, 
    unique : true
  },
  job_title : {
    type : String , 
  },
  gender : {
    type : String
  } 
 },
  {timestamps : true}
); 

// build model 
const User = mongoose.model('user' , userSchema); 


app.use(express.urlencoded({ extended: true })); // middleware for post requests

app.get("/users", async (req, res) => {
  const allUsers = await User.find({}); 
  
  const html = `<ul>
    ${allUsers.map((user)=> `<li>${user.first_name} - ${user.email}</li>`).join("")}
  </ul>`

  return res.send(html); 
});

app.get("/users/:id", async (req, res) => {
  const id = req.params.id;
  const findUser = await User.findById(id);
  if (findUser) {
    return res.status(201).json(findUser);
  } else {
    return res.status(404).json({ msg: "User Not Found!" });
  }
});

app.post("/users", async (req, res) => {
  // to do something
  const body = req.body;

  if(
    !body || !body.first_name || !body.last_name || !body.email
    || !body.gender || !body.job_title
  ){
    return res.status(400).json({ msg : "All fields are required ... "}); 
  }

  const result = await User.create({
    first_name : body.first_name,
    last_name : body.last_name , 
    email : body.email, 
    gender : body.gender, 
    job_title : body.job_title
  }); 

  console.log("Result!"); 
  return res.status(201).json({msg : "Success!"}); 
});

app.put("/users/:id", async (req, res) => {
  await User.findByIdAndUpdate(req.params.id , { last_name : "Changed!"} );
  return res.json({ status : "Success"});
});

app.delete("/users/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id); 
  return res.json({status : "Success"}); 
});

app.listen(PORT, () => {
  console.log("Server Started!");
});

