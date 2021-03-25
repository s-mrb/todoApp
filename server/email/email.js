
// 
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE,
  auth: {
    user: process.env.TRANSPORTER_USER_EMAIL,
    pass: process.env.TRANSPORTER_USER_PASSWORD
  }
});



// 

const sendWelcomeEmail = (email, name) =>
{
    
    var mailOptions = {
        from: 'thismailisfortestingcodes@gmail.com',
        to: email,
        subject: 'Thanks for chosing us!.',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
      };


      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          throw new Error(error)
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
};

const sendCancelationEmail = (email, name) =>
{
    
    var mailOptions = {
        from: 'thismailisfortestingcodes@gmail.com',
        to: email,
        subject: 'Please help us!',
        text: `Hi ${name}, We are so sorry to see you go. Please help us in making this a better service by telling us that how can we make it better.
        Your opinion matters! Goodbye.`
      };


      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          throw new Error(error)
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
};


module.exports = {sendWelcomeEmail, sendCancelationEmail};