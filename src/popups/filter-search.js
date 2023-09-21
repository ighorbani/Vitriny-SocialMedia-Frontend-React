import { useParams, Link } from "react-router-dom";
import React, { useEffect, useState } from "react";

function FilterSearch(props) {
  const userLocation = JSON.parse(localStorage.getItem("userLocation"));
  const [filterCity, setFilterCity] = useState(false);
  const [filterType, setFilterType] = useState([]);

  function ResetFilters() {
    setFilterType([]);
    setFilterCity(false);
  }

  const popupClasses = [
    "popup filter-popup",
    props.show === "entering"
      ? "pop-up"
      : props.show === "exiting"
      ? "pop-down"
      : null,
  ];

  function ToggleCityHandler() {
    setFilterCity((prevState) => !prevState);
  }

  const switchCityClass = ["filter-switch", filterCity && "active"];

  // function TypesHandler(type) {
  //   if (filterType.includes(type)) {
  //     const newTypesArray = filterType.filter(type);
  //     setFilterType(newTypesArray);
  //   } else {
  //     const newTypesArray = [...filterType, type];
  //     setFilterType(newTypesArray);
  //   }
  // }

  // function SetTypesClass(type) {
  //   let typesClass = [
  //     "filter-choice",
  //     filterType.includes(type) ? "active" : "",
  //   ];
  //   return typesClass.join(" ");
  // }

  useEffect(() => {
    // setFilterType(["business", "product"]);
    setFilterCity(false);
  }, []);

  return (
    <>
      <div className={popupClasses.join(" ")}>
        <div className="popup-top">
          <h2>Filter</h2>
          <span onClick={ResetFilters}>Clear All</span>
        </div>

        <div className="filters-cnt">
          <div className="filter-item-switch">
            <h4>Show items in {userLocation.name}</h4>
            <div
              className={switchCityClass.join(" ")}
              onClick={ToggleCityHandler}
            >
              <div>
                <span></span>
              </div>
            </div>
          </div>

          {/* <div className="filter-item-collapsible">
      <div className="filter-collapse">
        <h4>Search only in these items</h4>
        <div className="collapse-icon"></div>
      </div>
      <div className="filter-collapse-cnt">
        <div className="filter-choices-cnt">
          {[
            { type: "business", name: "In Businesses" },
            { type: "product", name: "In Products" },
          ].map((item, index) => (
            <div
              key={index}
              className={SetTypesClass(item.type)}
              onClick={TypesHandler.bind(this, item.type)}
            >
              {item.name}
            </div>
          ))}
        </div>
      </div>
    </div> */}

          <div
            className="button green"
            onClick={props.onApply.bind(this, {
              // types: filterType,
              city: filterCity,
              hasFilter: filterCity,
            })}
          >
            Apply!
          </div>
        </div>
      </div>
    </>
  );
}

export default FilterSearch;
