"use server";

const recaptchaSecret = process.env.RECAPTCHA_SECRET ?? null;

export default async function verifyRecaptchaToken(token: string) {
  if (recaptchaSecret === null) {
    throw new Error("RECAPTCHA_SECRET is not defined");
  }

  if (!token) return false;

  const res = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `secret=${recaptchaSecret}&response=${token}`,
  });

  if (!res.ok) {
    return false;
  } else {
    const captchaData = await res.json();
    return captchaData.success;
  }
}
