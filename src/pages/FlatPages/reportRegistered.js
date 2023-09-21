import { useParams, Link } from "react-router-dom";

function ReportRegistered() {
  return (
    <>
      <div className="padding-page">
        <div className="icon-title">
          <div className="icon success">
            <div>
              <span></span>
            </div>
          </div>
          <h2>Report Submitted Successfully</h2>
          <p>
            Thank you for your attention. Your feedback is valuable to us, and
            we will address it.
          </p>
        </div>

        <Link to="/" className="button green-outline">
          Return to Homepage
        </Link>
      </div>
    </>
  );
}

export default ReportRegistered;
