import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Flex, Box, Card, Heading, Form, Field, Button, Loader, Text } from "rimble-ui";
import InitialiseWeb3 from "../utils/web3.js";
import { baseURL } from "../../api";
import { ToastContainer, toast } from "react-toastify";
const IPFS = require("ipfs-api");
const ipfs = new IPFS({ host: "ipfs.infura.io", port: 5001, protocol: "https" });

const UpdateRecord = () => {

  const history = useHistory();
  const [isLoading, setisLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [buffer, setbuffer] = useState([]);

  
  const handelSubmit = (e,record_type) => {
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
      console.log(result)
      updateRecord(record_type,result[0].hash);
    });
  };

  const updateRecord = async (record_type,record_data) => {
      
      let data = {record_type,record_data};
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
        setisLoading(false);
        if (err) {
          console.log(err);
          toast.error("Something went wrong");
          return;
        }
      });
    
  };

  const captureFile = (e) => {
    const file = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      let buf = buffer
      console.log(e)
      buf[0] = Buffer(reader.result)
      setbuffer(buf);
    };
  };

  return (
    <Flex height={"100vh"}>
      <Box mx={"auto"} my={"auto"} width={[1, 9 / 15, 7 / 15]}>
        <Flex px={2} mx={"auto"} justifyContent="space-between">
          <Box my={"auto"}>
            <Heading as={"h2"} color={"primary"}>
              Update Details
            </Heading>
          </Box>
          <Box my={"auto"}>
            <Button
              onClick={() => {
                history.goBack();
              }}
            >
              Back
            </Button>
          </Box>
        </Flex>
        <Form id="update" onSubmit={(e)=>handelSubmit(e,"aadhar")}>
          <Card mb={20}>
              <Flex px={1} mx={"100px"}>
                <Box width={1} px={3}>
                  <Field label="Aadhar Card" width={1}>
                    <Form.Input type="file" required width={1} onChange={captureFile} />
                  </Field>
                </Box>
              </Flex>
          </Card>
          <Flex mx={-3} alignItems={"center"}>
            <Box px={3}>
              <Button type="submit" mt={2} minWidth={"150px"}>
                {isLoading ? <Loader color="white" /> : <p>Update</p>}
              </Button>
            </Box>
            {message && (
              <Box px={3}>
                <Text fontSize={"18px"}>{message}</Text>
              </Box>
            )}
          </Flex>
        </Form>
        <Card mt={20} mb={1}>
          © 2021-2022 Yadav Coin. All Rights Reserved.
        </Card>
      </Box>
    </Flex>
  );
};

export default UpdateRecord;
