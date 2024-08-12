const nodemailer = require("nodemailer");

const sendEmail = async (subject, message,send_to,reply_to) =>{
    //Create email transporter
    const transporter = nodemailer.createTransport({
        host: 'smtp-mail.outlook.com',
        port: 587,
        auth: {
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS,

        },
        tls:{
            rejectUnauthorized: false
        }
    })
    console.log(send_to,reply_to,subject,message);
    // Option for sending email
    const options = {
        from: 'farmlink.org@outlook.com',
        to: send_to,
        replyTo: reply_to,
        subject: subject,
        html: message,
    }
    // send email
    transporter.sendMail(options, function(err,info){
        if(err){
            console.log(err);
        }
        console.log(info);
    })
};




module.exports = sendEmail 