const nodemailer = require('nodemailer');
const ejs = require('ejs');
require('dotenv').config()

const { google } = require('googleapis');


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

const transport = nodemailer.createTransport({
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
const sendEmail = (receiver, subject, content) => {
  ejs.renderFile(__dirname + '/templates/welcome.ejs', { receiver, content }, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      var mailOptions = {
        from: 'saipranith',
        to: receiver,
        subject: subject,
        html: data
      };

      transport.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
      });
    }
  });
};

module.exports = {
  sendEmail
};