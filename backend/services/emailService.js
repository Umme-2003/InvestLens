// services/emailService.js
require('dotenv').config();
const nodemailer = require('nodemailer');

// Create a "transporter" object using SendGrid's SMTP details.
// This is the engine that will send the emails.
const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey', // This is a literal string, don't change it.
    pass: process.env.SENDGRID_API_KEY, // The API key you created
  },
});

async function sendReportEmail(recipientEmail, reportUrl) {
  console.log(`Preparing to send email to ${recipientEmail}...`);

  const mailOptions = {
    from: `"Pitch Deck Analyzer" <${process.env.SENDER_EMAIL_ADDRESS}>`, // Sender address
    to: recipientEmail, // List of receivers
    subject: 'Your Investment Thesis Report is Ready!', // Subject line
    text: `Hello,\n\nYour pitch deck analysis is complete! You can download your report here: ${reportUrl}\n\nThank you for using KaroStartup Pitch Deck Analyzer!`, // Plain text body
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Hello,</h2>
        <p>Your pitch deck analysis is complete! You can download your detailed investment thesis report by clicking the button below.</p>
        <p style="text-align: center;">
          <a href="${reportUrl}" style="background-color: #28a745; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-size: 16px;">Download Your Report</a>
        </p>
        <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
        <p><a href="${reportUrl}">${reportUrl}</a></p>
        <br>
        <p>Thank you for using the KaroStartup Pitch Deck Analyzer!</p>
      </div>
    `, // HTML body
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully! Message ID:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error; // Propagate the error to be handled by the route
  }
}

module.exports = { sendReportEmail };