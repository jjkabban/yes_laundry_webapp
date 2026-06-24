import nodemailer from "nodemailer";
import { SendEmailOptions } from "./types/mail";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: process.env.NODE_ENV === "production",
  },
});

export default async function sendEmail({
  to,
  subject,
  text,
  html,
}: SendEmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: `"Yes Laundry" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("Email sent successfully: %s", info.messageId);
    return { success: true, message: info.messageId };
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error("Email sending failed");
  }
}

export const sendEmailOtp = async (email: string, code: string) => {
  const to = email;
  const subject = `Verify your account`;
  const text = `our verification code is ${code}`;
  console.log("send email was called");
  try {
    const result = await sendEmail({ to, subject, text });
    console.log("the email result is ", result);
    return result;
  } catch (err) {
    throw new Error("An error occured sending email otp");
  }
};
