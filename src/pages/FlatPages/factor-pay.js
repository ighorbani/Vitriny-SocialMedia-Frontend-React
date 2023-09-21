import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link } from "react-router-dom";

function FactorPayPage(props) {
  const token = localStorage.getItem("token");
  const history = useHistory();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [invoice, setInvoice] = useState();

  async function FetchFactor() {
    setError(null);

    try {
      // prettier-ignore
      const response = await fetch("http://localhost:8080/getInvoice/"+ props.location.state.invoiceId, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      // prettier-ignore
      if (!response.ok) {throw new Error("An error occurred while fetching the data!"); }

      const data = await response.json();
      if (data.state === "Ok") {
        setInvoice(data.invoice);
      }

      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    FetchFactor();
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }, []);

  return (
    <>
      <Link to="/" className="fixed-back-menu">
        <div></div>
        <span>Back</span>
      </Link>

      {invoice && (
        <div className="padding-page" style={{ paddingTop: "8rem" }}>
          <div className="icon-title">
            <div className="icon invoice">
              <div>
                <span></span>
              </div>
            </div>
            <h2>{invoice.items[0].name}</h2>
            <p>{invoice.fromBusiness.businessInfo.title}</p>
          </div>

          <div className="invoice">
            <div className="invoice-row">
              <h5>Product</h5>
              <span>{invoice.items[0].name}</span>
            </div>

            <div className="invoice-row">
              <h5>Price</h5>
              <span>{invoice.items[0].price}USD</span>
            </div>

            <div className="invoice-row">
              <h5>Unit</h5>
              <span>{invoice.items[0].unit}</span>
            </div>

            <div className="invoice-row">
              <h5>Invoice Number</h5>
              <span>{invoice.invoiceInfo.number}</span>
            </div>
          </div>

          <Link to="" className="button">
            Pay {invoice.invoiceInfo.totalPrice} Dollar
          </Link>
        </div>
      )}
    </>
  );
}

export default FactorPayPage;
