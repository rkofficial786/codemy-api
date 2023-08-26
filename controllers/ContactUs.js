const mailSender = require("../utils/mailSender");

exports.contactUs = async (req, res) => {
  try {
    const { firstname, lastname, email, phone, message } = req.body;

    //todo

    const adminMessageBody = `
    <h2>New Contact Us Query</h2>
    <p><strong>Name:</strong> ${firstname} ${lastname}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Message:</strong></p>
    <p>${message}</p>
  `;

    await mailSender(
      process.env.MAIL_USER,
      "Got a query",
      adminMessageBody
    );

    const userConfirmationBody = `
    <h2>Thank You for Contacting Us</h2>
    <p>Dear ${firstname},</p>
    <p>We have received your query and will get back to you soon.</p>
    <p>Best Regards,</p>
    <p>StudyNotion</p>
  `;


    await mailSender(email, "Contact us", userConfirmationBody);

    return res.status(200).json({
      success: true,
      message: "Email received and sent successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      success: false,
    });
  }
};
