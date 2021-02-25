import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import SideNavBar from "./SideNavBar";

class Home extends React.Component {
  render() {
    return (
      <div id="pcoded" className="pcoded">
        <div className="pcoded-overlay-box"></div>
        <div className="pcoded-container navbar-wrapper">
          <Header />
          {
            localStorage.getItem('q8_mall_ad_role') !== "shop"
              ?
              <div className="pcoded-main-container">
                <div className="pcoded-wrapper">
                  <SideNavBar />
                  <div className="pcoded-content" id="admin_content">
                    {this.props.children}
                  </div>
                </div>
              </div>
              :
              <div className="pcoded-main-container">
                {this.props.children}
              </div>
          }
        </div>
      </div>
    );
  }
}

export default Home;
