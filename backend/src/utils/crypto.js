import crypto from "crypto";
import bcrypt from bcrypt


class CryptoClass{
  async hashData(data){
      return await crypto.createHash("sha256").update(data).digest("hex");
  }

  async hashPasswordBcrypt(password){
    return await bcrypt.hash(
      password, 10
    )
  }
  async comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }
}
  

export default new CryptoClass();