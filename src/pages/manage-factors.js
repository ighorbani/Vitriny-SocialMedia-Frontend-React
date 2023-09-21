import { useHistory, useParams, Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Transition from "react-transition-group/Transition";
import { useSelector, useDispatch } from "react-redux";
import Backdrop from "../components/backdrop";
import FooterMenu from "../components/footer-menu";

function ManageFactorsPage() {
  const params = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const token = localStorage.getItem("token");
  const availableUser = useSelector((state) => state.user);
  const [noFactor, setNoFactor] = useState(true);
  const [invoices, setInvoices] = useState([]);
  const [businessName, setBusinessName] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function FetchFactors() {
    setError(null);
    setIsLoading(true);
    try {
      // prettier-ignore
      const response = await fetch("http://localhost:8080/getBusinessInvoices/", {
        body: JSON.stringify(),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      // prettier-ignore
      if (!response.ok) {throw new Error("An error occurred while fetching the data!"); }

      const data = await response.json();
      if (data.state === "Ok") {
        setInvoices(data.invoices);
        setNoFactor(false);
      } else if (data.state === "No") {
        setNoFactor(true);
        setBusinessName(data.businessName);
      }

      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    FetchFactors();
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }, []);

  function SeeFactorHandler(invoiceId) {
    history.push({
      pathname: "/invoiceSingle",
      state: {
        invoiceId: invoiceId,
      },
    });
  }

  function commaSeparateNumber(val) {
    while (/(\d+)(\d{3})/.test(val.toString())) {
      val = val.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    }
    return val;
  }

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

  if (noFactor) {
    return (
      <div className="chats-page-cnt factors-managment-page">
        <div className="top-menu-name">
          <div onClick={history.goBack} className="back-menu"></div>
          <div className="comment-product-page-title">
            <h2>Sales Invoices</h2>
            <h5>{businessName}</h5>
          </div>
        </div>
        <div className="padding-page">
          <div className="icon-title">
            <div className="icon factor">
              <div>
                <span></span>
              </div>
            </div>
            <h2>No Invoices Found!</h2>
            <p>You haven't created any sales invoices yet.</p>
          </div>
        </div>
        <FooterMenu />
      </div>
    );
  }

  return (
    <div className="factors-managment-page">
      <div className="top-menu-name">
        <div onClick={history.goBack} className="back-menu"></div>
        <div className="comment-product-page-title">
          <h2>Sales Invoices</h2>
          <h5>{businessName}</h5>
        </div>
      </div>
      <div className="factors-managment-cnt">
        {invoices.length &&
          invoices.map((invoice, index) => (
            <div
              onClick={SeeFactorHandler.bind(this, invoice._id)}
              key={index}
              className={
                "factor-item " + (invoice.invoiceInfo.payed ? "payed" : "")
              }
            >
              <div className="number">{invoice.invoiceInfo.number}</div>
              <div className="img">
                <div></div>
              </div>
              <div className="cnt">
                <h4>{invoice.items[0].name}</h4>
                <h5 className="factor-price-name">
                  <span>
                    {commaSeparateNumber(invoice.items[0].price)} Toman
                  </span>
                  <span>
                    {invoice.forUser.userInfo.name.length < 8
                      ? invoice.forUser.userInfo.name
                      : invoice.forUser.userInfo.name.substring(0, 8) + " ..."}
                  </span>
                </h5>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default ManageFactorsPage;
