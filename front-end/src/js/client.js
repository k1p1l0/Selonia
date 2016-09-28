import React from "react";
import ReactDOM from "react-dom";

import LayoutContainer from './containers/Layout';

const API_URL = 'https://3j5zptrz4m.execute-api.us-east-1.amazonaws.com/prod';

const app = document.getElementById('app');

ReactDOM.render(<LayoutContainer source={API_URL} />, app);