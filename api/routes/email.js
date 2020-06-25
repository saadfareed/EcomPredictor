
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

module.exports = function sendEmail(email,id,name) {
    return new Promise((resolve,reject)=>{
        const oauth2Client = new OAuth2(
          "1058703829076-glll3carojsk0lrhv4f3fcafg6sre3bv.apps.googleusercontent.com", // CentID
          "qxH9VV09E5utqVtJtqQD5qKX", // Client Secret
          "https://developers.google.com/oauthplayground" // Redirect URL
        );
        oauth2Client.setCredentials({
          refresh_token: "1//04Juh7GzPoIsZCgYIARAAGAQSNwF-L9IrcHLdWRUxcwC-kJHczyu-DpPD3PNoQ8_2YrsQVRTkrRS-n7C9gAg3VuJ59IsDbFWSYUw"
        });
        const accessToken = oauth2Client.getAccessToken()
        const smtpTransport = nodemailer.createTransport({
          service: "gmail",
          auth: {
               type: "OAuth2",
               user: "kamranakram003@gmail.com", 
               clientId: "1058703829076-glll3carojsk0lrhv4f3fcafg6sre3bv.apps.googleusercontent.com",
               clientSecret: "qxH9VV09E5utqVtJtqQD5qKX",
               refreshToken: "1//04Juh7GzPoIsZCgYIARAAGAQSNwF-L9IrcHLdWRUxcwC-kJHczyu-DpPD3PNoQ8_2YrsQVRTkrRS-n7C9gAg3VuJ59IsDbFWSYUw",
               accessToken: accessToken
          }
        });
        var currentDateTime = new Date();
        const mailOptions = {
           to:email,
         // to: "kamranakram003@gmail.com",
          
          subject: "Reset Password",
          generateTextFromHTML: true,
          html: "<h1>Welcome To Ecom Predictor ! </h1><p>\
          <h3>Hello "+name+"</h3>\
          If You are requested to reset your password then click on below link<br/>\
          <a href='http://localhost/change-password/"+currentDateTime+"+++"+id+"'>Click On This Link</a>\
          </p>"
         
        };
        smtpTransport.sendMail(mailOptions, (error, response) => {
         
          error ? resolve([false]) : resolve([true,currentDateTime]);
          smtpTransport.close();
        });
      
        })
    
    
    
  
      
  };