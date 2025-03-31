import nodemailer from "nodemailer";

export async function sendEmail(
  email: string,
  token: string,
  mode: "resetPassword" | "verifyEmail",
) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  const emailHandlerUrl = `${process.env.NEXT_PUBLIC_URL}/email-handler?mode=${mode}&email=${email}&token=${token}`;
  const subject =
    mode === "verifyEmail"
      ? "Verify your Velvo account"
      : "Reset your Velvo password";
  const message =
    mode === "verifyEmail"
      ? "Thank you for joining Velvo! We just need one final step from you - please confirm your email address by clicking the button below to verify it and get started."
      : "No one likes being locked out of their account, and we're here to help. Just click the button below to get started. If you didn't request a password reset, feel free to ignore this email.";
  const btnText = mode === "verifyEmail" ? "Verify" : "Reset your password";

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: subject,
    html: `
      <table
      style="width: 100%; background-color: #e7f1ff; padding: 20px 40px; border-radius: 12px; text-align: center; font-family: Arial, sans-serif;">
      <tr>
        <td>
          <p style="font-size: 22px; font-weight: 600; margin-bottom: 20px; margin-top: 0px">Velvo</p>
          <p style="font-size: 16px; margin: 10px 0 20px 0; line-height: 1.6;">
            Hey there, <br>
            ${message}
          </p>
          <a href="${emailHandlerUrl}"
            style="display: inline-block; padding: 8px 20px; background-color: #3e71b8; color: #fff; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 16px;">${btnText}</a>
          <p style="font-size: 14px; margin-top: 20px;">
            Cheers,
            <span style="margin-top: 8px; display: block"></span>
            Ngo Nguyen Viet Anh - Hoang Anh Tuan
          </p>
          <div style="height: 2px; background-color: #666; opacity: 0.2; margin: 30px 0"></div>
          <p style="color: #666; font-size: 12px">Alternatively, you can copy and paste the link below into your browser:
            <span style="margin: 6px 0; display: block"></span>
            <a href="${emailHandlerUrl}"
              style="display: inline-block; transition: background-color 0.3s ease;">${emailHandlerUrl}</a>
          </p>
        </td>
      </tr>
    </table>
    `,
  });
}
