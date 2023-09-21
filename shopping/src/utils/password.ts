import bcrypt from "bcrypt";

const generateSalt = async () => {
	return bcrypt.genSaltSync(10);
};

const generatePassword = async (password: string, salt: string) => {
	return bcrypt.hashSync(password, salt);
};

const validatePassword = async (
	password: string,
	salt: string,
	hash: string
) => {
	return bcrypt.compareSync(password, hash);
};

export { generateSalt, generatePassword, validatePassword };
