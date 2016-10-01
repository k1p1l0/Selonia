import React from "react";
import ReactDOM from "react-dom";

import LayoutContainer from './containers/Layout';

const API_URL = 'https://3j5zptrz4m.execute-api.us-east-1.amazonaws.com/dev';

const app = document.getElementById('app');

ReactDOM.render(<LayoutContainer source={API_URL} />, app);

String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length === 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};