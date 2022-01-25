import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import ClientData from "./ClientData";
import { baseURL } from "../../api";
import { Card, Button, Row, message } from "antd";

const Client = () => {
  const history = useHistory();
  const [userData, setUserData] = useState(null);
  const [bankList, setBankList] = useState(null);

  useEffect(() => {
    updateUserData();
    updateBankLists();
  }, []);

  const updateUserData = () => {
    fetch(`${baseURL}/getClientData`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("clientToken")}`,
      },
    })
      .then((res) => res.json())
      .then((result, err) => {
        if (err) {
          console.log(err);
          message.error("Something went wrong");
          return;
        }
        if (result.success) {
          message.success(result.message);
          setUserData(result.data);
        }
        console.log(result);
      });
  };

  const updateBankLists = () => {
    fetch(`${baseURL}/getBankList`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("clientToken")}`,
      },
    })
      .then((res) => res.json())
      .then((result, err) => {
        if (err) {
          console.log(err);
          message.error("Something went wrong");
          return;
        }
        if (result.success) {
          setBankList(result.data);
        }
        console.log(result);
      });
  };

  const handleRequest = (e, _bankAddress, verdict) => {
    e.preventDefault();

    fetch(`${baseURL}/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("clientToken")}`,
      },
      body: JSON.stringify({
        bAddress: _bankAddress,
        response: verdict,
      }),
    })
      .then((res) => res.json())
      .then((result, err) => {
        if (err) {
          console.log(err);
          message.error("Something went wrong");
          return;
        }
        if (result.success) {
          updateBankLists();
          message.success("Response sent successfuly")
        }
        console.log(result);
      });
  };

  const handelLogout = ()=>{
    localStorage.removeItem('clientToken')
    history.push('/')
  }

  return (
    <>
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
            margin: "20px",
          }}
        >
          <div style={{ margin: "auto 0" }}>
            <h1 style={{ color: "rgb(14 21 246 / 85%)",fontWeight:"700"}}>vKYC</h1>
          </div>
          <div style={{ margin: "auto 0" }}>
            <Button
              type="primary"
              ghost
              onClick={() => history.push("/client/UpdateRecord")}
            >
              Update Details
            </Button>
            <Button></Button>
            <Button
              type="primary"
              ghost
              onClick={() => history.push("/client/video")}
            >
              Start Video KYC
            </Button>
            <Button></Button>
            <Button onClick={handelLogout} danger ghost>Logout</Button>
          </div>
        </div>

        <Card title="Client Data"  hoverable>
          {userData ? <ClientData userData={userData} /> : "No Data Found"}
        </Card>

        <Card
          title="Your approved Banks"
          style={{ margin: "20px 0" }}
          hoverable
        >
          {bankList && bankList.approvedBanks.length > 0
            ? bankList.approvedBanks.map((item, i) => {
                return (
                  <Card.Grid
                    style={{
                      width: "25%",
                      textAlign: "center",
                      margin: "15px",
                      fontSize: "15px",
                      borderRadius:"9px"
                    }}
                  >
                    {item[0]}
                  </Card.Grid>
                );
              })
            : "You have no approved Banks"}
        </Card>

        <Card
          title="Pending KYC Requests:"
          style={{ marginBottom: "20px" }}
          hoverable
        >
          {bankList && bankList.pendingBanks.length > 0
            ? bankList.pendingBanks.map((data, i) => {
                return (
                  <Card.Grid
                    style={{
                      width: "25%",
                      textAlign: "center",
                      margin: "15px",
                      fontSize: "15px",
                      borderRadius:"9px"
                    }}
                  >
                    {data[0]}
                    <Row style={{marginTop:"10px", display: "flex",justifyContent: "space-around"}}>
                      <Button
                      type="primary"
                        mx={2}
                        onClick={(e) => handleRequest(e, data[1], true)}
                      >
                        <p>Accept</p>
                      </Button>
                      <Button
                        mx={2}
                        onClick={(e) => handleRequest(e, data[1], false)}
                        danger
                      >
                        <p>Decline</p>
                      </Button>
                    </Row>
                  </Card.Grid>
                );
              })
            : "You have no pending KYC request"}
        </Card>

        <Card mt={20}></Card>
      </div>
    </>
  );
};

export default Client;
