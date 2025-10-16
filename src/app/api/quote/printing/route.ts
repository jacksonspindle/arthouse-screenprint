import { NextRequest, NextResponse } from 'next/server';

// Initialize Resend with direct fetch instead of the SDK to avoid React Email dependency
const RESEND_API_KEY = process.env.RESEND_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extract form fields
    const email = formData.get('email') as string;
    const hasArtwork = formData.get('hasArtwork') as string;
    const garmentType = formData.get('garmentType') as string;
    const garmentColor = formData.get('garmentColor') as string;
    const quantity = formData.get('quantity') as string;
    const sizeBreakdown = formData.get('sizeBreakdown') as string;
    const designColors = formData.get('designColors') as string;
    const printLocation = formData.get('printLocation') as string;
    const turnaroundTime = formData.get('turnaroundTime') as string;
    const additionalInfo = formData.get('additionalInfo') as string;

    // Extract files
    const files: File[] = [];
    const attachments: any[] = [];
    
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('file_') && value instanceof File) {
        files.push(value);
        
        // Convert file to buffer for email attachment
        const buffer = await value.arrayBuffer();
        attachments.push({
          filename: value.name,
          content: Buffer.from(buffer),
        });
      }
    }

    // Validate required fields
    if (!email || !hasArtwork || !garmentType || !quantity || !designColors || !printLocation) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create HTML email content
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #ddd; padding-bottom: 10px;">
          New Print Quote Request
        </h2>
        
        <div style="background-color: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <h3 style="margin-top: 0; color: #555;">Contact Information</h3>
          <p><strong>Email/Phone:</strong> ${email}</p>
        </div>

        <div style="background-color: #fff; padding: 20px; margin: 20px 0; border: 1px solid #ddd; border-radius: 5px;">
          <h3 style="margin-top: 0; color: #555;">Project Details</h3>
          <p><strong>Has Artwork:</strong> ${hasArtwork === 'yes' ? 'Yes' : 'No'}</p>
          <p><strong>Garment Type:</strong> ${garmentType}</p>
          ${garmentColor ? `<p><strong>Garment Color:</strong> ${garmentColor}</p>` : ''}
          <p><strong>Quantity:</strong> ${quantity}</p>
          ${sizeBreakdown ? `<p><strong>Size Breakdown:</strong> ${sizeBreakdown}</p>` : ''}
          <p><strong>Design Colors:</strong> ${designColors}</p>
          <p><strong>Print Location:</strong> ${printLocation}</p>
          ${turnaroundTime ? `<p><strong>Turnaround Time:</strong> ${turnaroundTime}</p>` : ''}
        </div>

        ${additionalInfo ? `
        <div style="background-color: #f0f8ff; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <h3 style="margin-top: 0; color: #555;">Additional Information</h3>
          <p>${additionalInfo.replace(/\n/g, '<br>')}</p>
        </div>
        ` : ''}

        ${files.length > 0 ? `
        <div style="background-color: #fff8dc; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <h3 style="margin-top: 0; color: #555;">Attached Files</h3>
          <ul>
            ${files.map(file => `<li>${file.name} (${(file.size / 1024).toFixed(1)}KB)</li>`).join('')}
          </ul>
        </div>
        ` : ''}

        <div style="margin-top: 30px; padding: 15px; background-color: #e8f5e8; border-radius: 5px;">
          <p style="margin: 0; font-size: 14px; color: #666;">
            This quote request was submitted through the Arthouse Screen Print website.
          </p>
        </div>
      </div>
    `;

    // Send email using direct Resend API call
    const emailData = {
      from: 'Arthouse Forms <onboarding@resend.dev>',
      to: ['jackson.spindle@gmail.com'], // Temporarily using your verified email for testing
      subject: `New Print Quote Request from ${email}`,
      html: htmlContent,
      ...(attachments.length > 0 && { attachments })
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
      message: 'Quote request submitted successfully',
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