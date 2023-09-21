import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import Transition from "react-transition-group/Transition";
import Backdrop from "../components/backdrop";
import Question from "../components/question";

function AddInvoiceForm(props) {
  const token = localStorage.getItem("token");
  const params = useParams();
  const history = useHistory();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState("");
  const [price, setPrice] = useState();
  const [unit, setUnit] = useState("");
  const [description, setDescription] = useState("");

  let buttonTitle = props.location.state.invoiceId
    ? "Save Changes"
    : "Create and Send to User";
  let pageTitle = props.location.state.invoiceId
    ? "Edit Invoice"
    : "Add Invoice";

  async function RegisterInvoice(event) {
    event.preventDefault();
    setError(null);

    let url = "";
    let method = "";

    if (props.location.state.invoiceId) {
      url = "http://localhost:8080/editInvoice/";
      method = "PUT";
    } else {
      url = "http://localhost:8080/createInvoice/";
      method = "POST";
    }
    try {
      const response = await fetch(url, {
        method: method,
        body: JSON.stringify({
          name: name,
          price: price,
          unit: unit,
          description: description,
          forUserId: props.location.state.userId,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const data = await response.json();
      if (data.state === "Ok") {
        history.push({
          pathname: "/userChatInvoices",
          state: {
            userId: props.location.state.userId,
            userName: props.location.state.userName,
          },
        });
      }
      if (data.state === "Error") {
        setError(data.errors);
      }
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }
  }

  async function FetchInvoice() {
    setError(null);

    try {
      const response = await fetch("http://localhost:8080/getInvoice/" + props.location.state.invoiceId, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      if (!response.ok) {
        throw new Error("An error occurred while fetching data!");
      }

      const data = await response.json();

      setName(data.invoice.itemName);
      setPrice(data.invoice.itemPrice);
      setUnit(data.invoice.unit);
      setDescription(data.invoice.description);

      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    if (props.location.state.invoiceId) {
      FetchInvoice();
    }
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }, []);

  return (
    <>
      <div className="top-menu-name">
        <div onClick={history.goBack} className="back-menu"></div>
        <h2>{pageTitle}</h2>
      </div>

      <div className="add-product-page">
        <p
          style={{ paddingRight: "2rem", paddingLeft: "2rem" }}
          className="description-p"
        >
          Please enter the required information below.
        </p>

        <form className="regular-form" onSubmit={RegisterInvoice}>
          {/* FORM INPUT */}
          <div
            className="form-field"
            style={{ paddingRight: "2rem", paddingLeft: "2rem" }}
          >
            <div className="input-label">Product / Service Title</div>
            <div className="form-input">
              <input
                onChange={(e) => setName(e.target.value)}
                name="name"
                autoComplete="off"
                type="text"
                placeholder="Product Name"
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
            <div className="input-label">Unit</div>
            <div className="form-input">
              <input
                onChange={(e) => setUnit(e.target.value)}
                name="unit"
                type="text"
                autoComplete="off"
                placeholder="e.g., 2 pieces / 2 hours"
                value={unit}
              />
              <div className="input-check"></div>
            </div>
            {error && error.find((e) => e.param === "unit") && (
              <div className="input-validation">
                <span></span>
                <p>{error.find((e) => e.param === "unit").msg}</p>
              </div>
            )}
          </div>

          {/* FORM INPUT */}
          <div
            className="form-field"
            style={{ paddingRight: "2rem", paddingLeft: "2rem" }}
          >
            <div className="input-label">Amount (in Toman)</div>
            <div className="form-input">
              <input
                onChange={(e) => setPrice(e.target.value)}
                name="price"
                type="number"
                placeholder="Amount"
                autoComplete="off"
                value={price}
              />
              <div className="input-check"></div>
            </div>
            {error && error.find((e) => e.param === "price") && (
              <div className="input-validation">
                <span></span>
                <p>{error.find((e) => e.param === "price").msg}</p>
              </div>
            )}
          </div>

          {/* FORM INPUT */}
          <div
            className="form-field"
            style={{ paddingRight: "2rem", paddingLeft: "2rem" }}
          >
            <div className="input-label">Description</div>
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
            <input
              className="button form-btn"
              type="submit"
              value={buttonTitle}
            />
          </div>
        </form>
      </div>
    </>
  );
}

export default AddInvoiceForm;
