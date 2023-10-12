import { randomBytes } from 'crypto';

const generateResetToken = () => {
  return randomBytes(32).toString('hex');
}

export default generateResetToken