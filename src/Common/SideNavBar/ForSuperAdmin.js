import React from "react";
import { Link } from 'react-router-dom'

class SideNavBar extends React.Component {

  render() {
    return (
      <nav className="pcoded-navbar noprint" id="admin_menu">
        <div className="pcoded-inner-navbar main-menu">
             {console.log(localStorage.getItem("q8_mall_auth"))}
          <ul className="pcoded-item pcoded-left-item">
            <li className="">
              <Link to="/">
                <span className="pcoded-micon"><i className="feather icon-home"></i></span>
                <span className="pcoded-mtext">Dashboard</span></Link>
            </li>
            <li className="">
              <Link to="/customers">
                <span className="pcoded-micon"><i className="icofont icofont-users-alt-3"></i></span>
                <span className="pcoded-mtext">Customers</span>
              </Link>
            </li>
            <li className="">
              <Link to="/driver">
                <span className="pcoded-micon"><i className="fa fa-drivers-license"></i></span>
                <span className="pcoded-mtext">Drivers</span>
              </Link>
            </li>
            <li className="">
              <Link to="/shops">
                <span className="pcoded-micon"><i className="icofont icofont-building-alt"></i></span>
                <span className="pcoded-mtext">Shops</span>
              </Link>
            </li>
            {/* <li className=" ">
              <Link to="/warehouse-orders">
                <span className="pcoded-micon"><i className="icofont icofont-cart"></i></span>
                <span className="pcoded-mtext">Ware House Orders</span>
              </Link>
            </li> */}
            <li className=" ">
              <Link to="/orders">
                <span className="pcoded-micon"><i className="icofont icofont-cart-alt"></i></span>
                <span className="pcoded-mtext">Orders</span>
              </Link>
            </li>
            <li className="">
              <Link to="/section">
                <span className="pcoded-micon"><i className="feather icon-slack f-17"></i></span>
                <span className="pcoded-mtext">Shops Section</span>
              </Link>
            </li>
          </ul>
          <div className="pcoded-navigatio-lavel">Master</div>
          <ul className="pcoded-item pcoded-left-item">
            <li className=" ">
              <Link to="/coupons">
                <span className="pcoded-micon"><i className="feather icon-tag"></i></span>
                <span className="pcoded-mtext">Coupon Master</span>
              </Link>
            </li>
            <li className=" ">
              <Link to="/category">
                <span className="pcoded-micon"><i className="feather icon-jfi-view-grid"></i></span>
                <span className="pcoded-mtext">Category Master</span>
              </Link>
            </li>
            <li className=" ">
              <Link to="/attribute-types">
                <span className="pcoded-micon"><i className="feather icon-aperture"></i></span>
                <span className="pcoded-mtext">Attribute Type Master</span>
              </Link>
            </li>
            {/*
            <li className=" ">
              <Link to="/attributes">
                <span className="pcoded-micon"><i className="feather icon-edit-2"></i></span>
                <span className="pcoded-mtext">Product Attribute Master</span>
              </Link>
            </li>
            <li className=" ">
              <Link to="/attribute-values">
                <span className="pcoded-micon"><i className="feather icon-life-buoy"></i></span>
                <span className="pcoded-mtext">Attribute Value Master</span>
              </Link>
            </li>
            */}
            <li className=" ">
              <Link to="/products">
                <span className="pcoded-micon"><i className="feather icon-command"></i></span>
                <span className="pcoded-mtext">Product Master</span>
              </Link>
            </li>
            <li className=" ">
              <Link to="/barcode">
                <span className="pcoded-micon"><i className="fa fa-barcode"></i></span>
                <span className="pcoded-mtext">Barcode Master</span>
              </Link>
            </li>
            <li className=" ">
              <Link to="/delivery-type">
                <span className="pcoded-micon"><i className="feather icon-shopping-cart"></i></span>
                <span className="pcoded-mtext">Delivery Type Master</span>
              </Link>
            </li>
            <li className=" ">
              <Link to="/reason">
                <span className="pcoded-micon"><i className="feather icon-shopping-cart"></i></span>
                <span className="pcoded-mtext">Delivery Reject Reason Master</span>
              </Link>
            </li>
            <li className=" ">
              <Link to="/banner">
                <span className="pcoded-micon"><i className="feather icon-image"></i></span>
                <span className="pcoded-mtext">Banner Master  </span>
              </Link>
            </li>
            <li className=" ">
              <Link to="/payment-methods">
                <span className="pcoded-micon"><i className="feather icon-tag"></i></span>
                <span className="pcoded-mtext">Payment Methods Master  </span>
              </Link>
            </li>
            <li className=" ">
              <Link to="/languages">
                <span className="pcoded-micon"><i className="feather icon-globe"></i></span>
                <span className="pcoded-mtext">Language Master  </span>
              </Link>
            </li>

            <li className=" pcoded-hasmenu">
              <a href="javascript:void(0)">
                <span className="pcoded-micon"><i className="feather icon-map-pin"></i></span>
                <span className="pcoded-mtext">Location Master</span>
              </a>
              <ul className="pcoded-submenu">
                <li className=" ">
                  <Link to="/country">
                    <span className="pcoded-mtext">Country</span>
                  </Link>
                </li>
                <li className=" ">
                  <Link to="/governorate">
                    <span className="pcoded-mtext">Governorate</span>
                  </Link>
                </li>
                <li className=" ">
                  <Link to="/area">
                    <span className="pcoded-mtext">Area</span>
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
          {/* </li>
          </ul> */}
          <div className="pcoded-navigatio-lavel">Settings</div>
          <ul className="pcoded-item pcoded-left-item">
            <li className="">
              <Link to="/notifications">
                <span className="pcoded-micon"><i className="icofont icofont-notification"></i></span>
                <span className="pcoded-mtext">Push Notification</span>
              </Link>
            </li>
            <li className="">
              <Link to="/terms">
                <span className="pcoded-micon"><i className="icofont icofont-law-document"></i></span>
                <span className="pcoded-mtext">Terms & conditions</span>
              </Link>
            </li>
            {/* <li className="">
              <Link to="/refund-policy">
                <span className="pcoded-micon"><i className="feather icon-refresh-ccw"></i></span>
                <span className="pcoded-mtext">Refund Policy</span>
              </Link>
            </li> */}
            <li className="">
              <Link to="/contact-us">
                <span className="pcoded-micon"><i className="feather icon-phone"></i></span>
                <span className="pcoded-mtext">Contact Us</span>
              </Link>
            </li>
            <li className="">
              <Link to="/contact-us/settings">
                <span className="pcoded-micon"><i className="feather icon-info"></i></span>
                <span className="pcoded-mtext">Contact Us Settings</span>
              </Link>
            </li>
            <li className="">
              <Link to="/delivery-time">
                <span className="pcoded-micon"><i className="feather icon-clock"></i></span>
                <span className="pcoded-mtext">Delivery Time Settings</span>
              </Link>
            </li>
          </ul>

        </div>
      </nav>
    );
  }
}

export default SideNavBar;