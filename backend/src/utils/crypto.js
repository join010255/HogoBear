import crypto from "crypto";
import bcrypt

const hashData = (data) => {
    return crypto.createHash("sha256").update(data).digest("hex");
}

export default hashData;