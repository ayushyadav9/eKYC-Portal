import Web3 from "web3";
import { abi as DMR_ABI } from "./KYC.json";
import { networks } from "./KYC.json";

async function InitialiseWeb3() {
  await window.ethereum.enable();
  const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
  const accounts = await web3.eth.getAccounts();
  const netId = await web3.eth.net.getId();
  const DMR = await new web3.eth.Contract(DMR_ABI, networks[netId].address);
  return [DMR, accounts];
}

export default InitialiseWeb3;
