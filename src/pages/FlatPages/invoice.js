import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function InvoicePage() {
  const params = useParams();

  const [businessInfo, setBusinessInfo] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function FetchBusiness() {
    setError(null);

    try {
      const response = await fetch(
        "http://localhost:8080/business/" + params.businessId
      );

      if (!response.ok) {
        throw new Error("An error occurred while fetching data!");
      }

      const data = await response.json();
      setBusinessInfo(data.business);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    FetchBusiness();
  }, []);

  return (
    <>
      {!isLoading && !error && businessInfo && (
        <div className="padding-page">
          <div className="icon-title">
            <div className="icon invoice">
              <div>
                <span></span>
              </div>
            </div>
            <h2>One-Year Premium Package</h2>
            <p>{businessInfo.businessInfo.title}</p>
          </div>

          <div className="invoice">
            <div className="invoice-row">
              <h5>Product</h5>
              <span>One-Year Vitrini Premium Package</span>
            </div>

            <div className="invoice-row">
              <h5>Price</h5>
              <span>120,000USD</span>
            </div>

            <div className="invoice-row">
              <h5>Expiration Date</h5>
              <span>1403/06/23</span>
            </div>

            <div className="invoice-row">
              <h5>Business</h5>
              <span>{businessInfo.businessInfo.title}</span>
            </div>
          </div>

          <Link to="" className="button">
            Pay 120,000 USD
          </Link>
        </div>
      )}
    </>
  );
}

export default InvoicePage;
