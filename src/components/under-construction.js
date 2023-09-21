import { Link } from "react-router-dom";

function UnderConstruction() {
  return (
    <>
      <div className="padding-page" style={{ paddingTop: "10rem" }}>
        <div className="icon-title">
          <div className="icon under-construction">
            <div>
              <span></span>
            </div>
          </div>
          <h2>Under Construction!</h2>
          <p>This page is under construction. Thank you for your patience!</p>
        </div>

        <Link
          to="/"
          className="button green-outline"
          style={{ marginTop: "4rem" }}
        >
          Back to Home
        </Link>
      </div>
    </>
  );
}

export default UnderConstruction;
