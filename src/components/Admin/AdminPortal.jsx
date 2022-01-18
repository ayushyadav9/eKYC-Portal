import React from "react";
import { useEffect, useState } from "react";
import { Flex, Box, Card, Heading, Form, Button } from "rimble-ui";
import InitialiseWeb3 from "../utils/web3.js";
import { useHistory } from "react-router-dom";
import BankData from "../Banks/BankData.jsx";

const AdminPortal = () => {
  
  const history = useHistory();
  const [dmr, setDmr] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [bankDetails, setBankDetails] = useState(null);
  const [bankWallet, setBankWallet] = useState();
  
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

  const handelSubmit = (e)=>{
    e.preventDefault()
    //console.log(bankWallet)
    getBankDetails(); 
  }

  const getBankDetails = async () => {
    if (dmr && accounts) {
      try {
        await dmr.methods
          .getBankByAddress(bankWallet)
          .call({from:accounts[0]})
          .then((res) => {  
            //console.log(res);
            const bankInfo = {
              bName: res.bName,
              bAddress: res.bAddress,
              bWallet: res.addr,
              label: "Bank Details",
            };
            console.log(bankInfo);
            setBankDetails(bankInfo);
          });
      } catch (e) {
        
        console.log("SOme Thing WeNt Wrong .....");
        // const data = e.data;
        // const txHash = Object.keys(data)[0]; // TODO improve
        // const reason = data[txHash].reason;    
        // console.log(reason); // prints "This is error message"
      }
    }
  };


  return (
    <Flex minWidth={380}>
      <Box mx={"auto"} width={[1, 11 / 12, 10 / 12]}>
        <Flex px={2} mx={"auto"} justifyContent="space-between">
          <Box my={"auto"}>
            <Heading as={"h1"} color="primary">
              Blockchain Admin
            </Heading>
          </Box>
          <Box my={"auto"}>
            <Button>Logout</Button>
          </Box>
        </Flex>
        <Card>
          <Heading as={"h2"}>No Data Found</Heading>         
        </Card>
        <Card mt={20}>
        <Flex px={2} mx={"auto"} justifyContent="space-between">
          <Box>
          <Heading as={"h2"}>Get Bank data</Heading>
          <Flex mx={3}>
            <Flex mr={5}>
              <Form.Field label="Enter Bank Wallet Address">
                <Form.Input width={'400px'} type="text" name="bankWallet" value={bankWallet || ''} onChange={(e)=>setBankWallet(e.target.value)} required />
              </Form.Field>
            </Flex>
            <Button mt={"28px"} type="submit" onClick={handelSubmit}>
              Send Request
            </Button>
          </Flex>
          </Box>
          <Box>
            {bankDetails &&  <BankData data={[bankDetails]} />}
          </Box>
          </Flex>
        </Card>
        <Flex mx={3}>
          <Box mx={"auto"} mt={20}>
            <Card>
            <Heading as={"h2"}>Register Bank</Heading>
              <Box  mx={10}>
                <Button onClick={()=>history.push("/admin/AddBank")}>Proceed</Button>
              </Box>
            </Card>
          </Box>
          <Box mx={"auto"} mt={20}>
            <Card>
            <Heading as={"h2"}>Authorize Bank</Heading>
              <Box  mx={10}>
                <Button onClick={()=>history.push("/admin/AddAuth")}>Proceed</Button>
              </Box>
            </Card>
          </Box>
          <Box mx={"auto"} mt={20}>
            <Card>
            <Heading as={"h2"}>Revoke Bank </Heading>
              <Box  mx={10}>
                <Button onClick={()=>history.push("/admin/RevokeAuth")}>Proceed</Button>
              </Box>
            </Card>
          </Box>
          <Box mx={"auto"} mt={20}>
            <Card>
            <Heading as={"h2"}>Add Admin</Heading>
              <Box  mx={10}>
                <Button onClick={()=>history.push("/admin/AddAdmin")}>Proceed</Button>
              </Box>
            </Card>
          </Box>
        </Flex>
        <Card mt={20}>© 2021-2022 Yadav Coin. All Rights Reserved.</Card>
      </Box>
    </Flex>
  );
};

export default AdminPortal;
