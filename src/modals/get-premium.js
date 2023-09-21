import { useParams, Link } from "react-router-dom";

function GetPremiumModal(props) {
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
          <h3>One-Year Vitrini Premium!</h3>
          <div className="modal-close" onClick={props.modalClose}></div>
        </div>
        <div className="modal-scrollable" style={{ paddingTop: "7rem" }}>
          <div className="icon-title">
            <div className="icon premium">
              <div>
                <span></span>
              </div>
            </div>
            <h2>Go Premium!</h2>
            <p style={{ padding: "0 2rem" }}>
              Use Vitrini's premium features for one year!
            </p>
          </div>

          <div className="modal-container-cnt">
            <h4 className="sec-title green">Chat with Your Customers</h4>
            <p className="description-p dashed">
              To register your business, you first need to sign up.
            </p>

            <h4 className="sec-title green">Post a Story Every Day</h4>
            <p className="description-p dashed">
              To register your business, you first need to sign up.
            </p>

            <h4 className="sec-title green">Chat with Your Customers</h4>
            <p className="description-p dashed">
              To register your business, you first need to sign up.
            </p>

            <Link to={`/invoice/${params.businessId}`} className="button">
              Go Premium!
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default GetPremiumModal;
