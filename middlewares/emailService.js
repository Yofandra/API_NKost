import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  secure: false,
  debug: true,
  auth: {
      user: process.env.EMAIL_SENDER,
      pass: process.env.PASS_SENDER
  },
  tls: {
      rejectUnauthorized: true
  }
});

export const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    to: to,
    from: process.env.EMAIL_SENDER,
    subject: subject,
    text: text,
  };

  return transporter.sendMail(mailOptions);
};
