import React from "react";

import Header from "./Header";

import "../css/responsive.css";
const App = props => {
  return (
    <div className="top-wrapper">
      <Header props={props}></Header>
      <div className="container">{props.children}</div>
    </div>
  );
};

export default App;
