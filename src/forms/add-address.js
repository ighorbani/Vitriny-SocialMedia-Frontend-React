import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

function AddAddressForm(props) {
  const token = localStorage.getItem("token");
  const history = useHistory();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [address, setAddress] = useState("");

  async function AddAddress(event) {
    event.preventDefault();

    setError(null);

    const url = "http://localhost:8080/business/addAddress/";
    const method = "POST";

    try {
      const response = await fetch(url, {
        method: method,
        body: JSON.stringify({
          city: city,
          region: region,
          address: address,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const data = await response.json();
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }
  }

  async function FetchAddress() {
    setError(null);

    try {
      const response = await fetch("http://localhost:8080/business/");
      if (!response.ok) {
        throw new Error("An error occurred while fetching data!");
      }

      const data = await response.json();
      setCity(data.business.city);
      setRegion(data.business.region);
      setAddress(data.business.address);

      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    FetchAddress();
  }, []);

  return (
    <>
      <div className="top-menu-name">
        <div onClick={history.goBack} className="back-menu"></div>
        <h2>Add Address</h2>
      </div>
      <div className="padding register-business-page">
        <p className="description-p">
          Please complete the following fields to add an address.
        </p>

        <form className="regular-form" onSubmit={AddAddress}>
          {/* FORM INPUT */}
          <div className="form-field">
            <div className="input-label">City</div>
            <div className="form-input disabled">
              <input
                onChange={(e) => setCity(e.target.value)}
                name="city"
                type="text"
                placeholder="Select a city"
                value={city}
              />
              <div className="input-check"></div>
            </div>
          </div>

          {/* FORM INPUT */}
          <div className="form-field">
            <div className="input-label">Region</div>
            <div className="form-input">
              <input
                onChange={(e) => setRegion(e.target.value)}
                name="region"
                autoComplete="off"
                type="text"
                value={region}
                placeholder="Region/Street/Neighborhood; e.g., John Street"
              />
              <div className="input-check"></div>
            </div>
          </div>

          {/* FORM INPUT */}
          <div className="form-field">
            <div className="input-label">Address</div>
            <div className="form-input">
              <input
                onChange={(e) => setAddress(e.target.value)}
                name="address"
                autoComplete="off"
                type="text"
                value={address}
                placeholder="e.g., John Street, Second Boulevard..."
              />
              <div className="input-check"></div>
            </div>
          </div>

          <input
            className="button form-btn"
            type="submit"
            value="Add Address"
          />
        </form>
      </div>
    </>
  );
}

export default AddAddressForm;
