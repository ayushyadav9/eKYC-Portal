import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Button, Form, Input, DatePicker, Select } from "antd";
import { baseURL } from "../../api";
import { ToastContainer, toast } from "react-toastify";
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
  const [message, setMessage] = useState(null);
  const [geo, setGeo] = useState("");

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
        setMessage("Something went wrong!");
        return;
      }
      setMessage("Updated Successfuly!");
      console.log(result);
      addCustomer(result[0].hash, result[1].hash, result[2].hash);
    });
  };

  const addCustomer = async (panIPFS, aadharIPFS, selfieIPFS) => {
    let data = { ...formData, panIPFS, aadharIPFS, selfieIPFS, geo };
    console.log(data);

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
          toast.error("Something went wrong");
          return;
        }
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

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        margin: "0 auto",
        width: "80%",
        justifyContent: "center",
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
          <Button></Button>
          <Button type="primary">Back</Button>
        </div>
      </div>
      <Form
        layout="vertical"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        size={"large"}
        width={100}
      >
        <Form.Item label="Name">
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => setformData({ ...formData, name: e.target.value })}
            required
          />
        </Form.Item>
        <Form.Item label="Email">
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setformData({ ...formData, email: e.target.value })}
            required
          />
        </Form.Item>
        <Form.Item label="Address">
          <Input
            type="text"
            value={formData.address}
            onChange={(e) => setformData({ ...formData, address: e.target.value })}
            required
          />
        </Form.Item>
        <Form.Item label="Phone">
          <Input
            type="text"
            value={formData.phone}
            onChange={(e) => setformData({ ...formData, phone: e.target.value })}
            required
          />
        </Form.Item>
        <Form.Item label="DOB">
          <DatePicker
            value={formData.dob}
            onChange={(date, dateString) => {
              setformData({ ...formData, dob: dateString });
            }}
          />
        </Form.Item>
        <Form.Item label="Gender">
          <Select>
            <Select.Option value="m">Male</Select.Option>
            <Select.Option value="f">Female</Select.Option>
            <Select.Option value="o">Others</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="PAN Number">
          <Input
            type="text"
            value={formData.PANno}
            onChange={(e) => setformData({ ...formData, PANno: e.target.value })}
            required
          />
        </Form.Item>

        <Form.Item label="PAN Card">
          <Input type="file" required width={1} onChange={(e) => captureFile(e, 0)} />
        </Form.Item>
        <Form.Item label="Aadhar Card">
          <Input type="file" required width={1} onChange={(e) => captureFile(e, 1)} />
        </Form.Item>
        <Form.Item label="Selfie">
          <Input type="file" required width={1} onChange={(e) => captureFile(e, 2)} />
        </Form.Item>
        <Button type="submit" onClick={handleSubmit}>
          Register
        </Button>
      </Form>
    </div>
  );
};

export default NewClient;
