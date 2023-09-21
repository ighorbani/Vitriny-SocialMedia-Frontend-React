import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";

function AddComment(props) {
  const params = useParams();
  const history = useHistory();
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem("token");

  let buttonTitle = params?.commentId ? "Save Comment" : "Add Comment";
  let pageTitle = params?.commentId ? "Edit Comment" : "Add Comment";

  async function registerComment(event) {
    event.preventDefault();

    setError(null);

    let url = "";
    let method = "";

    if (params.commentId) {
      url = "http://localhost:8080/editComment/" + params.commentId;
      method = "PUT";
    } else {
      url = "http://localhost:8080/addComment/" + props.location.state.id;
      method = "POST";
    }

    try {
      const response = await fetch(url, {
        method: method,
        body: JSON.stringify({ comment: comment }),
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

  return (
    <>
      <div className="top-menu-name">
        <div onClick={history.goBack} className="back-menu"></div>
        <h2>{pageTitle}</h2>
      </div>
      <div className="padding register-business-page">
        <p className="description-p">Please fill in the field below to add a comment.</p>

        <form className="regular-form" onSubmit={registerComment}>
          {/* FORM INPUT */}
          <div className="form-field">
            <div className="input-label">Comment</div>
            <div className="form-input">
              <textarea
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your comment..."
                name="comment"
                id=""
                rows="3"
              ></textarea>
              <div className="input-check"></div>
            </div>

            {error && error.find((e) => e.param === "comment") && (
              <div className="input-validation">
                <span></span>
                <p>{error.find((e) => e.param === "comment").msg}</p>
              </div>
            )}
          </div>

          <input
            className="button form-btn"
            type="submit"
            value={buttonTitle}
          />
        </form>
      </div>
    </>
  );
}

export default AddComment;
