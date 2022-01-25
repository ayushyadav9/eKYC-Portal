const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { gmail } = require("googleapis/build/src/apis/gmail");
const transporter = require("../../config/nodemailer");
const generateRandomString = require("../../utils/random");
const Bank = require("../../models/Bank");
const { getDetails, getReqList, handelRequest, registerCustomer, updateRecordBC} = require("./blockchain");

module.exports.register = async (req, res) => {
  try {
    if (req.body.sender == "client") {
      let user = await User.findOne({ email: req.body.formData.email });
      if (user) {
        return res.status(400).json({
          message: "User already exists",
          success: false,
        });
      }
      let kycId = "KYC-" + generateRandomString();
      let userWithKYC = await User.findOne({ kycId: kycId });
      while (userWithKYC) {
        kycId = "KYC-" + generateRandomString();
        userWithKYC = await User.findOne({ kycId: kycId });
      }
      let pass = generateRandomString(8);
      let hash = await bcrypt.hash(pass, 10);
      let receipt = await registerCustomer(req.body.formData,kycId)
      console.log(receipt)
      user = User({
        email: req.body.formData.email,
        kycId: kycId,
        password: pass,
      });
      const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET);
      await user.save();
      // const result = await transporter.sendMail({
      //   from: "eKYC Portal <ayushtest935@gmail.com>",
      //   to: req.body.email,
      //   replyTo: "ayushtest935@gmail.com",
      //   subject: "KYC credentials",
      //   html: `<h4><span style="font-size:16px">Email</span>:&nbsp; ${user.email}</h4>
      //                   <h4><span style="font-size:16px">Password</span>:&nbsp; ${pass}</h4>
      //                   <h4><span style="font-size:16px">KYC-ID</span>:&nbsp; ${user.kycId}</h4>`,
      // });
      res.status(200).json({
        message: "Registered Successfully",
        data: {
          user,
          token: token,
        },
        success: true,
      });
    } else if (req.body.sender == "bank") {
      let bank = await Bank.findOne({ email: req.body.email });
      let bankEth = await Bank.findOne({ ethAddress: req.body.ethAddress });
      if (bank || bankEth) {
        return res.status(400).json({
          message: "Bank already exists",
          success: false,
        });
      }
      let pass = generateRandomString(8);
      let hash = await bcrypt.hash(pass, 10);
      bank = Bank({
        email: req.body.email,
        ethAddress: req.body.ethAddress,
        password: pass,
      });
      const token = jwt.sign({ email: bank.email }, process.env.JWT_SECRET);
      await bank.save();
      // const result = await transporter.sendMail({
      //   from: "eKYC Portal <ayushtest935@gmail.com>",
      //   to: req.body.email,
      //   replyTo: "ayushtest935@gmail.com",
      //   subject: "Bank credentials",
      //   html: `<p><span style="font-size:16px">Email</span>:&nbsp; ${bank.email}</p>
      //                   <p><span style="font-size:16px">Password</span>:&nbsp; ${pass}</p>`,
      // });
      res.status(200).json({
        message: "Registered Successfully",
        data: {
          bank,
          token: token,
        },
        success: true,
      });
    } else {
      res.status(400).json({
        message: "Sender not specified!",
        success: false,
      });
    }
  } catch (err) {
    res.status(500).json({
      error: err.message,
      message: "Something went wrong",
      success: false,
    });
  }
};

module.exports.login = async (req, res) => {
  try {
    if (req.body.sender == "client") {
      let user = await User.findOne({ email: req.body.email });
      if (!user || !(req.body.password == user.password)){
        return res.status(400).json({
          message: "Invalid email or password",
          success: false,
        });
      }
      const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET);
      res.status(200).json({
        message: "User logged in successfully",
        data: {
          token,
        },
        success: true,
      });
    } else if (req.body.sender == "bank") {
      let bank = await Bank.findOne({ email: req.body.email });
      // if (!bank || !(await bcrypt.compare(req.body.password, bank.password))) {
      if (!bank || !(req.body.password == bank.password)) {
        return res.status(400).json({
          message: "Invalid email or password",
          success: false,
        });
      }
      const token = jwt.sign({ email: bank.email }, process.env.JWT_SECRET);
      res.status(200).json({
        message: "Bank logged in successfully",
        data: {
          bank: {
            email: bank.email,
            ethAddress: bank.ethAddress,
          },
          token,
        },
        success: true,
      });
    } else if(req.body.sender == "bank"){
      
    } else {
      res.status(400).json({
        message: "Sender not specified!",
        success: false,
      });
    }
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Something went wrong",
      success: false,
    });
  }
};

module.exports.request = async (req, res) => {
  try {
    const user = req.user;
    const { bAddress, response } = req.body;
    const receipt = await handelRequest(user.kycId, bAddress, response);
    res.status(200).json({
      transactionHash: receipt.transactionHash,
      message: "Response sent successfuly",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Something went wrong",
      success: false,
    });
  }
};

module.exports.getClientData = async (req, res) => {
  try {
    const user = req.user;
    const bcData = await getDetails(user.kycId);
    res.status(200).json({
      message: "Data Fetched from Blockchain",
      data: {
        email: user.email,
        kycId: user.kycId,
        name: bcData.name,
        phone: bcData.phone,
        address: bcData.customerAddress,
        gender: bcData.gender,
        dob: bcData.dob,
        pan: bcData.PAN,
        records: bcData.records,
        requestList: bcData.requestList,
        approvedBanks: bcData.approvedBanks,
        kycHistory: bcData.kycHistory,
        kycStatus: bcData.kycStatus,
      },
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Something went wrong",
      success: false,
    });
  }
};

module.exports.getBankList = async (req, res) => {
  try {
    const user = req.user;
    const bankList = await getReqList(user.kycId);
    res.status(200).json({
      message: "Data Fetched from Blockchain",
      data: {
        pendingBanks: bankList.pendingBanks,
        approvedBanks: bankList.approvedBanks,
      },
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Something went wrong",
      success: false,
    });
  }
};

module.exports.updateRecord = async (req, res) => {
  try {    
    let t = await updateRecordBC(req.user.kycId,req.body.record_type,req.body.record_data);    
    res.status(200).json({
      message: "Data Updated Successfully",      
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Something went wrong",
      success: false,
    });
  }
};

module.exports.updateSocket = async (req, res) => {
  try {    
    let user = req.user
    await User.updateOne({ _id: req.user._id },{ $set: { socket: req.body.socket }});
    res.status(200).json({
      message: "Data Updated Successfully",      
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Something went wrong",
      success: false,
    });
  }
};

module.exports.getSocket = async (req, res) => {
  try {    
    let user = await User.findOne({ kycId: req.body.kycId });
    if(!user || !user.socket){
      return res.status(400).json({
        message: "No user found",      
        success: false,
      });
    }
    res.status(200).json({
      socket : user.socket,
      message: "Fetched Successfuly",      
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Something went wrong",
      success: false,
    });
  }
};