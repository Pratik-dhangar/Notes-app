import nodemailer from 'nodemailer';
import { logger } from './logger';

const sendEmail = async (to: string, subject: string, text: string) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Note Taking App" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      text: text,
    });

    logger.info('Email sent successfully', { to });
  } catch (error) {
    logger.error('Error sending email', { to, error });
    throw new Error('Email could not be sent.');
  }
};

export default sendEmail;