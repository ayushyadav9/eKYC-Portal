import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Flex, Box, Card, Heading, Form, Button, Loader } from "rimble-ui";
import ClientData from "./ClientData";
import { baseURL } from "../../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
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
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
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
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
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
          toast.error("Something went wrong");
          return;
        }
        if (result.success) {
          toast.success(result.message);
          updateBankLists();
        }
        console.log(result);
      });
  };

  console.log(bankList);
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
      <Flex minWidth={380}>
        <Box mx={"auto"} width={[1, 10 / 12]}>
          <Flex px={2} mx={"auto"} justifyContent="space-between">
            <Box my={"auto"}>
              <Heading as={"h1"} color="primary">
                eKYC
              </Heading>
            </Box>
            <Box my={"auto"}>
              <Button mr={2} onClick={() => history.push("/client/update")}>
                Update Details
              </Button>
              <Button>Logout</Button>
            </Box>
          </Flex>
          <Card>
            <Heading as={"h2"}>Client data</Heading>
            {userData ? <ClientData userData={userData} /> : <Loader color="white" />}
          </Card>
          <Card mt={20}>
            <Box ml={10} my={1}>
              {bankList && bankList.approvedBanks.length > 0 ? (
                <Heading as={"h2"} my={"auto"}>
                  Your approved Banks:
                </Heading>
              ) : (
                <Heading as={"h2"} my={"auto"}>
                  You have no approved Banks
                </Heading>
              )}
            </Box>
            <Flex mt={3} direction={"column"}>
              {bankList &&
                bankList.approvedBanks.map((item, i) => {
                  return (
                    <Flex key={i} mx={2}>
                      <Heading
                        bg={"rgba(108, 160, 249, 0.2)"}
                        p={3}
                        borderRadius={1}
                        as={"h3"}
                        my={2}
                      >
                        {item[0]}
                      </Heading>
                    </Flex>
                  );
                })}
            </Flex>
          </Card>
          <Card mt={20}>
            {bankList && bankList.pendingBanks.length > 0 ? (
              <Heading as={"h2"}>Pending KYC Requests:</Heading>
            ) : (
              <Heading as={"h2"}>You have no pending KYC request</Heading>
            )}
            {/* <Heading as={"h2"}>Pending KYC Requests: </Heading> */}
            <Form>
              <Flex mx={-3}>
                <Box width={1} px={3}></Box>
              </Flex>
              {bankList &&
                bankList.pendingBanks.map((data, i) => {
                  return (
                    <Box key={i} bg={"rgba(108, 160, 249, 0.2)"} m={3} borderRadius={1}>
                      <Flex ml={4} mr={3} py={2} justifyContent="space-between">
                        <Heading as={"h3"}>{data[0]}</Heading>
                        <Box mr={1} my={"auto"}>
                          <Button mx={2} onClick={(e) => handleRequest(e, data[1], true)}>
                            <p>Give Access</p>
                          </Button>
                          <Button
                            mx={2}
                            onClick={(e) => handleRequest(e, data[1], false)}
                          >
                            <p>Decline</p>
                          </Button>
                        </Box>
                      </Flex>
                    </Box>
                  );
                })}
            </Form>
          </Card>
          <Card mt={20}></Card>
        </Box>
      </Flex>
    </>
  );
};

export default Client;
