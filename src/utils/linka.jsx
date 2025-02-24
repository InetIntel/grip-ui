import React from 'react';
import { Link } from 'react-router-dom';
import {isUrlExternal} from 'is-url-external';


function LinkA({ to, forceA, ...rest }) {
  if (isUrlExternal(to) || forceA) {
    return <a href={to} {...rest} />;
  }
  return <Link to={to} {...rest} />;
}

export default LinkA;