import React from 'react';
import styled from "styled-components";

const VerifyClient = ({togglePopup}) => {
  return (
      <PopupContainer>
        <div className="popup-box">
            <span className="close-icon" onClick={togglePopup}>
                x
            </span>
            <div className="box">Gane MArle Meri</div>
        </div>
      </PopupContainer>
  )
};

export default VerifyClient;


const PopupContainer = styled.div`
  .popup-box {
    z-index: 1;
    position: fixed;
    background: #00000050;
    width: 100%;
    height: 100vh;
    top: 0;
    left: 0;
    
  }
  .box {
    position: relative;
    width: 70%;
    margin: 0 auto;
    height: auto;
    max-height: 85vh;
    margin-top: calc(100vh - 85vh - 10px);
    // background: #fff;
    border-radius: 4px;
    padding: 20px;
    border: 1px solid #999;
    overflow: auto;
    background-image: linear-gradient(270deg,#ffffff,#e6f2ff);
  }
  .close-icon {
    content: "x";
    cursor: pointer;
    position: fixed;
    right: calc(15% - 30px);
    top: calc(100vh - 85vh - 33px);
    background: #ededed;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    line-height: 20px;
    text-align: center;
    border: 1px solid #999;
    font-size: 20px;
  }
`;