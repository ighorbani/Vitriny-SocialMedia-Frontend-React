import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import SearchCityPopup from "../popups/search-city";
import Backdrop from "../components/backdrop";
import SelectCategoryPopup from "../popups/select-category";
import Transition from "react-transition-group/Transition";
import { useSelector, useDispatch } from "react-redux";
import { editUser, setUser } from "../store/actions/userActions";

function EditUserPageForm(props) {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const history = useHistory();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [pagePrivacy, setPagePrivacy] = useState("public");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState();
  const [userPic, setUserPic] = useState({
    address: "",
    pic: "",
  });
  const [userModel, setUserModel] = useState("");
  const [description, setDescription] = useState("");

  async function RegisterUser(event) {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("destination", "user");
    formData.append("description", description);
    formData.append("pagePrivacy", pagePrivacy);
    formData.append("slug", slug);
    if (userPic.pic) {
      formData.append("hasImage", "true");
      formData.append("image", userPic.pic);
    } else if (!userPic.address) {
      formData.append("hasImage", "false");
    }

    setError(null);
    try {
      const response = await fetch("http://localhost:8080/user/editUser", {
        method: "PUT",
        body: formData,
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      const data = await response.json();
      if (data.state === "Ok") {
        dispatch(editUser(data.user));
        history.push("/userAdminPage");
      }
      if (data.state === "Error") {
        setError(data.errors);
      }
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }
  }

  function ChangeImageHandler(event) {
    setUserPic({
      address: URL.createObjectURL(event.target.files[0]),
      pic: event.target.files[0],
    });
  }

  function RemoveImageHandler() {
    setUserPic({ address: "", pic: "" });
  }

  async function FetchUser() {
    setIsLoading(true);
    setError(null);
    const getUserAdminUrl = "http://localhost:8080/user/getUserAdmin";

    try {
      // prettier-ignore
      const response = await fetch(getUserAdminUrl, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
      // prettier-ignore
      if (!response.ok) {throw new Error("An error occurred while fetching the data!"); }
      const data = await response.json();
      if (data.state === "Ok") {
        setName(data.result.userInfo.name);
        setDescription(data.result.userInfo.aboutMe);
        setSlug(data.result.userInfo.slug);
        setPagePrivacy(data.result.pagePrivacy);
        setUserPic({
          address:
            "http://localhost:8080/uploads/user/" + data.result.userInfo.pic,
        });
      }
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    FetchUser();
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }, []);

  if (isLoading) {
    return (
      <div className="loading-page">
        <div className="icon-title">
          <div className="icon diamond ">
            <div>
              <span className="loading-rotate"></span>
            </div>
          </div>
        </div>
        <div className="animated-fillbar">
          <h5>Please wait...</h5>
          <p>Fetching data</p>

          <div className="bar">
            <div className="fill"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {!isLoading && (
        <>
          <div className="top-menu-name">
            <div onClick={history.goBack} className="back-menu"></div>
            <h2>Edit Page Information</h2>
          </div>
          <div className="padding register-user-page">
            <p className="description-p">
              To introduce yourself better, please complete the following
              information.
            </p>

            <form className="regular-form" onSubmit={RegisterUser}>
              {/* FORM INPUT */}
              <div className="form-field">
                <div className="input-label">Name</div>
                <div className="form-input">
                  <input
                    onChange={(e) => setName(e.target.value)}
                    name="name"
                    type="text"
                    autoComplete="off"
                    placeholder="Name (English)"
                    value={name}
                  />
                  <div className="input-check"></div>
                </div>
                {error && error.find((e) => e.param === "name") && (
                  <div className="input-validation">
                    <span></span>
                    <p>{error.find((e) => e.param === "name").msg}</p>
                  </div>
                )}
              </div>

              {/* FORM INPUT */}
              <div className="form-field">
                <div className="input-label">Username (English)</div>
                <div className="form-input">
                  <input
                    name="slug"
                    autoComplete="off"
                    type="text"
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g., ali_alavi"
                    value={slug}
                  />
                  <div className="input-check"></div>
                </div>
                {error && error.find((e) => e.param === "slug") && (
                  <div className="input-validation">
                    <span></span>
                    <p>{error.find((e) => e.param === "slug").msg}</p>
                  </div>
                )}
              </div>

              {/* FORM INPUT */}
              <div className="form-field">
                <div className="input-label">About Me</div>
                <div className="form-input">
                  <textarea
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="About Me"
                    name="description"
                    id=""
                    rows="3"
                    value={description}
                  ></textarea>
                  <div className="input-check"></div>
                </div>
                {error && error.find((e) => e.param === "description") && (
                  <div className="input-validation">
                    <span></span>
                    <p>{error.find((e) => e.param === "description").msg}</p>
                  </div>
                )}
              </div>

              {/* FORM INPUT */}
              {/* <div className="form-field">
              <div className="input-label">Page Customization</div>
              <div className="form-input">
                <select
                  onChange={(e) => setPagePrivacy(e.target.value)}
                  name="pagePrivacy"
                >
                  <option>Select</option>
                  <option value="private">Private</option>
                  <option value="public">Public</option>
                </select>
                <div className="select-chev"></div>
              </div>
            </div> */}

              {/* FORM INPUT */}
              <div className="upload-images">
                <div className="edit-one-img">
                  {userPic.address && (
                    <div className="uploaded-image">
                      {/* prettier-ignore */}
                      <div className="uploaded-image-itself" style={{ backgroundImage: `url(${userPic.address})`}} ></div>
                      {/* prettier-ignore */}
                      <div className="remove-image" onClick={RemoveImageHandler}>Remove</div>
                    </div>
                  )}

                  {/* prettier-ignore */}
                  <div className="upload-image-box">
                  <input onChange={(e) => ChangeImageHandler(e)} accept="image/*" className="image-input" type="file" name="image" />
                  <span>Upload Photo (Optional)</span>
                  <div></div>
                </div>
                </div>
              </div>

              <input
                className="button form-btn"
                type="submit"
                value="Submit Information"
              />
            </form>
          </div>
        </>
      )}
    </>
  );
}

export default EditUserPageForm;
