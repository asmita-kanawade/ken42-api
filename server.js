const express = require('express');
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const mongoose = require("mongoose");
const applicationsModel = require("./model/applicationsModel");
const usersModel = require("./model/usersModel");

const dotenv = require("dotenv");

dotenv.config();
mongoose.set("useFindAndModify", false);

// -- create server --
const app = express();

// -- use body parser middleware to parse the req body --
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// enable cors 
app.use(cors());

/*Render HTML */
app.get('/', function (req, res) {
  fs.readFile("view/index.html", function (err, data) {
    //res.send(data.toString())
    res.send("Hello world..!");
  })
});



/** --- Login And Registration API --- */
app.post('/register-login', async (req, res) => {
  let user = req.body;
  //console.log(`Req. user: ${JSON.stringify(user)}`);

  try {
    //check if user is already registered
    let users = await usersModel.find({ phoneNumber: user.phoneNumber });

    // if user is not already registered, store as new user
    if (users.length == 0) {            
      const userSchema = new usersModel(user);

      // register the user
      let savedUser = await userSchema.save();
      
      res.send({
        status: `success`,
        message: `Sucessfully Logged In.`,
        user: savedUser
      });

    }
    else {      
      let savedUser = await usersModel.findOneAndUpdate(
        {phoneNumber: user.phoneNumber},
        user, 
        {new: true}
      );

      res.send({
        status: `success`,
        message: `Sucessfully Logged In.`,
        user: savedUser
      });

    }

  } catch (err) {
    //res.redirect("/");
    console.log(`Error occurred while signing up. Error: ${err}`);
    res.send(`Error occurred while signing up. Error: ${err}`);
  }

});


//--------API for get all applications---------------------------
app.post('/get-applications', async (req, res) => {

  try {
    let conditions = req.body;
    console.log(`conditions: ${JSON.stringify(conditions)}`);
    
    let applications = await applicationsModel.find(conditions, null, { sort: { name: 1 } });

    res.send(applications);

  } catch (error) {

    console.log(`Error while searching for applications: ${error}`);
    res.send(error);

  }

});


//--------API to get an application ----------------
app.post('/get-application', async (req, res) => {
  try {
    let conditions = req.body;
    //console.log(`conditions: ${JSON.stringify(conditions)}`);
    
    let application = await applicationsModel.find(conditions, null);

    res.send(application);
  } catch (error) {
    console.log(`Error while searching for application: ${error}`);
    res.send(error);
  }

});


// ------API for Saving Application-------------------------
app.post('/save-application', async (req, res) => {

  const application = req.body;
  //console.log(JSON.stringify(application));
  
  try {
    let conditions = {_id: application._id};    
    let existingApplication = await applicationsModel.find(conditions, null);
    let savedApplication;

    if(application.is_draft) 
      application.access_code = '000'
    else 
      application.access_code = Math.floor(Math.random() * 1000);

    if(existingApplication.length !== 0) {
      savedApplication = await applicationsModel.findOneAndUpdate(
        {_id: application._id},
        application, 
        {new: true}
      );      
    }
    else {
      await delete application._id;

      const applicationsSchema = new applicationsModel(application);
      savedApplication = await applicationsSchema.save(); 
    }

    // res.redirect(307, "/save-application");
    res.send({
      status:'success',
      application: savedApplication
    });

  } catch (err) {
    // res.redirect("/");
    console.log(err);
    
    res.send(`Error occurred while saving application form: ${err}`);

  }

});



//--------API to get an access to application ----------------
app.post('/check-access-code', async (req, res) => {
  try {
    let conditions = req.body;
    //console.log(`conditions: ${JSON.stringify(conditions)}`);
    
    let application = await applicationsModel.find(conditions, null);

    if(application.length !== 0) 
      res.send({
        status: 'success',
        message: 'Access Granted!'
      });
    else
      res.send({
        status: 'failed',
        message: 'Access Denied!'
      });

  } catch (error) {
    console.log(`Error while accessing application: ${error}`);
    res.send(error);
  }

});



// --- connect to mongodb ---
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
  console.log("Connected to mongoDB...");
});


// --- start the server ---
const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}...`);
});



