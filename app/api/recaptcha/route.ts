"use server";

import { createResponse } from "@lib/utils";

export async function POST(req: Request) {
  const token = await req.json();

  try {
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${token}`,
      { method: "POST" },
    );

    const data = await response.json();

    if (!data.success) return createResponse("Invalid CAPTCHA token!", 400);

    return createResponse("CAPTCHA verified successfully", 200);
  } catch (error) {
    return createResponse("Something went wrong!", 500);
  }
}
