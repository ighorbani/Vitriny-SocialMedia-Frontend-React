import { useHistory, useParams, Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Question from "../components/question";
import Backdrop from "../components/backdrop";
import Transition from "react-transition-group/Transition";

function AddPhoneForm(props) {
  const token = localStorage.getItem("token");
  const history = useHistory();
  const params = useParams();
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [number, setNumber] = useState("");

  function toggleDeletePrompt() {
    setShowDeletePrompt((prevState) => !prevState);
  }

  function closePrompt() {
    setShowDeletePrompt(false);
  }

  let buttonTitle = params.phoneId ? "Save Changes" : "Add Phone";
  let pageTitle = params.phoneId ? "Edit Phone" : "Add Phone";

  async function DeletePhone() {
    setError(null);

    let url = "http://localhost:8080/business/deletePhone/" + params.phoneId;
    let method = "PUT";

    try {
      const response = await fetch(url, {
        method: method,
        body: JSON.stringify({}),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const data = await response.json();

      if (data.state === "Deleted") {
        history.goBack();
      }
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }
  }

  async function registerPhone(event) {
    event.preventDefault();

    setError(null);

    let url = "";
    let method = "";

    if (params.phoneId) {
      url = "http://localhost:8080/business/editPhone/" + params.phoneId;
      method = "PUT";
    } else {
      url =
        "http://localhost:8080/business/addPhone/" + props.location.state.id;
      method = "POST";
    }

    try {
      const response = await fetch(url, {
        method: method,
        body: JSON.stringify({ number: number }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const data = await response.json();
      if (data.state === "Ok") {
        history.goBack();
      }
      if (data.state === "Error") {
        setError(data.errors);
      }
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }
  }

  async function FetchPhone() {
    setError(null);

    try {
      // Fetch the phone data
      const response = await fetch(
        "http://localhost:8080/business/getPhone/" + params.phoneId
      );
      if (!response.ok) {
        throw new Error("There was an error in fetching the data!");
      }

      const data = await response.json();
      if (data.state === "Ok") {
        setNumber(data.number);
      }
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    if (params.phoneId) {
      FetchPhone();
    }
  }, []);

  return (
    <>
      <Transition
        in={showDeletePrompt}
        timeout={500}
        mountOnEnter
        unmountOnExit
      >
        {(state) => (
          <>
            <Question
              closePrompt={closePrompt}
              accept="Confirm"
              title="Delete Phone"
              reject="Cancel"
              message="Are you sure?"
              promptProceed={DeletePhone}
              show={state}
            />
            <Backdrop clicked={closePrompt} show={state} />
          </>
        )}
      </Transition>
      <div className="top-menu-name">
        <div onClick={history.goBack} className="back-menu"></div>
        <h2>{pageTitle}</h2>
      </div>
      <div className="padding add-phone-page">
        <p className="description-p">
          Please complete the field below to add a phone number.
        </p>

        <form className="regular-form" onSubmit={registerPhone}>
          {/* FORM INPUT */}
          <div className="form-field">
            <div className="input-label">Phone Number</div>
            <div className="form-input">
              <input
                onChange={(e) => setNumber(e.target.value)}
                name="number"
                autoComplete="off"
                type="text"
                placeholder="e.g., 123-456-7890"
                value={number}
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

          {params.phoneId ? (
            <div className="btns-flx">
              <input
                className="button form-btn"
                type="submit"
                value={buttonTitle}
                style={{ flex: "0 0 67%" }}
              />
              <div
                onClick={toggleDeletePrompt}
                className="button red"
                style={{ flex: "0 0 30%" }}
              >
                Delete
              </div>
            </div>
          ) : (
            <input
              className="button form-btn"
              type="submit"
              value={buttonTitle}
            />
          )}
        </form>
      </div>
    </>
  );
}

export default AddPhoneForm;
