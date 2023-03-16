const mailchimp = require("@mailchimp/mailchimp_marketing");
const md5 = require("md5");
const express=require("express");
const bodyParser=require('body-parser');
const https=require('https');
const request =require('request');
require("dotenv").config();

const app=express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",(req,res)=>{
  res.sendFile(__dirname+"/signup.html");
})

app.post("/",(req,res)=>{
  const Fname=req.body.Fname;
  const Lname=req.body.Lname;
  const email=req.body.email;
  
  mailchimp.setConfig({
    apiKey: process.env.api_key,
    server: process.env.server_prefix,
  });
  
  const listId = process.env.list_id;
  const subscribingUser = {
    firstName: Fname,
    lastName: Lname,
    email: email
  };
  
  async function run() {
    try {
      var response = await mailchimp.lists.addListMember(listId, {
        email_address: subscribingUser.email,
        status: "subscribed",
        merge_fields: {
          FNAME: subscribingUser.firstName,
          LNAME: subscribingUser.lastName
        }
      })
      res.sendFile(__dirname+'/success.html');
      
    } catch (error) {
        console.log(error);
        res.sendFile(__dirname+'/failure.html');
      }
    }
    run();
  })
  
app.listen(process.env.PORT || 3000,()=>{console.log("server live on 3000");})