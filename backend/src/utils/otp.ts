import config from "./../config/config";
import { transporter } from "../config/nodemailer";

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOTPEmail = async (recipientEmail: string, otp: string): Promise<boolean> => {
  const mailOptions = {
    from: config.mail_user,
    to: recipientEmail,
    subject: "Your OTP Code for Verification",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Email Verification</h2>
        <p>Your One-Time Password (OTP) for verification is:</p>
        <h3 style="color: #007bff;">${otp}</h3>
        <p>This OTP is valid for a limited time. Do not share it with anyone.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("OTP email sent successfully!");
    return true;
  } catch (error) {
    console.error("Error sending OTP email:", error);
    return false;
  }
};
