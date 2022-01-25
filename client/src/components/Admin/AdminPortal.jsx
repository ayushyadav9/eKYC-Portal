import React from "react";
import { useEffect, useState } from "react";
import { Button, Input, Card, Modal, message, Form } from "antd";
import InitialiseWeb3 from "../utils/web3.js";
import { BankOutlined } from "@ant-design/icons";
import { baseURL } from "../../api.js";
const { Meta } = Card;

const AdminPortal = () => {
  const [dmr, setDmr] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [bankDetails, setBankDetails] = useState(null);
  const [bankWallet, setBankWallet] = useState("");
  const [isModal, setisModal] = useState(false);
  const [isLoading, setisLoading] = useState(false);

  useEffect(() => {
    setup();
  }, []);

  const setup = async () => {
    let [tempDmr, tempAcc] = await InitialiseWeb3();
    console.log(tempDmr, tempAcc);
    setDmr(tempDmr);
    setAccounts(tempAcc);
    console.log(tempAcc);
  };

  const handelSubmit = (e) => {
    e.preventDefault();
    getBankDetails();
  };

  const getBankDetails = async () => {
    setisModal(true);
    if (dmr && accounts) {
      try {
        await dmr.methods
          .getBankByAddress(bankWallet)
          .call({ from: accounts[0] })
          .then((res) => {
            const bankInfo = {
              bName: res.bName,
              bAddress: res.bAddress,
              bWallet: res.addr,
              label: "Bank Details",
            };
            console.log(bankInfo);
            setBankDetails(bankInfo);
            setisModal(true);
          });
      } catch (e) {
        console.log(e);
      }
    }
  };
  const handelPopup = () => {
    setisModal((prev) => !prev);
  };

  const handelAddBank = (values)=>{
    console.log(values)
    setisLoading(true);
      dmr.methods
        .addBank(values.bName, values.bAddress, values.bContact, values.bWallet)
        .send({ from: accounts[0] })
        .then((res) => {
          console.log(res);
          fetch(`${baseURL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: values.bEmail,
              sender: "bank",
              ethAddress: values.bWallet,
            }),
          })
            .then((res) => res.json())
            .then((result, err) => {
              setisLoading(false);
              if (err) {
                console.log(err);
                message.error('Something Went wrong')
                return;
              }
              if (result.success) {
                message.success("Account Added Successfully");
              } else {
                console.log(result);
                message.info(result.message);
              }
            });
        })
        .catch((err) => {
          message.error("Something Went wrong");
          setisLoading(false);
          console.log(err);
        });
    }
    const handelFailed=(errorInfo)=>{
      console.log('Failed:', errorInfo);
    }


  return (
    <>
      <Modal
        title="Bank Details"
        visible={isModal}
        onOk={handelPopup}
        onCancel={handelPopup}
      >
        <Card hoverable>
          {bankDetails && (
            <Meta
              avatar={<BankOutlined />}
              title={bankDetails.bName}
              description={`Bank Address: ${bankDetails.bAddress}`}
            />
          )}
        </Card>
      </Modal>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          margin: "0 auto",
          width: "80%",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            margin: "25px",
          }}
        >
          <div style={{ margin: "auto 0" }}>
            <h1 style={{ color: "rgb(14 21 246 / 85%)" ,fontWeight:"700"}}>Blockchain Admin</h1>
          </div>
          <div style={{ margin: "auto 0" }}>
            <Button
              type="primary"
              ghost
            >
              Hello Admin!
            </Button>
            <Button></Button>
            <Button danger ghost>Logout</Button>
          </div>
        </div>
        <Card title="Get Bank data" style={{ marginBottom: "20px" }} hoverable>
          <div style={{ display: "flex" }}>
            <Input
              size="large"
              placeholder="Bank Wallet Address"
              value={bankWallet}
              onChange={(e) => setBankWallet(e.target.value)}
              style={{ width: "35%" }}
              prefix={<BankOutlined />}
            />
            <Button size="large" onClick={handelSubmit}>
              Submit
            </Button>
          </div>
        </Card>
        <Card
          title="Register a new Bank"
          style={{ marginBottom: "20px" }}
          hoverable
        >
          <div style={{ display: "flex",justifyContent:"center" }}>
            <Form
              name="basic"
              size={"large"}
              initialValues={{ remember: true }}
              autoComplete="off"
              onFinish={handelAddBank}
              onFinishFailed={handelFailed}
            >
              <Form.Item
                label="Bank Name"
                name="bName"
                rules={[{ required: true, message: "Please input Bank Name!" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Bank Email"
                name="bEmail"
                rules={[
                  { required: true, message: "Please input yBank Email!" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Bank Address"
                name="bAddress"
                rules={[
                  { required: true, message: "Please input Bank address!" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Contact Number"
                name="bContact"
                rules={[
                  { required: true, message: "Please input Bank Contacts!" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Wallet Address"
                name="bWallet"
                rules={[
                  {
                    required: true,
                    message: "Please input Bank Wallet Address!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit" loading={isLoading}>
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Card>
      </div>
    </>
    // <Flex minWidth={380}>
    //   <Box mx={"auto"} width={[1, 11 / 12, 10 / 12]}>
    //     <Flex px={2} mx={"auto"} justifyContent="space-between">
    //       <Box my={"auto"}>
    //         <Heading as={"h1"} color="primary">
    //           Blockchain Admin
    //         </Heading>
    //       </Box>
    //       <Box my={"auto"}>
    //         <Button>Logout</Button>
    //       </Box>
    //     </Flex>
    //     <Card>
    //       <Heading as={"h2"}>No Data Found</Heading>
    //     </Card>
    //     <Card mt={20}>
    //     <Flex px={2} mx={"auto"} justifyContent="space-between">
    //       <Box>
    //       <Heading as={"h2"}>Get Bank data</Heading>
    //       <Flex mx={3}>
    //         <Flex mr={5}>
    //           <Form.Field label="Enter Bank Wallet Address">
    //             <Form.Input width={'400px'} type="text" name="bankWallet" value={bankWallet || ''} onChange={(e)=>setBankWallet(e.target.value)} required />
    //           </Form.Field>
    //         </Flex>
    //         <Button mt={"28px"} type="submit" onClick={handelSubmit}>
    //           Send Request
    //         </Button>
    //       </Flex>
    //       </Box>
    //       <Box>
    //         {bankDetails &&  <BankData data={[bankDetails]} />}
    //       </Box>
    //       </Flex>
    //     </Card>
    //     <Flex mx={3}>
    //       <Box mx={"auto"} mt={20}>
    //         <Card>
    //         <Heading as={"h2"}>Register Bank</Heading>
    //           <Box  mx={10}>
    //             <Button onClick={()=>history.push("/admin/AddBank")}>Proceed</Button>
    //           </Box>
    //         </Card>
    //       </Box>
    //       <Box mx={"auto"} mt={20}>
    //         <Card>
    //         <Heading as={"h2"}>Authorize Bank</Heading>
    //           <Box  mx={10}>
    //             <Button onClick={()=>history.push("/admin/AddAuth")}>Proceed</Button>
    //           </Box>
    //         </Card>
    //       </Box>
    //       <Box mx={"auto"} mt={20}>
    //         <Card>
    //         <Heading as={"h2"}>Revoke Bank </Heading>
    //           <Box  mx={10}>
    //             <Button onClick={()=>history.push("/admin/RevokeAuth")}>Proceed</Button>
    //           </Box>
    //         </Card>
    //       </Box>
    //       <Box mx={"auto"} mt={20}>
    //         <Card>
    //         <Heading as={"h2"}>Add Admin</Heading>
    //           <Box  mx={10}>
    //             <Button onClick={()=>history.push("/admin/AddAdmin")}>Proceed</Button>
    //           </Box>
    //         </Card>
    //       </Box>
    //     </Flex>
    //     <Card mt={20}>© 2021-2022 Yadav Coin. All Rights Reserved.</Card>
    //   </Box>
    // </Flex>
  );
};

export default AdminPortal;
