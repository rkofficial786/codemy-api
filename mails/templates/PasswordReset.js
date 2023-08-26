exports.passwordResetEmail = (url,name) => {
    return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>Course Registration Confirmation</title>
        <style>
            body {
                background-color: #ffffff;
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.4;
                color: #333333;
                margin: 0;
                padding: 0;
            }
    
    
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                text-align: center;
            }
    
            .logo {
                max-width: 200px;
                margin-bottom: 20px;
                border-radius: 15px;
            }
    
            .message {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 20px;
            }
    
            .body {
                font-size: 16px;
                margin-bottom: 20px;
            }
    
            .cta {
                display: inline-block;
                padding: 10px 20px;
                background-color: #FFD60A;
                color: rgb(185, 34, 59);
                text-decoration: none;
                border-radius: 5px;
                font-size: 16px;
                font-weight: bold;
                margin-top: 20px;
            }
    
            .support {
                font-size: 14px;
                color: #999999;
                margin-top: 20px;
            }
    
            .highlight {
                font-weight: bold;
            }
        </style>
    
    </head>
    
    <body>
        <div class="container">
            <a href="https://codemy.onrender.com"><img class="logo" src="https://res.cloudinary.com/dcq1ivq4t/image/upload/f_auto,q_auto/v1/RkData/sd9ljv9al60hatvxdpcv"
                    alt="Codemy Logo"></a>
            <div class="message">Password reset request</div>
            <div class="body">
                <p>Dear ${name},</p>
                
                <p>Please click on the below button to reset your password
                </p>
                <a class="cta" href=${url}>Reset Password</a>
            </div>
            <div class="support">If you have any questions or need assistance, please feel free to reach out to us at <a
                    href="mailto:excelshopping0@gmail.com">excelShopping.com</a>. We are here to help!</div>
        </div>
    </body>
    
    </html>`;
  };
  