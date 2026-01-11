import bcrypt from "bcrypt";

// Hash the password with the salt

export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  let hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

export async function comparePasswords(storedPassword, newPassword) {
  let comparedResult = await bcrypt.compare(storedPassword, newPassword);
  return comparedResult;
}
