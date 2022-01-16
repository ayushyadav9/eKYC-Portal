import React from "react";
import {
  Flex,
  Box,
  Card,
  Heading,
  Form,
  Field,
  Radio,
  Button,
  Image,
} from "rimble-ui";

const Home = () => {
  return (
    <Flex height={"100vh"}>
      <Box mx={"auto"} my={"auto"} width={[1, 1 / 2, 1 / 3, 1 / 4]}>
        <Card>
          <Flex mx={"auto"} justifyContent="center">
            <Image alt="eKYC logo" width={"110px"} src="./customer.png" />
          </Flex>
          <Heading
            as={"h1"}
            mt={1}
            mb={3}
            textAlign={"center"}
            color={"primary"}
          >
            eKYC
          </Heading>
          <Form>
            <Flex mx={-3} flexWrap={"wrap"}>
              <Box width={1} px={3}>
                <Field label="Login" width={1}>
                  <Form.Input type="text" required width={1} />
                </Field>
              </Box>
              <Box width={1} px={3}>
                <Field label="Password" width={1}>
                  <Form.Input type="password" required width={1} />
                </Field>
              </Box>
            </Flex>
            <Flex mx={-3} flexWrap={"wrap"}>
              <Box width={1} px={3}>
                <Field label="Role" optional={false}>
                  <Radio required label="Client" my={2} value={"client"} />
                  <Radio required label="Bank" my={2} value={"bank"} />
                </Field>
              </Box>
            </Flex>
            <Button width={1}>Submit</Button>
          </Form>
        </Card>
      </Box>
    </Flex>
  );
};

export default Home;
