import React from "react";
import { Flex, Box, Heading, Text } from "rimble-ui";

const BankData = ({ data }) => {
  return (
    <Box bg={"rgba(108, 160, 249, 0.2)"} p={3} borderRadius={1}>
      {data.map((item, key) => (
        <Flex my={1} key={key}>
          <Box width={[1, 1 / 2, 1 / 3, 1 / 6]}>
            <Heading as={"h4"} my={"auto"}>
              {item.label}
            </Heading>
          </Box>
          <Box width={1}>
            <Text>Name: {item.bName}</Text>
            <Text>Address: {item.bAddress}</Text>
            <Text>Etherium Address: {item.bWallet}</Text>
          </Box>
        </Flex>
      ))}
    </Box>
  );
};

export default BankData;
