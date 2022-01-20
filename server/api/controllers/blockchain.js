const Web3 = require("web3");
const MyConc = require("../../../blockchain/build/contracts/KYC.json");
const adminAddress = process.env.ADMIN_ADDRESS;
const adminKey = process.env.ADMIN_KEY;

module.exports.getDetails = async (kycId) => {
  const web3 = new Web3("http://localhost:7545");
  const netId = await web3.eth.net.getId();
  const conc = new web3.eth.Contract(MyConc.abi, MyConc.networks[netId].address);
  const data = await conc.methods.getCustomerDetails(kycId).call({ from: adminAddress });
  return data;
};

module.exports.getReqList = async (kycId) => {
  const web3 = new Web3("http://localhost:7545");
  const netId = await web3.eth.net.getId();
  const conc = new web3.eth.Contract(MyConc.abi, MyConc.networks[netId].address);
  const data = await conc.methods.getClientData(kycId).call({ from: adminAddress });
  return data;
};

module.exports.handelRequest = async (kycId, bAddress, response) => {
  const web3 = new Web3("http://localhost:7545");
  const netId = await web3.eth.net.getId();
  const conc = new web3.eth.Contract(MyConc.abi, MyConc.networks[netId].address);
  const tx = conc.methods.manageRequest(kycId, bAddress, response);
  const gas = await tx.estimateGas({ from: adminAddress });
  const gasPrice = await web3.eth.getGasPrice();
  const data = tx.encodeABI();
  const nonce = await web3.eth.getTransactionCount(adminAddress);

  const signedTx = await web3.eth.accounts.signTransaction(
    {
      to: conc.options.address,
      data,
      gas,
      gasPrice,
      nonce,
      chainId: netId,
    },
    adminKey
  );

  const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  return receipt;
};
