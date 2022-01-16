import React from "react";
import { useHistory } from "react-router-dom";
import { Flex, Box, Card, Heading, Form, Field, Button } from "rimble-ui";

const UpdateData = () => {
  const history = useHistory();

  return (
    <Flex height={"100vh"}>
      <Box mx={"auto"} my={"auto"} width={[1, 9 / 12, 7 / 12]}>
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
        <Form>
          <Card mb={20}>
            <Flex mx={-3} flexWrap={"wrap"}>
              <Box width={1} px={3}>
                <Field label="Name" width={1}>
                  <Form.Input type="text" required width={1} />
                </Field>
              </Box>
              <Box width={1} px={3}>
                <Field label="Address" width={1}>
                  <Form.Input type="text" required width={1} />
                </Field>
              </Box>
              <Box width={1} px={3}>
                <Field label="Date of Birth" width={1}>
                  <Form.Input type="date" required width={1} />
                </Field>
              </Box>
              <Box width={1} px={3}>
                <Field label="ID Number" width={1}>
                  <Form.Input type="text" required width={1} />
                </Field>
              </Box>
            </Flex>
          </Card>
        </Form>
        <Flex mx={-3} alignItems={"center"}>
          <Box px={3}>
            <Button type="submit" mt={2}>
              <p>Update</p>
            </Button>
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
};

export default UpdateData;
