import React, { useState } from "react";
import {
  useHistory,
  Link,
  useParams,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { Transition } from "react-transition-group";
import Backdrop from "../components/backdrop";
import SelectCategoryPopup from "../popups/select-category";

function RegisterBusinessForm() {
  const token = localStorage.getItem("token");
  const history = useHistory();
  const [businessPicAddress, setBusinessPicAddress] = useState("");
  const [businessPic, setBusinessPic] = useState("");
  const [category, setCategory] = useState();

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [businessModel, setBusinessModel] = useState("");
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);

  async function registerBusiness(event) {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append("title", name);
    formData.append("destination", "business");
    formData.append("businessModel", businessModel);
    formData.append("categoryId", category.id);

    if (businessPic) {
      formData.append("hasImage", "true");
      formData.append("image", businessPic);
    }

    setError(null);
    try {
      const response = await fetch(
        "http://localhost:8080/business/registerBusiness",
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      const data = await response.json();
      if (data.state === "Created") {
        history.push(`/businessAdmin/${data.businessSlug}`);
      }
      if (data.state === "Error") {
        setError(data.errors);
      }
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }
  }

  function setCategoryState(info) {
    setCategory(info);
    closePopup();
  }

  function changeImageHandler(event) {
    setBusinessPicAddress(URL.createObjectURL(event.target.files[0]));
    setBusinessPic(event.target.files[0]);
  }

  function toggleCategoriesPopup() {
    setShowCategoryPopup((prevState) => !prevState);
  }

  function closePopup() {
    setShowCategoryPopup(false);
  }

  function RemoveImageHandler() {
    setBusinessPicAddress("");
    setBusinessPic("");
  }

  if (isLoading) {
    return (
      <div className="loading-page">
        <div className="icon-title">
          <div className="icon diamond">
            <div>
              <span className="loading-rotate"></span>
            </div>
          </div>
        </div>
        <div className="animated-fillbar">
          <h5>Please wait...</h5>
          <p>Registering the business</p>

          <div className="bar">
            <div className="fill"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Transition
        in={showCategoryPopup}
        timeout={500}
        mountOnEnter
        unmountOnExit
      >
        {(state) => (
          <>
            <SelectCategoryPopup
              setCategory={setCategoryState}
              popupClose={closePopup}
              show={state}
            />
            <Backdrop clicked={closePopup} show={state} />
          </>
        )}
      </Transition>

      <div className="top-menu-name">
        <div onClick={history.goBack} className="back-menu"></div>
        <h2>Register a Business</h2>
      </div>
      <div className="padding register-business-page">
        <p className="description-p">
          Please enter the initial information for your business below.
        </p>

        <form onSubmit={registerBusiness} className="regular-form">
          {/* FORM INPUT */}
          <div className="form-field">
            <div className="input-label">Business Name</div>
            <div className="form-input">
              <input
                name="title"
                type="text"
                onChange={(e) => setName(e.target.value)}
                placeholder="Business Name"
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
            <div className="input-label">Business Type</div>
            <div className="form-input">
              <select
                onChange={(e) => setBusinessModel(e.target.value)}
                name="businessModel"
              >
                <option>Select</option>
                <option value="service">Service</option>
                <option value="product">Product</option>
              </select>
              <div className="select-chev"></div>
            </div>
          </div>

          {/* FORM INPUT */}
          <div className="form-field">
            <div className="input-label">Business Category</div>
            <div className="form-input popup-chev">
              <div className="popup-selector" onClick={toggleCategoriesPopup}>
                {category ? category.name : "Select"}
              </div>
              <div className="select-chev"></div>
            </div>
          </div>

          {/* FORM INPUT */}
          <div className="upload-images">
            <div className="edit-one-img">
              {businessPicAddress && (
                <div className="uploaded-image">
                  {/* prettier-ignore */}
                  <div className="uploaded-image-itself" style={{ backgroundImage: `url(${businessPicAddress})`}} ></div>
                  {/* prettier-ignore */}
                  <div className="remove-image" onClick={RemoveImageHandler}> Remove </div>
                </div>
              )}
              <div className="upload-image-box">
                <input
                  onChange={(e) => changeImageHandler(e)}
                  className="image-input"
                  type="file"
                  accept="image/*"
                  name="image"
                />
                <span>Logo Image (Optional)</span>
                <div></div>
              </div>
            </div>
          </div>
          {error && error.find((e) => e.param === "image") && (
            <div className="input-validation">
              <span></span>
              <p>{error.find((e) => e.param === "image").msg}</p>
            </div>
          )}
          <input
            className="button form-btn"
            type="submit"
            value="Register Business"
          />
        </form>
      </div>
    </>
  );
}

export default RegisterBusinessForm;
