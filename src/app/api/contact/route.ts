import { NextRequest, NextResponse } from 'next/server';

// Initialize Resend with direct fetch instead of the SDK to avoid React Email dependency
const RESEND_API_KEY = process.env.RESEND_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const { name, message } = await request.json();

    // Validate required fields
    if (!name || !message) {
      return NextResponse.json(
        { success: false, message: 'Name and message are required' },
        { status: 400 }
      );
    }

    // Create HTML email content
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #ddd; padding-bottom: 10px;">
          New Contact Form Message
        </h2>
        
        <div style="background-color: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <h3 style="margin-top: 0; color: #555;">Contact Information</h3>
          <p><strong>Name:</strong> ${name}</p>
        </div>

        <div style="background-color: #fff; padding: 20px; margin: 20px 0; border: 1px solid #ddd; border-radius: 5px;">
          <h3 style="margin-top: 0; color: #555;">Message</h3>
          <p>${message.replace(/\n/g, '<br>')}</p>
        </div>

        <div style="margin-top: 30px; padding: 15px; background-color: #e8f5e8; border-radius: 5px;">
          <p style="margin: 0; font-size: 14px; color: #666;">
            This message was submitted through the Arthouse Screen Print contact form.
          </p>
        </div>
      </div>
    `;

    // Send email using direct Resend API call
    const emailData = {
      from: 'Arthouse Forms <onboarding@resend.dev>',
      to: ['jackson.spindle@gmail.com'], // Temporarily using your verified email for testing
      subject: `New Contact Form Message from ${name}`,
      html: htmlContent,
    };

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Resend error:', result);
      return NextResponse.json(
        { success: false, message: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
      emailId: result.id
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}