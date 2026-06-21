import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, businessType, summary } = await req.json();
    if (!email) return NextResponse.json({ ok: false }, { status: 400 });

    // Log to Vercel server logs (visible in dashboard + analytics)
    console.log("[EMAIL_CAPTURE]", JSON.stringify({ email, businessType, ts: new Date().toISOString() }));

    // If Resend API key is set, send the actual email
    if (process.env.RESEND_API_KEY) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Business Advisor <advisor@gemini-xprize.vercel.app>",
          to: [email],
          subject: "Your AU Business Automation Blueprint",
          html: `<h2>Your Automation Blueprint</h2><p>${summary}</p><p>Log back in to see your full recommendations at <a href="https://gemini-xprize.vercel.app">gemini-xprize.vercel.app</a></p>`,
        }),
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
