import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import {
  Button,
  Form,
  Input,
  DatePicker,
  Select,
  Row,
  Card,
  Space,
  Modal,
  message,
} from "antd";
import { UploadOutlined, CameraTwoTone } from "@ant-design/icons";
import { baseURL } from "../../api";
import Webcam from "react-webcam";

const IPFS = require("ipfs-api");
const ipfs = new IPFS({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

const NewClient = () => {
  const history = useHistory();
  const [isLoading, setisLoading] = useState(false);
  const [buffer, setbuffer] = useState([0, 1, 2]);
  const [geo, setGeo] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const webcamRef = useRef(null);

  const [formData, setformData] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    dob: "",
    gender: "",
    PANno: "",
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setGeo(position.coords.latitude + "," + position.coords.longitude);
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setisLoading(true);
    ipfs.files.add(buffer, (error, result) => {
      setisLoading(false);
      if (error) {
        console.error(error);
        message.error("Something went wrong!");
        return;
      }
      console.log(result);
      addCustomer(result[0].hash, result[1].hash, result[2].hash);
    });
  };

  const addCustomer = async (panIPFS, aadharIPFS, selfieIPFS) => {
    let data = { ...formData, panIPFS, aadharIPFS, selfieIPFS, geo };
    fetch(`${baseURL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        formData: data,
        sender: "client",
      }),
    })
      .then((res) => res.json())
      .then((result, err) => {
        setisLoading(false);
        if (err) {
          console.log(err);
          message.error("Something went wrong");
          return;
        }
        if (result.success) {
          return message.success("Added Successfuly!");
        }
        message.info(result.message);
      })
      .catch((err) => {
        message.error("Something went wrong!");
        console.log(err);
      });
  };

  const captureFile = (e, i) => {
    const file = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      let buf = buffer;
      console.log(e, i);
      buf[i] = Buffer(reader.result);
      setbuffer(buf);
    };
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    capture();
    message.success("Selfie clicked!!");
    setIsModalVisible(false);
  };

  function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    var file = dataURLtoFile(imageSrc, "selfie.png");
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      let buf = buffer;
      buf[2] = Buffer(reader.result);
      setbuffer(buf);
    };
     // eslint-disable-next-line 
  }, [webcamRef]);

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Modal
        title="Basic Modal"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Card>
          <Webcam style={{ width: "100%" }} ref={webcamRef} />
        </Card>
      </Modal>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          margin: "0 auto",
          width: "80%",
          textAlign: "center",
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
            <h1 style={{ color: "rgb(14 21 246 / 85%)" }}>vKYC</h1>
          </div>
          <div style={{ margin: "auto 0" }}>
            <Button
              type="primary"
              onClick={() => {
                history.goBack();
              }}
            >
              Back
            </Button>
          </div>
        </div>
        <Card style={{ width: "50%", margin: "0 auto" }} hoverable>
          <Form layout="horizontal" style={{ margin: "10px" }} size={"large"}>
            <Form.Item label="Full Name">
              <Input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setformData({ ...formData, name: e.target.value })
                }
                required
              />
            </Form.Item>
            <Form.Item label="Email Id">
              <Input
                type="email Id"
                value={formData.email}
                onChange={(e) =>
                  setformData({ ...formData, email: e.target.value })
                }
                required
              />
            </Form.Item>
            <Form.Item label="Address">
              <Input
                type="text"
                value={formData.address}
                onChange={(e) =>
                  setformData({ ...formData, address: e.target.value })
                }
                required
              />
            </Form.Item>

            <Form.Item label="Phone No">
              <Input
                type="text"
                value={formData.phone}
                onChange={(e) =>
                  setformData({ ...formData, phone: e.target.value })
                }
                required
              />
            </Form.Item>
            <Space>
              <Form.Item
                label="DOB"
                style={{
                  display: "inline-block",
                }}
              >
                <DatePicker
                  style={{ width: 120 }}
                  onChange={(date, dateString) => {
                    setformData({ ...formData, dob: dateString });
                  }}
                />
              </Form.Item>
              <Form.Item
                label="Gender"
                style={{
                  display: "inline-block",
                }}
              >
                <Select
                  size={"large"}
                  style={{ width: 120 }}
                  defaultValue="Select"
                  onChange={(e) => setformData({ ...formData, gender: e })}
                >
                  <Select.Option value="Male">Male</Select.Option>
                  <Select.Option value="Female">Female</Select.Option>
                  <Select.Option value="Other">Other</Select.Option>
                </Select>
              </Form.Item>
            </Space>
            <Row>
              <Form.Item label="PAN Number" style={{ width: "45%" }}>
                <Input
                  type="text"
                  value={formData.PANno}
                  onChange={(e) =>
                    setformData({ ...formData, PANno: e.target.value })
                  }
                  required
                />
              </Form.Item>

              <Form.Item
                label="PAN Card"
                style={{ width: "50%", marginLeft: "30px" }}
              >
                <Input
                  type="file"
                  suffix={<UploadOutlined />}
                  required
                  onChange={(e) => captureFile(e, 0)}
                />
              </Form.Item>
            </Row>
            <Row>
              <Form.Item label="Aadhar Card" style={{ width: "45%" }}>
                <Input
                  type="file"
                  suffix={<UploadOutlined />}
                  required
                  onChange={(e) => captureFile(e, 1)}
                />
              </Form.Item>
              <Button
                size="large"
                label="Selfie Photo"
                style={{ width: "31%", marginLeft: "80px" }}
                onClick={showModal}
              >
                <CameraTwoTone />
                Click a Selfie
              </Button>
            </Row>

            <Button
              size="large"
              type="submit"
              onClick={handleSubmit}
              loading={isLoading}
            >
              Register
            </Button>
          </Form>
        </Card>
      </div>
    </>
  );
};

export default NewClient;
