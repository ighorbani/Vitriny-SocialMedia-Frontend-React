import { useParams, Link } from "react-router-dom";

function PostsImportedPage() {
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
          <h2>Posts Added Successfully</h2>
          <p>
            You can now add products, services, and other information on the
            business page.
          </p>
        </div>

        <Link
          to={`/businessAdmin/${params.businessId}`}
          className="button green-outline"
        >
          Return to Business
        </Link>
      </div>
    </>
  );
}

export default PostsImportedPage;
