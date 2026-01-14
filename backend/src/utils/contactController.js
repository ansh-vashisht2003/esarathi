import nodemailer from "nodemailer";

export const sendContactMail = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"E-Sarathi Support" <${process.env.EMAIL_USER}>`,
      to: "anshvashisht.2003@gmail.com",
      replyTo: email,
      subject: `[E-Sarathi Contact] ${subject}`,
      html: `
        <h2>New Contact Message</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <hr/>
        ${message}
      `,
    });

    return res.json({
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("Contact mail error:", error);
    return res.status(500).json({
      message: "Failed to send message",
    });
  }
};
