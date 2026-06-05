import { NextResponse } from "next/server";

export async function GET() {
  const pk = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const sk = process.env.CLERK_SECRET_KEY;

  return NextResponse.json({
    VERCEL_ENV: process.env.VERCEL_ENV || null,
    NODE_ENV: process.env.NODE_ENV || null,
    pk: {
      exists: typeof pk !== "undefined",
      value: pk || null,
      length: pk ? pk.length : 0,
      charCodes: pk ? Array.from(pk).map(c => c.charCodeAt(0)) : [],
    },
    sk: {
      exists: typeof sk !== "undefined",
      length: sk ? sk.length : 0,
      prefix: sk ? sk.substring(0, 8) : null,
      suffix: sk ? sk.substring(sk.length - 4) : null,
    }
  });
}
