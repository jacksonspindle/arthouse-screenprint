import { NextRequest, NextResponse } from 'next/server';

// Initialize Resend with direct fetch instead of the SDK to avoid React Email dependency
const RESEND_API_KEY = process.env.RESEND_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extract form fields
    const email = formData.get('email') as string;
    const garmentType = formData.get('garmentType') as string;
    const quantity = formData.get('quantity') as string;
    const repairType = formData.get('repairType') as string;
    const hasReferenceGarment = formData.get('hasReferenceGarment') as string;
    const turnaroundTime = formData.get('turnaroundTime') as string;
    const description = formData.get('description') as string;

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
    if (!email || !garmentType || !quantity || !repairType) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create HTML email content
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #ddd; padding-bottom: 10px;">
          New Repair Quote Request
        </h2>
        
        <div style="background-color: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <h3 style="margin-top: 0; color: #555;">Contact Information</h3>
          <p><strong>Email/Phone:</strong> ${email}</p>
        </div>

        <div style="background-color: #fff; padding: 20px; margin: 20px 0; border: 1px solid #ddd; border-radius: 5px;">
          <h3 style="margin-top: 0; color: #555;">Repair Details</h3>
          <p><strong>Garment Type:</strong> ${garmentType}</p>
          <p><strong>Quantity:</strong> ${quantity}</p>
          <p><strong>Repair Type:</strong> ${repairType}</p>
          <p><strong>Has Reference Garment:</strong> ${hasReferenceGarment === 'yes' ? 'Yes' : 'No'}</p>
          ${turnaroundTime ? `<p><strong>Turnaround Time:</strong> ${turnaroundTime}</p>` : ''}
        </div>

        ${description ? `
        <div style="background-color: #f0f8ff; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <h3 style="margin-top: 0; color: #555;">Description</h3>
          <p>${description.replace(/\n/g, '<br>')}</p>
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
            This repair quote request was submitted through the Arthouse Screen Print website.
          </p>
        </div>
      </div>
    `;

    // Send email using direct Resend API call
    const emailData = {
      from: 'Arthouse Forms <onboarding@resend.dev>',
      to: ['jackson.spindle@gmail.com'], // Temporarily using your verified email for testing
      subject: `New Repair Quote Request from ${email}`,
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
      message: 'Repair quote request submitted successfully',
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