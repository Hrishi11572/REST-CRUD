const express = require("express");
const users = require("./MOCK_DATA.json"); // an array of objects
const fs = require("fs");
const PORT = 8080;

const app = express();

app.use(express.urlencoded({ extended: true })); // middleware for post requests

app.get("/users", (req, res) => {
  return res.json(users);
});

app.get("/users/:id", (req, res) => {
  const id = req.params.id;
  const findUser = users.find((user) => user.id == Number(id));
  if (findUser) {
    return res.json(findUser);
  } else {
    return res.json({ msg: "User Not Found!" });
  }
});

app.post("/users", (req, res) => {
  // to do something
  const body = req.body;
  const id = users[users.length - 1].id + 1;

  users.push({ id, ...body });

  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
    if (err) {
      console.log("failed to add user!");
      return;
    } else {
      return res.json({ msg: "Added user succesfully!" });
    }
  });
});

app.put("/users/:id", (req, res) => {
  const id = req.params.id;
  const user = users.find((user) => user.id === parseInt(id));

  if (!user) {
    return res.status("404").json({ msg: "user not found!" });
  }

  // update the user
  Object.keys(req.body).forEach((key) => {
    if (user.hasOwnProperty(key)) {
      user[key] = req.body[key];
    }
  });

  // save the user in the file ...
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
    if (err) {
      console.log(err);
      return res.json({ msg: "Error Occured in updating user" });
    } else {
      return res.json({ msg: "User updated succesfully!", user });
    }
  });
});

app.delete("/users/:id", (req, res) => {
  const id = req.params.id;
  const index = users.findIndex((user) => user.id === parseInt(id));

  if (index === -1) {
    return res.status("404").json({ msg: "user not found!" });
  }

  const deletedUser = users.splice(index, 1)[0]; // splice returns an array

  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
    if (err) {
      console.log(err);
      return res.json({ msg: "Error Occured in updating user" });
    } else {
      return res.json({ msg: "User deleted succesfully!"});
    }
  });
});

app.listen(PORT, () => {
  console.log("Server Started!");
});

// Comments :

/*
GET /users --> get all users 
GET /users/id --> get the user with id = id 

POST /users --> create a new user 
PATCH /users/id --> edit the user with id = id 

DELETE /users/id --> delete the users with id = id
*/

/*
app.put("/users/:id" , (req ,res)=>{
    const id = req.params.id; 
    const first_name = req.body.first_name; 
    const last_name = req.body.last_name ; 
    const email = req.body.email; 
    const job_title = req.body.job_title; 


    const user = users.find((user)=> user.id === Number(id)); 
    user.first_name = first_name; 
    user.last_name = last_name; 
    user.email = email; 
    user.job_title = job_title; 

    fs.writeFile("./MOCK_DATA.json" , JSON.stringify(users, null, 2) , (err)=>{
        if(err){
            console.log("Failed to update the user!"); 
            return ; 
        }else{
            return res.json({msg : "Update Successful!"});
        }
    })
}); 
*/
