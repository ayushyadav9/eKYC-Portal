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
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [clientData, setClientData] = useState(null);
  const [isLoading, setisLoading] = useState(false);

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
    setisLoading(true)
    if (dmr && accounts) {
      dmr.methods
        .addRequest(customerKycId)
        .send({ from: accounts[0] })
        .then((res) => {
          setisLoading(false)
          message.success("Request sent!")
          getBankData();
          setCustomerKycId("");
        })
        .catch((err) => {
          setisLoading(false)
          message.error("Something went wrong!")
          console.log(err);
        });
    }
  };

  // const handleCancelRequest = (kycId) => {
  //   if (dmr && accounts) {
  //     dmr.methods
  //       .removeRequest(kycId)
  //       .send({ from: accounts[0] })
  //       .then((res) => {
  //         console.log("Removed succesfully!");
  //         getBankData();
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   }
  // };

  const handelLogout = () => {
    localStorage.removeItem("bankToken");
    history.push("/");
  };

  const togglePopup = (data) => {
    setClientData(data);
    setIsPopupOpen((prev) => {
      return !prev;
    });
  };

  const handelStartvKYC = () => {
    if (clientData) {
      fetch(`${baseURL}/getSocket`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ kycId: clientData.kycId }),
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
    }
  };
  const handelApproveWithoutvKYC = (verdict) => {
    if (dmr && accounts && clientData) {
      if (verdict) {
        dmr.methods
          .approveKyc(clientData.kycId, bankDetails.bName, "OK", Date.now())
          .send({ from: accounts[0] })
          .then((res) => {
            getBankData();
            togglePopup();
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        dmr.methods
          .rejectKyc(clientData.kycId, bankDetails.bName, "REJECT", Date.now())
          .send({ from: accounts[0] })
          .then((res) => {
            getBankData();
            togglePopup();
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
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
        footer={[
          <Button type="primary" onClick={handelStartvKYC}>
            Start vKYC
          </Button>,
          <Button type="primary" onClick={() => handelApproveWithoutvKYC(true)}>
            Approve without vKYC
          </Button>,
          <Button
            type="primary"
            onClick={() => handelApproveWithoutvKYC(false)}
          >
            Reject without vKYC
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
        ]}
      >
        <VerifyClient dmr={dmr} accounts={accounts} data={clientData} />
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
            <h1 style={{ color: "rgb(14 21 246 / 85%)" ,fontWeight:"700"}}>vKYC</h1>
          </div>
          <div style={{ margin: "auto 0" }}>
            <Button
              type="primary"
              ghost
            >
              Hello Bank!
            </Button>
            <Button></Button>
            <Button danger ghost onClick={handelLogout}>Logout</Button>
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
            <Button size="large" loading={isLoading} onClick={handleSendRequest}>
              Send Request
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
                    onClick={() => togglePopup(req)}
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
