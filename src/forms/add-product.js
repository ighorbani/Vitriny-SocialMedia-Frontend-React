import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import Transition from "react-transition-group/Transition";
import Backdrop from "../components/backdrop";
import Question from "../components/question";

function AddProductForm(props) {
  const token = localStorage.getItem("token");
  const params = useParams();
  const history = useHistory();
  const [productPic, setProductPic] = useState({ address: "", pic: "" });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  // const [tags, setTags] = useState();
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);

  const [collapseItems, setCollapseItems] = useState([
    {
      name: "presentationModels",
      closed: false,
    },
  ]);
  const [presentations, setPresentation] = useState([
    {
      name: "pricewithFeature",
      selected: true,
      title: "Display with Features and Price",
    },
    {
      name: "deliveryWithCaption",
      selected: false,
      title: "Display with Delivery Date and Caption",
    },
  ]);

  let buttonTitle = params.productId ? "Save Changes" : "Add Product";
  let pageTitle = params.productId ? "Edit Product" : "Add Product";

  async function DeleteProduct() {
    setError(null);

    let url = "http://localhost:8080/deleteProduct/" + params.productId;
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

  function CollapsibleHandler(name) {
    const newState = collapseItems.map((collapseItem, index) => {
      if (collapseItem.name === name) {
        return {
          ...collapseItem,
          closed: (collapseItem.closed = !collapseItem.closed),
        };
      } else {
        return {
          ...collapseItem,
          closed: false,
        };
      }
    });

    setCollapseItems(newState);
  }

  function RemoveImageHandler() {
    setProductPic({ address: "", pic: "" });
  }

  function ChangeImageHandler(event) {
    setProductPic({
      address: URL.createObjectURL(event.target.files[0]),
      pic: event.target.files[0],
    });
  }

  function PresentationHandler(name) {
    const newState = presentations.map((presentation, index) => {
      if (presentation.name === name) {
        return {
          ...presentation,
          selected: (presentation.selected = !presentation.selected),
        };
      } else {
        return {
          ...presentation,
          selected: false,
        };
      }
    });

    setPresentation(newState);
  }

  function toggleDeletePrompt() {
    setShowDeletePrompt((prevState) => !prevState);
  }

  function closePrompt() {
    setShowDeletePrompt(false);
  }

  async function RegisterProduct(event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("destination", "product");
    formData.append("price", price);
    formData.append("description", description);
    // formData.append("tags", tags);
    formData.append("presentType", presentations);
    if (productPic.pic) {
      formData.append("hasImage", "true");
      formData.append("image", productPic.pic);
    } else if (!productPic.address) {
      formData.append("hasImage", "false");
    }

    setError(null);

    let url = "";
    let method = "";

    if (params.productId) {
      url = "http://localhost:8080/editProduct/" + params.productId;
      method = "PUT";
    } else {
      url = "http://localhost:8080/addProduct/" + props.location.state.id;
      method = "POST";
    }

    try {
      const response = await fetch(url, {
        method: method,
        body: formData,
        headers: {
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

  async function FetchProduct() {
    setError(null);

    try {
      // prettier-ignore
      const response = await fetch("http://localhost:8080/getProduct/" + params.productId);
      // prettier-ignore
      if (!response.ok) {throw new Error("There was an error in fetching the data!"); }

      const data = await response.json();

      setProductPic({
        address:
          "http://localhost:8080/uploads/product/" +
          data.product.productInfo.featureImage,
      });
      setName(data.product.productInfo.name);
      setPrice(data.product.productInfo.price);
      setDescription(data.product.productInfo.description);
      // setTags(data.product.productTags.join(" #"));
      setPresentation(data.product.productInfo.presentType);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    if (params.productId) {
      FetchProduct();
    }
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
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
              title="Delete Product"
              reject="Cancel"
              message="Are you sure?"
              promptProceed={DeleteProduct}
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

      <div className="add-product-page">
        {/* <p
          style={{ paddingRight: "2rem", paddingLeft: "2rem" }}
          className="description-p"
        >
          Please enter the required information below.
        </p> */}

        <form className="regular-form" onSubmit={RegisterProduct}>
          {/* FORM INPUT */}
          <div
            className="form-field"
            style={{ paddingRight: "2rem", paddingLeft: "2rem" }}
          >
            <div className="input-label">Product Name</div>
            <div className="form-input">
              <input
                onChange={(e) => setName(e.target.value)}
                name="name"
                type="text"
                autoComplete="off"
                placeholder="Title"
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
          <div
            className="form-field"
            style={{ paddingRight: "2rem", paddingLeft: "2rem" }}
          >
            <div className="input-label">Price or Product Feature</div>
            <div className="form-input">
              <input
                onChange={(e) => setPrice(e.target.value)}
                name="price"
                autoComplete="off"
                type="text"
                placeholder="Price or Feature"
                value={price}
              />
              <div className="input-check"></div>
            </div>
          </div>

          {/* FORM INPUT */}
          {/* <div
            className="form-field"
            style={{ paddingRight: "2rem", paddingLeft: "2rem" }}
          >
            <div className="input-label">Product Tags</div>
            <div className="form-input">
              <input
                onChange={(e) => setTags(e.target.value)}
                name="tags"
                type="text"
                placeholder="Tags like #kebab #delicious_kabab "
                value={tags}
              />
              <div className="input-check"></div>
            </div>
          </div> */}

          {/* FORM INPUT */}
          <div
            className="form-field"
            style={{ paddingRight: "2rem", paddingLeft: "2rem" }}
          >
            <div className="input-label">Description </div>
            <div className="form-input">
              <textarea
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                name="description"
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

          <div style={{ paddingRight: "2rem", paddingLeft: "2rem" }}>
            {/* FORM INPUT */}
            <div className="upload-images">
              <div className="edit-one-img">
                {productPic.address && (
                  <div className="uploaded-image">
                    {/* prettier-ignore */}
                    <div className="uploaded-image-itself" style={{ backgroundImage: `url(${productPic.address})`}} ></div>
                    {/* prettier-ignore */}
                    <div className="remove-image" onClick={RemoveImageHandler}> Remove </div>
                  </div>
                )}

                {/* prettier-ignore */}
                <div className="upload-image-box">
                <input onChange={(e) => ChangeImageHandler(e)} className="image-input" type="file" name="image" />
                <span>Product Image</span>
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
            {params.productId ? (
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
          </div>
        </form>
      </div>
    </>
  );
}

export default AddProductForm;
