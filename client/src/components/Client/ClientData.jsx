import React from "react";
import { Card } from 'antd';
import { Image, Row, Col } from 'antd';
import { Descriptions } from 'antd';
import { Typography } from 'antd';
import {CopyTwoTone} from '@ant-design/icons';

const ClientData = ({ userData }) => {
  const { Text} = Typography;
  return (
    <>
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
                  <h1> KYC id : <Text type={userData.kycStatus ? "success" : "danger"}>{userData.kycId}</Text></h1>   
                  <CopyTwoTone style={{ fontSize: '150%'}} onClick={() =>  navigator.clipboard.writeText(`${userData.kycId}`)}/>                                      
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