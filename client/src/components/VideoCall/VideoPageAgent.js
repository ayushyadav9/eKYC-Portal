import { useEffect } from "react";

import Video from "./Video/VideoAgent";
import VideoState from "../../context/VideoState";

import Options from "./options/OptionsAgent";
import { ToastContainer, toast } from "react-toastify";
import "./VideoPage.css";

const VideoPage = (props) => {
  useEffect(() => {
    if (!navigator.onLine) toast.error("Please connect to the internet!");
  }, [navigator]);

  // useEffect(() => {
  //   var cookies = document.cookie.split(";");

  //   for (var i = 0; i < cookies.length; i++) {
  //     var cookie = cookies[i];
  //     var eqPos = cookie.indexOf("=");
  //     var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
  //     document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  //   }
  // }, []);

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
