import React, { useState } from "react";
import {Flex, Box, Card, Heading, Form, Field, Radio, Button, Image, Loader} from "rimble-ui";
import { baseURL } from "../api";
// import { Button, Form } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useHistory } from "react-router-dom";


const Home = () => {
  const [loginData, setloginData] = useState({
    email: "",
    password: "",
    sender: "",
  });
  const [isLoading, setisLoading] = useState(false);
  const history = useHistory();
  const handelLogin = (e) => {
    e.preventDefault();
    if (loginData.sender === "bank" || loginData.sender === "client") {
      setisLoading(true);
      fetch(`${baseURL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      })
        .then((res) => res.json())
        .then((result, err) => {
          setisLoading(false);
          if (err) {
            console.log(err);
            toast.error("Something went wrong");
            return;
          }
          if (result.success) {
            toast.success(result.message);
            localStorage.setItem(loginData.sender==='client'?"userToken":"bankToken", result.data.token);
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
      <ToastContainer
        theme="dark"
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <Flex height={"100vh"}>
      <Box mx={"auto"} my={"auto"} width={[1, 1 / 2, 1 / 3, 1 / 4]}>

        <Flex px={2} mx={"auto"} justifyContent="space-between">
          <Box my={"auto"}>
            <Heading as={"h1"} color="primary">
              vKYC 
            </Heading>
          </Box>
          <Box my={"auto"}>
            <Button mr={2} onClick={()=>history.push("/client/NewClient")}>
              New KYC customer
            </Button>            
          </Box>
        </Flex>

        <Card>
          <Flex mx={"auto"} justifyContent="center">
            <Image alt="eKYC logo" width={"110px"} src="./customer.png" />
          </Flex>
          <Heading as={"h1"} mt={1} mb={3} textAlign={"center"} color={"primary"}>
            eKYC
          </Heading>
          <Form>
            <Flex mx={-3} flexWrap={"wrap"}>
              <Box width={1} px={3}>
                <Field label="Login" width={1}>
                  <Form.Input type="text" value={loginData.email} onChange={(e)=>{setloginData({...loginData,'email':e.target.value})}} required width={1} />
                </Field>
              </Box>
              <Box width={1} px={3}>
                <Field label="Password" width={1}>
                  <Form.Input type="password" value={loginData.password} onChange={(e)=>{setloginData({...loginData,'password':e.target.value})}} required width={1} />
                </Field>
              </Box>
            </Flex>
            <Flex mx={-3} flexWrap={"wrap"}>
              <Box width={1} px={3}>
                <Field label="Role" onChange={(e)=>{setloginData({...loginData,'sender':e.target.value})}} required>
                  <Radio required label="Client" my={2} checked={loginData.sender==='client'} onChange={e => {}} value={"client"} />
                  <Radio required label="Bank" my={2} checked={loginData.sender==='bank'} onChange={e => {}}  value={"bank"} />
                </Field>
              </Box>
            </Flex>
            <Button onClick = {handelLogin} width={1}>{isLoading ? <Loader color="white" /> :"Submit"}</Button>
          </Form>
        </Card>
      </Box>
    </Flex>
    </>
  );
};

export default Home;
