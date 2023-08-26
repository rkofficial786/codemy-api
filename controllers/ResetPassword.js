const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const crypto =require("crypto")
const bcrypt =require("bcrypt");
const { passwordResetEmail } = require("../mails/templates/PasswordReset");

//reset password token
exports.resetPasswordToken = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.json({
        success: false,
        message: "Email not found",
      });
    }

    const token = crypto.randomUUID();
    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      { token: token, resePasswordExpires: Date.now() + 5 * 60 * 100 },
      { new: true }
    );

    const url = `https://codemy.onrender.com/update-password/${token}`;

    await mailSender(
      email,
      "Password reset link",
      passwordResetEmail(url,user.firstName)
    );
    return res.json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while password reset",
    });
  }
};

//reset password

exports.resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body;
    if (password !== confirmPassword) {
      return res.json({
        success: false,
        message: "Password does not match",
      });
    }
    const userDetails = await User.findOne({ token: token });
    if (!userDetails) {
      return res.json({
        success: false,
        message: "Token invalid",
      });
    }
    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.status(401).json({
        success: false,
        message: "Link Expired",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findOneAndUpdate(
      { token: token },
      { password: hashedPassword },
      { new: true }
    );

    return res.status(200).json({
      message: "Password reset success",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while password reset",
    });
  }
};
