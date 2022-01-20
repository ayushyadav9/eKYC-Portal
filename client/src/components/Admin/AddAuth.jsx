import React from "react";
import { useEffect, useState } from "react";
import { Flex, Box, Card, Heading, Form, Field, Button,Loader,Text } from "rimble-ui";
import InitialiseWeb3 from "../utils/web3.js";
import { useHistory } from "react-router-dom";
import Web3 from "web3";

const AddAuth = () => {
  
  const history = useHistory();
  const [dmr, setDmr] = useState(null);
  const [isLoading, setisLoading] = useState(false)
  const [message, setMessage] = useState("Status Unknown")
  const [accounts, setAccounts] = useState(null);
  const [kycId, setKycId] = useState();
  const [bankWallet, setBankWallet] = useState();
  
  useEffect(() => {
    setup();
  }, []);

  const setup = async () => {
    let [tempDmr, tempAcc] = await InitialiseWeb3();
    //console.log(tempDmr, tempAcc);
    setDmr(tempDmr);
    setAccounts(tempAcc);
    //console.log(tempAcc);
  }; 

  const handelSubmit = (e)=>{
    e.preventDefault()
    //console.log(Web3.utils.toBN(kycId),bankWallet)    
    addAuth(); 
  }

  const addAuth = async () => {
    if (dmr && accounts) {
      try {
        await dmr.methods
          .addAuth(Web3.utils.toBN(kycId),bankWallet)
          .send({from:accounts[0]})
          .then((res) => {  
            console.log(res);
            setMessage("Status Success");          
          });
      } catch (e) {        
        setMessage("Status Failed");  
        console.log("SOme Thing WeNt Wrong .....");
        console.log(e);
        // const data = e.data;
        // const txHash = Object.keys(data)[0]; // TODO improve
        // const reason = data[txHash].reason;    
        // console.log(reason); // prints "This is error message"
      }
    }
  };


  return (
    <Flex height={"100vh"}>
      <Box mx={"auto"} my={"auto"} width={[1, 9 / 12, 7 / 12]}>
        <Flex px={2} mx={"auto"} justifyContent="space-between">
          <Box my={"auto"}>
            <Heading as={"h2"} color={"primary"}>
              Authorise Bank to Access Customer Details
            </Heading>
          </Box>
          <Box my={"auto"}>
            <Button onClick={() => {history.goBack()}}>
              Back
            </Button>
          </Box>
        </Flex>
        <Form id='update' onSubmit={handelSubmit}>
          <Card mb={20}>
            <Flex mx={-3} flexWrap={"wrap"}>
              <Box width={1} px={3}>
                <Field label="bankWallet" width={1}>
                  <Form.Input type="text" name="bankWallet" value={bankWallet || ''} onChange={(e)=>setBankWallet(e.target.value)} required width={1} />
                </Field>
              </Box>
              <Box width={1} px={3}>
                <Field label="Customer KYC Id" width={1}>
                  <Form.Input type="text" name="kycId" value={kycId || ''} onChange={(e)=>setKycId(e.target.value)} required width={1} />
                </Field>
              </Box>             
            </Flex>
          </Card>
            <Flex mx={-3} alignItems={"center"}>
                <Box px={3}>
                <Button  type="submit" mt={2} minWidth={'150px'}>
                {isLoading ? <Loader color="white" /> : <p>Submit</p>}
                </Button>
                </Box>
                {message && <Box px={3}><Text fontSize={'18px'}>{message}</Text></Box>}
            </Flex>
        </Form>
        <Card mt={20} mb={1}>© 2021-2022 Yadav Coin. All Rights Reserved.</Card>
      </Box>
    </Flex>
  );
};

export default AddAuth;
