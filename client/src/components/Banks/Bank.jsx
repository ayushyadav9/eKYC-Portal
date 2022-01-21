import React from "react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Flex, Box, Card, Heading, Form, Button } from "rimble-ui";
import BankData from "./BankData";
import InitialiseWeb3 from "../utils/web3.js";

const Bank = () => {
  const history = useHistory();
  const [dmr, setDmr] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [bankDetails, setBankDetails] = useState(null);
  const [pendingClientRequests, setPendingClientRequests] = useState([]);
  const [approvedClients, setApprovedClients] = useState([]);
  const [customerKycId, setCustomerKycId] = useState("");

  useEffect(() => {
    setup();
  }, []);

  const setup = async () => {
    let [tempDmr, tempAcc] = await InitialiseWeb3();
    setDmr(tempDmr);
    setAccounts(tempAcc);
  };

  const getBankDetails = async () => {
    console.log(accounts);
    if (dmr && accounts) {
      dmr.methods
        .getBankByAddress(accounts[0])
        .call({ from: accounts[0] })
        .then((res) => {
          console.log(res);
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
          console.log(res);
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
    if (dmr && accounts) {
      dmr.methods
        .addRequest(customerKycId)
        .send({ from: accounts[0] })
        .then((res) => {
          console.log("Added succesfully!");
          console.log(res);
          getBankData();
          setCustomerKycId("");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleCancelRequest = (kycId) => {
    if (dmr && accounts) {
      dmr.methods
        .removeRequest(kycId)
        .send({ from: accounts[0] })
        .then((res) => {
          console.log("Removed succesfully!");
          console.log(res);
          getBankData();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const kycVerdictHandler = (kycId, verdict) => {
    if (dmr && accounts) {
      if (verdict) {
        console.log(kycId, verdict, bankDetails.bName, Date.now());
        dmr.methods
          .approveKyc(kycId, bankDetails.bName, "OK", Date.now())
          .send({ from: accounts[0] })
          .then((res) => {
            console.log(res);
            getBankData();
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        dmr.methods
          .rejectKyc(kycId, bankDetails.name, "REJECT", Date.now())
          .send({ from: accounts[0] })
          .then((res) => {
            console.log(res);
            getBankData();
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  };

  return (
    <Flex minWidth={380}>
      <Box mx={"auto"} width={[1, 11 / 12, 10 / 12]}>
        <Flex px={2} mx={"auto"} justifyContent="space-between">
          <Box my={"auto"}>
            <Heading as={"h1"} color="primary">
              eKYC
            </Heading>
          </Box>
          <Box my={"auto"}>
            <Button mr={2} onClick={() => history.push("/bank/update")}>
              Add New Customer
            </Button>
            <Button>Logout</Button>
          </Box>
        </Flex>
        <Card>
          <Heading as={"h2"}>Bank Data</Heading>
          {bankDetails && <BankData data={[bankDetails]} />}
        </Card>
        <Card mt={20}>
          <Heading as={"h2"}>Get Client data</Heading>
          <Flex mx={5}>
            <Flex mr={3}>
              <Form.Field label="Client KYC ID" width={1}>
                <Form.Input
                  type="text"
                  required
                  value={customerKycId}
                  onChange={(e) => setCustomerKycId(e.target.value)}
                />
              </Form.Field>
              <Button mt={"28px"} type="submit" onClick={handleSendRequest}>
                Send Request
              </Button>
            </Flex>
          </Flex>
        </Card>

        <Box mx={"auto"} mt={20}>
          <Card>
            <Heading as={"h2"}>Pending Requests</Heading>
            {pendingClientRequests.map((req, i) => {
              return (
                <Box bg={"rgba(108, 160, 249, 0.2)"} m={3} borderRadius={1}>
                  <Flex justifyContent="space-between">
                    <Heading as={"h3"} p={2} pl={4}>
                      {req.name}
                    </Heading>
                    <Button
                      my={"auto"}
                      mr={4}
                      onClick={() => handleCancelRequest(req.kycId)}
                    >
                      <p>Cancel Request</p>
                    </Button>
                  </Flex>
                </Box>
              );
            })}
          </Card>
        </Box>

        <Box mx={"auto"} mt={20}>
          <Card>
            <Heading as={"h2"}>Approved Requests</Heading>
            {approvedClients.length > 0 ? (
              approvedClients.map((req, i) => {
                return (
                  <Box bg={"rgba(108, 160, 249, 0.2)"} m={3} borderRadius={1}>
                    <Flex justifyContent="space-between">
                      <Heading as={"h3"} p={2} pl={4}>
                        {req.name}
                      </Heading>
                      <Flex>
                        <Button
                          my={"auto"}
                          mr={4}
                          onClick={() => kycVerdictHandler(req.kycId, true)}
                        >
                          <p>Approve</p>
                        </Button>
                        <Button
                          my={"auto"}
                          mr={4}
                          onClick={() => kycVerdictHandler(req.kycId, false)}
                        >
                          <p>Reject</p>
                        </Button>
                      </Flex>
                    </Flex>
                  </Box>
                );
              })
            ) : (
              <Heading as={"h3"} p={2} pl={4}>
                No approval requests
              </Heading>
            )}
          </Card>
        </Box>
        <Card mt={20}></Card>
      </Box>
    </Flex>
  );
};

export default Bank;
