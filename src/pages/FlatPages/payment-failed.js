import { useParams, Link } from "react-router-dom";
function PaymentFailedPage() {
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
          <h2>Payment Failed!</h2>
          <p>Please click the button below to return to the homepage.</p>
        </div>

        <Link
          to={`/businessAdmin/${businessId}`}
          className="button red-outline"
          style={{ marginTop: "10rem" }}
        >
          Return to Business
        </Link>
      </div>
    </>
  );
}

export default PaymentFailedPage;
