import React from "react";
import { useHistory } from "react-router-dom";
import { Flex, Box, Card, Heading, Form, Button } from "rimble-ui";
import ClientData from "./ClientData";

import { userData, approvedBankList, pendingRequests } from "../utils/userdata";

const Client = () => {
  const history = useHistory();
  const handleClickNewClient = (e) => {
    e.preventDefault();
    history.push("/client/update");
  };

  return (
    <Flex minWidth={380}>
      <Box mx={"auto"} width={[1, 10 / 12]}>
        <Flex px={2} mx={"auto"} justifyContent="space-between">
          <Box my={"auto"}>
            <Heading as={"h1"} color="primary">
              eKYC
            </Heading>
          </Box>
          <Box my={"auto"}>
            <Button mr={2} onClick={handleClickNewClient}>
              Update Details
            </Button>
            <Button>Logout</Button>
          </Box>
        </Flex>
        <Card>
          <Heading as={"h2"}>Client data</Heading>
          <ClientData userData={userData} />
        </Card>
        <Card mt={20}>
          <Box ml={10} my={1}>
            {approvedBankList.length > 0 ? (
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
            {approvedBankList.map((item, i) => {
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
          <Heading as={"h2"}>Pending KYC Requests: </Heading>
          <Form>
            <Flex mx={-3}>
              <Box width={1} px={3}></Box>
            </Flex>
            {pendingRequests.map((data, i) => {
              return (
                <Box bg={"rgba(108, 160, 249, 0.2)"} m={3} borderRadius={1}>
                  <Flex ml={4} mr={3} py={2} justifyContent="space-between">
                    <Heading as={"h3"}>{data.bankName}</Heading>
                    <Box mr={1} my={"auto"}>
                      <Button mx={2}>
                        <p>Give Access</p>
                      </Button>
                      <Button mx={2}>
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
  );
};

export default Client;
