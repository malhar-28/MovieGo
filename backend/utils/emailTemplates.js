const generateOtpEmailContent = (otp) => {
  const time = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  return `
    <div style="max-width:600px;margin:auto;background-color:#f9f9f9;border-radius:12px;font-family:Inter,sans-serif;overflow:hidden;border:1px solid #ddd;">
      <div style="background-color:#0B193F;color:white;padding:20px;text-align:center;">
        <h2 style="margin:0;">Reset Your Password</h2>
      </div>
      <div style="padding:20px;background-color:white;">
        <p style="font-size:16px;color:#333;">Hello,</p>
        <p style="font-size:15px;">We received a request to reset your password on <strong>MovieGo</strong>.</p>
        <p style="font-size:14px;margin: 16px 0;">Use the following OTP to reset your password. This OTP is valid for the next <strong>10 minutes</strong>.</p>
        <div style="text-align:center;margin:20px 0;">
          <span style="font-size:28px;letter-spacing:4px;background:#0B193F;color:white;padding:10px 20px;border-radius:8px;">${otp}</span>
        </div>
        <p style="font-size:13px;color:#888;">Requested on: ${time}</p>
        <p style="margin-top:30px;font-size:14px;color:#777;">If you didn’t request this, you can ignore this email.</p>
        <p style="font-size:14px;color:#777;">Cheers,<br/><strong>MovieGo Team</strong></p>
      </div>
    </div>
  `;
};

module.exports = { generateOtpEmailContent };
