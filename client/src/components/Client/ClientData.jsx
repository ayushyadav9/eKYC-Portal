import React from "react";
import { Flex, Box, Heading, Text, Image } from "rimble-ui";

const ClientData = ({ userData }) => {
  return (
    <Box bg={"rgba(108, 160, 249, 0.2)"} p={3} borderRadius={1}>
      <Flex my={1}>
        <Box width={[1, 1 / 2, 1 / 3, 1 / 6]}>
          <Heading as={"h4"} my={"auto"}>
            User Details
          </Heading>
        </Box>
        <Box width={1}>
          
          <Flex>
            <Box width={"400px"}>
              <Image
                alt="Selfie img"                
                src={`https://ipfs.io/ipfs/${userData.records[2][1]}`}
              />
            </Box>
            <Box mx={"100px"}>
              <Text>
                <strong>Name: </strong> {userData.name}
              </Text>
              <Text>
                <strong>Gender: </strong> {userData.gender}
              </Text>
              <Text>
                <strong>Phone: </strong> {userData.phone}
              </Text>
              <Text>
                <strong>Address: </strong> {userData.address}
              </Text>
              <Text>
                <strong>Email: </strong> {userData.email}
              </Text>
              <Text>
                <strong>KYC-Id: </strong> {userData.kycId}
              </Text>
              <Text>
                <strong>KYC Status: </strong>{" "}
                {userData.kycStatus ? "Approved" : "Not Approved"}
              </Text>
            </Box>  
          </Flex>
          
          <Flex>
            <Box>
              <Text>
                <strong>Aadhar Card: </strong>
              </Text>
              <Image
                alt="aadhar img"
                width={0.5}
                src={`https://ipfs.io/ipfs/${userData.records[0][1]}`}
              />
            </Box>
            <Box>
              <Text>
                <strong>PAN Card: </strong>
              </Text>
              <Image
                alt="pan img"
                width={0.5}
                src={`https://ipfs.io/ipfs/${userData.records[1][1]}`}
              />
            </Box>
          </Flex>

        </Box>
      </Flex>
    </Box>
  );
};

export default ClientData;