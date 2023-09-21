import { useParams, Link } from "react-router-dom";
function BusinessHidedPage() {
  const businessId = "";
  return (
    <>
      <div className="padding-page">
        <div className="icon-title">
          <div className="icon failed">
            <div>
              <span></span>
            </div>
          </div>
          <h2>Business is Suspended</h2>
          <p>
            Unfortunately, this business is suspended for certain reasons. Click
            to return to the homepage.
          </p>
        </div>

        <Link
          to="/"
          className="button red-outline"
          style={{ marginTop: "10rem" }}
        >
          Back to Home
        </Link>
      </div>
    </>
  );
}

export default BusinessHidedPage;
