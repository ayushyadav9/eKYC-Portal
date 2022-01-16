import React from "react";
import { Flex, Box, Card, Heading, Form, Button } from "rimble-ui";
import BankData from "./BankData";
import {
  approvedClientList,
  bankData,
  pendingClientRequests,
} from "../utils/userdata";

const Bank = () => {
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
          <BankData data={bankData} />
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
