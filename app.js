const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https= require('https');
const app = express();

app.use(bodyParser.urlencoded({extended: true})); // allows to route
app.use(express.static("public"));

app.get("/",function(req,res){
  res.sendFile(__dirname+"/signup.html")
});
app.post("/",function(req,res){
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const emailid = req.body.email;

  var data = {
    members: [
      {
        email_address: emailid,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  var jsonData = JSON.stringify(data);
  const url = "https://us21.api.mailchimp.com/3.0/lists/98132db5cf";
  const options = {
    methos: "POST",
    auth: "ChaviKothari:b6f1f5f1614a9d04f0c708d5bb4a1089-us21"
  }
  const request = https.request(url,options,function(response){
      if(response.statusCode == 200){
        res.sendFile(__dirname+"/success.html");
      }
      else{
        res.sendFile(__dirname+"/failure.html");
      }
      response.on("data",function(data){
        console.log(JSON.parse(data));
      })
  })
  request.write(jsonData);
  request.end()
});
app.post("/failure",function(req,res){
  res.redirect("/")
})
app.listen(process.env.PORT || 3000,function(){
  console.log('server is running at 3000');
});
