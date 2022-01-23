import React, { useState, useContext, useEffect, useRef, useLocation } from "react";
import { Input, Button, Tooltip, Modal, message } from "antd";
import Phone from "../../../assets/phone.gif";
import Teams from "../../../assets/teams.mp3";
import * as classes from "./Options.module.css";
import { CopyToClipboard } from "react-copy-to-clipboard";
import VideoContext from "../../../context/VideoContext";
import Hang from "../../../assets/hang.svg";
import { Flex, Box, Card, Heading, Form, Field, Loader, Text } from "rimble-ui";

import {
  UserOutlined,
  CopyOutlined,
  InfoCircleOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { socket } from "../../../context/VideoState";

const Options = (props) => {
  console.log(props.clientId);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const Audio = useRef();
  const {
    call,
    callAccepted,
    myVideo,
    userVideo,
    stream,
    name,
    setName,
    callEnded,
    me,
    callUser,
    leaveCall,
    answerCall,
    otherUser,
    setOtherUser,
    leaveCall1,
  } = useContext(VideoContext);

  useEffect(() => {
    if (isModalVisible) {
      Audio?.current?.play();
    } else Audio?.current?.pause();
  }, [isModalVisible]);

  const showModal = (showVal) => {
    setIsModalVisible(showVal);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    leaveCall1();
    window.location.reload();
  };

  useEffect(() => {
    if (call.isReceivingCall && !callAccepted) {
      setIsModalVisible(true);
      setOtherUser(call.from);
    } else setIsModalVisible(false);
  }, [call.isReceivingCall]);

  return (
    <>
      <div className={classes.options}>
        <div style={{ marginBottom: "0.5rem" }}>
          <h2>Client Info</h2>
          <Input
            size="large"
            prefix={<UserOutlined />}
            maxLength={15}
            suffix={<small>{name.length}/15</small>}
            value="ayush"
            disabled={true}
            className={classes.inputgroup}
          />
        </div>

        <div style={{ marginBottom: "0.5rem" }}>
          <h2>Call</h2>

          {callAccepted && !callEnded ? (
            <Button
              variant="contained"
              onClick={leaveCall}
              className={classes.hang}
              tabIndex="0"
            >
              <img src={Hang} alt="hang up" style={{ height: "15px" }} />
              &nbsp; Hang up
            </Button>
          ) : (
            <Button
              type="primary"
              icon={<PhoneOutlined />}
              onClick={() => {
                callUser(props.clientId);
                console.log(props.clientId);
              }}
              className={classes.btn}
              tabIndex="0"
            >
              Call
            </Button>
          )}
        </div>

        {call.isReceivingCall && !callAccepted && (
          <>
            <audio src={Teams} loop ref={Audio} />
            <Modal
              title="Incoming Call"
              visible={isModalVisible}
              onOk={() => showModal(false)}
              onCancel={handleCancel}
              footer={null}
            >
              <div style={{ display: "flex", justifyContent: "space-around" }}>
                <h1>
                  {call.name} is calling you:{" "}
                  <img
                    src={Phone}
                    alt="phone ringing"
                    className={classes.phone}
                    style={{ display: "inline-block" }}
                  />
                </h1>
              </div>
              <div className={classes.btnDiv}>
                <Button
                  variant="contained"
                  className={classes.answer}
                  color="#29bb89"
                  icon={<PhoneOutlined />}
                  onClick={() => {
                    answerCall();
                    Audio.current.pause();
                  }}
                  tabIndex="0"
                >
                  Answer
                </Button>

                <Button
                  variant="contained"
                  className={classes.decline}
                  icon={<PhoneOutlined />}
                  onClick={() => {
                    setIsModalVisible(false);
                    Audio.current.pause();
                  }}
                  tabIndex="0"
                >
                  Decline
                </Button>
              </div>
            </Modal>
          </>
        )}
      </div>
      <div className="screenshot">
        <canvas ref={props.canvasEle} style={{ display: "none" }}></canvas>
        <div className="preview">
          <img className="preview-img" src={props.imageURL} ref={props.imageEle} />
        </div>
      </div>
      <div className="kycVerdict">
        <Flex>
          <Button variant="contained" onClick={props.acceptKyc}>
            Accept
          </Button>
          <Button variant="contained" onClick={props.rejectKyc}>
            Reject
          </Button>
        </Flex>
        <span>{props.message}</span>
      </div>
    </>
  );
};

export default Options;
