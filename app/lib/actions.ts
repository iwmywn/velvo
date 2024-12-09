"use server";

import nodemailer from "nodemailer";
import { signOut } from "@/auth";

export async function handleSignOut() {
  await signOut();
}

export async function sendVerificationEmail(email: string, token: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Verify your StyleWave account",
    html: `
      <table
      style="width: 100%; background-color: #e7f1ff; padding: 20px 40px; border-radius: 12px; text-align: center; font-family: Arial, sans-serif;">
      <tr>
        <td>
          <img style="width: 35px; height: 35px; margin-bottom: 10px;"
            src="https://github.com/iwmywn/doan/blob/master/public/logo-mail.png?raw=true" alt="logo">
          <p style="font-size: 22px; font-weight: 600; margin-bottom: 20px; margin-top: 0px">StyleWave</p>
          <p style="font-size: 16px; margin: 10px 0 20px 0; line-height: 1.6;">
            Hey there, <br>
            Thanks for joining StyleWave! We just need one more thing from you - a quick confirmation of your email
            address. Click the button below to verify your email and get started.
          </p>
          <a href="${verificationUrl}"
            style="display: inline-block; padding: 8px 20px; background-color: #3e71b8; color: #fff; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 16px;">Verify</a>
          <p style="font-size: 14px; margin-top: 20px;">
            Cheers,
            <span style="margin-top: 8px; display: block"></span>
            Ngo Nguyen Viet Anh - Hoang Anh Tuan
          </p>
          <div style="height: 2px; background-color: #666; opacity: 0.2; margin: 30px 0"></div>
          <p style="color: #666; font-size: 12px">Alternatively, you can copy and paste the link below into your browser:
            <span style="margin: 6px 0; display: block"></span>
            <a href="${verificationUrl}"
              style="display: inline-block; transition: background-color 0.3s ease;">${verificationUrl}</a>
          </p>
        </td>
      </tr>
    </table>  
    `,
  });
}
