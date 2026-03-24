import sendEmail from "../utils/sendEmail.js";

export const driverSupport = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ message: "Subject and message are required" });
    }

    await sendEmail(
      "anshvashisht.2003@gmail.com",
      `🚗 Driver Support Request - ${subject}`,
      `
Driver Name: ${name}
Driver Email: ${email}

Message:
${message}
      `
    );

    res.json({
      success: true,
      message: "Support request sent successfully ✅",
    });
  } catch (err) {
    console.error("Driver support error:", err);
    res.status(500).json({ message: "Failed to send support message" });
  }
};
