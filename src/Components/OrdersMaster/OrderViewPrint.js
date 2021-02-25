import React from "react";
import { Link } from "react-router-dom";
import Constant from "../../Constant.js";
import Swal from 'sweetalert2';
// import './print-order.css';


class OrderViewPrint extends React.Component {
  state = {
    order_details: {
      User: {},
      payment: {},
      Address: {},
      transaction: {}
    }
  }
  componentDidMount() {
    this.getOrdersList();
  }
  getOrdersList = () => {
    var that = this;
    var data = new URLSearchParams();
    // this.setState({ isSaving: true });
    data.append("OrderId", that.props.match.params.order_id);
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
      if (json.status === true) {
        var print_order_data;
        for (var i = 0; i < json.data.length; i++) {
          if (json.data[i].id === that.props.match.params.order_id) {
            print_order_data = json.data[i];
            var date = new Date(json.data[i].createdAt);
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
            var order_date = day + "-" + month + "-" + year;
            print_order_data.order_date = order_date;
          }
        }
        that.setState({ orders_list: json.data, order_details: print_order_data, isOrderData: true });
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
  componentDidUpdate(prevState) {
    var that = this;
    if (prevState.isOrderData !== this.state.isOrderData && this.state.isOrderData !== false) {
      setTimeout(function () { that.onPrint() }, 1000);
    }
  }
  onPrint = () => {
    var that = this;
    window.onbeforeprint = function (event) {
      // alert("beforePrint")
      if (localStorage.getItem('q8_mall_ad_role') === "admin") {
        document.getElementById('admin_menu').classList.remove('pcoded-navbar');
        document.getElementById('admin_content').classList.remove('pcoded-content');
      }
      // return (<RetailerPrintInvoice />)
      document.title = `invoice - #${that.props.match.params.order_id}`;
    };
    window.onafterprint = function (event) {
      // alert("Printing completed...");
      // document.getElementById('invoice_detail').innerHTML = hidePrint
      if (localStorage.getItem('q8_mall_ad_role') === "admin") {
        document.getElementById('admin_menu').classList.add('pcoded-navbar');
        document.getElementById('admin_content').classList.add('pcoded-content');
      }
      if (that.props.match.path == "/orders/view-print/:order_id") {
        window.location.href = `#/orders/view/${that.props.match.params.order_id}`;
      }
      document.title = "QMall";
    };
    window.print();
  }
  render() {
    return (
      <div className="invoice-print">
        {
          this.state.order_details.OrderShops !== undefined && this.state.order_details.OrderShops !== null && this.state.order_details.OrderShops !== [] && this.state.order_details.OrderShops.length > 0
            ?
            <table width="800" border="0" align="center" cellPadding="15" cellspacing="0" bgColor="#FFFFFF" >
              <tbody>
                <tr>
                  <td>
                    <table width="100%" border="0" cellspacing="0" cellPadding="0">
                      <tbody>
                        <tr>
                          <td><img src="./assets/images/invoice-banner.jpg" style={{ 'display': 'block', 'width': '100%' }} /></td>
                        </tr>
                        <br />
                        <tr>
                          <td>
                            <table width="100%" border="0" cellspacing="0" cellPadding="0">
                              <tbody>
                                <tr>
                                  <td>
                                    <h5 className="h5-header">Order ID:-</h5>
                                  </td>
                                  <td>
                                    <h5 className="h5-value" style={{textAlign: "right"}}>#{this.state.order_details.invoice}</h5>
                                  </td>
                                  <td>
                                    <h5 className="h5-header" style={{textAlign: "right"}}>: رقم الطلب </h5>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <h5 className="h5-header" >Order Date:-</h5>
                                  </td>
                                  <td>
                                    <h5 className="h5-value"style={{textAlign: "right"}}>{this.state.order_details.order_date}</h5>
                                  </td>
                                  <td>
                                    <h5 className="h5-header" style={{textAlign: "right"}}>: تاريخ الطلب</h5>
                                  </td>
                                </tr>
                                {/* <tr>
                                  <td>
                                    <h5 className="h5-header" >Order Time:-</h5>
                                  </td>
                                  <td>
                                    <h5 className="h5-value"style={{textAlign: "right"}}>{}</h5>
                                  </td>
                                  <td>
                                    <h5 className="h5-header" style={{textAlign: "right"}}>: وقت الطلب</h5>
                                  </td>
                                </tr> */}
                                <tr>
                                  <td>
                                    <h5 className="h5-header">Status:</h5>
                                  </td>
                                  <td>
                                    <h5 className="h5-value"style={{textAlign: "right"}}>Order Placed</h5>
                                  </td>
                                  <td>
                                    <h5 className="h5-header"style={{textAlign: "right"}}>: الحالة</h5>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <h5 className="h5-header">Delivery Date:</h5>
                                  </td>
                                  <td>
                                    <h5 className="h5-value"style={{textAlign: "right"}}>Within 2 Days</h5>
                                  </td>
                                  <td>
                                    <h5 className="h5-header"style={{textAlign: "right"}}>: تاريخ التسليم او الوصول
            </h5>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        <br />
                        <tr>
                          <td>
                            <table width="100%" border="0" cellspacing="0" cellPadding="10">
                              <tbody>
                                <tr>
                                  <td height="30" valign="middle" bgColor="#525252" className="invoice_table_border">
                                    <p className="product_table_header">Product Name | اسم المنتج</p>
                                  </td>
                                  <td bgColor="#525252" className="invoice_table_border">
                                    <p className="product_table_header">Shop | المتجر</p>
                                  </td>
                                  <td bgColor="#525252" className="invoice_table_border">
                                    <p className="product_table_header">Quantity | كمية</p>
                                  </td>
                                  <td bgcolor="#525252" className="invoice_table_border">
                                    <p className="product_table_header">Total | إجمالي</p>
                                  </td>
                                </tr>
                                {
                                  this.state.order_details.OrderShops.map(OrderShops =>
                                    OrderShops.OrderStocks !== null && OrderShops.OrderStocks !== [] && OrderShops.OrderStocks.length > 0
                                      ?
                                      OrderShops.OrderStocks.map(order_stock =>
                                        <tr>
                                          <td className="invoice_table_border">
                                            <ul>
                                              {
                                                order_stock.Stock !== null ?
                                                  <p className="product_table_value">
                                                    {order_stock.Stock.Product.name_en}
                                                  </p>
                                                  : null
                                              }
                                            </ul>
                                            <p className="product_table_value">Product ID: <span className="invoice-print-span">QMALL1003993</span></p>
                                          </td>
                                          <td className="invoice_table_border">
                                            <p className="product_table_shop_header">{OrderShops.Shop.name_en}</p>
                                          </td>
                                          <td className="invoice_table_border">
                                            <p className="product_table_shop_header">{order_stock.unit}</p>
                                          </td>
                                          <td className="invoice_table_border">
                                            <p className="product_table_shop_header">{order_stock.amount}KWD</p>
                                          </td>
                                        </tr>
                                      )
                                      : null
                                  )
                                }

                                <tr>
                                  <td colspan="3" align="right" className="invoice_table_border">
                                    <p className="invoice_total">Delivery Charges | رسوم التوصيل </p>
                                  </td>
                                  <td className="invoice_table_border">
                                    <p className="invoice_total_value">{this.state.order_details.totalDeliveryCharge} KWD</p>
                                  </td>
                                </tr>
                                <tr>
                                  <td colspan="3" align="right" className="invoice_table_border">
                                    <p className="invoice_total">Grand Total | المجموع الكلي</p>
                                  </td>
                                  <td className="invoice_table_border">
                                    <p className="invoice_total_value">{this.state.order_details.totalwithdelivery} KWD</p>
                                  </td>
                                </tr>
                              </tbody >
                            </table ></td >
                        </tr >
                        <tr>
                          <td>&nbsp;</td>
                        </tr>
                        <tr>
                          <td><table width="100%" border="0" cellspacing="0" cellPadding="0">
                            <tbody>
                              <tr >
                                <td className="invoice_customer_details invoice_table_border">
                                  <p className="invoice_table_header">Customer Name </p>
                                </td>
                                <td className="invoice_customer_details invoice_table_border">
                                  <p className="product_table_shop_header">{this.state.order_details.User.userName}</p>
                                </td>
                                <td className="invoice_customer_details invoice_table_border">
                                  <p className="invoice_table_header"> اسم العميل </p>
                                </td>
                              </tr>
                              <tr >
                                <td className="invoice_customer_details invoice_table_border">
                                  <p className="invoice_table_header">Mobile</p>
                                </td>
                                <td className="invoice_customer_details invoice_table_border">
                                  <p className="product_table_shop_header">{
                                    this.state.order_details.User.mobileNumber !== undefined && this.state.order_details.User.mobileNumber !== null && this.state.order_details.User.mobileNumber !== ""
                                      ? this.state.order_details.User.mobileNumber : null}</p>
                                </td>
                                <td className="invoice_customer_details invoice_table_border">
                                  <p className="invoice_table_header"> رقم الموبايل </p>
                                </td>
                              </tr>
                              <tr>
                                <td className="invoice_customer_details invoice_table_border">
                                  <p className="invoice_table_header">Address</p>
                                </td>
                                <td className="invoice_customer_details invoice_table_border">
                                  <p className="product_table_shop_header">
                                    {this.state.order_details.Address !== null
                                      ?
                                      <p className="m-0 m-t-10">
                                        {this.state.order_details.Address.title}
                                        {this.state.order_details.Address.houseNo} , {this.state.order_details.Address.floorNo} ,
                    {this.state.order_details.Address.block} , {this.state.order_details.Address.street} ,
                    {this.state.order_details.Address.avenue} , {this.state.order_details.Address.direction}
                                      </p>
                                      : null
                                    }
                                  </p>
                                </td>
                                <td className="invoice_customer_details invoice_table_border">
                                  <p className="invoice_table_header"> العنوان </p>
                                </td>
                              </tr>
                              <tr>

                                <td className="invoice_customer_details invoice_table_border">
                                  <p className="invoice_table_header">Payment Type</p>
                                </td>
                                <td className="invoice_customer_details invoice_table_border">
                                  <p className="product_table_shop_header">{this.state.order_details.payment.title_en}</p>
                                </td>
                                <td className="invoice_customer_details invoice_table_border">
                                  <p className="invoice_table_header">نوع الدفع</p>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          </td>
                        </tr >
                        <tr>
                          <td>&nbsp;</td>
                        </tr>
                        <tr>
                          <td>
                            <p className="product_table_shop_header">
                              <strong className="invoice-footer">Thank you for shopping with QMALL</strong><br /><br />
                            </p>
                          </td>

                        </tr>
                      </tbody >
                    </table ></td >
                </tr >
              </tbody >
            </table >
            :
            null
        }
      </div >
    );

  }
}

export default OrderViewPrint;
