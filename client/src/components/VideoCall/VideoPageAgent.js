import { useEffect, useRef, useState } from "react";
import { Flex, Box, Card, Heading, Form, Field, Button, Loader, Text } from "rimble-ui";
import Video from "./Video/VideoAgent";
import VideoState from "../../context/VideoState";
import { baseURL } from "../../api";
import Options from "./options/OptionsAgent";
import { ToastContainer, toast } from "react-toastify";
import "./VideoPage.css";
import { FileImageFilled } from "@ant-design/icons";
const IPFS = require("ipfs-api");
const ipfs = new IPFS({ host: "ipfs.infura.io", port: 5001, protocol: "https" });

const VideoPage = (props) => {
  const canvasEle = useRef();
  const imageEle = useRef();
  const [imageURL, setImageURL] = useState();
  const [imageFile, setImageFile] = useState();
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!navigator.onLine) toast.error("Please connect to the internet!");
  }, [navigator]);

  useEffect(() => {
    setImageFile(dataURLtoFile(imageURL, "vidScreenshot"));
  }, [imageURL]);

  // useEffect(() => {
  //   var cookies = document.cookie.split(";");

  //   for (var i = 0; i < cookies.length; i++) {
  //     var cookie = cookies[i];
  //     var eqPos = cookie.indexOf("=");
  //     var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
  //     document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  //   }
  // }, []);

  const clickScreenshot = async (userVideo) => {
    // Get the exact size of the video element.
    const width = userVideo.current.videoWidth;
    const height = userVideo.current.videoHeight;

    // get the context object of hidden canvas
    const ctx = canvasEle.current.getContext("2d");

    // Set the canvas to the same dimensions as the video.
    canvasEle.current.width = width;
    canvasEle.current.height = height;

    // Draw the current frame from the video on the canvas.
    ctx.drawImage(userVideo.current, 0, 0, width, height);

    // Get an image dataURL from the canvas.
    const imageDataURL = canvasEle.current.toDataURL("image/png");

    // Set the dataURL as source of an image element, showing the captured photo.
    setImageURL(imageDataURL);
  };

  const dataURLtoFile = (dataurl, filename) => {
    if (dataurl) {
      var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    }
  };

  const updateRecord = async (record_type, record_data) => {
    let data = { record_type, record_data };
    console.log(data);

    fetch(`${baseURL}/updateRecord`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((result, err) => {
        // setisLoading(false);
        if (err) {
          console.log(err);
          toast.error("Something went wrong");
          return;
        }
      });
  };

  const acceptKyc = () => {
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(imageFile);
    ipfs.files.add(Buffer([reader.result]), (error, result) => {
      // setisLoading(false);
      if (error) {
        console.error(error);
        console.log(imageFile, imageURL);
        setMessage("Something went wrong!");
        return;
      }
      setMessage("Updated Successfuly!");
      console.log(result);
      updateRecord(
        "video_kyc",
        JSON.stringify({ iamge: result[0].hash, verdict: "accepted" })
      );
    });
  };

  const rejectKyc = () => {
    ipfs.files.add([imageURL], (error, result) => {
      // setisLoading(false);
      if (error) {
        console.error(error);
        setMessage("Something went wrong!");
        return;
      } else {
        setMessage("Updated Successfuly!");
        console.log(result);
        updateRecord(
          "video_kyc",
          JSON.stringify({ iamge: result[0].hash, verdict: "rejected" })
        );
      }
    });
  };

  return (
    <div className="videoPageBody">
      <ToastContainer
        theme="dark"
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <VideoState>
        <Video clickScreenshot={clickScreenshot} />
        <Options
          clientId={props.match.params.clientId}
          canvasEle={canvasEle}
          imageEle={imageEle}
          imageURL={imageURL}
          acceptKyc={acceptKyc}
          rejectKyc={rejectKyc}
          message={message}
        />
      </VideoState>
    </div>
  );
};

export default VideoPage;
