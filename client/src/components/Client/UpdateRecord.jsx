import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import InitialiseWeb3 from "../utils/web3.js";
import { baseURL } from "../../api";
import { ToastContainer, toast } from "react-toastify";
import { Form, Button } from "antd";
import { Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { DownOutlined } from "@ant-design/icons";
import { Card, Col, Row } from "antd";
import { Select, Space } from "antd";

const IPFS = require("ipfs-api");
const ipfs = new IPFS({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

const UpdateRecord = () => {
  const history = useHistory();
  //const [isLoading, setisLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [buffer, setbuffer] = useState([]);
  const [docType, setDocType] = useState("");
  const { Option } = Select;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("OPGG");
    ipfs.files.add(buffer, (error, result) => {
      if (error) {
        console.error(error);
        setMessage("Something went wrong!");
        return;
      }
      setMessage("Updated Successfuly!");
      console.log(result);
      updateRecord(docType, result[0].hash);
    });
  };

  const handleChange = (e) => {
    console.log(e);
    setDocType(e);
  };

  const updateRecord = async (record_type, record_data) => {
    let data = { record_type, record_data };
    console.log(data);

    fetch(`${baseURL}/updateRecord`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((result, err) => {
        if (err) {
          console.log(err);
          toast.error("Something went wrong");
          return;
        }
      });
  };

  const captureFile = (e) => {
    console.log(e);
    const file = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      let buf = buffer;
      console.log(e);
      buf[0] = Buffer(reader.result);
      setbuffer(buf);
    };
  };

  return (
    <>
      <div style={{ paddingTop: "240px" }}>
        <div
          style={{
            background: "#ECECEC",
            padding: "30px",
            width: "800px",
            margin: "0 auto",
            paddingBottom: "60px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              marginBottom: "10px",
            }}
          >
            <Button
              type="primary"
              size={"large"}
              onClick={() => {
                history.goBack();
              }}
            >
              Back
            </Button>
          </div>

          <Card title="Update Document" bordered={true}>
            <Row justify="center">
              <Space>
                <Select
                  size={"large"}
                  defaultValue="Select"
                  style={{ width: 120 }}
                  onChange={handleChange}
                >
                  <Option value="aadhar">Aadhar</Option>
                  <Option value="pan">Pan</Option>
                </Select>
                <input onChange={captureFile} type="file" />{" "}
                <Button type="primary" size={"large"} onClick={handleSubmit}>
                  Submit
                </Button>
              </Space>
            </Row>
          </Card>
        </div>
      </div>
    </>
  );
};

export default UpdateRecord;
