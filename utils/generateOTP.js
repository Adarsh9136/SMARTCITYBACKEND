const generateOTP = () => {
    let otp = '';

    // Generate a 6-digit numeric OTP
    for (let i = 0; i < 6; i++) {
        otp += Math.floor(Math.random() * 10); // Random number between 0 and 9
    }

    return otp;
}

module.exports = generateOTP;
