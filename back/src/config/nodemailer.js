const nodemailer = require('nodemailer');

const createTransport = () => {
  const transport = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASS,
    },
  });
  return transport;
};

module.exports = createTransport