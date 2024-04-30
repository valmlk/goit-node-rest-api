import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const { META_PASS } = process.env;

const nodemailerConfig = {
  host: 'smtp.meta.ua',
  port: 465,
  secure: true,
  auth: {
    user: 'valentynamlk@meta.ua',
    pass: META_PASS,
  },
};

const transporter = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async data => {
  try {
    const emailOptions = {
      ...data,
      from: 'valentynamlk@meta.ua',
    };
    await transporter.sendMail(emailOptions);
    console.log('Email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

export default sendEmail;
