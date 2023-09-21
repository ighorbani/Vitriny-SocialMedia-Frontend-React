import { useHistory, useParams, Link } from "react-router-dom";

function SelectProductPresentation() {
  const params = useParams();
  const history = useHistory();
  return (
    <>
      <div className="top-menu-name">
        <div onClick={history.goBack} className="back-menu"></div>
        <h2>Online Sales Request Form</h2>
      </div>

      <div className="request-business-payment-page">
        <p
          style={{ paddingRight: "2rem", paddingLeft: "2rem" }}
          className="description-p"
        >
          To request the possibility of online sales in the showcase, please
          complete the following form.
          <br />
          {/* <span className="download-info">
            <div className="icon-title">
              <div className="icon cart">
                <div>
                  <span></span>
                </div>
              </div>
            </div>
            To fill out the certificate, use this sample file and after filling it out,
            scan it legibly with your signature and fingerprint and upload it.
            <a
              href="http://localhost:3000/vitriny.png"
              className="button"
              target="_blank"
            >
              Sample Certificate File
            </a>
          </span> */}
        </p>

        <form className="regular-form" onSubmit={RegisterInformation}>
          {/* FORM INPUT */}
          <div
            className="form-field"
            style={{ paddingRight: "2rem", paddingLeft: "2rem" }}
          >
            <div className="input-label">Full Name</div>
            <div className="form-input">
              <input
                onChange={(e) => setName(e.target.value)}
                name="fullName"
                type="text"
                placeholder="Full Name"
                autoComplete="off"
                value={name}
              />
              <div className="input-check"></div>
            </div>
            {error && error.find((e) => e.param === "fullName") && (
              <div className="input-validation">
                <span></span>
                <p>{error.find((e) => e.param === "fullName").msg}</p>
              </div>
            )}
          </div>

          {/* FORM INPUT */}
          <div
            className="form-field"
            style={{ paddingRight: "2rem", paddingLeft: "2rem" }}
          >
            <div className="input-label">Date of Birth</div>
            <div className="form-input">
              <input
                onChange={(e) => setBirthDate(e.target.value)}
                name="birthDate"
                autoComplete="off"
                type="text"
                placeholder="Date of Birth"
                value={birthDate}
              />
              <div className="input-check"></div>
            </div>
          </div>

          {/* FORM INPUT */}
          {/* <div
              className="form-field"
              style={{ paddingRight: "2rem", paddingLeft: "2rem" }}
            >
              <div className="input-label">Residential Address</div>
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
              {error && error.find((e) => e.param === "address") && (
                <div className="input-validation">
                  <span></span>
                  <p>{error.find((e) => e.param === "address").msg}</p>
                </div>
              )}
            </div> */}

          {/* FORM INPUT */}
          <div
            className="form-field"
            style={{ paddingRight: "2rem", paddingLeft: "2rem" }}
          >
            <div className="input-label">Description (Optional)</div>
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

            <input
              className="button form-btn"
              type="submit"
              value="Submit Request"
            />
          </div>
        </form>
      </div>
    </>
  );
}

export default SelectProductPresentation;
