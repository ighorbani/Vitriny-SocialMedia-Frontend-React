function SortBusinessesPopup(props) {
  const popupClasses = [
    "popup simple-option-popup",
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
          <h2>In Order...</h2>
          <span id="close-popup" onClick={props.popupClose}></span>
        </div>

        <div className="simple-options" style={{ padding: "0 2rem" }}>
          <div
            className="option"
            onClick={props.sorting.bind(this, "mostVisited")}
          >
            <h4>Most Visited</h4>
          </div>
          <div className="option" onClick={props.sorting.bind(this, "newest")}>
            <h4>Newest</h4>
          </div>
          <div
            className="option"
            onClick={props.sorting.bind(this, "mostProduct")}
          >
            <h4>Most Products</h4>
          </div>
          <div className="option" onClick={props.sorting.bind(this, "oldest")}>
            <h4>Oldest</h4>
          </div>
        </div>
      </div>
    </>
  );
}

export default SortBusinessesPopup;
