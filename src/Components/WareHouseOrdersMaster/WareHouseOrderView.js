import React from "react";
import { Link } from "react-router-dom";
import Constant from "../../Constant.js";
import Swal from 'sweetalert2';
// import './print-order.css';


class WareHouseOrderView extends React.Component {
  state = {
    order_details: {
      Shop: {},
      Address: {}
    }
  }

  componentWillMount() {
    if (this.props.match.params.order_id !== undefined &&
      this.props.match.params.order_id !== null &&
      this.props.match.params.order_id !== 0 &&
      this.props.match.params.order_id !== '') {
      this.setState({ order_id: this.props.match.params.order_id })
      //console.log(this.props.match.params.order_id)
    }
    this.getDeliveryTypeList();
    this.getOrdersList();
    this.getDriversList();
    if (localStorage.getItem('q8_mall_ad_role') === "shop") {
      this.getShopBranchList();
    }
  }
  handleLanguage = (language_id) => {
    this.setState({ language_id: language_id })
  }
  getOrdersList = () => {
    var that = this;
    var data = new URLSearchParams();
    // this.setState({ isSaving: true });
    data.append("OrderId", that.props.match.params.order_id);
    data.append("DeliveryType", "warehouseToCustomer,shopToWarehouse")
    fetch(Constant.getAPI() + "/product/order/getShopOrder", {
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
        var order_data;
        for (var i = 0; i < json.data.length; i++) {
          if (json.data[i].id === that.props.match.params.order_id) {
            order_data = json.data[i];
            var date = new Date(json.data[i].createdAt);
            var year = date.getFullYear();
            var month;
            if (date.getMonth() + 1 > 10) {
              month = date.getMonth() + 1;
            } else {
              month = "0" + (date.getMonth() + 1);
            }
            var day;
            if (date.getDate() > 10) {
              day = date.getDate();
            } else {
              day = "0" + date.getDate();
            }
            var order_date = day + " / " + month + " / " + year;
            order_data.order_date = order_date;
          }
        }
        that.setState({ orders_list: json.data, order_details: order_data });
      } else {
        Swal.fire({
          title: "Something went wrong. Try again after some Time.!",
          icon: 'error',
          text: "",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Ok"
        })
      }
    })

  }
  getDeliveryTypeList = () => {
    var that = this;
    var data = new URLSearchParams();
    fetch(Constant.getAPI() + "/delivery/type/get", {
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
        that.setState({ delivery_type: json.data });
      } else {
        Swal.fire({
          title: "Something went wrong. Try again after some Time.!",
          icon: 'error',
          text: "",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Ok"
        })
      }
    })
  }
  getShopBranchList = () => {
    var that = this;
    var data = new URLSearchParams();
    data.append("ShopId", localStorage.getItem('q8_mall_ad_uid'))
    fetch(Constant.getAPI() + "/shop/address/get", {
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
        that.setState({ branch_address_list: json.data });
      } else {
        Swal.fire({
          title: "Something went wrong. Try again after some Time.!",
          icon: 'error',
          text: "",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Ok"
        })
      }
    })
  }

  getDriversList = () => {
    var that = this;
    var data = new URLSearchParams();
    fetch(Constant.getAPI() + "/driver/get", {
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
        that.setState({ drivers_list: json.data });
      } else {
        Swal.fire({
          title: "Something went wrong. Try again after some Time.!",
          icon: 'error',
          text: "",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Ok"
        })
      }
    })
  }
  handleChange = (shop_id, event) => {
    event.preventDefault();

    // console.log("status : " + event.target.value, shop_id);

    // return false;
    var that = this;
    var data = new URLSearchParams();
    // this.setState({ isSaving: true });
    data.append("OrderShopId", shop_id);
    data.append("status", event.target.value);
    fetch(Constant.getAPI() + "/product/order/shop/setStatus", {
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
        Swal.fire("Updated !", "Status has been Updated", "success");
        that.getOrdersList();
      } else {
        Swal.fire({
          title: "Something went wrong. Try again after some Time.!",
          icon: 'error',
          text: "",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Ok"
        })
      }
    });
  }
  handleAssignBranch = (orderId, event) => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    data.append("ShopOrderId", orderId);
    data.append("branchAddressId", event.target.value);
    fetch(Constant.getAPI() + "/product/order/assignbranchAddress", {
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
        Swal.fire("Updated !", "Shop Branch Address has been Assigned", "success");
        that.getOrdersList();
      } else {
        Swal.fire({
          title: "Something went wrong. Try again after some Time.!",
          icon: 'error',
          text: "",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Ok"
        })
      }
    });
  }
  handleAssignDeliveryType = (orderId, event) => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    data.append("ShopOrderId", orderId);
    data.append("DeliveryType", event.target.value);
    fetch(Constant.getAPI() + "/product/order/assignDeliveryType", {
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
        Swal.fire("Updated !", "Delivery Type has been Updated", "success");
        that.getOrdersList();
      } else {
        Swal.fire({
          title: "Something went wrong. Try again after some Time.!",
          icon: 'error',
          text: "",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Ok"
        })
      }
    });
  }
  handleAssignDriver = (orderId, event) => {
    var that = this;
    var data = new URLSearchParams();
    // this.setState({ isSaving: true });
    data.append("ShopOrderId", orderId);
    data.append("DriverId", event.target.value);
    fetch(Constant.getAPI() + "/product/order/assignDriver", {
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
        Swal.fire("Updated !", "Driver has been Assigned", "success");
        that.getOrdersList();
      } else {
        Swal.fire({
          title: "Something went wrong. Try again after some Time.!",
          icon: 'error',
          text: "",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Ok"
        })
      }
    });
  }
  render() {
    return (
      <div className="main-body">
        <div className="page-wrapper">
          <div className="page-header">
            <div className="row align-items-end">
              <div className="col-lg-8">
                <div className="page-header-title">
                  <div className="d-inline">
                    <h4>View Warehouse Order</h4>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="page-header-breadcrumb">
                  <ul className="breadcrumb-title">
                    <li className="breadcrumb-item">
                      <Link to="/"> <i className="feather icon-home"></i> </Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link to="/warehouse-orders">Warehouse Orders</Link>
                    </li>
                    <li className="breadcrumb-item active" >{this.props.match.params.order_id ? "View" : "View"}{" "} Warehouse Order

                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div id="print-area">
            <div className="row">
              <div className="col-md-8">
                <div className="invoice-box row">
                  <div className="col-sm-12">
                    <table className="table table-responsive invoice-table table-borderless">
                      <tbody>
                        <tr>
                          <td>
                            <img src="./assets/images/icon.png" className="m-b-10 img-100" alt="" /></td>
                        </tr>

                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-block" id="print_invoice">
              <div className="row invoive-info">
                <div className="col-md-4 col-xs-12 invoice-client-info">
                  <h6>Shop Information :</h6>
                  <h6 className="m-0">{this.state.order_details.Shop.name} </h6>
                  {
                    this.state.order_details.Address !== null
                      ?
                      <p className="m-0 m-t-10">
                        {this.state.order_details.Shop.address}
                      </p>
                      :
                      null
                  }
                  <p className="m-0">{this.state.order_details.Shop.phNumber}</p>

                </div>
                <div className="col-md-4 col-sm-6">
                  <h6>order Information :</h6>
                  <table className="table table-responsive invoice-table invoice-order table-borderless">
                    <tbody>
                      <tr>
                        <th>Order Date :</th>
                        <td>{this.state.order_details.order_date}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="col-md-4 col-sm-6">
                  {/* <h6 className="m-b-20">Transaction ID <span>#{this.state.data.transactionID}</span></h6> */}
                  <h6 className="text-uppercase text-primary">
                    Payment Method :<span>{this.state.order_details.paymentMethod}</span>
                  </h6>
                </div>
              </div>
              {
                this.state.order_details.OrderStocks !== undefined && this.state.order_details.OrderStocks !== null && this.state.order_details.OrderStocks !== [] && this.state.order_details.OrderStocks.length > 0
                  ?
                  <div className="row">
                    <div className="col-sm-12">
                      <div className="table-responsive">
                        <table className="table">
                          <col width="250" />
                          <col width="180" />
                          <col width="200" />
                          <col width="200" />
                          <col width="120" />
                          <thead>
                            <tr className="thead-inverse">
                              <th>Product Name</th>
                              <th>Vendor Name</th>
                              <th>Order Status </th>
                              <th>Driver</th>
                              <th>Deliver To</th>
                              <th>Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              this.state.order_details.OrderStocks.map((order_stock, i) =>
                                <tr>
                                  <td width={'350px'}>
                                    {
                                      order_stock.Stock !== null ?
                                        <Link to={"/products/add/" + order_stock.Stock.Product.id} >
                                          {order_stock.Stock.Product.name}
                                          {
                                            order_stock.Stock.AttributeValues.map(attributes =>
                                              <span className="badge badge-primary mx-1">{attributes.name}</span>
                                            )
                                          }
                                        </Link>
                                        :
                                        null
                                    }
                                  </td>
                                  <td><h6>{this.state.order_details.Shop.name}</h6></td>
                                  <td >
                                    {/* {
                                      localStorage.getItem('q8_mall_ad_role') === "shop" && OrderShops.status !== "shipped"
                                        ?
                                        OrderShops.status
                                        : */}
                                    <select name="status" className="form-control" value={this.state.order_details.status} onChange={this.handleChange.bind(this, this.state.order_details.id)} >
                                      {/* <option value="received" name="received">Received</option>
                                      <option value="shipped" name="shipped">Shipped</option>
                                      <option value="in progress" name="in progress">In Progress</option>
                                      <option value="on the way" name="on the way">On The Way</option>
                                      <option value="complete" name="complete">Complete</option> */}
                                      <option value="Order placed">Order Placed</option>
                                      <option value='Ready for dispatch'>Ready for dispatch</option>
                                      <option value="Shipped to warehouse">Shipped to warehouse</option>
                                      <option value="On the way">On The Way</option>
                                      <option value="Delivered">Delivered</option>
                                      <option value="Not Delivered">Not Delivered</option>
                                    </select>
                                    {/* } */}
                                  </td>
                                  <td>
                                    {/* {
                                      localStorage.getItem('q8_mall_ad_role') === "shop" && OrderShops.status !== "shipped"
                                        ?
                                        OrderShops.status
                                        : */}
                                    <select name="driverId" className="form-control" value={this.state.order_details.DriverId} onChange={this.handleAssignDriver.bind(this, this.state.order_details.id)}>
                                      <option value="">Assign Driver</option>
                                      {
                                        this.state.drivers_list !== undefined && this.state.drivers_list !== null && this.state.drivers_list !== [] && this.state.drivers_list.length > 0
                                          ?
                                          this.state.drivers_list.map(driver =>
                                            <option value={driver.id} key={driver.id}>{driver.firstName} {driver.lastName}</option>
                                          )
                                          : null
                                      }
                                    </select>
                                    {/* } */}
                                  </td>
                                  <td>
                                    <select name="DeliveryType" className="form-control" value={this.state.order_details.DeliveryType} onChange={this.handleAssignDeliveryType.bind(this, this.state.order_details.id)}>
                                      <option value="shopToWarehouse">Shop to Warehouse</option>
                                      <option value="shopToCustomer">Shop to Customer</option>
                                      <option value="warehouseToCustomer">Warehouse to Customer</option>
                                    </select>
                                  </td>
                                  <td>{this.state.order_details.totalwithdelivery} {this.state.order_details.CurrencyId}</td>
                                </tr>
                              )
                            }
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  :
                  null
              }
              <div className="row">
                <div className="col-sm-12">
                  <table className="table table-responsive invoice-table invoice-total">
                    <tbody>
                      <tr>
                        <th>Total Amount :</th>
                        <td>{this.state.order_details.totalAmount} {this.state.order_details.CurrencyId}</td>
                      </tr>
                      <tr>
                        <th>Delivery Charges :</th>
                        <td>{this.state.order_details.totalDeliveryCharge} {this.state.order_details.CurrencyId}</td>
                      </tr>

                      <tr className="text-info">
                        <td>
                          <hr />
                          <h5 >Grand Total :</h5>
                        </td>
                        <td>
                          <hr />
                          <h5 >{this.state.order_details.totalwithdelivery} {this.state.order_details.CurrencyId}</h5>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div >
          </div >
          <div className="row text-center">
            <div className="col-sm-12 invoice-btn-group text-center">
              {/* <button type="button" onClick={window.print} className="btn btn-inverse btn-print-invoice m-b-10 btn-sm m-1 waves-effect waves-light m-r-20">Print</button> */}
              <Link to="/warehouse-orders" type="button" className="btn btn-danger waves-effect m-b-10 btn-sm m-1 waves-light">Cancel</Link>
            </div>
          </div>
        </div >
      </div >
    );

  }
}

export default WareHouseOrderView;
