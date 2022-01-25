import React, { useState,useEffect } from "react";
import { Image, Row, Col, message, Card, Typography, Descriptions, Button, Modal, Table } from 'antd';
import {CopyTwoTone} from '@ant-design/icons';

const ClientData = ({ userData }) => {
  const [isModal, setisModal] = useState();
  const [tableData, settableData] = useState([]);
  const { Text} = Typography;

  useEffect(() => {
    userData.kycHistory.forEach(item => {
      var d = new Date(parseInt(item[3])); 
      const Titem = {
        name: item[0],
        remarks: item[1],
        status: item[2],
        time: d.toDateString()
      }
      settableData([...tableData,Titem])
    });
  
  }, []);
  

  const copyKycId = (id)=>{
    navigator.clipboard.writeText(`${id}`)
    message.success("KYC ID Copied!")
  }
  const toggleModal = ()=>{
    setisModal((prev)=>{
      return !prev
    })
  }
  const columns = [{
    title: 'Bank Name',
    dataIndex: 'name',
    key: 'name',
    render: text => <span style={{color:"#1890ff"}}>{text}</span>,
  },
  {
    title: 'Remarks',
    dataIndex: 'remarks',
    key: 'remarks',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: 'Time of last KYC',
    dataIndex: 'time',
    key: 'time',
  },
]

  
  
  return (
    <>
    <Modal title="Basic Modal" visible={isModal} onOk={toggleModal} onCancel={toggleModal}>
      {tableData.length>0 && <Table columns={columns} dataSource={tableData} />}
      </Modal>
      <div className="site-card-wrapper">
        <Row gutter={16}>
          <Col span={8}>
            <Row span={6}>
              <Card title="Profile Picture" bordered={false}>
                <Image width={300}
                  alt="Loading....."
                  src={`https://ipfs.io/ipfs/${userData.records[2][1]}`}
                />
              </Card>
            </Row>
            <Row span={2}>
              <Card>        
                <Row> 
                  <h1> KYC ID : <Text type={userData.kycStatus ? "success" : "danger"}>{userData.kycId}</Text></h1>   
                  <CopyTwoTone style={{ fontSize: '150%'}} onClick={() => copyKycId(userData.kycId) }/>                                      
                </Row>                        
              </Card>         
            </Row>
          </Col>
          <Col span={8}>
            <Card title="Basic Details" bordered={true}>
              <Descriptions title="User Info" layout="horizontal">
                <Descriptions.Item label="Name " span={3}>{userData.name}</Descriptions.Item>
                <Descriptions.Item label="Gender " span={3}>{userData.gender}</Descriptions.Item>
                <Descriptions.Item label="Phone " span={3}>{userData.phone}</Descriptions.Item>
                <Descriptions.Item label="Address " span={3}>{userData.address}</Descriptions.Item>
                <Descriptions.Item label="Email " span={3}>{userData.email}</Descriptions.Item>
                <Descriptions.Item label="KYC Id " span={3}>{userData.kycId}</Descriptions.Item>
                <Descriptions.Item label="KYC Status "><strong>{userData.kycStatus ? "Approved" : "Not Approved"}</strong></Descriptions.Item>
              </Descriptions>
              <Button onClick={toggleModal}>Show KYC History</Button>
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Documents" bordered={false}>
              <Image.PreviewGroup>
                <Image width={300} src={`https://ipfs.io/ipfs/${userData.records[0][1]}`} />
                <Image
                  width={300}
                  src={`https://ipfs.io/ipfs/${userData.records[1][1]}`}
                />
              </Image.PreviewGroup>
            </Card>
          </Col>
        </Row>
      </div>

    </>
  );
};

export default ClientData;