import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import SearchCityPopup from "../popups/search-city";
import Backdrop from "../components/backdrop";
import SelectCategoryPopup from "../popups/select-category";
import Transition from "react-transition-group/Transition";

function EditBusinessForm(props) {
  const token = localStorage.getItem("token");
  const history = useHistory();
  const [showCityPopup, setShowCityPopup] = useState(false);
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState("");
  const [web, setWeb] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState();
  const [slug, setSlug] = useState();
  const [businessPic, setBusinessPic] = useState({
    address: "",
    pic: "",
  });
  const [region, setRegion] = useState("");
  const [businessModel, setBusinessModel] = useState("");
  const [category, setCategory] = useState();
  const [description, setDescription] = useState("");
  const [showFeatureType, setShowFeatureType] = useState("");

  async function registerBusiness(event) {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append("title", name);
    formData.append("destination", "business");
    formData.append("cityName", city.name);
    formData.append("cityId", city.id);
    formData.append("web", web);
    formData.append("address", address);
    formData.append("region", region);
    formData.append("businessModel", businessModel);
    formData.append("categoryId", category.id);
    formData.append("description", description);
    formData.append("showFeatureType", showFeatureType);
    formData.append("slug", slug);
    if (businessPic.pic) {
      formData.append("hasImage", "true");
      formData.append("image", businessPic.pic);
    } else if (!businessPic.address) {
      formData.append("hasImage", "false");
    }

    setError(null);
    try {
      const response = await fetch(
        "http://localhost:8080/editBusiness/" + props.location.state.slug,
        {
          method: "PUT",
          body: formData,
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      const data = await response.json();
      if (data.state === "Ok") {
        history.push(`/businessAdmin/${data.business.businessInfo.slug}`);
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

  function setCityState(info) {
    setCity(info);
    localStorage.setItem("userLocation", JSON.stringify(info));
    closePopup();
  }

  function toggleCityPopup() {
    setShowCityPopup((prevState) => !prevState);
  }

  function ChangeImageHandler(event) {
    setBusinessPic({
      address: URL.createObjectURL(event.target.files[0]),
      pic: event.target.files[0],
    });
  }

  function RemoveImageHandler() {
    setBusinessPic({ address: "", pic: "" });
  }

  function toggleCategoriesPopup() {
    setShowCategoryPopup((prevState) => !prevState);
  }

  function closePopup() {
    setShowCityPopup(false);
    setShowCategoryPopup(false);
  }

  async function FetchBusiness() {
    setIsLoading(true);
    setError(null);
    const getBusinessAdminUrl =
      "http://localhost:8080/getBusinessAdmin/" + props.location.state.slug;

    try {
      // prettier-ignore
      const response = await fetch(getBusinessAdminUrl, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
      // prettier-ignore
      if (!response.ok) {throw new Error("An error occurred while fetching the data!"); }
      const data = await response.json();

      if (data.state === "Ok") {
        setName(data.business.businessInfo.title);
        setRegion(data.business.businessInfo.region);
        setBusinessModel(data.business.businessInfo.businessModel);
        setCategory({
          name: data.business.category.title,
          slug: data.business.category.slug,
          id: data.business.category._id,
        });
        setCity({
          name: data.business.businessInfo.cityName,
          id: data.business.businessInfo.cityId,
        });
        setWeb(data.business.businessInfo.web);
        setAddress(data.business.businessInfo.address);
        setDescription(data.business.businessInfo.description);
        setSlug(data.business.businessInfo.slug);
        setShowFeatureType(data.business.businessInfo.showFeatureType);
        setBusinessPic({
          address:
            "http://localhost:8080/uploads/business/" +
            data.business.businessInfo.indexImage,
        });
      }
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    FetchBusiness();
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
          <p>Fetching information</p>

          <div className="bar">
            <div className="fill"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Transition in={showCityPopup} timeout={500} mountOnEnter unmountOnExit>
        {(state) => (
          <>
            <SearchCityPopup
              popupClose={closePopup}
              setCity={setCityState}
              show={state}
            />
            <Backdrop clicked={closePopup} show={state} />
          </>
        )}
      </Transition>

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

      {!isLoading && (
        <>
          <div className="top-menu-name">
            <div onClick={history.goBack} className="back-menu"></div>
            <h2>Edit Business Information</h2>
          </div>
          <div className="padding register-business-page">
            <p className="description-p">
              To better introduce your business, please complete the following
              information.
            </p>

            <form className="regular-form" onSubmit={registerBusiness}>
              {/* FORM INPUT */}
              <div className="form-field">
                <div className="input-label">Business Name</div>
                <div className="form-input">
                  <input
                    onChange={(e) => setName(e.target.value)}
                    name="title"
                    type="text"
                    autoComplete="off"
                    placeholder="Business Name"
                    value={name}
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
                <div className="input-label">Username (English)</div>
                <div className="form-input">
                  <input
                    name="slug"
                    autoComplete="off"
                    type="text"
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. shahrzad_restaurant"
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
                <div className="input-label">City</div>
                <div className="form-input popup-chev">
                  <div className="popup-selector" onClick={toggleCityPopup}>
                    {city?.name ? city.name : "Select"}
                  </div>
                  <div className="select-chev"></div>
                </div>
              </div>

              {/* FORM INPUT */}
              <div className="form-field">
                <div className="input-label">Region</div>
                <div className="form-input">
                  <input
                    onChange={(e) => setRegion(e.target.value)}
                    name="name"
                    autoComplete="off"
                    type="text"
                    value={region}
                    placeholder="e.g. Kashani"
                  />
                  <div className="input-check"></div>
                </div>
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
                  <div
                    className="popup-selector"
                    onClick={toggleCategoriesPopup}
                  >
                    {category ? category.name : "Select"}
                  </div>
                  <div className="select-chev"></div>
                </div>
              </div>

              {/* FORM INPUT */}
              <div className="form-field">
                <div className="input-label">Display Features Type</div>
                <div className="form-input">
                  <select
                    onChange={(e) => setShowFeatureType(e.target.value)}
                    name="showFeatureType"
                  >
                    <option>Select</option>
                    <option value="square">Square</option>
                    <option value="row">Row</option>
                  </select>
                  <div className="select-chev"></div>
                </div>
              </div>

              {/* FORM INPUT */}
              <div className="form-field">
                <div className="input-label">Website</div>
                <div className="form-input">
                  <input
                    name="web"
                    type="text"
                    onChange={(e) => setWeb(e.target.value)}
                    placeholder="Website (Optional)"
                    value={web}
                  />
                  <div className="input-check"></div>
                </div>
              </div>

              {/* FORM INPUT */}
              <div className="form-field">
                <div className="input-label">Address</div>
                <div className="form-input">
                  <textarea
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Address"
                    name="address"
                    rows="2"
                    value={address}
                  ></textarea>
                  <div className="input-check"></div>
                </div>
              </div>
              <div className="beneath-alert">
                <span>Attention</span>
                <p>
                  Dear user, if your business is online or at home, you can
                  leave the address empty.
                </p>
              </div>

              {/* FORM INPUT */}
              <div className="form-field">
                <div className="input-label">Description</div>
                <div className="form-input">
                  <textarea
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
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
              <div className="upload-images">
                <div className="edit-one-img">
                  {businessPic.address && (
                    <div className="uploaded-image">
                      {/* prettier-ignore */}
                      <div className="uploaded-image-itself" style={{ backgroundImage: `url(${businessPic.address})`}} ></div>
                      {/* prettier-ignore */}
                      <div className="remove-image" onClick={RemoveImageHandler}> Remove </div>
                    </div>
                  )}

                  {/* prettier-ignore */}
                  <div className="upload-image-box">
                  <input onChange={(e) => ChangeImageHandler(e)} accept="image/*" className="image-input" type="file" name="image" />
                  <span>Upload Logo (Optional)</span>
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

export default EditBusinessForm;
