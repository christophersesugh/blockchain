import dotenv from "dotenv";
import ethers from "ethers";
import fs from "fs";

dotenv.config();

const { PRIVATE_KEY, PRIVATE_KEY_PASSWORD } = process.env;

async function main() {
  const wallet = new ethers.Wallet(PRIVATE_KEY);
  const encryptedJsonKey = await wallet.encrypt(
    PRIVATE_KEY_PASSWORD,
    PRIVATE_KEY
  );
  console.log(encryptedJsonKey);
  fs.writeFileSync("./.encryptedJsonKey.json", encryptedJsonKey);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
