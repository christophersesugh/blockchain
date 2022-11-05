import { ethers } from "./ethers.js";
import { abi, contractAddress } from "./constant.js";

const connectBtn = document.getElementById("connect");
const balanceBtn = document.getElementById("balance");
const showBalance = document.getElementById("showBalance");

const fundMeBtn = document.getElementById("fund");
const withdrawBtn = document.getElementById("withdraw");

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

async function getBalance() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(contractAddress);
    const fb = ethers.utils.formatEther(balance);
    showBalance.innerHTML = `Balance: ${fb}`;
  }
}

async function fund() {
  const ethAmount = document.getElementById("ethAmount").value;
  try {
    if (typeof window.ethereum !== "undefined") {
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

async function withdraw() {
  if (typeof window.ethereum !== "undefined") {
    console.log("Withdrawing...");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.withdraw();
      await listenForTransactionMine(transactionResponse, provider);
      console.log("Done!");
    } catch (error) {
      errorMsg.innerText = error.message;
    }
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

connectBtn.addEventListener("click", connect);
balanceBtn.addEventListener("click", getBalance);
fundMeBtn.addEventListener("click", fund);
withdrawBtn.addEventListener("click", withdraw);
