import { useParams, Link } from "react-router-dom";

function BuildBusinessVitrin(props) {
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
          <h3>Vitrini Social Network</h3>
          <div className="modal-close" onClick={props.modalClose}></div>
        </div>
        <div className="modal-scrollable" style={{ paddingTop: "7rem" }}>
          <div className="icon-title">
            <div className="icon premium">
              <div>
                <span></span>
              </div>
            </div>
            <h2>Vitrini for Your Posts</h2>
            <p style={{ padding: "0 2rem" }}>
              Share your posts for free on Vitrini!
            </p>
          </div>

          <div className="modal-container-cnt">
            <div className="modal-image instagram-link"></div>
            <h4 className="sec-title green">
              My Sales Depend on Your Warm Presence
            </h4>
            <p className="description-p dashed">
              Create your business page, add your phone number, social networks,
              map location, and more! Showcase your products with images and
              prices! Now, link this page to your Instagram so all your
              followers can have complete access to your business information
              and products!
            </p>
            <h4 className="sec-title green">
              Chat and Search by City Features
            </h4>
            <p className="description-p dashed">
              In addition to online page creation, you can chat with customers.
              When you register your business here, your fellow citizens can
              also see and buy from you!
            </p>

            <Link to="/registerBusiness" className="button">
              Create a Personal Page!
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default BuildBusinessVitrin;
