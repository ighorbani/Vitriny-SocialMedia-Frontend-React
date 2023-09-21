import { useHistory, useParams, Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Transition from "react-transition-group/Transition";
import { useSelector, useDispatch } from "react-redux";
import Backdrop from "../components/backdrop";
import FooterMenu from "../components/footer-menu";
import AdminMessageModal from "../modals/admin-message";

function FinancialManagmentPage() {
  const params = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const token = localStorage.getItem("token");
  const availableUser = useSelector((state) => state.user);
  const [financialStatement, setFinancialStatement] = useState();
  const [financialEvidences, setFinancialEvidences] = useState();
  const [noFactor, setNoFactor] = useState(false);
  const [notAccepted, setNotAccepted] = useState(false);
  const [businessName, setBusinessName] = useState(true);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminModalInfo, setAdminModalInfo] = useState({});

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function FetchFinancialStatement() {
    setError(null);
    setIsLoading(true);

    try {
      // prettier-ignore
      const response = await fetch("http://localhost:8080/calculateBusinessFinancial/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      // prettier-ignore
      if (!response.ok) {throw new Error("An error occurred while fetching the data!"); }

      const data = await response.json();
      if (data.state === "Ok") {
        setFinancialStatement(data.financialStatement);
        setNoFactor(false);
      } else if (data.state === "NotAccepted") {
        setNotAccepted(true);
        setBusinessName(data.businessName);
        setFinancialEvidences(data.financialInformation);
      }

      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    FetchFinancialStatement();
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }, []);

  function closeModal() {
    setShowAdminModal(false);
  }

  function toggleAdminModal() {
    setShowAdminModal((prevState) => !prevState);
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

  function commaSeparateNumber(val) {
    while (/(\d+)(\d{3})/.test(val.toString())) {
      val = val.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    }
    return val;
  }

  if (notAccepted) {
    return (
      <>
        {/* FLASH MESSAGE */}
        <Transition
          in={showAdminModal}
          timeout={1000}
          mountOnEnter
          unmountOnExit
        >
          {(state) => (
            <>
              <AdminMessageModal
                info={adminModalInfo}
                show={state}
                hideMessage={closeModal}
              />
              <Backdrop clicked={closeModal} show={state} />
            </>
          )}
        </Transition>
        <div className="chats-page-cnt">
          <div className="top-menu-name financial-managment-page">
            <div onClick={history.goBack} className="back-menu"></div>
            <div className="comment-product-page-title">
              <h2>Financial Reports</h2>
              <h5>{businessName}</h5>
            </div>
          </div>
          <div style={{ paddingTop: "5rem" }}>
            <div className="icon-title">
              <div className="icon factor">
                <div>
                  <span></span>
                </div>
              </div>

              {financialEvidences?.sentForReview === true ? (
                <>
                  <h2>Information Under Review</h2>
                  <p>
                    Your information has been sent for financial account review.
                    The information will be reviewed, and you will be notified
                    of the outcome.
                  </p>
                </>
              ) : financialEvidences?.sentForReview === true ? (
                <>
                  <h2>Your Information Was Not Accepted!</h2>
                  <p>
                    Unfortunately, the information you provided for financial
                    account opening was not accepted. To view the management
                    message, click the button below.
                  </p>
                </>
              ) : (
                <>
                  <h2>Your Financial Account Is Not Active!</h2>
                  <p>
                    Currently, online sales are not available on Vitreeni. This
                    feature will be activated for businesses once the number of
                    users reaches 20,000.
                  </p>
                </>
              )}
            </div>

            {!financialEvidences?.accepted &&
              financialEvidences?.hasAdminMessage && (
                <div
                  onClick={toggleAdminModal}
                  className="button black"
                  style={{ marginTop: "4rem" }}
                >
                  View Admin Message
                </div>
              )}

            {/* {!financialEvidences?.sentForReview &&
      !financialEvidences?.accepted && (
        <Link style={{marginTop:"5rem"}} to="/requestBusinessPaymentForm" className="button green">
          Request Online Sales Capability
        </Link>
      )} */}
          </div>
          <FooterMenu />
        </div>
      </>
    );
  }

  function commaSeparateNumber(val) {
    while (/(\d+)(\d{3})/.test(val.toString())) {
      val = val.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    }
    return val;
  }

  return (
    <>
      {financialStatement && (
        <>
          <div className="top-menu-name financial-managment-page">
            <div onClick={history.goBack} className="back-menu"></div>
            <div className="comment-product-page-title">
              <h2>Financial Management</h2>
              <h5>{financialStatement.businessName}</h5>
            </div>
          </div>

          <div className="financial-managment-cnt">
            <div className="financial-managment-state">
              <div className="state-icon">
                <div>
                  <span></span>
                </div>
              </div>
              <h2>Receivables</h2>
              <div className="financial-states">
                <div className="invoice-item">
                  <h5>Last Month</h5>
                  <div className="invoice-item-flx">
                    <div className="i">
                      <h3>Number of Invoices</h3>
                      <span>{financialStatement.lastMInvoices} invoices</span>
                    </div>
                    <div className="i">
                      <h3>Paid Invoices</h3>
                      <span>
                        {financialStatement.lastMPayedInvoices} invoices
                      </span>
                    </div>
                    <div className="i">
                      <h3>Last Month's Income</h3>
                      <span>
                        {commaSeparateNumber(financialStatement.lastMIncome)}{" "}
                        Toman
                      </span>
                    </div>
                  </div>
                </div>

                <div className="invoice-item">
                  <h5>Total Activity Period</h5>
                  <div className="invoice-item-flx">
                    <div className="i">
                      <h3>Number of Invoices</h3>
                      <span>{financialStatement.totalInvoices} invoices</span>
                    </div>
                    <div className="i">
                      <h3>Paid Invoices</h3>
                      <span>
                        {financialStatement.totalPayedInvoices} invoices
                      </span>
                    </div>
                  </div>
                </div>

                <div className="i summary">
                  <h3>Total Sales</h3>
                  <span>
                    {commaSeparateNumber(financialStatement.totalIncome)} Toman
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default FinancialManagmentPage;
