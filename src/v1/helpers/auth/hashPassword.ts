import bcrypt from "bcrypt";

export async function hashPassword(password: string) {
  const saltsRounds = 12;
  const passwordHash = await bcrypt.hash(password, saltsRounds);

  return passwordHash;
}

export async function comparePasswords(passwordHash: string, password: string) {
  const isValid = await bcrypt.compare(password, passwordHash);
  return isValid;
}
