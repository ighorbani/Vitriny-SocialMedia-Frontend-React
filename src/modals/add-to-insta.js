import { useParams, Link } from "react-router-dom";

function AddToInsta(props) {
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
          <h3>Link to Instagram Page</h3>
          <div className="modal-close" onClick={props.modalClose}></div>
        </div>
        <div className="modal-scrollable" style={{ paddingTop: "7rem" }}>
          <div className="icon-title">
            <div className="icon premium">
              <div>
                <span></span>
              </div>
            </div>
            <h2>Bring Instagram Customers!</h2>
            <p style={{ padding: "0 2rem" }}>
              Showcase your business to Instagram customers!
            </p>
          </div>

          <div className="modal-container-cnt">
            <div className="modal-image instagram-link"></div>
            <h4 className="sec-title green">
              Adding a Link to Your Instagram Page
            </h4>
            <p className="description-p dashed">
              Place the link to your business's showcase in your Instagram page
              so that your customers can stay in touch with your business and
              products.
            </p>

            <div onClick={props.copyLink} className="button">
              Copy Your Business Address
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddToInsta;
