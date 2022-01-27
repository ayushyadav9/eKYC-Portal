import React, { useContext, useEffect, useState, useRef } from "react";
import VideoContext from "../../../context/VideoContext";
import "./Video.css";
import { Modal, Input, notification, Avatar } from "antd";
import VideoIcon from "../../../assets/video.svg";
import VideoOff from "../../../assets/video-off.svg";
// import Profile from "../../assets/profile.svg";
import Msg_Illus from "../../../assets/msg_illus.svg";
import Msg from "../../../assets/msg.svg";
import { UserOutlined, MessageOutlined } from "@ant-design/icons";
import { socket } from "../../../context/VideoState";
import { baseURL } from "../../../api";

const { Search } = Input;
const Video = () => {
  const {
    callAccepted,
    myVideo,
    stream,
    name,
    me,
    callEnded,
    sendMsg: sendMsgFunc,
    msgRcv,
    chat,
    setChat,
    myVdoStatus,
    fullScreen,
    updateVideo,
    myMicStatus,
    updateMic,
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

  // useEffect(() => {
  //   window.location.reload()
  // }, []);
  
  useEffect(() => {
    if(me){
      fetch(`${baseURL}/updateSocket`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("clientToken")}`,
        },
        body: JSON.stringify({socket:me})
      })
        .then((res) => res.json())
        .then((result, err) => {
          if (err) {
            console.log(err);
            return;
          }
          console.log(result);
        });
      }
  }, [me]);
  console.log(me)
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
    <div className="grid">
    {stream ? (
      <div
        style={{ textAlign: "center" }}
        className="card"
        id={callAccepted && !callEnded ? "video1" : "video3"}
      >
        <div style={{ height: "2rem" }}>
          <h3>{myVdoStatus && name}</h3>
        </div>
        <div className="video-avatar-container">
          <video
            playsInline
            muted
            onClick={fullScreen}
            ref={myVideo}
            autoPlay
            className="video-active"
            style={{
              opacity: `${myVdoStatus ? "1" : "0"}`,
            }}
          />

          <Avatar
            style={{
              backgroundColor: "#116",
              position: "absolute",
              opacity: `${myVdoStatus ? "-1" : "2"}`,
            }}
            size={98}
            icon={!name && <UserOutlined />}
          >
            {name}
          </Avatar>
        </div>

        <div className="iconsDiv">
          <div
            className="icons"
            onClick={() => {
              updateMic();
            }}
            tabIndex="0"
          >
            <i
              className={`fa fa-microphone${myMicStatus ? "" : "-slash"}`}
              style={{ transform: "scaleX(-1)" }}
              aria-label={`${myMicStatus ? "mic on" : "mic off"}`}
              aria-hidden="true"
            ></i>
          </div>

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

          <div className="icons" onClick={() => updateVideo()} tabIndex="0">
            {myVdoStatus ? (
              <img src={VideoIcon} alt="video on icon" />
            ) : (
              <img src={VideoOff} alt="video off icon" />
            )}
          </div>
        </div>
      </div>
    ) : (
      <div className="bouncing-loader">
        <div></div>
        <div></div>
        <div></div>
      </div>
    )}

  </div>
);
};

export default Video;
