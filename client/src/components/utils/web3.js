import Web3 from "web3";
import {abi,networks} from "../../../../blockchain/build/contracts/KYC.json";

async function InitialiseWeb3() {
  await window.ethereum.enable();
  const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
  const netId = await web3.eth.net.getId()
  const accounts = await web3.eth.getAccounts();
  const DMR = await new web3.eth.Contract(
    abi, 
    networks[netId].address
  );
  return [DMR, accounts];
}

export default InitialiseWeb3;
