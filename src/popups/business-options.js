import OptionWithIcon from "../components/option-with-icon";
import { useParams, Link } from "react-router-dom";

function BusinessOptionsPopup(props) {
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
          <h2>Options</h2>
          <span id="close-popup" onClick={props.popupClose}></span>
        </div>

        <div className="simple-options">
          <div className="option" onClick={props.activateHandler}>
            {props.activateState === false ? (
              <h4>Deactivate Business</h4>
            ) : (
              <h4>Activate Business</h4>
            )}
          </div>

          <div className="option" onClick={props.addToInsta}>
            <h4>Add Instagram Link</h4>
          </div>
        </div>
      </div>
    </>
  );
}

export default BusinessOptionsPopup;
