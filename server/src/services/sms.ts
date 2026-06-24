import africasTalking from "../lib/africastalking";

export const sendSMSOtp = async (phone: string, code: string) => {
  let normalized = phone.trim();

  if (normalized.startsWith("+233")) {
  } else if (normalized.startsWith("233")) {
    normalized = "+" + normalized;
  } else if (normalized.startsWith("0")) {
    normalized = "+233" + normalized.slice(1);
  } else {
    normalized = "+233" + normalized;
  }

  const sms = africasTalking.SMS;
  const message = `Your Yes Laundry verification code is ${code}`;

  try {
    const result = await sms.send({
      to: [normalized],
      message,
    });
    console.log("the reuslt is ", result);
    return result;
  } catch (err) {
    throw new Error(`An error occurred sending sms otp, ${err}`);
  }
};
