const mailchimp = require("@mailchimp/mailchimp_marketing");
const express=require("express");
const bodyParser=require('body-parser');
require("dotenv").config();

const app=express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",(req,res)=>{
  res.sendFile(__dirname+"/signup.html");
})

app.post("/",(req,res)=>{
  
  // security keys 
  const api_key=process.env.api_key;
  const server_prefix=process.env.server_prefix;
  const list_id=process.env.list_id;

  const Fname=req.body.Fname;
  const Lname=req.body.Lname;
  const email=req.body.email;
  
  const listId = list_id;

  const subscribingUser = {
    firstName: Fname,
    lastName: Lname,
    email: email
  };

  mailchimp.setConfig({
    apiKey: api_key,
    server: server_prefix,
  });
  
  async function run() {
    try {
      var response = await mailchimp.lists.addListMember(listId, {
        email_address: subscribingUser.email,
        status: "pending",
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