import crypto from "crypto";
import bcrypt from "bcrypt"


class CryptoClass{
  async hashData(data){
      return await crypto.createHash("sha256").update(data).digest("hex");
  }

  hashPasswordBcrypt(password){
    return bcrypt.hash(
      password, 10
    )
  }
  comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
  }
}
  

export default new CryptoClass();