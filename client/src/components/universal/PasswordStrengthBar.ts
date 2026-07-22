import PasswordStrengthBarCjs from 'react-password-strength-bar'

const PasswordStrengthBar =
  (PasswordStrengthBarCjs as unknown as { default?: typeof PasswordStrengthBarCjs }).default || PasswordStrengthBarCjs

export default PasswordStrengthBar
