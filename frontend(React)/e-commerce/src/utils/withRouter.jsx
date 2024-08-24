import React from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

export const withRouter = (WrappedComponent) => {
  return (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();

    return (
      <WrappedComponent
        {...props}
        navigate={navigate}
        location={location}
        params={params}
      />
    );
  };
};
