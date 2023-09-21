import OptionWithIcon from "../components/option-with-icon";
import { useParams, Link } from "react-router-dom";
import SearchCityPopup from "../popups/search-city";
import React, { useEffect, useState } from "react";
import Transition from "react-transition-group/Transition";
import { useSelector, useDispatch } from "react-redux";
import Backdrop from "../components/backdrop";
import FooterMenu from "../components/footer-menu";
import { setActiveBusiness } from "../store/actions/userActions";

function AccountPage() {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const availableUser = useSelector((state) => state.user);
  const [showCityPopup, setShowCityPopup] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unpayedInvoices, setUnpayedInvoices] = useState(0);
  const [business, setBusiness] = useState();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  function toggleCityPopup() {
    setShowCityPopup((prevState) => !prevState);
  }

  function closePopup() {
    setShowCityPopup(false);
  }

  async function fetchUnreadMessages() {
    setError(null);

    try {
      const response = await fetch(
        "http://localhost:8080/fetchUnreadMessages",
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      if (!response.ok) {
        throw new Error("An error occurred while fetching data!");
      }

      const data = await response.json();
      if (data.notSeenCount > 100) {
        setUnreadMessages("+99");
      } else {
        setUnreadMessages(data.notSeenCount);
      }
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }

  async function fetchUnpayedInvoices() {
    setError(null);

    try {
      const response = await fetch(
        "http://localhost:8080/getUnpayedInvoicesCount",
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      if (!response.ok) {
        throw new Error("An error occurred while fetching data!");
      }

      const data = await response.json();

      if (data.state === "Ok") {
        setUnpayedInvoices(data.count);
      }
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }

  async function fetchMyBusiness() {
    setError(null);
    try {
      const response = await fetch("http://localhost:8080/user/getMyBusiness", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (!response.ok) {
        throw new Error("An error occurred while fetching data!");
      }
      const data = await response.json();
      if (data.state === "Ok") {
        setBusiness(data.business);
        dispatch(
          setActiveBusiness({
            title: data.business.businessInfo.title,
            slug: data.business.businessInfo.slug,
            id: data.business._id,
          })
        );
      }

      setUnreadMessages(data.notSeenCount);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    fetchUnpayedInvoices();
    fetchUnreadMessages();
    fetchMyBusiness();
  }, []);

  return (
    <>
      <Transition in={showCityPopup} timeout={500} mountOnEnter unmountOnExit>
        {(state) => (
          <>
            <SearchCityPopup popupClose={closePopup} show={state} />
            <Backdrop clicked={closePopup} show={state} />
          </>
        )}
      </Transition>
      <Link to="/userAdminPage" className="top-menu-user-name">
        <div className="user-name-flx">
          {availableUser.userInfo.pic && (
            <div
              className="user-img"
              style={{
                backgroundImage: `url(http://localhost:8080/uploads/user/${availableUser.userInfo.pic})`,
              }}
            ></div>
          )}

          <div className="user-des">
            <h2>{availableUser.userInfo.name}</h2>
            <h5>My Page</h5>
          </div>
        </div>
        <div className="chev-icon"></div>
      </Link>

      <div className="options-with-icon">
        {business?.businessInfo.slug ? (
          <>
            <Link to={`/businessAdmin/${business.businessInfo.slug}`}>
              <div className="button">{`${business.businessInfo.title}`}</div>
            </Link>
            <OptionWithIcon
              link="/financialManagment"
              iconClass="shop"
              notification={{ active: false, value: "" }}
              title="Financial Reports"
            />

            <OptionWithIcon
              link="/factors"
              iconClass="statement"
              notification={{ active: false, value: "" }}
              title="Invoice Management"
            />
          </>
        ) : (
          <Link to="/registerBusiness">
            <div className="button">Register a Business</div>
          </Link>
        )}

        <OptionWithIcon
          link="/myCart"
          iconClass="cart"
          notification={{
            active: unpayedInvoices !== 0 ? true : false,
            value: unpayedInvoices,
          }}
          title="My Purchases"
        />

        {/* <OptionWithIcon
    link="/chats"
    iconClass="chats"
    notification={{
      active: unreadMessages !== 0 ? true : false,
      value: unreadMessages,
    }}
    title="Messages"
  /> */}

        <OptionWithIcon
          link="/savedItems"
          iconClass="saved"
          notification={{ active: false, value: "" }}
          title="Saved Items"
        />
        {/* <OptionWithIcon
    link="/recentVisited"
    iconClass="recents"
    notification={{ active: false, value: "" }}
    title="Recent Visits"
  /> */}
        {/* <OptionWithIcon
    link="/statistics"
    iconClass="statistics"
    notification={{ active: false, value: "" }}
    title="Visit Statistics"
  /> */}
        <OptionWithIcon
          link="/helpQuestions"
          iconClass="faq"
          notification={{ active: false, value: "" }}
          title="FAQ"
        />
        <OptionWithIcon
          link="/support"
          iconClass="contact"
          notification={{ active: false, value: "" }}
          title="Contact Support"
        />

        {/* <OptionWithIcon
    link="/settings"
    iconClass="settings"
    notification={{ active: false, value: "" }}
    title="Settings"
  /> */}

        <OptionWithIcon
          link="/signOut"
          iconClass="exit"
          notification={{ active: false, value: "" }}
          title="Sign Out"
        />

        {/* <div
    onClick={toggleCityPopup}
    notification={{ active: false, value: "" }}
    title="Change City"
  ></div> */}
      </div>

      <FooterMenu activeItem={"profile"} />
    </>
  );
}

export default AccountPage;
