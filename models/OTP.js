const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate =require("../mails/templates/emailVerificationTemplate")

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60*5,
  },
});

//a function to send email

async function sendVerificationEmail(email, otp) {
  try {
    const mailResponse = await mailSender(
			email,
			"Verification Email",
			emailTemplate(otp)
		);
		console.log("Email sent successfully: ", mailResponse.response);
  } catch (error) {
    console.log("error while sending mail", error);
  }
}
// Define a post-save hook to send email after the document has been saved
OTPSchema.pre("save", async function (next) {
	console.log("New document saved to database");

	// Only send an email when a new document is created
	if (this.isNew) {
		await sendVerificationEmail(this.email, this.otp);
	}
	next();
});


module.exports = mongoose.model("OTP", OTPSchema);
