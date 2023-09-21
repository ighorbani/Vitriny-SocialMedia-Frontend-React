import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import moment from "moment";
import UnderConstruction from "../components/under-construction";

function RecentVisited() {
  const params = useParams();
  const history = useHistory();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // async function FetchComments() {
  //
  //   setError(null);
  //
  //     try {
  //       const response = await fetch(
  //         "http://localhost:8080/comments/" + params.businessId
  //       );

  //       if (!response.ok) {
  //         throw new Error("An error occurred while fetching data!");
  //       }

  //       const data = await response.json();
  //       setComments(data.comments);
  //       setIsLoading(false);
  //
  //     } catch (error) {
  //       setError(error.message);
  //     }
  //   }
  //   setIsLoading(false);
  // }

  // useEffect(() => {
  //   FetchComments();
  // }, []);

  return (
    <>
      <div className="top-menu-name">
        <div onClick={history.goBack} className="back-menu"></div>
        <h2>Recent Visits</h2>
      </div>
      <UnderConstruction />
    </>
  );
}

export default RecentVisited;
