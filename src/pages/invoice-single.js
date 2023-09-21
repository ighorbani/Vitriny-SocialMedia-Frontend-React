import { useHistory, useParams, Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Transition from "react-transition-group/Transition";
import { useSelector, useDispatch } from "react-redux";
import Backdrop from "../components/backdrop";
import FooterMenu from "../components/footer-menu";
import moment from "jalali-moment";

function InvoiceSinglePage(props) {
  const params = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const token = localStorage.getItem("token");
  const availableUser = useSelector((state) => state.user);
  const [invoice, setInvoice] = useState();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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

  function commaSeparateNumber(val) {
    while (/(\d+)(\d{3})/.test(val.toString())) {
      val = val.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    }
    return val;
  }

  return (
    <>
      <div className="top-menu-name financial-management-page">
        <>
          <div onClick={history.goBack} className="back-menu"></div>

          {invoice && (
            <div className="comment-product-page-title">
              <h2>Invoice Details</h2>
              <h5>{invoice.businessName}</h5>
            </div>
          )}
        </>
      </div>

      <div className="financial-management-cnt">
        {invoice && !invoice.forMe && (
          <div
            className={
              "financial-management-state " + (invoice.payed ? "paid" : "")
            }
          >
            <div className="state-icon">
              <div>
                <span></span>
              </div>
            </div>
            <h2>Invoice {invoice.invoiceNumber}</h2>
            <div className="financial-states">
              <div className="i">
                <h3>Payment Status</h3>
                <span className="payment-status">
                  {invoice.payed ? "Paid" : "Not Paid"}
                </span>
              </div>
              <div className="i">
                <h3>Creation Date</h3>
                <span className="date">
                  {moment(invoice.date).locale("en").format("YYYY / MM / DD")}
                </span>
              </div>
              <div className="i">
                <h3>User Name</h3>
                <span>{invoice.userName}</span>
              </div>
              <div className="i" style={{ borderBottom: "none" }}>
                <h3>User Code</h3>
                <span>{invoice.userSlug}</span>
              </div>

              <div className="invoice-item">
                <h5>Sale Item</h5>
                <div className="invoice-item-flx">
                  <div className="i">
                    <h3>Title</h3>
                    <span>{invoice.itemName}</span>
                  </div>
                  <div className="i">
                    <h3>Unit</h3>
                    <span>{invoice.unit}</span>
                  </div>
                  <div className="i">
                    <h3>Price</h3>
                    <span>{commaSeparateNumber(invoice.itemPrice)} Toman</span>
                  </div>

                  <div className="i">
                    <blockquote>{invoice.description}</blockquote>
                  </div>
                </div>
              </div>

              <div className="i summary">
                <h3>Total Amount</h3>
                <span>{commaSeparateNumber(invoice.totalPrice)} Toman</span>
              </div>
            </div>
          </div>
        )}
        {invoice && !invoice.forMe && !invoice.payed && (
          <div className="invoice-ctas">
            <Link
              to={{
                pathname: "/resendInvoice",
                state: {
                  // userName: props.location.state.userName,
                  // userId: props.location.state.userId,
                },
              }}
              className="button green"
            >
              Resend to User
            </Link>

            <Link
              to={{
                pathname: "/editInvoice",
                state: {
                  invoiceId: props.location.state.invoiceId,
                  userId: props.location.state.userId,
                },
              }}
              className="button green-outline"
            >
              Edit
            </Link>
          </div>
        )}

        {invoice && invoice.forMe && (
          <>
            <div className="icon-title" style={{ marginTop: "-2rem" }}>
              <div className="icon invoice">
                <div>
                  <span></span>
                </div>
              </div>
              <h2>{invoice.itemName}</h2>
              <p>{invoice.businessName}</p>
            </div>

            <div className="invoice">
              <div className="invoice-row">
                <h5>Product</h5>
                <span>{invoice.itemName}</span>
              </div>

              <div className="invoice-row">
                <h5>Price</h5>
                <span>{commaSeparateNumber(invoice.itemPrice)} Toman</span>
              </div>

              <div className="invoice-row">
                <h5>Unit</h5>
                <span>{invoice.unit}</span>
              </div>

              <div className="invoice-row">
                <h5>Invoice Number</h5>
                <span>{invoice.invoiceNumber}</span>
              </div>
            </div>

            <Link to="" className="button">
              Pay {commaSeparateNumber(invoice.totalPrice)} Toman
            </Link>
          </>
        )}
      </div>
    </>
  );
}

export default InvoiceSinglePage;
