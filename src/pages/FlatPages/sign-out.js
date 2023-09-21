import { useHistory, useParams, Link } from "react-router-dom";
import React, { useEffect, useState } from "react";

function SignOut() {
  const history = useHistory();

  useEffect(() => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
  }, []);

  function GoHomeHandler() {
    history.go(0);
  }

  return (
    <>
      <div className="padding-page">
        <div className="icon-title">
          <div className="icon business">
            <div>
              <span></span>
            </div>
          </div>
          <h2>You have been logged out!</h2>
          <p>Touch the button below to continue.</p>
        </div>

        <div
          onClick={GoHomeHandler}
          className="button green-outline"
          style={{ marginTop: "10rem" }}
        >
          Return to the Home Page
        </div>
      </div>
    </>
  );
}

export default SignOut;
