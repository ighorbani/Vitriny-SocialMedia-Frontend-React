import { render } from "@testing-library/react";
import React, { useState } from "react";
import {
  BrowserRouter,
  Redirect,
  useHistory,
  useParams,
  Link,
} from "react-router-dom";
import TermsConditions from "../../modals/terms-conditions";
import Transition from "react-transition-group/Transition";
import Backdrop from "../../components/backdrop";

function LoginNumberPage() {
  const history = useHistory();
  const [redirect, setRedirect] = useState();
  const [showConditionsModal, setShowConditionsModal] = useState(false);

  const [number, setNumber] = useState();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  function toggleConditionsModal() {
    setShowConditionsModal((prevState) => !prevState);
  }

  function closeModal() {
    setShowConditionsModal(false);
  }

  async function SendNumber(event) {
    event.preventDefault();
    setError(null);
    try {
      const response = await fetch(
        "http://localhost:8080/user/loginUserNumber",
        {
          method: "POST",
          body: JSON.stringify({ number: number }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setIsLoading(false);
      if (data.state === "Ok") {
        setRedirect("/loginVerification");
      }
      if (data.state === "Error") {
        setError(data.errors);
      }
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <>
      {/* PREMIUM MODAL */}
      <Transition
        in={showConditionsModal}
        timeout={500}
        mountOnEnter
        unmountOnExit
      >
        {(state) => (
          <>
            <TermsConditions show={state} modalClose={closeModal} />
            <Backdrop clicked={closeModal} show={state} />
          </>
        )}
      </Transition>
      {/* prettier-ignore */}
      {redirect && redirect === "/loginVerification" && (
        <Redirect
          to={{ pathname: "/loginVerification", state: { number: number } }}
        />
      )}

      {/* <Link to="/" className="fixed-back-menu">
  <div></div>
  <span>Back</span>
</Link> */}

      <div className="padding-page" style={{ paddingTop: "7rem" }}>
        <div className="icon-title">
          <div className="icon logo">
            <div>
              <span></span>
            </div>
          </div>
          <h2>Welcome to Vitrini</h2>
        </div>

        <p className="description-p terms-conditions">
          To register or log in, please enter your mobile number. By registering
          on Vitrini, you agree to the{" "}
          <a onClick={toggleConditionsModal}>Privacy Policy</a>.
        </p>

        <form onSubmit={SendNumber} className="regular-form">
          {/* FORM INPUT */}
          <div className="form-field">
            <div className="input-label">Mobile Number</div>
            <div className="form-input">
              <input
                name="number"
                autoComplete="off"
                onChange={(e) => setNumber(e.target.value)}
                type="number"
                placeholder="e.g., 09125638745"
              />

              <div className="input-check"></div>
            </div>

            {error && error.find((e) => e.param === "number") && (
              <div className="input-validation">
                <span></span>
                <p>{error.find((e) => e.param === "number").msg}</p>
              </div>
            )}
          </div>

          <input className="button form-btn" type="submit" value="Continue" />
        </form>
      </div>
    </>
  );
}

export default LoginNumberPage;
