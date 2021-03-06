import React from "react";
import { Link } from "react-router-dom";
import $ from "jquery";
import Swal from "sweetalert2";
import Constant from "../../Constant";
import MUIDataTable from "mui-datatables";
import Pagination from 'react-js-pagination';

class OrderListShop extends React.Component {
  state = {
    activePage:1,
    dataLength:10,
    datarange:0,
  };
  componentWillMount() {
    clearInterval(this.interval);

    this.getOrdersList(10,0);
    this.setState({
      role:localStorage.getItem("q8_mall_ad_role")
    })
    //console.log(localStorage.getItem("q8_mall_ad_role"))
  }
  handlePageChange(pageNumber) {
    this.setState({
      orders_list:[]
    })
     const range = pageNumber * 10 - 10;
     const dataLength = this.state.dataLength;
    this.getOrdersList(dataLength,range)
   
     this.setState({
       datarange: range,
       activePage: pageNumber 
     });
   }

  componentDidMount(){
    setInterval(this.getOrdersList(this.state.dataLength,this.state.datarange), 60000)

  }
  getOrdersList = (count,startRange) => {
    var that = this;

    var data = new URLSearchParams();
    data.append("startRange",startRange)
    data.append("count",count)
    this.setState({ isSaving: true });
    //console.log(localStorage.getItem("q8_mall_auth")  )
    fetch(Constant.getAPI() + "/product/order/get", {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: localStorage.getItem("q8_mall_auth"),
      },
      body: data,
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {

        if (json.status === true) {
          console.log(json)
          // var orders = [];
          // for (var i = 0; i < json.data.length; i++) {
          //   var order_obj = json.data[i];
          //   var total_orders = 0;
          //   var completed_orders = 0;
          //   for (var j = 0; j < json.data[i].OrderShops.length; j++) {
          //     total_orders =
          //       json.data[i].OrderShops[j].OrderStocks.length + total_orders;
          //     if (json.data[i].OrderShops[j].status === "Delivered") {
          //       completed_orders =
          //         json.data[i].OrderShops[j].OrderStocks.length +
          //         completed_orders;
          //     } else {
          //       completed_orders = completed_orders;
          //     }
          //   }
          //   order_obj.complete_status = completed_orders + " / " + total_orders;
          //   if (completed_orders === total_orders) {
          //     order_obj.complete = true;
          //   } else {
          //     order_obj.complete = false;
          //   }
          //   var order_date = new Date(order_obj.createdAt);
          //   var order_day, order_month, order_year;
          //   if (order_date.getDate() > 9) {
          //     order_day = order_date.getDate();
          //   } else {
          //     order_day = "0" + order_date.getDate();
          //   }
          //   if (order_date.getMonth() + 1 > 9) {
          //     order_month = order_date.getMonth() + 1;
          //   } else {
          //     order_month = "0" + (order_date.getMonth() + 1);
          //   }
          //   order_year = order_date.getFullYear();

          //   var created_at = order_day + "-" + order_month + "-" + order_year;
          //   order_obj.create_date = created_at;
          //   orders.push(order_obj);
          // }
          that.setState({ orders_list: json.data,countFilterWise:json.countFilterWise, isSaving: false });
        } else {
          that.setState({ orders_list: [], isSaving: false });
          Swal.fire({
            title: "Something went wrong. Try again after some Time.!",
            icon: "error",
            text: "",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ok",
          });
        }
      });
  };
  render() {
    const columns = [
      {
        name: "invoice",
        label: "Invoice Id",
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        name: "User.userName",
        label: "Customer Name",
        options: {
          filter: true,
          sort: true,
        },
        // }, {
        //   name: "OrderShops",
        //   label: "Delivery",
        //   options: {
        //     filter: true,
        //     sort: true,
        //     customBodyRender: (OrderShops, tableMeta) => {
        //       return <ul>
        //         {
        //           OrderShops.map(shop =>
        //             shop.DeliveryType !== null ?
        //               <li>{shop.DeliveryType.name}</li>
        //               :
        //               null
        //           )
        //         }
        //       </ul >
        //     }
        //   }
      },
      {
        name: "createdAt",
        label: "Date",
        options: {
          filter: true,
          sort: true,
          customBodyRender: (createdAt, tableMeta) => {
            var order_date = new Date(createdAt);
            var order_day, order_month, order_year;
            if (order_date.getDate() > 9) {
              order_day = order_date.getDate();
            } else {
              order_day = "0" + order_date.getDate();
            }
            if ((order_date.getMonth() + 1) > 9) {
              order_month = (order_date.getMonth() + 1);
            } else {
              order_month = "0" + (order_date.getMonth() + 1);
            }
            order_year = order_date.getFullYear();

            var created_at = order_day + "-" + order_month + "-" + order_year

            return <div>{created_at}</div>;
          },
        },
      },
      // {
      //   name: "OrderShops.length",
      //   label: "Shop Included",
      //   options: {
      //     filter: true,
      //     sort: true,
      //   },
      // },
      {
        name: "OrderShops",
        label: "Amount",
        options: {
          filter: true,
          sort: true,
          customBodyRender: (OrderShops, tableMeta) => {
            return(
            OrderShops !== null && OrderShops !== undefined && OrderShops[0] !==undefined?

             parseFloat(OrderShops[0].amount).toFixed(3)
            :null
            )
          },
        },
      },
      {
        name: "payment",
        label: "Payment Type",
        options: {
          filter: true,
          sort: true,
          download: false,
          customBodyRender: (payment, tableMeta) => {
            return (
              <div>
                {payment.type === "cod" || payment.type === "COD" ? (
                  <label className="badge badge-primary text-uppercase">
                    {payment.title_en}
                  </label>
                ) : (
                  <label className="badge badge-secondary text-uppercase">
                    {payment.title_en}
                  </label>
                )}
              </div>
            );
          },
        },
      },
  
      {
        name: "viewedByAdmin",
        label: "Viewed By Admin",
        options: {
          display: false,
        },
      },
      {
        name: "viewedByShop",
        label: "Viewed By Shop",
        options: {
          display: false,
        },
      },
      {
        name: "complete",
        label: "Delivery Status",
        options: {
          filter: true,
          sort: true,
          customBodyRender: (complete, tableMeta) => {
            return (
              <div>
                {complete === true ? (
                  <label className="badge badge-success text-uppercase">
                    Delivered
                  </label>
                ) : (
                  <label className="badge badge-danger text-uppercase">
                    Not Delivered
                  </label>
                )}
              </div>
            );
          },
        },
      },
      {
        name: "id",
        label: "Action",
        options: {
          filter: true,
          sort: true,
          download: false,
          customBodyRender: (id, tableMeta) => {
            return (
              <div>
                <Link
                  to={"/orders/view/" + id}
                  className="m-r-15 text-muted"
                  data-toggle="tooltip"
                  data-placement="top"
                  title=""
                  data-original-title="View"
                >
                  <i className="f-22 icofont icofont-eye text-dark"></i>
                </Link>

                {
                  localStorage.getItem('q8_mall_ad_role') === "admin"
                 ?
                   <Link
                  to={"/orders/view-print/" + id}
                  className="m-r-15 text-muted">
                  {" "}
                  <i className="f-22 icofont icofont-print text-danger"></i>{" "}
                </Link> 
                : null
               }
              </div>
            );
          },
        },
      },
    ];
    const options = {
      filterType: "dropdown",
      viewColumns: false,
      print: false,
      pagination:false,
      download: true,
      selectableRows: "none",
      setRowProps: (row, dataIndex, rowIndex) => {
        if (localStorage.getItem("q8_mall_ad_role") === "shop") {
          if (row[8] === false) {
            return {
              // className: clsx({
              //   [this.props.classes.BusinessAnalystRow]: row[7] === false
              // }),
              style: { backgroundColor: "lightgoldenrodyellow" },
            };
          }
        } else {
          if (row[7] === false) {
            return {
              // className: clsx({
              //   [this.props.classes.BusinessAnalystRow]: row[7] === false
              // }),
              style: { backgroundColor: "lightgoldenrodyellow" },
            };
          }
        }
      },
      downloadOptions: {
        filename: "orders_list.csv",
        filterOptions: {
          useDisplayedColumnsOnly: true,
          useDisplayedRowsOnly: true,
        },
      },
      textLabels: {
        body: {
          noMatch: this.state.isSaving
            ? "Loading data..!"
            : "Sorry, No Orders Found",
          toolTip: "Sort",
          columnHeaderTooltip: (column) => `Sort for ${column.label}`,
        },
      },
    };
    return (
      <div className="pcoded-inner-content">
        <div className="main-body">
          <div className="page-wrapper">
            <div className="page-header">
              <div className="row align-items-end">
                <div className="col-lg-8">
                  <div className="page-header-title">
                    <div className="d-inline">
                      <h4>Order List</h4>
                    </div>
                  </div>
                  <Link
                    to="/"
                    className="btn btn-sm btn-outline-dark waves-effect waves-light f-right d-inline-block md-trigger"
                    data-modal="modal-13"
                  >
                    {" "}
                    <i className="icofont icofont-arrow-left m-r-5"></i> Back{" "}
                  </Link>
                </div>
                <div className="col-lg-4">
                  <div className="page-header-breadcrumb">
                    <ul className="breadcrumb-title">
                      <li className="breadcrumb-item">
                        <Link to="/">
                          <i className="feather icon-home"></i>{" "}
                        </Link>
                      </li>
                      <li className="breadcrumb-item active">Order List</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="page-body">
              <div className="row">
                <div className="col-sm-12">
                  <div className="card">
                    <div className="card-block">
                      <div className="dt-responsive table-responsive">
                        <MUIDataTable
                          title={"Order List"}
                          className="table-responsive"
                          data={this.state.orders_list}
                          columns={columns}
                          options={options}
                        />
                        	<nav
													aria-label="Page navigation example "
													className="display-flex float-right"
												>
													<ul class="pagination">
														<li class="page-item mx-2 py-2">
															Count : {this.state.datarange}-
															{this.state.datarange + this.state.dataLength}
														</li>
													
														<Pagination
															itemClass="page-item"
															linkClass="page-link"
															activePage={this.state.activePage}
															itemsCountPerPage={10}
															totalItemsCount={this.state.countFilterWise}
															pageRangeDisplayed={20}
															onChange={this.handlePageChange.bind(this)}
														/>
													</ul>
												</nav>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default OrderListShop;
