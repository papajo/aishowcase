function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return null;
  }

  // Dynamic import to avoid build-time errors
  return import("resend").then(({ Resend }) => new Resend(apiKey));
}

const FROM_EMAIL = process.env.FROM_EMAIL || "onboarding@resend.dev";
const TO_EMAIL = process.env.CONTACT_EMAIL || "joshipv2@gmail.com";

export async function sendWelcomeEmail(email: string) {
  try {
    const resend = await getResend();
    if (!resend) {
      console.warn("Email service not configured, skipping welcome email");
      return { success: true };
    }

    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Welcome to AI Showcase!",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #0a0a0a; color: #e5e5e5;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="font-size: 24px; font-weight: bold; color: #fff; margin-bottom: 8px;">Welcome to AI Showcase!</h1>
            <div style="width: 60px; height: 3px; background: linear-gradient(90deg, #3b82f6, #8b5cf6); margin: 0 auto;"></div>
          </div>
          
          <p style="color: #a3a3a3; line-height: 1.6; margin-bottom: 24px;">
            Thanks for subscribing! You'll receive weekly updates about:
          </p>
          
          <ul style="color: #a3a3a3; line-height: 1.8; margin-bottom: 24px; padding-left: 20px;">
            <li>AI tools and recommendations</li>
            <li>Project updates and case studies</li>
            <li>Development insights and tips</li>
          </ul>
          
          <div style="border-top: 1px solid #262626; padding-top: 24px; margin-top: 32px;">
            <p style="color: #525252; font-size: 14px;">
              If you didn't subscribe, you can safely ignore this email.
            </p>
          </div>
        </body>
        </html>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send welcome email:", error);
    return { success: false, error };
  }
}

export async function sendContactEmail({
  name,
  email,
  message,
}: {
  name: string;
  email: string;
  message: string;
}) {
  try {
    const resend = await getResend();
    if (!resend) {
      console.warn("Email service not configured, skipping contact email");
      return { success: true };
    }

    await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: email,
      subject: `New message from ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #0a0a0a; color: #e5e5e5;">
          <div style="margin-bottom: 24px;">
            <h1 style="font-size: 20px; font-weight: bold; color: #fff; margin-bottom: 8px;">New Contact Form Message</h1>
            <div style="width: 60px; height: 3px; background: linear-gradient(90deg, #3b82f6, #8b5cf6);"></div>
          </div>
          
          <div style="background-color: #171717; border: 1px solid #262626; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <p style="margin: 0 0 8px 0;"><strong style="color: #fff;">Name:</strong> ${name}</p>
            <p style="margin: 0 0 8px 0;"><strong style="color: #fff;">Email:</strong> ${email}</p>
            <p style="margin: 0;"><strong style="color: #fff;">Message:</strong></p>
            <p style="color: #a3a3a3; line-height: 1.6; margin-top: 8px;">${message}</p>
          </div>
          
          <div style="border-top: 1px solid #262626; padding-top: 16px;">
            <p style="color: #525252; font-size: 14px;">
              Reply to this email to respond directly to ${name}.
            </p>
          </div>
        </body>
        </html>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send contact email:", error);
    return { success: false, error };
  }
}

export async function sendAutoReply({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  try {
    const resend = await getResend();
    if (!resend) {
      console.warn("Email service not configured, skipping auto-reply");
      return { success: true };
    }

    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Thanks for reaching out!",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #0a0a0a; color: #e5e5e5;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="font-size: 24px; font-weight: bold; color: #fff; margin-bottom: 8px;">Message Received!</h1>
            <div style="width: 60px; height: 3px; background: linear-gradient(90deg, #3b82f6, #8b5cf6); margin: 0 auto;"></div>
          </div>
          
          <p style="color: #a3a3a3; line-height: 1.6; margin-bottom: 24px;">
            Hi ${name},
          </p>
          
          <p style="color: #a3a3a3; line-height: 1.6; margin-bottom: 24px;">
            Thanks for reaching out! I've received your message and will get back to you within 24-48 hours.
          </p>
          
          <p style="color: #a3a3a3; line-height: 1.6; margin-bottom: 24px;">
            In the meantime, feel free to check out my latest projects and articles on the site.
          </p>
          
          <div style="border-top: 1px solid #262626; padding-top: 24px; margin-top: 32px;">
            <p style="color: #525252; font-size: 14px;">
              Best regards,<br>
              PJ
            </p>
          </div>
        </body>
        </html>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send auto-reply:", error);
    return { success: false, error };
  }
}
