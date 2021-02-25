import React from 'react';
import { Link } from 'react-router-dom'
import $ from 'jquery';
import Swal from 'sweetalert2'
import Constant from '../../Constant'
import MUIDataTable from "mui-datatables";


class WareHouseOrderList extends React.Component {
  state = {}
  componentWillMount() {
    this.getOrdersList();
  }
  getOrdersList = () => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    // data.append("DeliveryType", "shopToWarehouse")
    data.append("DeliveryType", "warehouseToCustomer,shopToWarehouse");
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
        var orders = []
        for (var i = 0; i < json.data.length; i++) {
          var order_obj = json.data[i];
          var total_orders = 0;
          var completed_orders = 0;
          for (var j = 0; j < json.data[i].length; j++) {
            total_orders = json.data[i].OrderStocks.length + total_orders
            if (json.data[i].status === "Delivered") {
              completed_orders = json.data[i].OrderStocks.length + completed_orders
            } else {
              completed_orders = completed_orders
            }
          }
          order_obj.complete_status = completed_orders + " / " + total_orders
          // if (completed_orders === total_orders) {
          //   order_obj.complete = true
          // } else {
          //   order_obj.complete = false
          // }
          orders.push(order_obj);
        }
        that.setState({ orders_list: orders, isSaving: false });

      } else {
        that.setState({ orders_list: [], isSaving: false });
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
  render() {
    const columns = [{
      name: "invoice",
      label: "Invoice Id",
      options: {
        filter: true,
        sort: true
      }
    }, {
      name: "Shop.name",
      label: "Shop Name",
      options: {
        filter: true,
        sort: true
      }
    }, {
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

          return <div>
            {created_at}
          </div >
        }
      }
    }, {
      name: "complete",
      label: "Delivery Status",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (complete, tableMeta) => {
          return <div>
            {
              complete === true
                ?
                <label className="badge badge-success text-uppercase">Delivered</label>
                :
                <label className="badge badge-danger text-uppercase">Not Delivered</label>
            }
          </div >
        }
      }
    }, {
      name: "id",
      label: "Action",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (id, tableMeta) => {
          return <div>
            <Link
              to={"/warehouse-orders/view/" + id}
              className="m-r-15 text-muted"
              data-toggle="tooltip"
              data-placement="top"
              title=""
              data-original-title="View">
              <i className="f-22 icofont icofont-eye text-dark"></i>
            </Link>
          </div >
        }

      }
    }
    ];
    const options = {
      filterType: "dropdown",
      viewColumns: false,
      print: false,
      download: false,
      selectableRows: 'none',
      textLabels: {
        body: {
          noMatch: this.state.isSaving ?
            "Loading data..!" :
            "Sorry, No Orders Found",
          toolTip: "Sort",
          columnHeaderTooltip: column => `Sort for ${column.label}`
        }
      }
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
                      <h4>Warehouse Order List</h4>
                    </div>
                  </div>
                  {/* <Link to="/" className="btn btn-sm btn-outline-dark waves-effect waves-light f-right d-inline-block md-trigger" data-modal="modal-13"> <i className="icofont icofont-arrow-left m-r-5"></i> Back </Link> */}
                </div>
                <div className="col-lg-4">
                  <div className="page-header-breadcrumb">
                    <ul className="breadcrumb-title">
                      <li className="breadcrumb-item">
                        <Link to="/">
                          <i className="feather icon-home"></i> </Link>
                      </li>
                      <li className="breadcrumb-item active">Warehouse Order List</li>
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
                          title={"Warehouse Order List"}
                          className="table-responsive"
                          data={this.state.orders_list}
                          columns={columns}
                          options={options}
                        />
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

export default WareHouseOrderList;
