import nodemailer from "nodemailer";
require("dotenv").config({ path: "./.env" });

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "[REDACTED]" : "Not Set");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  debug: true,
  logger: true,
});

transporter.verify((error, success) => {
  if (error) {
    console.error("Verification failed:", error);
  } else {
    console.log("Transporter ready:", success);
  }
});

const sendTestEmail = async () => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "l.deng@alustudent.com",
      subject: "Test Email",
      text: "This is a test email.",
    });
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Send email error:", error);
  }
};

sendTestEmail();
