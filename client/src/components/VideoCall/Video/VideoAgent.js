import React, { useContext, useEffect, useState, useRef } from "react";
import VideoContext from "../../../context/VideoContext";
import "./Video.css";
import {  Modal, Input, notification, Avatar } from "antd";
import ScreenShotIcon from "../../../assets/screenshot.png";
import Msg_Illus from "../../../assets/msg_illus.svg";
import Msg from "../../../assets/msg.svg";
import { UserOutlined, MessageOutlined, RedoOutlined } from "@ant-design/icons";

import { socket } from "../../../context/VideoState";

// const socket = io()
const { Search } = Input;
const Video = (props) => {
  const {
    callAccepted,
    userVideo,
    name,
    callEnded,
    sendMsg: sendMsgFunc,
    msgRcv,
    chat,
    setChat,
    fullScreen,
    userVdoStatus,
  } = useContext(VideoContext);

  const [sendMsg, setSendMsg] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  socket.on("msgRcv", ({ name, msg: value, sender }) => {
    let msg = {};
    msg.msg = value;
    msg.type = "rcv";
    msg.sender = sender;
    msg.timestamp = Date.now();
    setChat([...chat, msg]);
  });

  const dummy = useRef();

  useEffect(() => {
    if (dummy?.current) dummy.current.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const showModal = (showVal) => {
    setIsModalVisible(showVal);
  };

  const onSearch = (value) => {
    if (value && value.length) sendMsgFunc(value);
    setSendMsg("");
  };

  useEffect(() => {
    if (msgRcv.value && !isModalVisible) {
      notification.open({
        message: "",
        description: `${msgRcv.sender}: ${msgRcv.value}`,
        icon: <MessageOutlined style={{ color: "#108ee9" }} />,
      });
    }
    // eslint-disable-next-line
  }, [msgRcv]);

  return (
    <>
      <div className="grid">
        {callAccepted && !callEnded?  (
          <div
            style={{ textAlign: "center" }}
            className="card"
            id={callAccepted && !callEnded ? "video1" : "video3"}
          >
            <div style={{ height: "2rem" }}>
              <h3>{userVdoStatus && name?name:"Client Name"}</h3>
            </div>
            <div className="video-avatar-container">
              <video
                playsInline
                muted
                onClick={fullScreen}
                ref={userVideo}
                autoPlay
                className="video-active"
                style={{
                  opacity: `${userVdoStatus ? "1" : "0"}`,
                }}
              />

              <Avatar
                style={{
                  backgroundColor: "#116",
                  position: "absolute",
                  opacity: `${userVdoStatus ? "-1" : "2"}`,
                }}
                size={98}
                icon={!name && <UserOutlined />}
              >
                {name}
              </Avatar>
            </div>

            <div className="iconsDiv">

              {callAccepted && !callEnded && (
                <div
                  className="icons"
                  onClick={() => {
                    setIsModalVisible(!isModalVisible);
                  }}
                  tabIndex="0"
                >
                  <img src={Msg} alt="chat icon" />
                </div>
              )}
              <Modal
                title="Chat"
                footer={null}
                visible={isModalVisible}
                onOk={() => showModal(false)}
                onCancel={() => showModal(false)}
                style={{ maxHeight: "100px" }}
              >
                {chat.length ? (
                  <div className="msg_flex">
                    {chat.map((msg) => (
                      <div className={msg.type === "sent" ? "msg_sent" : "msg_rcv"}>
                        {msg.msg}
                      </div>
                    ))}
                    <div ref={dummy} id="no_border"></div>
                  </div>
                ) : (
                  <div className="chat_img_div">
                    <img src={Msg_Illus} alt="msg_illus" className="img_illus" />
                  </div>
                )}
                <Search
                  placeholder="your message"
                  allowClear
                  className="input_msg"
                  enterButton="Send 🚀"
                  onChange={(e) => setSendMsg(e.target.value)}
                  value={sendMsg}
                  size="large"
                  onSearch={onSearch}
                />
              </Modal>

              {callAccepted && !callEnded && (
                <div
                  className="icons"
                  onClick={() => props.clickScreenshot(userVideo)}
                  tabIndex="0"
                >
                  <img src={ScreenShotIcon}  alt="screenshot icon" />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bouncing-loader">
            <div></div>
            <div></div>
            <div></div>
          </div>
        )}

      {props.SS && (
          <div style={{ textAlign: "center" }}className="card"id={callAccepted && !callEnded ? "video1" : "video3"}>
          <div style={{ height: "2rem" }}>
            <h3>{userVdoStatus && name?name:"Screenshot"}</h3>
          </div>
            <img alt="example" style={{ maxWidth:'100%'}} src={props.imageURL}/>

            <div className="iconsDiv">
              {callAccepted && !callEnded && (
                <div className="icons" onClick={() => {props.clickScreenshot(userVideo)}}tabIndex="0">
                  <RedoOutlined />
                  {/* <img src={Msg} alt="chat icon" /> */}
                </div>
              )}
              </div>
          </div>
        )}  
      </div>
    </>
  );
};

export default Video;
