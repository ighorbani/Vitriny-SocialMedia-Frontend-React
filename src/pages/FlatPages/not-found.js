import { useParams, Link } from "react-router-dom";
function NotFound() {
  const businessId = "";
  return (
    <>
      <div className="padding-page">
        <div className="icon-title">
          <div className="icon under-construction">
            <div>
              <span></span>
            </div>
          </div>
          <h2>Not Found!</h2>
          <p>Unfortunately, the requested page was not found!</p>
        </div>

        <Link
          to="/"
          className="button green-outline"
          style={{ marginTop: "4rem" }}
        >
          Return to Homepage
        </Link>
      </div>
    </>
  );
}

export default NotFound;
