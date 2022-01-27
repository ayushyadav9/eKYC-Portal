import React from "react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import InitialiseWeb3 from "../utils/web3.js";

import VerifyClient from "./VerifyClient.jsx";
import { Card, Button, Input, Modal, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { baseURL } from "../../api";

const Bank = () => {
  const history = useHistory();
  const [dmr, setDmr] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [bankDetails, setBankDetails] = useState(null);
  const [pendingClientRequests, setPendingClientRequests] = useState([]);
  const [approvedClients, setApprovedClients] = useState([]);
  const [customerKycId, setCustomerKycId] = useState("");
  const [customerKycIdData, setCustomerKycIdData] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [clientData, setClientData] = useState(null);
  const [isLoading, setisLoading] = useState(false);
  const [userDataFooters, setUserDataFooters] = useState([]);
  const [addRemPop, setaddRemPop] = useState(false);
  const [remarks, setremarks] = useState("");

  useEffect(() => {
    setup();
  }, []);

  const setup = async () => {
    let [tempDmr, tempAcc] = await InitialiseWeb3();
    setDmr(tempDmr);
    setAccounts(tempAcc);
  };

  const getBankDetails = async () => {
    if (dmr && accounts) {
      dmr.methods
        .getBankByAddress(accounts[0])
        .call({ from: accounts[0] })
        .then((res) => {
          const bankInfo = {
            bName: res.bName,
            bAddress: res.bAddress,
            bWallet: res.addr,
            label: "Bank Details",
          };
          setBankDetails(bankInfo);
        })
        .catch((err) => {
          console.log(err);
      });
    }
  };

  const getBankData = async () => {
    if (dmr && accounts) {
      dmr.methods
        .getBankData()
        .call({ from: accounts[0] })
        .then((res) => {
          setPendingClientRequests(res.pendingCustomers);
          setApprovedClients(res.approvedCustomers);
        })
        .catch((err) => {
          console.log(err);
        });
      }
  };

  useEffect(() => {
    if (dmr && accounts) {
      getBankDetails();
      getBankData();
    }
    // eslint-disable-next-line
  }, [dmr, accounts]);

  const handleSendRequest = (e) => {
    e.preventDefault();
    setisLoading(true);
    if (dmr && accounts) {
      dmr.methods
        .addRequest(customerKycId)
        .send({ from: accounts[0] })
        .then((res) => {
          setisLoading(false);
          message.success("Request sent!");
          getBankData();
          setCustomerKycId("");
        })
        .catch((err) => {
          setisLoading(false);
          message.error("Something went wrong!");
          console.log(err);
        });
    }
  };

  const handleRequestData = (e) => {
    e.preventDefault();
    setisLoading(true);
    console.log(customerKycIdData);
    if (dmr && accounts) {
      dmr.methods
        .getCustomerDetails(customerKycIdData)
        .call({ from: accounts[0] })
        .then((res) => {
          setisLoading(false);
          message.success("Request sent!");
          console.log(res);
          togglePopup(res, [
            <Button type="primary" onClick={() => handleKycVerdict(1)}>
              Accept KYC
            </Button>,
            <Button type="primary" onClick={() => handleKycVerdict(3)}>
              Revoke KYC
            </Button>,
          ]);
          setCustomerKycIdData("");
        })
        .catch((err) => {
          setisLoading(false);
          message.error("Something went wrong!");
          console.log(err);
        });
    }
  };

  const handelLogout = () => {
    localStorage.removeItem("bankToken");
    history.push("/");
  };

  const togglePopup = (data, footers) => {

    setClientData(data);
    console.log(data);
    setUserDataFooters(footers);
    setIsPopupOpen((prev) => {
      return !prev;
    });
  };

  const handelStartvKYC = (kyc) => {
    
      fetch(`${baseURL}/getSocket`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ kycId: kyc }),
      })
        .then((res) => res.json())
        .then((result, err) => {
          if (err) {
            console.log(err);
            return;
          }
          if (result.success) {
            history.push(`agent/video/${result.socket}`);
          }
          console.log(result);
        });
  };

  const handleKycVerdict = (verdict) => {
    setaddRemPop(true);
  };

  const handleVerdict = (verdict) => {
    console.log(remarks);
    if (dmr && accounts && clientData && remarks.length>0) {
      dmr.methods
        .updateKycStatus(
          clientData.kycId,
          bankDetails.bName,
          remarks,
          Date.now(),
          verdict
        )
        .send({ from: accounts[0] })
        .then((res) => {
          getBankData();
          handelAddRemarksPopup();
          setIsPopupOpen((prev) => {return !prev;});
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handelAddRemarksPopup = () => {
    setaddRemPop((prev) => !prev);
  };

  return (
    <>
      <Modal
        title="Client Details"
        width={1100}
        style={{ top: "20px" }}
        visible={isPopupOpen}
        onCancel={() =>
          setIsPopupOpen((prev) => {
            return !prev;
          })
        }
        footer={userDataFooters}
      >
        <Modal
          title="Add Remarks"
          visible={addRemPop}
          onCancel={handelAddRemarksPopup}
          footer={[
            <Button
              type="primary"
              onClick={() => handleVerdict(2)} 
            >
              Reject KYC
            </Button>,
            <Button
              type="primary"
              onClick={() => handleVerdict(1)} 
            >
              Accept KYC
            </Button>
          ]}
        >
          <Input
            placeholder="Enter Remarks"
            value={remarks}
            onChange={(e) => setremarks(e.target.value)}
          ></Input>
        </Modal>
        {clientData && (
          <VerifyClient dmr={dmr} accounts={accounts} data={clientData} />
        )}
      </Modal>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          margin: "0 auto",
          width: "80%",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            margin: "25px",
          }}
        >
          <div style={{ margin: "auto 0" }}>
            <h1 style={{ color: "rgb(14 21 246 / 85%)", fontWeight: "700" }}>
              vKYC
            </h1>
          </div>
          <div style={{ margin: "auto 0" }}>
            <Button type="primary" ghost>
              Hello Bank!
            </Button>
            <Button></Button>
            <Button danger ghost onClick={handelLogout}>
              Logout
            </Button>
          </div>
        </div>

        <Card title="Bank Details" my={"50px"} hoverable>
          {bankDetails && (
            <Card type="inner" hoverable>
              Name: {bankDetails.bName}
              <br />
              Address: {bankDetails.bAddress}
              <br />
              Etherium Address: {bankDetails.bWallet}
            </Card>
          )}
        </Card>
        <Card title="Request Access" style={{ margin: "20px 0" }} hoverable>
          <div style={{ display: "flex" }}>
            <Input
              size="large"
              placeholder="Client KYC ID"
              value={customerKycId}
              onChange={(e) => setCustomerKycId(e.target.value)}
              style={{ width: "20%" }}
              prefix={<UserOutlined />}
            />
            <Button
              size="large"
              loading={isLoading}
              onClick={handleSendRequest}
            >
              Send Request
            </Button>
          </div>
        </Card>

        <Card title="Access Data" style={{ margin: "20px 0" }} hoverable>
          <div style={{ display: "flex" }}>
            <Input
              size="large"
              placeholder="Client KYC ID"
              value={customerKycIdData}
              onChange={(e) => setCustomerKycIdData(e.target.value)}
              style={{ width: "20%" }}
              prefix={<UserOutlined />}
            />
            <Button
              size="large"
              loading={isLoading}
              onClick={handleRequestData}
            >
              Access
            </Button>
          </div>
        </Card>

        <Card
          title="Pending Requests"
          style={{ marginBottom: "20px" }}
          hoverable
        >
          {pendingClientRequests.length > 0
            ? pendingClientRequests.map((req, i) => {
                return (
                  <Card.Grid
                    style={{
                      width: "25%",
                      textAlign: "center",
                      margin: "15px",
                      fontSize: "15px",
                      borderRadius: "9px",
                    }}
                  >
                    {req.name}
                  </Card.Grid>
                );
              })
            : "No pending requests"}
        </Card>

        <Card
          title="Approved Requests"
          style={{ marginBottom: "20px" }}
          hoverable
        >
          {approvedClients.length > 0
            ? approvedClients.map((req, i) => {
                return (
                  <Card.Grid
                    style={{
                      width: "25%",
                      textAlign: "center",
                      margin: "15px",
                      fontSize: "15px",
                      borderRadius: "9px",
                    }}
                    onClick={() =>
                      togglePopup(req, [
                        <Button type="primary" onClick={()=>handelStartvKYC(req.kycId)}>
                          Start vKYC
                        </Button>,
                        <Button
                          type="primary"
                          onClick={handelAddRemarksPopup} 
                        >
                          Proceed without vKYC
                        </Button>,
                        <Button
                          key="back"
                          onClick={() =>
                            setIsPopupOpen((prev) => {
                              return !prev;
                            })
                          }
                        >
                          Cancel
                        </Button>,
                      ])
                    }
                  >
                    {req.name}
                  </Card.Grid>
                );
              })
            : "No approved requests"}
        </Card>
        <Card mt={20}></Card>
      </div>
    </>
  );
};

export default Bank;
