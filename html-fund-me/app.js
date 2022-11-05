import { ethers } from "./ethers.js";
import { abi, contractAddress } from "./constant.js";

const connectBtn = document.getElementById("connect");
const fundMeBtn = document.getElementById("fund");
const errorMsg = document.getElementById("error");

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    console.log("Metamask supported");
    await window.ethereum.request({ method: "eth_requestAccounts" });
    connectBtn.innerText = "Connected!";
  } else {
    console.log("Your browser doesn't support Meta mask.");
  }
}

async function fund(ethAmount) {
  try {
    if (typeof window.ethereum !== "undefined") {
      ethAmount = "0.01";
      console.log(`Funding with ${ethAmount}...`);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      });
      await listenForTransactionMine(transactionResponse, provider);
      console.log("Done!");
    }
  } catch (error) {
    errorMsg.innerText = error.message;
  }
}

function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}...`);
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(
        `Completed with ${transactionReceipt.confirmations} confirmations`
      );
      resolve();
    });
  });
}

connectBtn.onclick = connect;
// connectBtn.addEventListener("click", connect);
fundMeBtn.addEventListener("click", fund);
