import { useParams, Link } from "react-router-dom";
function UserHidedPage() {
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
          <h2>Page Suspended!</h2>
          <p>
            Unfortunately, this page is suspended for certain reasons. Click to
            return to the homepage.
          </p>
        </div>

        <Link
          to="/"
          className="button red-outline"
          style={{ marginTop: "10rem" }}
        >
          Return to Home
        </Link>
      </div>
    </>
  );
}

export default UserHidedPage;
