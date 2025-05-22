import nodemailer from 'nodemailer'

export async function POST(request) {
  const { name, email, message } = await request.json()

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'jenasuraj742@gmail.com', // receiver (you)
    subject: `New message from ${name}`,
    text: `
You received a message from your website contact form.

Name: ${name}
Email: ${email}
Message: ${message}
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    return Response.json({ success: true, message: 'Email sent successfully' })
  } catch (error) {
    console.error('Error sending email:', error)
    return Response.json({ success: false, message: 'Failed to send email' }, { status: 500 })
  }
}
