require('dotenv').config()
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const path = require('path');
const { sendEmail } = require("./email");
const hbs = require('nodemailer-express-handlebars');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine",'ejs');

const OAuth2 = google.auth.OAuth2 

const OAuth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI,
   
)

OAuth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN,
})

const accessToken = new Promise((resolve,reject)=>{
    OAuth2Client.getAccessToken((err,token)=>{
        if(err) reject(err)
         resolve(token)
    })
})

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure:false,
    auth:{
        type: 'OAuth2',
        user: 'saipranithswargam@gmail.com',
        clientId:process.env.CLIENT_ID,
        clientSecret:process.env.CLIENT_SECRET,
        refreshToken:process.env.REFRESH_TOKEN,
    }
})

// const handlebarOptions = {
//     viewEngine:{
//         extName:".handlebars",
//         partialsDir:path.resolve('./views'),
//         defaultLayout: false,
//     },
//     viewPath: path.resolve('./views'),
//     extName:".handlebars",
// }

// transporter.use('compile',hbs(handlebarOptions));




// app.post("/api",async (req,res)=>{
//     // const resultSendMail =  await transporter.sendMail({
//     //     from:'Nodemailer OAuth2',
//     //     to:'swargamprakash@gmail.com',
//     //     subject: "Automated Email check",
//     //     text:"<div><h1>Hello this is html h1</h1></div>",
//     // });
//     const mailOptions = await {
//             from:"Nodemailer OAuth2",
//             to:to,
//             subject: "Automated Email check",
//             template:'email',
//             context:{
//                 title:"saipranithswargam@gmail",
//                 text:"Lorem epsum gypsum"
//             }
//         }
//     transporter.sendMail(mailOptions,(err,info)=>{
//             if(err){
//                 console.log(err);
//             }
//             else{
//                 console.log("Email has been sent successfully");
//             }
//         })
//         res.send("done");
//     });
app.post("/api", async (req, res) => {
    const email = await req.body.email;
    console.log(req.body);
    await sendEmail(
      email,
      'Subject : Saipranith Swargam- ASN--093',
      "Welcome message content"
    );
    res.send("please verify your email");
  });
  app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/tobesent.html");
  })
app.get("/verified",(req,res)=>{
    res.send("<h1>You have been verified</h1>")
})
app.listen(process.env.PORT||3000,()=>{
    console.log("listening to port 3000");
})
