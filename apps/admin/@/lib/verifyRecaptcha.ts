import axios from 'axios';

export async function verifyRecaptcha(token: string): Promise<boolean> {
  try {
    const secret = process.env.RECAPTCHA_SECRET_KEY;
    const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
      params: {
        secret,
        response: token,
      },
    });

    return response.data.success;
  } catch (error) {
    console.error('Error verifying reCAPTCHA:', error);
    return false;
  }
}
