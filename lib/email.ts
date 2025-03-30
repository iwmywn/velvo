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

  const emailHandlerUrl = `${process.env.NEXT_PUBLIC_URL}/email-handler?mode=${
    mode === "verifyEmail" ? "verifyEmail" : "resetPassword"
  }&email=${email}&token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: `${mode === "verifyEmail" ? "Verify your Velvo account" : "Reset your Velvo password"} `,
    html: `
      <table
      style="width: 100%; background-color: #e7f1ff; padding: 20px 40px; border-radius: 12px; text-align: center; font-family: Arial, sans-serif;">
      <tr>
        <td>
          <p style="font-size: 22px; font-weight: 600; margin-bottom: 20px; margin-top: 0px">Velvo</p>
          <p style="font-size: 16px; margin: 10px 0 20px 0; line-height: 1.6;">
            Hey there, <br>
            ${
              mode === "verifyEmail"
                ? "Thanks for joining Velvo! We just need one more thing you - a quick confirmation of your email address. Click the button below to verify your email and get started."
                : "Nobody likes being locked out of their account. We're coming to your rescue - just click the button below to get started. If you didn't request a password reset, you can safely ignore this email."
            }
          </p>
          <a href="${emailHandlerUrl}"
            style="display: inline-block; padding: 8px 20px; background-color: #3e71b8; color: #fff; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 16px;">${mode === "verifyEmail" ? "Verify" : "Reset your password"}</a>
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
