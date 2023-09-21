import { useParams, Link } from "react-router-dom";
import React, { useState } from "react";

function FilterCategory(props) {
  const [phoneInfo, setPhoneInfo] = useState();

  const popupClasses = [
    "popup filter-popup",
    props.show === "entering"
      ? "pop-up"
      : props.show === "exiting"
      ? "pop-down"
      : null,
  ];

  return (
    <>
      <div className={popupClasses.join(" ")}>
        <div className="popup-top">
          <h2>Filter</h2>
          <span>Clear All</span>
        </div>

        <div className="filters-cnt">
          <div className="filter-item-switch">
            <h4>Colorful Items Only</h4>
            <div className="filter-switch active">
              <div>
                <span></span>
              </div>
            </div>
          </div>
          <div className="filter-item-switch">
            <h4>Colorful Items Only</h4>
            <div className="filter-switch">
              <div>
                <span></span>
              </div>
            </div>
          </div>
          <div className="filter-item-collapsible">
            <div className="filter-collapse">
              <h4>Colorful Items Only</h4>
              <div className="collapse-icon"></div>
            </div>
            <div className="filter-collapse-cnt">
              <div className="filter-choices-cnt">
                <div className="filter-choice">Blue</div>
                <div className="filter-choice active">Blue</div>
                <div className="filter-choice">Blue</div>
              </div>
            </div>
          </div>
          <div className="button green">Apply!</div>
        </div>
      </div>
    </>
  );
}

export default FilterCategory;
