import { useEffect, useRef, useState } from "react";
import Video from "./Video/VideoAgent";
import VideoState from "../../context/VideoState";
import { baseURL } from "../../api";
import Options from "./options/OptionsAgent";
import { ToastContainer, toast } from "react-toastify";
import "./VideoPage.css";
const IPFS = require("ipfs-api");
const ipfs = new IPFS({ host: "ipfs.infura.io", port: 5001, protocol: "https" });

const VideoPage = (props) => {
  const canvasEle = useRef();
  const imageEle = useRef();
  const [imageURL, setImageURL] = useState();
  const [imageFile, setImageFile] = useState();
  const [message, setMessage] = useState("");
  const [buffer, setBuffer] = useState([]);
  const [SS, setSS] = useState(false);

  useEffect(() => {
    if (!navigator.onLine) toast.error("Please connect to the internet!");
     // eslint-disable-next-line
  }, [navigator]);

  useEffect(() => {
    setImageFile(dataURLtoFile(imageURL, "vidScreenshot"));
  }, [imageURL]);


  const clickScreenshot = async (userVideo) => {
    const width = userVideo.current.videoWidth;
    const height = userVideo.current.videoHeight;
    const ctx = canvasEle.current.getContext("2d");
    canvasEle.current.width = width;
    canvasEle.current.height = height;

    ctx.drawImage(userVideo.current, 0, 0, width, height);

    let imageDataURL = canvasEle.current.toDataURL("image/png");
    setImageURL(imageDataURL);
    imageDataURL = dataURLtoFile(imageDataURL,"userSelfie.png")
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(imageDataURL);
    reader.onloadend = () => {
      setBuffer([Buffer(reader.result)]);
    };
    setSS(true)
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
        Authorization: `Bearer ${localStorage.getItem("clientToken")}`,
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
        console.log(result)
      });
  };

  const handleVerdict = (verd) => {
    
    ipfs.files.add(buffer, (error, result) => {
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
        JSON.stringify({ image: result[0].hash, verdict: verd })
      );
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
        <Video 
          clickScreenshot={clickScreenshot} 
          SS={SS}
          imageURL={imageURL}
        />
        <Options
          clientId={props.match.params.clientId}
          canvasEle={canvasEle}
          imageEle={imageEle}
          imageURL={imageURL}
          handleVerdict={handleVerdict}
          message={message}
          SS={SS}
        />
      </VideoState>
    </div>
  );
};

export default VideoPage;
