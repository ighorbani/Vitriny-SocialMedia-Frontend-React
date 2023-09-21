import { useParams, Link } from "react-router-dom";

function NeedsUpdatePage() {
  const params = useParams();

  return (
    <>
      <div className="padding-page">
        <div className="icon-title">
          <div className="icon premium">
            <div>
              <span></span>
            </div>
          </div>
          <h2>Update Required</h2>
          <p>
            This version of the Vitrini app needs an update. Please update it
            through the app stores or use the web version of the app.
          </p>
        </div>

        <a
          href="https://vitriny.com"
          className="button black"
          style={{ marginTop: "10rem" }}
          target="_blank"
        >
          Use Web Version
        </a>
      </div>
    </>
  );
}

export default NeedsUpdatePage;
