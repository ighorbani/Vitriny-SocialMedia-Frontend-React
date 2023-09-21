import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function StoryOptionsPopup(props) {
  const popupClasses = [
    "popup simple-option-popup",
    props.show === "entering"
      ? "pop-up"
      : props.show === "exiting"
      ? "pop-down"
      : null,
  ];

  return (
    <>
      <div className={popupClasses.join(" ")}>
        <div className="popup-top">
          <h2>Story Options</h2>
          <span id="close-popup" onClick={props.popupClose}></span>
        </div>

        <div className="simple-options">
          <div className="option">
            <h4>Delete</h4>
          </div>

          <div className="option">
            <h4>Add to Story Collections</h4>
          </div>
        </div>
      </div>
    </>
  );
}

export default StoryOptionsPopup;
