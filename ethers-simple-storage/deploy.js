import dotenv from "dotenv";
import ethers from "ethers";
import fs from "fs";

dotenv.config();

const { PRIVATE_KEY, RPC_URL } = process.env;

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf-8");
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf-8"
  );

  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log("Deploying...");
  const contract = await contractFactory.deploy();
  await contract.deployTransaction.wait(1);

  const favNum = await contract.retrieve();
  console.log(`Currrent favNum is ${favNum.toString()}`);
  const transactionResponse = await contract.store("29");
  const transactionReceipt = await transactionResponse.wait(1);
  const updatedFavNum = await contract.retrieve();
  console.log(`Updated favorite number is ${updatedFavNum}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
