const otpStore = new Map();

export const storeOTP = (email, otp) => {
  otpStore.set(email, {
    otp,
    createdAt: Date.now()
  });
};

export const verifyOTP = (email, userOTP) => {
  const storedData = otpStore.get(email);
  if (!storedData) {
    console.log('No OTP found for email:', email);
    return false;
  }

  // Check if OTP is expired (10 minutes)
  const now = Date.now();
  const diff = now - storedData.createdAt;
  if (diff > 10 * 60 * 1000) {
    console.log('OTP expired for email:', email);
    otpStore.delete(email);
    return false;
  }

  const isValid = storedData.otp === userOTP;
  console.log('OTP validation result:', isValid);

  if (isValid) {
    otpStore.delete(email);
  }
  
  return isValid;
}; 