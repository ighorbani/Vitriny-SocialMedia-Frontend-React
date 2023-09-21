import { useParams, Link } from "react-router-dom";

function PaymentSuccedPage() {
  const params = useParams();

  return (
    <>
      <div className="padding-page">
        <div className="icon-title">
          <div className="icon success">
            <div>
              <span></span>
            </div>
          </div>
          <h2>Payment Successful!</h2>
          <p>
            Your payment for "Pato-e Golbaft 6-meter" at Atlas Store has been
            successfully processed.
          </p>
        </div>

        <div className="invoice success">
          <div className="invoice-row">
            <h5>Product</h5>
            <span>Pato-e Golbaft 6-meter</span>
          </div>

          <div className="invoice-row">
            <h5>Amount Paid</h5>
            <span>120,000 USD</span>
          </div>

          <div className="invoice-row">
            <h5>Business</h5>
            <span>Atlas Store</span>
          </div>
        </div>

        <Link to="/" className="button green-outline">
          Return to Home
        </Link>
      </div>
    </>
  );
}

export default PaymentSuccedPage;
