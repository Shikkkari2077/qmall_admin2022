import React from "react";
import Constant from "../Constant.js";
import { Link } from "react-router-dom";

class ShopAdminDashboard extends React.Component {

  state = {
    itemsSold: 0,
    todaySales: 0,
    totalProduct: 0,
    totalProductPending: 0
  }
  componentWillMount() {
    this.getShopAdminDashboardStats();
  }
  getShopAdminDashboardStats = () => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isLoading: true });
    fetch(Constant.getAPI() + "/product/order/shop/stats", {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": localStorage.getItem('q8_mall_auth')
      },
      body: data
    }).then(function (response) {
      return response.json();
    }).then(function (json) {
      if (json.status === true) {
        that.setState({
          itemsSold: json.data.itemsSold,
          todaySales: json.data.todaySales,
          totalProduct: json.data.totalProduct,
          totalProductPending: json.data.totalProductPending
        });
      } else {
        //console.log(json);
      }
    });
  }
  render() {
    return (
      <div className="pcoded-inner-content">

        <div className="main-body">
          <div className="page-wrapper">

            <div className="page-header">
              <div className="row align-items-end">
                <div className="col-lg-8">
                  <div className="page-header-title">
                    <div className="d-inline">
                      <h4>Dashboard</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="page-body">
              <div className="row">
                <div className="col-xl-3 col-md-6">
                  <div className="card">
                    <div className="card-block">
                      <div className="row align-items-center">
                        <div className="col-8">
                          <h4 className="text-c-green f-w-600">{this.state.todaySales} KWD</h4>
                          <h6 className="text-muted m-b-0">Today's Sales</h6>
                        </div>
                        <div className="col-4 text-right">
                          <i className="icofont icofont-coins f-28"></i>
                        </div>
                      </div>
                    </div>
                    <div className="card-footer bg-c-green">
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-md-6">
                  <div className="card">
                    <div className="card-block">
                      <div className="row align-items-center">
                        <div className="col-8">
                          <h4 className="text-c-yellow f-w-600">{this.state.itemsSold !== null ? this.state.itemsSold :"0"}</h4>
                          <h6 className="text-muted m-b-0">Items Sold Today</h6>
                        </div>
                        <div className="col-4 text-right">
                          <i className="icofont icofont-shopping-cart f-28"></i>
                        </div>
                      </div>
                    </div>
                    <div className="card-footer bg-c-yellow">
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-md-6">
                  <div className="card">
                    <div className="card-block">
                      <div className="row align-items-center">
                        <div className="col-8">
                          <h4 className="text-c-pink f-w-600">{this.state.totalProductPending}</h4>
                          <h6 className="text-muted m-b-0">Pending Products</h6>
                        </div>
                        <div className="col-4 text-right">
                          <i className="feather icon-alert-triangle f-28"></i>
                        </div>
                      </div>
                    </div>
                    <div className="card-footer bg-c-pink">
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-md-6">
                  <div className="card">
                    <div className="card-block">
                      <div className="row align-items-center">
                        <div className="col-8">
                          <h4 className="text-c-blue f-w-600">{this.state.totalProduct}</h4>
                          <h6 className="text-muted m-b-0">Total Products</h6>
                        </div>
                        <div className="col-4 text-right">
                          <i className="feather icon-award f-28"></i>
                        </div>
                      </div>
                    </div>
                    <div className="card-footer bg-c-blue">
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-xl-3 col-md-6">
                  <Link to={"/orders/shop"}>
                    <div className="card card-border-primary">
                      <div className="card-block">
                        <div className="row align-items-center">
                          <div className="col-8">
                            <h6 className="text-amazon m-b-0">Order List</h6>
                          </div>
                          <div className="col-4 text-right">
                            <i className="icofont icofont-cart-alt f-28"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
                {/* <div className="col-xl-3 col-md-6">
                  <Link to={"/category"}>
                    <div className="card card-border-primary">
                      <div className="card-block">
                        <div className="row align-items-center">
                          <div className="col-8">
                            <h6 className="text-amazon m-b-0">Category List</h6>
                          </div>
                          <div className="col-4 text-right">
                            <i className="feather icon-jfi-view-grid f-28"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div> */}

                <div className="col-xl-3 col-md-6">
                  <Link to={"/products"}>
                    <div className="card card-border-primary">
                      <div className="card-block">
                        <div className="row align-items-center">
                          <div className="col-8">
                            <h6 className="text-amazon m-b-0">Products List</h6>
                          </div>
                          <div className="col-4 text-right">
                            <i className="feather icon-command f-28"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
                
                <div className="col-xl-3 col-md-6">
                  <Link to={"/attribute-types"}>
                    <div className="card card-border-primary">
                      <div className="card-block">
                        <div className="row align-items-center">
                          <div className="col-8">
                            <h6 className="text-amazon m-b-0">Attribute</h6>
                          </div>
                          <div className="col-4 text-right">
                            <i className="feather icon-command f-28"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="col-xl-3 col-md-6">
                  <Link to={"/barcode"}>
                    <div className="card card-border-primary">
                      <div className="card-block">
                        <div className="row align-items-center">
                          <div className="col-8">
                            <h6 className="text-amazon m-b-0">Barcode List</h6>
                          </div>
                          <div className="col-4 text-right">
                            <i className="fa fa-barcode f-28"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="col-xl-3 col-md-6">
                  <Link to={"/shops/branch/" + localStorage.getItem('q8_mall_ad_uid')}>
                    <div className="card card-border-primary">
                      <div className="card-block">
                        <div className="row align-items-center">
                          <div className="col-8">
                            <h6 className="text-amazon m-b-0">Branch List</h6>
                          </div>
                          <div className="col-4 text-right">
                            <i className="feather icon-book f-28"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="col-xl-3 col-md-6">
                  <Link to={"/section"}>
                    <div className="card card-border-primary">
                      <div className="card-block">
                        <div className="row align-items-center">
                          <div className="col-8">
                            <h6 className="text-amazon m-b-0">Section List</h6>
                          </div>
                          <div className="col-4 text-right">
                            <i className="feather icon-slack f-28"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
                {/* <div className="col-xl-3 col-md-6">
                  <Link to={"/profile"}>
                    <div className="card card-border-primary">
                      <div className="card-block">
                        <div className="row align-items-center">
                          <div className="col-8">
                            <h6 className="text-amazon m-b-0">My Profile</h6>
                          </div>
                          <div className="col-4 text-right">
                            <i className="feather icon-user f-28"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div> */}

              </div>
            </div>
          </div>
          <div id="styleSelector">
          </div>
        </div>
      </div>
    );
  }
}

export default ShopAdminDashboard;