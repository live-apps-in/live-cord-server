export const AUTH_CONTENT = {
  send_otp: (otp) => {
    return `Your LiveCord Verification code is: **${otp}**\n
Please do not share code to anyone, which may lead to full-access to your server!`;
  },
};
