import * as argon2 from "argon2";


export const hash = async (password: string): Promise<string> => {
  try {
    const hashedPassword = await argon2.hash(password);
    return hashedPassword;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw error;
  }
};

export const verify = async (
  hash: string,
  password: string
): Promise<boolean> => {
  try {
    const isPasswordValid = await argon2.verify(hash, password);
    return isPasswordValid;
  } catch (error) {
    console.error("Error verifying password:", error);
    throw error;
  }
};
