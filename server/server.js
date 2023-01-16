const emailConfig = require('./emailConfig')
const dotenv = require('dotenv');
const nodemailer = require('nodemailer')
const hbs = require('nodemailer-express-handlebars');
const path = require('path')
var express = require('express');

dotenv.config({path:path.relative(process.cwd(), path.join(__dirname,'../.env'))})

var app = express()

let transporter = nodemailer.createTransport({
    service:process.env.SMTP_SERVICE,
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    }
})


const handleBars = {
  viewEngine:{
    extName: ".handlebars",
    partialsDir: path.resolve('./templates'),
    defaultLayout: false,
  },
  viewPath: path.resolve('./templates'),
  extName: ".handlebars",
}
transporter.use('compile', hbs(handleBars))

let mailOptions = {
  from: process.env.SENDER_EMAIL, // TODO: email sender
  to: ['abc@gmail.com','abcd1@cemk.ac.in'], // TODO: email receiver
  subject: 'Nodemailer - Test',
  text: 'Wooohooo it works!!',
  // html: `<h2>Prarinam! thanks for registering on our site</h2>
  //                  <h4>Please verify your mail to continue...</h4>
  //                  <a href="/api/users/verify-email?token=">Click Here to Verify Your Email</a><br/><p>Do not reply to this email</p>`,
  template: 'emailTemp',
  context: {
      name: 'Prarinam',
      subject: 'ABC'
  } // send extra values to  template
};

app.get('/sendEmail', function(req, res){
  // for(let i=0; i<10; i++)
  // {
  transporter.sendMail(mailOptions, (err, data)=>{
    if(err){
      console.log("error: ", err)
      res.send({
        "message":"error has been occureed",
        "status":503
      })
    }
    else{
      console.log("email has been send")
      res.send({
        "message":"successfully email has been sent",
        "status":200
      })
    }
  })
// }
})

var server = app.listen(8081, function () {
  var host = 'lcocalhost'
  var port = process.env.PORT
  console.log('process.env.SMTP_SERVICE: ', process.env.SMTP_SERVICE, process.env.SMTP_HOST, emailConfig.EMAIL_PASSWORD)
  console.log("Example app listening at http://%s:%s", host, port)
})

