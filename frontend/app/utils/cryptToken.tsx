/* import CryptoJS from "crypto-js";

// Secret key for encryption and decryption (replace with your secret key)
const secretKey = process.env.CRYPT_SECRET_KEY;
if (!secretKey) {
	throw new Error("Secret key is undefined.");
}

// Function to encrypt a token
const encryptToken = (token: string) => {
	const encryptedToken = CryptoJS.AES.encrypt(token, secretKey).toString();
	return encryptedToken;
};

// Function to decrypt a token
const decryptToken = (encryptedToken: string) => {
	const bytes = CryptoJS.AES.decrypt(encryptedToken, secretKey);
	const decryptedToken = bytes.toString(CryptoJS.enc.Utf8);
	return decryptedToken;
};

export { encryptToken, decryptToken };
 */
