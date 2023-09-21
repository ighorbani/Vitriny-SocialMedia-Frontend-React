import { useParams, Link } from "react-router-dom";

function BusinessCreatedPage() {
  const params = useParams();

  return (
    <>
      <div className="padding-page">
        <div className="icon-title">
          <div className="icon business">
            <div>
              <span></span>
            </div>
          </div>
          <h2>Business Successfully Registered</h2>
          <p>
            You can now add products, services, and other information on your
            business page.
          </p>
        </div>

        <Link
          to={`/businessAdmin/${params.businessId}`}
          className="button green-outline"
          style={{ marginTop: "10rem" }}
        >
          Back to Business
        </Link>
      </div>
    </>
  );
}

export default BusinessCreatedPage;
