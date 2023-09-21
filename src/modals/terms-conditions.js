import { useParams, Link } from "react-router-dom";

function TermsConditions(props) {
  const params = useParams();

  const modalClasses = [
    "modal-container",
    props.show === "entering"
      ? "fade-in"
      : props.show === "exiting"
      ? "fade-out"
      : null,
  ];

  return (
    <>
      <div className={modalClasses.join(" ")}>
        <div className="modal-top">
          <h3>Privacy Policy</h3>
          <div className="modal-close" onClick={props.modalClose}></div>
        </div>
        <div className="modal-scrollable" style={{ paddingTop: "7rem" }}>
          <div className="modal-container-cnt" style={{ paddingTop: "0" }}>
            {/* <h4 className="sec-title green" style={{ marginTop: "0" }}>
          Privacy Protection
        </h4> */}
            <p className="description-p dashed">
              To register on the Vitrini app and website, you need to provide
              information such as your name and mobile phone number. If you
              wish, you can also upload your picture to complete your profile.
              Many users' concerns revolve around the security of their personal
              information, including their mobile number and name, which they
              entrust to us for registration and login. It's worth mentioning
              that we understand the importance of this matter, and the privacy
              of our users is of utmost importance to us.
            </p>
            <div
              style={{ margin: 0 }}
              onClick={props.modalClose}
              className="button"
            >
              Close
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TermsConditions;
