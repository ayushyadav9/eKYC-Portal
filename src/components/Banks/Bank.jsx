import React from "react";
import { useEffect, useState } from "react";
import { Flex, Box, Card, Heading, Form, Button } from "rimble-ui";
import BankData from "./BankData";
import { approvedClientList, pendingClientRequests } from "../utils/userdata";
import InitialiseWeb3 from "../utils/web3.js";

const Bank = () => {
  const [dmr, setDmr] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [bankDetails, setBankDetails] = useState(null);

  useEffect(() => {
    setup();
  }, []);

  const setup = async () => {
    let [tempDmr, tempAcc] = await InitialiseWeb3();
    // console.log(tempDmr, tempAcc);
    setDmr(tempDmr);
    setAccounts(tempAcc);
    console.log(tempAcc);
    // tempDmr.methods
    //   .getBankById(1)
    //   .call()
    //   .then((res) => {
    //     console.log(res);
    //   });

    // tempDmr.methods
    //   .addBank(
    //     "SBI",
    //     "India",
    //     "hasvcjcbashsjbcx",
    //     "0x3d9ee5A2Fa27ca9414249C05c4fD86104126cff4"
    //   )
    //   .send({ from: "0x3d9ee5A2Fa27ca9414249C05c4fD86104126cff4" })
    //   .then((res) => {
    //     console.log(res);
    //   });
  };

  const getBankDetails = async () => {
    if (dmr && accounts) {
      dmr.methods
        .getBankByAddress(accounts[0])
        .call()
        .then((res) => {
          console.log(res);
          const bankInfo = {
            bName: res.bName,
            bAddress: res.bAddress,
            bWallet: res.addr,
            label: "Bank Details",
          };
          setBankDetails(bankInfo);
        });
    }
  };

  useEffect(() => {
    console.log(dmr, accounts);
    if (dmr && accounts) {
      getBankDetails();
    }
  }, [dmr, accounts]);

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
            <Button>Logout</Button>
          </Box>
        </Flex>
        <Card>
          <Heading as={"h2"}>Bank Data</Heading>
          {bankDetails && <BankData data={[bankDetails]} />}
        </Card>
        <Card mt={20}>
          <Box ml={10} my={1}>
            {approvedClientList.length > 0 ? (
              <Heading as={"h2"} my={"auto"}>
                Your approved clients:
              </Heading>
            ) : (
              <Heading as={"h2"} my={"auto"}>
                You have no approved clients
              </Heading>
            )}
          </Box>
          <Flex mt={3} direction={"column"}>
            {approvedClientList.map((item, i) => {
              return (
                <Flex mx={2}>
                  <Heading
                    bg={"rgba(108, 160, 249, 0.2)"}
                    p={3}
                    borderRadius={1}
                    as={"h3"}
                    my={2}
                  >
                    {item}
                  </Heading>
                </Flex>
              );
            })}
          </Flex>
        </Card>
        <Card mt={20}>
          <Heading as={"h2"}>Get Client data</Heading>
          <Flex mx={5}>
            <Flex mr={3}>
              <Form.Field label="Client KYC ID" width={1}>
                <Form.Input type="text" required />
              </Form.Field>
            </Flex>
            <Button mt={"28px"} type="submit">
              Send Request
            </Button>
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
                    <Button my={"auto"} mr={4}>
                      <p>Cancel Request</p>
                    </Button>
                  </Flex>
                </Box>
              );
            })}
          </Card>
        </Box>
        <Card mt={20}></Card>
      </Box>
    </Flex>
  );
};

export default Bank;
