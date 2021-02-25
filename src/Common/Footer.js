import React from "react";

class Footer extends React.Component {
  render() {
    return (
      <footer className="footer">
        <div className="container-fluid clearfix">
          <span className="text-muted d-block text-center text-sm-left d-sm-inline-block">
          @ Ajaar App . All rights reserved
          </span>
          <span className="float-none float-sm-right d-block mt-1 mt-sm-0 text-center"></span>
        </div>
      </footer>
    );
  }
}
export default Footer;
