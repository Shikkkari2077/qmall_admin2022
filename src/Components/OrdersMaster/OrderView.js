import React from "react";
import { Link } from "react-router-dom";
import Constant from "../../Constant.js";
import Swal from 'sweetalert2';
import OrderViewPrint from "./OrderViewPrint.js";
// import './print-order.css';


class OrderView extends React.Component {
  state = {
    order_details: {
      User: {},
      payment: {},
      Address: {},
      transaction: {}
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.order_id !== this.props.order_id) {
      this.setState({ order_id: this.props.order_id });
      this.getDeliveryTypeList();
      this.getOrdersList();
      this.getDriversList();
      if (localStorage.getItem('q8_mall_ad_role') === "shop") {
        this.getShopBranchList();
      }

    }
  }
  handleLanguage = (language_id) => {
    this.setState({ language_id: language_id })
  }
  getOrdersList = () => {
    var that = this;
    var data = new URLSearchParams();
    // this.setState({ isSaving: true });
    data.append("OrderId", that.props.order_id);
    fetch(Constant.getAPI() + "/product/order/get", {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": localStorage.getItem('q8_mall_auth')
      },
      body: data
    }).then(function (response) {
      return response.json();
    }).then(function (json) {
      console.log(json.data)
      if (json.status === true) {
        var order_data;
        for (var i = 0; i < json.data.length; i++) {
          if (json.data[i].id === that.props.order_id) {
            order_data = json.data[i];
            var date = new Date(json.data[i].createdAt);
            //console.log(date.getHours())
            var hours=date.getHours();
            var minutes=date.getMinutes();
            var year = date.getFullYear();
            var month;
            if (date.getMonth() + 1 > 10) {
              month = date.getMonth() + 1;
            } else {
              month = "0" + (date.getMonth() + 1);
            }
            var day;
            if (date.getDate() > 9) {
              day = date.getDate();
            } else {
              day = "0" + date.getDate();
            }
            var order_date = day + " / " + month + " / " + year;
            var order_time = hours + " : "+ minutes + " ";
            order_data.order_time=order_time;
            order_data.order_date=order_date;
          }
        }
        that.setState({ 
          orders_list: json.data, 
          order_details: order_data });
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
  handleChangeInvoiceStatus = (event) => {
    event.preventDefault();

    // console.log("status : " + event.target.value, shop_id);

    // return false;
    var that = this;
    var data = new URLSearchParams();
    // this.setState({ isSaving: true });
    data.append("invoice", that.state.order_details.invoice);
    data.append("invoiceStatus", event.target.value);
    fetch(Constant.getAPI() + "/product/order/setInvoiceStatus", {
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
        Swal.fire("Updated !", "Invoice Status has been Updated", "success");
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
  sendOrderNotification = (shopId, event) => {
    var that = this;
    var data = new URLSearchParams();
    // this.setState({ isSaving: true });
    data.append("UserID", shopId);
    data.append("orderId", that.props.order_id);
    data.append("title", "New Order Request");
    data.append("text", "You have received new order request to deliver.!");
    data.append("type", "WEB");
    fetch(Constant.getAPI() + "/notification/add", {
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
        Swal.fire("Successful !", "Notification has been Sent", "success");
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
      <div className="">
        {/* <div className="card-body"> */}
        <div id="print-area">
          <div className="row">
            <div className="col-md-3">
              <div className="invoice-box row">
                <div className="col-sm-12">
                  <table className="table table-responsive invoice-table table-borderless">
                    <tbody>
                      <tr>
                        <td>
                          <img src="./assets/images/Qmall_logo.png" className="m-b-10 img-100" alt="" /></td>
                      </tr>

                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            {
              this.state.order_details.deliveredToWarehouse
                ?
                <div className="col-md-3">
                  <div className="invoice-box row">
                    <div className="col-sm-12">
                      <table className="table table-responsive invoice-table table-borderless">
                        <tbody>
                          <tr>
                            <td className="p-1">
                              <label>Invoice Status</label>
                            </td>
                            <td className="p-1">
                              <select name="invoiceStatus" className="form-control" value={this.state.invoiceStatus} onChange={this.handleChangeInvoiceStatus}>
                                
                                <option value='Ready for dispatch'>Ready for dispatch</option>
                                <option value="pending">Pending</option>
                                <option value="Shipped to warehouse">Shipped to warehouse</option>
                                <option value="On the way">On The Way</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Not Delivered">Not Delivered</option>
                              </select>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                :
                null
            }
          </div>
          <div className="card-block" id="print_invoice">
            <div className="row invoive-info">
              <div className="col-md-4 col-xs-12 invoice-client-info">
                <h6>Client Information :</h6>
                <h6 className="m-0">{this.state.order_details.User.userName} </h6>
                {
                  localStorage.getItem('q8_mall_ad_role') !== "shop"
                    ?
                    this.state.order_details.Address !== null
                      ?
                      <p className="m-0 m-t-10">
                        {this.state.order_details.Address.title}
                        {this.state.order_details.Address.houseNo} , {this.state.order_details.Address.floorNo} ,
                    {this.state.order_details.Address.block} , {this.state.order_details.Address.street} ,
                    {this.state.order_details.Address.avenue} , {this.state.order_details.Address.direction}
                      </p>
                      :
                      null
                    :
                    null
                }
                {
                  localStorage.getItem('q8_mall_ad_role') !== "shop"
                    ?
                    this.state.order_details.User.mobileNumber !== undefined && this.state.order_details.User.mobileNumber !== null && this.state.order_details.User.mobileNumber !== ""
                      ?
                      <p className="m-0">
                        Contact Number : {this.state.order_details.User.mobileNumber}
                      </p>
                      :
                      null
                    :
                    null
                }

              </div>
              <div className="col-md-4 col-sm-6">
                <h6>order Information :</h6>
                <table className="table table-responsive invoice-table invoice-order table-borderless">
                  <tbody>
                    <tr>
                      <th>Order Date :</th>
                      <td>{this.state.order_details.order_date}</td>
                    </tr>
                    <tr>
                      <th>Order Time :</th>
                       <td>{ this.state.order_details.order_time}</td> 
                    </tr>
                    
                  </tbody>
                </table>
              </div>
              <div className="col-md-4 col-sm-6">
                {
                  this.state.order_details.transaction !== null
                    ?
                    <h6 className="m-b-20">Transaction ID <span>#{this.state.order_details.transaction.TranID}</span></h6>
                    : null
                }
                {
                  (this.state.order_details.transaction === null && this.state.order_details.payment.type === "cod" || this.state.order_details.payment.type === "COD") || (this.state.order_details.transaction !== null)
                    ?
                    <h6 className="text-uppercase text-primary">
                      Payment Status : <span className="badge badge-success">Success</span>
                    </h6>
                    :
                    <h6 className="text-uppercase text-primary">
                      Payment Status : <span className="badge badge-danger"> Pending </span>
                    </h6>
                }
                <h6 className="text-uppercase text-primary">
                  Payment Method : <span>{this.state.order_details.payment.title_en}</span>
                </h6>
                {/* <h6 >
              <span className="text-uppercase text-primary" >Notes:</span>  <span>{this.state.order_details.notes}</span>
                </h6> */}
               
              </div>
            </div>
            {
              this.state.order_details.OrderShops !== undefined && this.state.order_details.OrderShops !== null && this.state.order_details.OrderShops !== [] && this.state.order_details.OrderShops.length > 0
                ?
                <div className="row">
                  <div className="col-sm-12">
                    <div className="table-responsive">
                      <table className="table">
                        <col width="250" />
                        {/* <col width="120" /> */}
                        <col width="180" />
                        <col width="200" />
                        <col width="200" />
                        <col width="200" />
                        <col width="120" />
                        <thead>
                          <tr className="thead-inverse">
                            <th>Product Name</th>
                            {/* <th>Delivery Type</th> */}
                            <th>Vendor Name</th>
                            {
                              localStorage.getItem('q8_mall_ad_role') === "shop"
                                ? <th className="noprint">Shop Branch</th> : null}
                            <th className="noprint">Order Status </th>
                            {
                              localStorage.getItem('q8_mall_ad_role') === "shop"
                                ? null : <th className="noprint">Driver</th>}
                            {
                              localStorage.getItem('q8_mall_ad_role') === "shop"
                                ? null : <th className="noprint">Deliver To</th>}
                            <th>Total</th>
                            <th>Qmall Commission</th>
                            <th>Seller Amount</th>
                            <th>Notes</th>
                            {
                              localStorage.getItem('q8_mall_ad_role') === "shop"
                                ? null : <th className="noprint">Reminder to Shop</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {
                            this.state.order_details.OrderShops.map((OrderShops, i) =>
                              <tr>
                                <td width={'350px'}>
                                  {OrderShops.OrderStocks !== null && OrderShops.OrderStocks !== [] && OrderShops.OrderStocks.length > 0
                                    ?
                                    <ul>
                                      {OrderShops.OrderStocks.map(order_stock =>
                                        order_stock.Stock !== null ?
                                          <li>
                                            <Link to={"/products/add/" + order_stock.Stock.Product.id} >
                                              {order_stock.Stock.Product.name_en}
                                              {
                                                order_stock.Stock.AttributeValues.map(attributes =>
                                                  <span className="badge badge-primary mx-1">{attributes.name_en}</span>
                                                )
                                              }
                                            </Link>
                                          </li>
                                          :
                                          null
                                      )}
                                    </ul>
                                    :
                                    null
                                  }
                                </td>
                                {/* {
                                    OrderShops.Delivery !== null
                                      ?
                                      <td>
                                        {this.state.delivery_type !== undefined && this.state.delivery_type !== null && this.state.delivery_type !== [] && this.state.delivery_type.length > 0
                                          ?
                                          this.state.delivery_type.map(type =>
                                            type.id === OrderShops.Delivery.DeliveryTypeId ? type.name_en : null
                                          )
                                          : null} - {OrderShops.Delivery.name_en}
                                      </td>
                                      :
                                      <td>
                                        -
                                      </td>
                                  } */}
                                <td>
                                  <h6>{OrderShops.Shop.name_en}</h6>
                                  {OrderShops.Shop.phNumber !== undefined && OrderShops.Shop.phNumber !== null && OrderShops.Shop.phNumber !== ""
                                    ? <span>Contact : {OrderShops.Shop.phNumber}</span> : null}
                                </td>
                                {
                                  localStorage.getItem('q8_mall_ad_role') === "shop"
                                    ?
                                    <td className="noprint">
                                      <select name="branchAddressId" className="form-control" value={OrderShops.branchAddressId} onChange={this.handleAssignBranch.bind(this, OrderShops.id)}>
                                        <option value="">Assign Branch</option>
                                        {
                                          this.state.branch_address_list !== undefined && this.state.branch_address_list !== null && this.state.branch_address_list !== [] && this.state.branch_address_list.length > 0
                                            ?
                                            this.state.branch_address_list.map(branch =>
                                              <option value={branch.id} key={branch.id}>{branch.title}</option>
                                            )
                                            : null
                                        }
                                      </select>
                                    </td>
                                    :
                                    null
                                }
                                 
                                 {/* <td className="noprint"> 
                                {
                                  localStorage.getItem("q8_mall_ad_role") == "shop"?
                                    <div></div>
                                  :""
                                }
                                  </td> */}
                                <td className="noprint">
                                  {/* {
                                      localStorage.getItem('q8_mall_ad_role') === "shop" && OrderShops.status !== "shipped"
                                        ?
                                        OrderShops.status
                                        : */}
                                     { localStorage.getItem('q8_mall_ad_role') === "shop"?<div>
                                     <select name="status" className="form-control" value={OrderShops.status} onChange={this.handleChange.bind(this, OrderShops.id)}>
                                     <option value="pending" name="in progress">Pending</option>
         
                                      <option value='Ready for dispatch'>Ready for dispatch</option>
                                    
                                  </select>

                                     </div>:<div>
                                  <select name="status" className="form-control" value={OrderShops.status} 
                                  onChange={this.handleChange.bind(this, OrderShops.id)}>
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
                                  </div>
                                  
                                    }
                                </td>
                                {
                                  localStorage.getItem('q8_mall_ad_role') === "shop"
                                    ? null
                                    :
                                    <td className="noprint">
                                      {/* {
                                      localStorage.getItem('q8_mall_ad_role') === "shop" && OrderShops.status !== "shipped"
                                        ?
                                        OrderShops.status
                                        : */}
                                      <select name="driverId" className="form-control" value={OrderShops.DriverId} onChange={this.handleAssignDriver.bind(this, OrderShops.id)}>
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
                                }
                                {
                                  localStorage.getItem('q8_mall_ad_role') === "shop"
                                    ? null
                                    :
                                    <td className="noprint">
                                      <select name="DeliveryType" className="form-control" value={OrderShops.DeliveryType} onChange={this.handleAssignDeliveryType.bind(this, OrderShops.id)}>
                                        <option value="shopToWarehouse">Shop to Warehouse</option>
                                        <option value="shopToCustomer">Shop to Customer</option>
                                        <option value="warehouseToCustomer">Warehouse to Customer</option>
                                      </select>
                                    </td>
                                }
                                <td>{parseFloat(OrderShops.amount).toFixed(3)} {this.state.order_details.CurrencyId}</td>
                                <td>{parseFloat((OrderShops.amount * OrderShops.qmallCommission) / 100).toFixed(3)} {this.state.order_details.CurrencyId}</td>
                                <td>{parseFloat(OrderShops.amount - ((OrderShops.amount * OrderShops.qmallCommission) / 100)).toFixed(3)} {this.state.order_details.CurrencyId}</td>
                                {
                                  OrderShops.OrderStocks !== undefined ?
                                  
                                    <td> 
                                      <ul>
                                      {
                                        OrderShops.OrderStocks.map(order=>(
                                          //console.log(order)
                                         <li>{order.productNote ?order.productNote:"--"}</li> 
                                        ))
                                      }
                                      </ul>
                                    </td>
                                :null
                                }
                                {
                                  localStorage.getItem('q8_mall_ad_role') === "shop"
                                    ? null
                                    :
                                    <td className="noprint">
                                      <button className="btn btn-icon btn-xlg btn-outline-secondary" onClick={this.sendOrderNotification.bind(this, OrderShops.ShopId)}>
                                        <i className="icofont icofont-notification"></i>
                                      </button>
                                    </td>
                                }
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
                      <td>{parseFloat(this.state.order_details.totalAmount).toFixed(3)} {this.state.order_details.CurrencyId}</td>
                    </tr>
                    <tr>
                      <th>Delivery Charges :</th>
                      <td>{parseFloat(this.state.order_details.totalDeliveryCharge).toFixed(3)} {this.state.order_details.CurrencyId}</td>
                    </tr>

                    <tr className="text-info">
                      <td>
                        <hr />
                        <h5 >Grand Total :</h5>
                      </td>
                      <td>
                        <hr />
                        <h5 >{parseFloat(this.state.order_details.totalwithdelivery).toFixed(3)} {this.state.order_details.CurrencyId}</h5>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="row text-center noprint">
          <div className="col-sm-12 invoice-btn-group text-center">
            {localStorage.getItem('q8_mall_ad_role') === "admin" ?
            <Link to={"/orders/view-print/" + this.state.order_id} 
            className="btn btn-sm btn-print-invoice btn-inverse waves-effect waves-light d-inline-block md-trigger" > 
            <i className="icofont icofont-print m-r-5"></i> Print </Link>
         :null }
         {  localStorage.getItem('q8_mall_ad_role') === "admin" ?

            <Link to="/orders" type="button" className="btn btn-danger waves-effect m-b-10 btn-sm m-1 waves-light">Back</Link>
            :
            <Link to="/orders/shop" type="button" className="btn btn-danger waves-effect m-b-10 btn-sm m-1 waves-light">Back</Link>
      

         }
          </div>
        </div>
        {/* </div > */}
      </div >
    );

  }
}

export default OrderView;
