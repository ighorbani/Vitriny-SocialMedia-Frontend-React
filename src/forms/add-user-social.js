import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import Question from "../components/question";
import Backdrop from "../components/backdrop";
import Transition from "react-transition-group/Transition";

function AddUserSocialFrom(props) {
  const token = localStorage.getItem("token");
  const params = useParams();
  const history = useHistory();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const [type, setType] = useState("");
  const [link, setLink] = useState("");

  let buttonTitle = params.socialId ? "Save Changes" : "Add Social Network";
  let pageTitle = params.socialId
    ? "Edit Social Network"
    : "Add Social Network";

  async function DeleteSocial() {
    setError(null);

    let url = "http://localhost:8080/user/deleteSocial/" + params.socialId;
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

  async function registerSocial(event) {
    event.preventDefault();

    setError(null);

    let url = "";
    let method = "";

    if (params.socialId) {
      url = "http://localhost:8080/user/editSocial/" + params.socialId;
      method = "PUT";
    } else {
      url = "http://localhost:8080/user/addSocial";
      method = "POST";
    }

    try {
      const response = await fetch(url, {
        method: method,
        body: JSON.stringify({ link: link, type: type }),
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

  function toggleDeletePrompt() {
    setShowDeletePrompt((prevState) => !prevState);
  }

  function closePrompt() {
    setShowDeletePrompt(false);
  }

  async function FetchSocial() {
    setError(null);

    try {
      // prettier-ignore
      const response = await fetch("http://localhost:8080/user/getSocial/" + params.socialId);
      // prettier-ignore
      if (!response.ok) {throw new Error("An error occurred while fetching the data!"); }

      const data = await response.json();
      if (data.state === "Ok") {
        setType(data.type);
        setLink(data.link);
      }
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    if (params.socialId) {
      FetchSocial();
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
              title="Delete Social Network"
              reject="Cancel"
              message="Are you sure?"
              promptProceed={DeleteSocial}
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
      <div className="padding add-social-page">
        <p className="description-p">
          To add a social network, complete the following information. The best
          way to display social networks is up to 5 items.
        </p>

        <form className="regular-form" onSubmit={registerSocial}>
          {/* FORM INPUT */}
          <div className="form-field">
            <div className="input-label">Select network type</div>
            <div className="form-input">
              {/* prettier-ignore */}
              <select onChange={(e) => setType(e.target.value)} name="type">
          <option>Select</option>
          {type === "twitter" ? <option value="twitter" selected>Twitter</option> : <option value="twitter" >Twitter</option>}
          {type === "instagram" ? <option value="instagram" selected>Instagram</option> : <option value="instagram" >Instagram</option>}
          {type === "telegram" ? <option value="telegram" selected>Telegram</option> : <option value="telegram" >Telegram</option>}
          {type === "whatsapp" ? <option value="whatsapp" selected>WhatsApp</option> : <option value="whatsapp" >WhatsApp</option>}
          {type === "youtube" ? <option value="youtube" selected>YouTube</option> : <option value="youtube" >YouTube</option>}
          {type === "facebook" ? <option value="facebook" selected>Facebook</option> : <option value="facebook" >Facebook</option>}
        </select>

              <div className="select-chev"></div>
            </div>
          </div>

          {/* FORM INPUT */}
          <div className="form-field">
            <div className="input-label">Page link</div>
            <div className="form-input">
              <input
                onChange={(e) => setLink(e.target.value)}
                name="link"
                type="text"
                value={link}
                placeholder="Enter the link here without spaces"
              />
              <div className="input-check"></div>
            </div>
            {error && error.find((e) => e.param === "link") && (
              <div className="input-validation">
                <span></span>
                <p>{error.find((e) => e.param === "link").msg}</p>
              </div>
            )}
          </div>

          {params.socialId ? (
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

export default AddUserSocialFrom;
