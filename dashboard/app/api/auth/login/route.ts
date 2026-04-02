import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const body = await req.json()
  console.log("Login attempt:", JSON.stringify(body))
  const { username, password } = body

  if (
    username === (process.env.AUTH_USERNAME || "admin") &&
    password === (process.env.AUTH_PASSWORD || "admin")
  ) {
    const res = NextResponse.json({ ok: true })
    res.cookies.set("auth_token", Buffer.from(`${username}:${Date.now()}`).toString("base64"), {
      httpOnly: true,
      path: "/",
      maxAge: 86400,
    })
    return res
  }

  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
}
