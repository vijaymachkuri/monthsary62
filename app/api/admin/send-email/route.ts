import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  // Ensure the app password is set
  if (!process.env.GMAIL_APP_PASSWORD) {
    return new NextResponse('GMAIL_APP_PASSWORD is not configured', { status: 500 });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'monthsaryservice@gmail.com',
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: '"Your Monthsary Website" <monthsaryservice@gmail.com>',
    to: 'vijaymachkuri12@gmail.com, mzjhe9601@gmail.com',
    subject: 'Happy Monthsary! ❤️ (Manual Trigger)',
    html: `
      <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 40px; border-radius: 16px; background: linear-gradient(135deg, #fff1f2 0%, #fdf4ff 100%); border: 2px solid #fbcfe8; box-shadow: 0 10px 25px rgba(236, 72, 153, 0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #be185d; font-size: 32px; margin-bottom: 10px;">Happy Monthsary!</h1>
          <p style="font-size: 24px;">✨</p>
        </div>
        
        <p style="font-size: 18px; color: #4c1d95; line-height: 1.6;">
          <strong>Hey Jay and Gem,</strong>
        </p>
        <p style="font-size: 17px; color: #5b21b6; line-height: 1.7;">
          Today is your special day! Another month of beautiful memories, shared laughter, and endless love.
        </p>
        <p style="font-size: 17px; color: #5b21b6; line-height: 1.7;">
          Take a moment today to reflect on your beautiful journey together. The website has been decorated especially for today!
        </p>
        
        <div style="text-align: center; margin: 40px 0;">
          <a href="https://monthsary62.vercel.app/" style="background-color: #db2777; color: white; padding: 14px 28px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(219, 39, 119, 0.4);">
            Open Your Memories
          </a>
        </div>
        
        <p style="font-size: 15px; color: #9d174d; text-align: center; margin-top: 50px; font-style: italic;">
          Sent with infinite love ❤️
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true, message: 'Email sent successfully!' });
  } catch (error: any) {
    console.error('Error sending manual email:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
