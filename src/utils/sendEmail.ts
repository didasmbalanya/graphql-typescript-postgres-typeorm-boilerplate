import * as Sparkpost from 'sparkpost';
import * as nodemailer from 'nodemailer';

// email sending  client

// using nodemailer

export const sendWIthNodeMailer = async (recipient: string, url: string) => {
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
      subject: 'CONFIRM EMAIL',
      html: `
      <h1> Company Name and logo </h1>
      <p> Comfirm account details by clicking the link below </p>
      <a href="${url}">Confirm Email </a>`,
    };

    const res = await transporter.sendMail(mailOptions);
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// using spark
/**
 *
 * @param recipients
 * @param subject
 * @param url
 */
export const sendEmail = async (
  recipients: string,
  subject: string,
  url: string,
) => {
  if (process.env.NODE_ENV === 'test') {
    return null;
  }
  const client = new Sparkpost(process.env.SPARKPOST_API_KEY);
  // send data amd config
  try {
    await client.transmissions.send({
      options: {
        sandbox: true,
      },
      content: {
        from: 'testing@sparkpostbox.com',
        subject,
        html: `<html>
            <body>
              <h1> Company Name and log </h1>
              <p>Testing SparkPost - the world's most awesomest company!</p>
              <a href="${url}"> Click here to confirm email</a>
            </body>
          </html>`,
      },
      recipients: [{ address: recipients }],
    });
    return true;
  } catch (error) {
    console.log('Whoops! Something went wrongwhen sending the email');
    console.log(error);
    return null;
  }
};
