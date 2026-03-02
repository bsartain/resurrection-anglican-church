import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { name, email, phone, comments } = await request.json();

  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "btsartain@yahoo.com",
      subject: `New Email From Resurrection Church Website Form: ${name}`,
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Phone:</strong> ${phone}</p>
             <p><strong>Message:</strong> ${comments}</p>`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
