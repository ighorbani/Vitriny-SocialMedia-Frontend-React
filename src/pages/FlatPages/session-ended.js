import { useParams, Link } from "react-router-dom";
import React, { useEffect, useState } from "react";

function SessionEndedPage() {
  useEffect(() => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
  }, []);

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
          <h2>Please Log In Again!</h2>
          <p>Your session has expired. Please log in again!</p>
        </div>

        <Link
          to="/loginNumber"
          className="button green-outline"
          style={{ marginTop: "10rem" }}
        >
          Log In to Vitrini
        </Link>
      </div>
    </>
  );
}

export default SessionEndedPage;
