import React from "react";
import ReactDOM from "react-dom";

import Layout from './components/Layout';

const API_URL = 'https://3j5zptrz4m.execute-api.us-east-1.amazonaws.com/prod/recipients';

const app = document.getElementById('app');

ReactDOM.render(<Layout source={API_URL} />, app);