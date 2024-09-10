import React from "react";
import {
  useNavigate,
  useLocation,
  useParams,
  useLoaderData,
} from "react-router-dom";

export const withRouter = (WrappedComponent) => {
  return (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const loaderData = useLoaderData();

    return (
      <WrappedComponent
        {...props}
        navigate={navigate}
        location={location}
        params={params}
        loaderData={loaderData}
      />
    );
  };
};
