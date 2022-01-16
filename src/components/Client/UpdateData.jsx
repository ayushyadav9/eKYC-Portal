import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Flex, Box, Card, Heading, Form, Field, Button,Loader,Text } from "rimble-ui";
const IPFS = require('ipfs-api');
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

const UpdateData = () => {
  const history = useHistory();
  const [isLoading, setisLoading] = useState(false)
  const [buffer, setbuffer] = useState([])
  const [message, setMessage] = useState(null)
  const [formData, setformData] = useState({
    name:"",
    address:"",
    dob:""
  })

  const handelSubmit = (e)=>{
    e.preventDefault()
    setisLoading(true)
    ipfs.files.add(buffer, (error, result) => {
      setisLoading(false)
      if(error) {
        console.error(error)
        setMessage("Something went wrong!")
        return
      }
      setMessage("Updated Successfuly!")
      setformData({...formData,"panIPFS":result[0].hash,"aadharIPFS":result[1].hash})
    })
  }

  const captureFile = (e)=>{
    const file = e.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      setbuffer([...buffer,Buffer(reader.result)])
    }
  }

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
            <Button onClick={() => {history.goBack()}}>
              Back
            </Button>
          </Box>
        </Flex>
        <Form id='update' onSubmit={handelSubmit}>
          <Card mb={20}>
            <Flex mx={-3} flexWrap={"wrap"}>
              <Box width={1} px={3}>
                <Field label="Name" width={1}>
                  <Form.Input type="text" name="name" value={formData.name} onChange={(e)=>setformData({...formData,'name':e.target.value})} required width={1} />
                </Field>
              </Box>
              <Box width={1} px={3}>
                <Field label="Address" width={1}>
                  <Form.Input type="text" name="address" value={formData.address} onChange={(e)=>setformData({...formData,'address':e.target.value})} required width={1} />
                </Field>
              </Box>
              <Box width={1} px={3}>
                <Field label="Date of Birth" width={1}>
                  <Form.Input type="date" name="dob" value={formData.dob} onChange={(e)=>setformData({...formData,'dob':e.target.value})} required width={1} />
                </Field>
              </Box>
              <Box width={1} px={3}>
                <Field label="PAN Card" width={1}>
                  <Form.Input type="file" required width={1} onChange={captureFile}/>
                </Field>
              </Box>
              <Box width={1} px={3}>
                <Field label="Aadhar Card" width={1}>
                  <Form.Input type="file" required width={1} onChange={captureFile}/>
                </Field>
              </Box>
            </Flex>
          </Card>
        <Flex mx={-3} alignItems={"center"}>
          <Box px={3}>
            <Button  type="submit" mt={2} minWidth={'150px'}>
            {isLoading ? <Loader color="white" /> : <p>Update</p>}
            </Button>
          </Box>
          {message && <Box px={3}><Text fontSize={'18px'}>{message}</Text></Box>}
        </Flex>
        </Form>
        <Card mt={20} mb={1}></Card>
      </Box>
    </Flex>
  );
};

export default UpdateData;
