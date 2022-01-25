import React, { useState } from "react";
import { baseURL } from "../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useHistory } from "react-router-dom";
import { Card, Button, Input, Radio, Space } from "antd";
import { UserOutlined } from "@ant-design/icons";

const Home = () => {
  const [loginData, setloginData] = useState({ email: "", password: "", sender: "" });
  const history = useHistory();

  const handelLogin = (e) => {
    e.preventDefault();
    if (loginData.sender === "bank" || loginData.sender === "client") {
      fetch(`${baseURL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      })
        .then((res) => res.json())
        .then((result, err) => {
          if (err) {
            console.log(err);
            toast.error("Something went wrong");
            return;
          }
          if (result.success) {
            toast.success(result.message);
            localStorage.setItem("userToken", result.data.token);
            history.push(`/${loginData.sender}`);
          } else {
            toast.info(result.message);
          }
          console.log(result);
        });
    } else {
      toast.info("Please select yout role!");
    }
  };

  return (
    <>
      <div style={{ background: "#d4d4d4eb" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            margin: "0 auto",
            width: "25%",
          }}
        >
          <div
            style={{ display: "flex", justifyContent: "space-around", margin: "25px" }}
          >
            <div style={{ margin: "auto 0" }}>
              <h1 style={{ color: "rgb(14 21 246 / 85%)" }}>vKYC</h1>
            </div>
            <div style={{ margin: "auto 0" }}>
              <Button mr={2} onClick={() => history.push("/client/NewClient")}>
                New KYC customer
              </Button>
            </div>
          </div>

          <div>
            <Card title="Client Login" bordered={true}>
              <Card style={{ display: "flex", justifyContent: "center" }}>
                <img alt="eKYC logo" width={"110px"} src="./customer.png" />
              </Card>

              <Card>
                <Input
                  size="large"
                  placeholder="Login"
                  value={loginData.email}
                  onChange={(e) => {
                    setloginData({ ...loginData, email: e.target.value });
                  }}
                  prefix={<UserOutlined />}
                  required
                />
              </Card>

              <Card>
                <Input
                  size="large"
                  placeholder="Password"
                  value={loginData.password}
                  onChange={(e) => {
                    setloginData({ ...loginData, password: e.target.value });
                  }}
                  prefix={<UserOutlined />}
                  required
                />
              </Card>

              <Card>
                <Radio.Group
                  onChange={(e) => {
                    setloginData({ ...loginData, sender: e.target.value });
                  }}
                  required
                >
                  <Space direction="vertical">
                    <Radio value={"client"}>Client</Radio>
                    <Radio value={"bank"}>Bank</Radio>
                  </Space>
                </Radio.Group>
              </Card>

              <Card style={{ display: "flex", justifyContent: "center" }}>
                <Button onClick={handelLogin} width={1}>
                  Login
                </Button>
              </Card>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
