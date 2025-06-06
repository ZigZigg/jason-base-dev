/**
 * Generates a random password that meets Cognito password policy requirements:
 * - Minimum 8 characters
 * - Contains at least 1 number
 * - Contains at least 1 special character
 * - Contains at least 1 uppercase letter
 * - Contains at least 1 lowercase letter
 */
export function generateRandomPassword(): string {
  // Define character sets
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  // Ensure at least one character from each required set
  let password = '';
  password += lowercase[Math.floor(Math.random() * lowercase.length)]; // At least 1 lowercase
  password += uppercase[Math.floor(Math.random() * uppercase.length)]; // At least 1 uppercase
  password += numbers[Math.floor(Math.random() * numbers.length)]; // At least 1 number
  password += specialChars[Math.floor(Math.random() * specialChars.length)]; // At least 1 special char
  
  // Fill remaining characters (minimum 8 total, so 4 more needed)
  const allChars = lowercase + uppercase + numbers + specialChars;
  for (let i = 4; i < 12; i++) { // Generate 12 character password
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password to randomize the order
  return password.split('').sort(() => Math.random() - 0.5).join('');
} 