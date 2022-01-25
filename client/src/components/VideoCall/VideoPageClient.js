import { useEffect } from "react";

import Video from "./Video/VideoClient";
import VideoState from "../../context/VideoState";

import Options from "./options/OptionsClient";
import { ToastContainer, toast } from "react-toastify";
import "./VideoPage.css";

const VideoPage = (props) => {
  useEffect(() => {
    if (!navigator.onLine) toast.error("Please connect to the internet!");
  }, []);


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
        <Video />
        <Options clientId={props.match.params.clientId} />
      </VideoState>
    </div>
  );
};

export default VideoPage;
