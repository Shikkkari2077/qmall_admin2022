import React from "react";
import { Link } from 'react-router-dom'

class ForVendorSideNavBar extends React.Component {

  render() {
    return (
      <nav className="pcoded-navbar noprint">
        <div className="pcoded-inner-navbar main-menu">

          <ul className="pcoded-item pcoded-left-item">
            <li className="">
              <Link to="/">
                <span className="pcoded-micon"><i className="feather icon-home"></i></span>
                <span className="pcoded-mtext">Dashboard</span></Link>
            </li>
            <li className=" ">
              <Link to="/orders">
                <span className="pcoded-micon"><i className="icofont icofont-cart-alt"></i></span>
                <span className="pcoded-mtext">Orders</span>
              </Link>
            </li>
          </ul>
          <div className="pcoded-navigatio-lavel">Master</div>
          <ul className="pcoded-item pcoded-left-item">
            <li className=" ">
              <Link to="/category">
                <span className="pcoded-micon"><i className="feather icon-jfi-view-grid"></i></span>
                <span className="pcoded-mtext">Category Master</span>
              </Link>
            </li>
            <li className=" ">
              <Link to="/products">
                <span className="pcoded-micon"><i className="feather icon-command"></i></span>
                <span className="pcoded-mtext">Product Master</span>
              </Link>
            </li>
            <li className=" ">
              <Link to={"shops/branch/" + localStorage.getItem('q8_mall_ad_uid')}>
                <span className="pcoded-micon"><i className="feather icon-book"></i></span>
                <span className="pcoded-mtext">Branch Master</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

export default ForVendorSideNavBar;
