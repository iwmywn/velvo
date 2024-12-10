"use server";

// import { connectToDatabase } from "@lib/mongodb";
import bcrypt from "bcrypt";
import { getUserByEmail } from "@/app/lib/data";
import { signInSchema } from "@/schemas";
import jwt from "jsonwebtoken";
import cookie from "cookie";

export async function POST(req: Request) {
  const data = await req.json();
  const parsedCredentials = signInSchema.safeParse(data);

  if (!parsedCredentials.success) {
    return new Response(JSON.stringify({ message: "Invalid field!" }), {
      status: 400,
    });
  }
  const { email, password } = parsedCredentials.data;
  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return new Response(
      JSON.stringify({ message: "Email or password is incorrect!" }),
      {
        status: 400,
      },
    );
  }

  if (!existingUser.isVerified) {
    return new Response(
      JSON.stringify({
        message: "Account not verified. Please check your email to verify!",
      }),
      { status: 400 },
    );
  }

  const isPasswordValid = await bcrypt.compare(password, existingUser.password);
  if (!isPasswordValid) {
    return new Response(
      JSON.stringify({ message: "Email or password is incorrect!" }),
      {
        status: 400,
      },
    );
  }

  const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60,
    path: "/",
    sameSite: "strict" as const,
  };

  const cookieHeader = cookie.serialize("auth_token", token, cookieOptions);

  return new Response(JSON.stringify({ message: "Signin successful." }), {
    status: 200,
    headers: {
      "Set-Cookie": cookieHeader,
      Location: "/",
    },
  });
}
