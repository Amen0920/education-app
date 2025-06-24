import bcrypt from "bcryptjs";

const PASSWORD_SALT_ROUNDS = 10;

export const saltAndHasPassword = (password: string) => {
  const salt = bcrypt.genSaltSync(PASSWORD_SALT_ROUNDS);
  const hash = bcrypt.hashSync(password, salt);

  return hash;
};

export const comparePassword = (password: string, hashedPassword: string) => {
  return bcrypt.compareSync(password, hashedPassword);
};
