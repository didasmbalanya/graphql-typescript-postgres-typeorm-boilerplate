import * as nodemailer from 'nodemailer';

// using nodemailer

export const sendWIthNodeMailer = async (
  recipient: string,
  url: string,
  content: EmailContent,
) => {
  if (process.env.NODE_ENV === 'test') {
    return null;
  }
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const mailOptions = {
      from: 'barefootuserdev@gmail.com',
      to: recipient,
      subject: content.subject,
      html: content.body(url),
    };

    const res = await transporter.sendMail(mailOptions);
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export interface EmailContent {
  subject: string;
  body: (url: string) => string;
}

export const confirmEmailData = {
  subject: 'Confirm Email',
  body: (url: string) => `<h1> Company Name and logo </h1>
  <p> Comfirm account details by clicking the link below </p>
  <a href="${url}">Confirm Email </a>`,
};

export const PasswordResetEmail = {
  subject: 'PASSWORD RESET',
  body: (url: string) => `<h1> Company Name and logo </h1>
  <p> Click link below to change password</p>
  <a href="${url}">Reset Password</a>`,
};
