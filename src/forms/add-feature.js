import React, { useEffect, useState } from "react";
import Question from "../components/question";
import Transition from "react-transition-group/Transition";
import Backdrop from "../components/backdrop";
import { useHistory, useParams } from "react-router-dom";

function AddFeatureForm(props) {
  const token = localStorage.getItem("token");
  const params = useParams();
  const history = useHistory();
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [icon, setIcon] = useState("");
  const [type, setType] = useState("");

  let buttonTitle = params.featureId ? "Save Changes" : "Add Feature";
  let pageTitle = params.featureId ? "Edit Feature" : "Add Feature";

  async function registerFeature(event) {
    event.preventDefault();
    setError(null);

    let url = "";
    let method = "";

    if (params.featureId) {
      url = "http://localhost:8080/business/editFeature/" + params.featureId;
      method = "PUT";
    } else {
      url =
        "http://localhost:8080/business/addFeature/" + props.location.state.id;
      method = "POST";
    }

    try {
      const response = await fetch(url, {
        method: method,
        body: JSON.stringify({
          title: title,
          value: value,
          type: type,
          icon: icon,
        }),
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

  async function DeleteFeature() {
    setError(null);

    let url =
      "http://localhost:8080/business/deleteFeature/" + params.featureId;
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

  async function FetchFeature() {
    setError(null);

    try {
      const response = await fetch(
        "http://localhost:8080/business/getFeature/" + params.featureId
      );

      if (!response.ok) {
        throw new Error("An error occurred while fetching data!");
      }

      const data = await response.json();
      if (data.state === "Ok") {
        setTitle(data.title);
        setValue(data.value);
        setIcon(data.icon);
        setType(data.type);
      }

      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    if (params.featureId) {
      FetchFeature();
    }
  }, []);

  function toggleDeletePrompt() {
    setShowDeletePrompt((prevState) => !prevState);
  }

  function closePrompt() {
    setShowDeletePrompt(false);
  }

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
              title="Delete Feature"
              reject="Cancel"
              message="Are you sure?"
              promptProceed={DeleteFeature}
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
      <div className="padding register-business-page">
        <p className="description-p">
          Please complete the following fields to add a feature. Try to keep the
          features and their values as concise as possible.
        </p>

        <form className="regular-form" onSubmit={registerFeature}>
          {/* FORM INPUT */}
          <div className="form-field">
            <div className="input-label">Feature Title</div>
            <div className="form-input">
              <input
                onChange={(e) => setTitle(e.target.value)}
                name="title"
                autoComplete="off"
                type="text"
                placeholder="Title"
                value={title}
              />
              <div className="input-check"></div>
            </div>
            {error && error.find((e) => e.param === "title") && (
              <div className="input-validation">
                <span></span>
                <p>{error.find((e) => e.param === "title").msg}</p>
              </div>
            )}
          </div>

          {/* FORM INPUT */}
          <div className="form-field">
            <div className="input-label">Value</div>
            <div className="form-input">
              <input
                onChange={(e) => setValue(e.target.value)}
                name="value"
                autoComplete="off"
                type="text"
                placeholder="Value"
                value={value}
              />
              <div className="input-check"></div>
            </div>
            {error && error.find((e) => e.param === "value") && (
              <div className="input-validation">
                <span></span>
                <p>{error.find((e) => e.param === "value").msg}</p>
              </div>
            )}
          </div>

          {/* FORM INPUT */}
          <div className="form-field">
            <div className="input-label">Display Type</div>
            <div className="form-input">
              <select onChange={(e) => setType(e.target.value)} name="type">
                <option>Select</option>
                {type === "square" ? (
                  <option value="square" selected>
                    Square
                  </option>
                ) : (
                  <option value="square">Square</option>
                )}
                {type === "row" ? (
                  <option value="row" selected>
                    Row
                  </option>
                ) : (
                  <option value="row">Row</option>
                )}
              </select>
              <div className="select-chev"></div>
            </div>
          </div>

          {params.featureId ? (
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

export default AddFeatureForm;
