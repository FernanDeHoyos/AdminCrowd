import { AES, enc } from 'crypto-js';

export const Encrypt = () => {

    const encryptData = (data, secretKey) => {
        const dataJSON = JSON.stringify(data);
        const cipherText = AES.encrypt(dataJSON, secretKey).toString();
        return cipherText;
      };

      const decryptData = (cipherText, secretKey) => {
        const bytes = AES.decrypt(cipherText, secretKey);
        const decryptedJSON = bytes.toString(enc.Utf8);
        return decryptedJSON;
      };

  return {
    encryptData,
    decryptData
  }
}

