const Web3 = require("web3");
const web3 = new Web3(
  new Web3.providers.HttpProvider(
    "https://polygon-mumbai.g.alchemy.com/v2/iiKsERYL7jzR-WQFV3P4tIRTbgbRXw3z"
  )
);

const abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "Admin_Address",
        type: "address",
      },
    ],
    name: "AdminAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "Admin_Address",
        type: "address",
      },
    ],
    name: "AdminRemoved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_to",
        type: "address",
      },
    ],
    name: "OwnerChanged",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "BankList",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_address",
        type: "address",
      },
    ],
    name: "addAdmin",
    outputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_kycId",
        type: "string",
      },
      {
        internalType: "address",
        name: "_bankAddress",
        type: "address",
      },
    ],
    name: "addAuth",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_bName",
        type: "string",
      },
      {
        internalType: "string",
        name: "_bAddress",
        type: "string",
      },
      {
        internalType: "string",
        name: "_bContact",
        type: "string",
      },
      {
        internalType: "address",
        name: "_addr",
        type: "address",
      },
    ],
    name: "addBank",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_phone",
        type: "string",
      },
      {
        internalType: "string",
        name: "customerAddress",
        type: "string",
      },
      {
        internalType: "string",
        name: "_gender",
        type: "string",
      },
      {
        internalType: "string",
        name: "_dob",
        type: "string",
      },
      {
        internalType: "string",
        name: "_PAN",
        type: "string",
      },
      {
        internalType: "string",
        name: "_kycId",
        type: "string",
      },
      {
        internalType: "string",
        name: "_geoLocation",
        type: "string",
      },
      {
        internalType: "string",
        name: "ipfs_selfie",
        type: "string",
      },
      {
        internalType: "string",
        name: "ipfs_aadhar",
        type: "string",
      },
      {
        internalType: "string",
        name: "ipfs_pan",
        type: "string",
      },
    ],
    name: "addCustomer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_kycId",
        type: "string",
      },
    ],
    name: "addRequest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_address",
        type: "address",
      },
    ],
    name: "getBankByAddress",
    outputs: [
      {
        internalType: "string",
        name: "bName",
        type: "string",
      },
      {
        internalType: "string",
        name: "bAddress",
        type: "string",
      },
      {
        internalType: "string",
        name: "bContact",
        type: "string",
      },
      {
        internalType: "address",
        name: "addr",
        type: "address",
      },
      {
        internalType: "bool",
        name: "isApproved",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getBankData",
    outputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "string",
                name: "name",
                type: "string",
              },
              {
                internalType: "string",
                name: "kycId",
                type: "string",
              },
            ],
            internalType: "struct KYC.tempCustomer[]",
            name: "pendingCustomers",
            type: "tuple[]",
          },
          {
            components: [
              {
                internalType: "string",
                name: "name",
                type: "string",
              },
              {
                internalType: "string",
                name: "kycId",
                type: "string",
              },
            ],
            internalType: "struct KYC.tempCustomer[]",
            name: "approvedCustomers",
            type: "tuple[]",
          },
        ],
        internalType: "struct KYC.BankData",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_kycId",
        type: "string",
      },
    ],
    name: "getClientData",
    outputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "string",
                name: "name",
                type: "string",
              },
              {
                internalType: "address",
                name: "addr",
                type: "address",
              },
            ],
            internalType: "struct KYC.tempBank[]",
            name: "pendingBanks",
            type: "tuple[]",
          },
          {
            components: [
              {
                internalType: "string",
                name: "name",
                type: "string",
              },
              {
                internalType: "address",
                name: "addr",
                type: "address",
              },
            ],
            internalType: "struct KYC.tempBank[]",
            name: "approvedBanks",
            type: "tuple[]",
          },
        ],
        internalType: "struct KYC.ClientData",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_kycId",
        type: "string",
      },
    ],
    name: "getCustomerDetails",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "kycId",
            type: "string",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "phone",
            type: "string",
          },
          {
            internalType: "string",
            name: "customerAddress",
            type: "string",
          },
          {
            internalType: "string",
            name: "gender",
            type: "string",
          },
          {
            internalType: "string",
            name: "dob",
            type: "string",
          },
          {
            internalType: "string",
            name: "PAN",
            type: "string",
          },
          {
            components: [
              {
                internalType: "string",
                name: "bName",
                type: "string",
              },
              {
                internalType: "string",
                name: "data",
                type: "string",
              },
              {
                internalType: "uint256",
                name: "time",
                type: "uint256",
              },
            ],
            internalType: "struct KYC.Records[]",
            name: "records",
            type: "tuple[]",
          },
          {
            internalType: "address[]",
            name: "requestList",
            type: "address[]",
          },
          {
            internalType: "address[]",
            name: "approvedBanks",
            type: "address[]",
          },
          {
            components: [
              {
                internalType: "string",
                name: "bName",
                type: "string",
              },
              {
                internalType: "string",
                name: "remarks",
                type: "string",
              },
              {
                internalType: "uint256",
                name: "status",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "time",
                type: "uint256",
              },
            ],
            internalType: "struct KYC.KycVerdict[]",
            name: "kycHistory",
            type: "tuple[]",
          },
          {
            internalType: "uint256",
            name: "kycStatus",
            type: "uint256",
          },
        ],
        internalType: "struct KYC.Customer",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "index",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_kycId",
        type: "string",
      },
      {
        internalType: "address",
        name: "_bankAddress",
        type: "address",
      },
      {
        internalType: "bool",
        name: "response",
        type: "bool",
      },
    ],
    name: "manageRequest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_address",
        type: "address",
      },
    ],
    name: "removeAdmin",
    outputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_kycId",
        type: "string",
      },
    ],
    name: "removeRequest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_kycId",
        type: "string",
      },
      {
        internalType: "address",
        name: "_bankAddress",
        type: "address",
      },
    ],
    name: "revokeAuth",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
    ],
    name: "setOwner",
    outputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_kycId",
        type: "string",
      },
      {
        internalType: "string",
        name: "bName",
        type: "string",
      },
      {
        internalType: "string",
        name: "remarks",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "timeStamp",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "verdict",
        type: "uint256",
      },
    ],
    name: "updateKycStatus",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_kycId",
        type: "string",
      },
      {
        internalType: "string",
        name: "record_type",
        type: "string",
      },
      {
        internalType: "string",
        name: "record_data",
        type: "string",
      },
    ],
    name: "updateRecord",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

module.exports = new web3.eth.Contract(abi, "0x65dfc9d775df17b429865eb84ed41ba9a13c1c3a");
