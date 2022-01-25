import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { baseURL } from "../../api";
import { Select, Space, Card, Row, Button, message  } from "antd";
const IPFS = require("ipfs-api");
const ipfs = new IPFS({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

const UpdateRecord = () => {
  const history = useHistory();
  const [buffer, setbuffer] = useState([]);
  const [docType, setDocType] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const { Option } = Select;

  const handleSubmit = (e) => {
    e.preventDefault();
    setisLoading(true)
    ipfs.files.add(buffer, (error, result) => {
      setisLoading(false)
      if (error) {
        console.error(error);
        message.error("Something went wrong!");
        return;
      }
      message.success("Updated Successfuly!");
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
        Authorization: `Bearer ${localStorage.getItem("clientToken")}`,
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((result, err) => {
        if (err) {
          console.log(err);
          message.error("Something went wrong");
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
      <div style={{ margin: "20px" }}>
        <div
          style={{
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
              marginBottom: "20px",
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
                <Button type="primary" size={"large"} loading={isLoading} onClick={handleSubmit}>
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
