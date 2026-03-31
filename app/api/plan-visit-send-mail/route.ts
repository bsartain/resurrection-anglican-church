import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { firstName, lastName, email, phone, bringingKids, questions, website } = await request.json();

  // Trap Field: bots fill hidden fields, real users don't
  if (website) {
    return NextResponse.json({ success: true });
  }

  // Phone must only contain digits, spaces, parentheses, hyphens, and plus signs
  if (phone && /[a-zA-Z]/.test(phone)) {
    return NextResponse.json({ success: true });
  }

  try {
    await resend.emails.send({
      from: "no-reply@resurrectionrockhill.org",
      to: ["btsartain@yahoo.com", "btsartain@gmail.com", "admin@resurrectionrockhill.org"],
      subject: `Resurrection Church Received a Message From Someone Planning Their Visit To The Church: ${firstName} ${lastName}`,
      html: `<p><strong>First Name:</strong> ${firstName}</p>
             <p><strong>Last Name:</strong> ${lastName}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Phone:</strong> ${phone}</p>
             <p><strong>Are They Bringing Kids?:</strong> ${bringingKids}</p>
             <p><strong>Questions:</strong> ${questions}</p>
             `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
