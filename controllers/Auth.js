const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const Profile = require("../models/Profile");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
require("dotenv").config();
//send OTP

// exports.sendOTP = async (req, res) => {
//   try {
//     //fetch email from request ki body
//     const { email } = req.body;

//     //check if user exist

//     const checkUserPresent = await User.findOne({ email });
//     if (checkUserPresent) {
//       return res.status(401).json({
//         success: false,
//         message: "User already registered",
//       });
//     }

//     //generate OTP

//     var otp = otpgenerator.generate(6, {
//       upperCaseAlphabets: false,
//       lowerCaseAlphabets: false,
//       specialChars: false,
//     });

//     console.log("OTP Generated", otp);

//     // check if otp is unique

//     let result = await OTP.findOne({ otp: otp });

//     while (result) {
//       otp = otpgenerator.generate(6, {
//         upperCaseAlphabets: false,
//         lowerCaseAlphabets: false,
//         specialChars: false,
//       });

//       result = await OTP.findOne({ otp: otp });
//     }

//     const otpPayload = { email, otp };
//     //create an entry for OTP
//     const otpBody = await OTP.create(otpPayload);
//     console.log("otpbody", otpBody);

//     //return response

//     res.status(200).json({
//       success: true,
//       message: "OTP sent successfully",
//       otp,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

//signup

exports.signUp = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;
    //validate
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    //password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "password does not match",
      });
    }

    // Check if user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({
				success: false,
				message: "User already exists. Please sign in to continue.",
			});
		}

// Find the most recent OTP for the email
let response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
console.log("response", response);

// Check if OTP is still being fetched (wait for a reasonable time)
let otpFetched = false;
let maxWaitTime = 10000; // Maximum wait time in milliseconds (adjust as needed)
let currentTime = 0;

while (!otpFetched && currentTime < maxWaitTime) {
  if (response.length === 0) {
    await new Promise(resolve => setTimeout(resolve, 500)); // Wait for 500ms
    currentTime += 200;
    response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
  } else {
    otpFetched = true;
  }
}

// Check OTP after fetching
if (!otpFetched || otp !== response[0].otp) {
  // Invalid OTP
  return res.status(400).json({
    success: false,
    message: "The OTP is not valid",
  });
}



    //hash password

    const hashedPassword = await bcrypt.hash(password, 10);

    const profileDetails = await Profile.create({
      gender: null,
      dateofBirth: null,
      about: null,
      contactNumber: null,
    });
    let approved = "";
		approved === "Instructor" ? (approved = false) : (approved = true);
    const user = await User.create({
      firstName,
			lastName,
			email,
			contactNumber,
			password: hashedPassword,
			accountType: accountType,
			approved: approved,
			additionalDetails: profileDetails._id,
			image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    return res.status(200).json({
      success: true,
      message: "User is registered successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "User Cannot be registered",
    });
  }
};

//login

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validate data

    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    //check exist user

    const user = await User.findOne({ email }).populate("additionalDetails");
   
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not registered ,please sign up",
      });
    }
    //generate JWT after pass match
    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user._id,
        accountType: user.accountType,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      user.token = token;
      user.password = undefined;

      //create cookie
      const options = {
        expires: new Date(Date.now(+3 * 24 * 60 * 60 * 1000)),
        httpOnly: true,
      };

      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "Logged in successfully",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "password incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Login Failed",
    });
  }
};




// Send OTP For Email Verification
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body

    // Check if user is already present
    // Find user with provided email
    const checkUserPresent = await User.findOne({ email })
    // to be used in case of signup

    // If user found with provided email
    if (checkUserPresent) {
      // Return 401 Unauthorized status code with error message
      return res.status(401).json({
        success: false,
        message: `User is Already Registered`,
      })
    }

    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    })
    const result = await OTP.findOne({ otp: otp })
    console.log("Result is Generate OTP Func")
    console.log("OTP", otp)
    console.log("Result", result)
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
      })
    }
    const otpPayload = { email, otp }
    const otpBody = await OTP.create(otpPayload)
    console.log("OTP Body", otpBody)
    res.status(200).json({
      success: true,
      message: `OTP Sent Successfully`,
      otp,
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({ success: false, error: error.message })
  }
}



//change password

exports.changePassword = async (req, res) => {
  try {
    const { email, password, newPassword, confirmNewPassword } = req.body;
    if (newPassword !== confirmNewPassword) {
      return res.status(401).json({
        success: false,
        message: "password does not match",
      });
    }
    const userDetails = await User.findOne({email:email})

   if(password !== userDetails.password){
    return res.status(401).json({
      success: false,
      message: "Password incorrect",
    });
   }


    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const user = await User.findOneAndUpdate(
      { email: email },
      { password: hashedPassword },
      { new: true }
    );

    const mailResponse = await mailSender(
      email,
      "Password changed",
      "Your account password has been changed"
    );
    console.log("email sent successfully", mailResponse);

    return res.status(200).json({
      success: true,
      message: "password updated sucessfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error while updating password",
    });
  }
};
