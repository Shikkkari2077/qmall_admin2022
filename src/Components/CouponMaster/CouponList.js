import React from 'react';
import { Link } from 'react-router-dom'
import Constant from '../../Constant'
import Swal from 'sweetalert2'
import MUIDataTable from "mui-datatables";
import CouponWiseShopModal from './CouponWiseShopModal';

class CouponList extends React.Component {
  state = {}
  componentWillMount() {
    this.getCouponList();
  }
  deleteCoupon = (coupon_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this !",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it"
    }).then(result => {
      if (result.value) {
        var that = this;
        var data = new URLSearchParams();
        // this.setState({ isSaving: true });
        data.append("CouponId", coupon_id);
        fetch(Constant.getAPI() + "/coupon/delete", {
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
            Swal.fire("Deleted!", "Coupon deleted.", "success");
            that.getCouponList();
          } else {
            Swal.fire({
              title: "Something went wrong. Try again after some Time.!",
              icon: 'error',
              text: "",
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Ok"
            });
          }
        });
      }
    });
  }
  getCouponList = () => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    fetch(Constant.getAPI() + "/coupon/get", {
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
        that.setState({ coupon_list: json.data, isSaving: false });
      } else {
        that.setState({ coupon_list: [], isSaving: false });
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
  onOpenShopModal = (coupon_id) => {
    this.setState({ isOpen: true, coupon_id: coupon_id });
  }
  onCloseShopModal = () => {
    this.setState({ isOpen: false, coupon_id: "" });
  }
  render() {
    const columns = [{
      name: "code",
      label: "Coupon Code",
      options: {
        filter: true,
        sort: true
      }
    }, {
      name: "createdAt",
      label: "Created At",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (createdAt, tableMeta) => {
          var create_date = new Date(createdAt);
          var create_day, create_month, create_year;
          if (create_date.getDate() > 9) {
            create_day = create_date.getDate();
          } else {
            create_day = "0" + create_date.getDate();
          }
          if ((create_date.getMonth() + 1) > 9) {
            create_month = (create_date.getMonth() + 1);
          } else {
            create_month = "0" + (create_date.getMonth() + 1);
          }
          create_year = create_date.getFullYear();

          var created_at = create_day + "-" + create_month + "-" + create_year

          return (<div>
            {created_at}
          </div>
          )
        }
      }
    }, {
      name: "expiry",
      label: "Coupon Expiery Date",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (expiry, tableMeta) => {
          var coupon_expiery = new Date(expiry);
          var exp_day, exp_month, exp_year;
          if (coupon_expiery.getDate() > 9) {
            exp_day = coupon_expiery.getDate();
          } else {
            exp_day = "0" + coupon_expiery.getDate();
          }
          if ((coupon_expiery.getMonth() + 1) > 9) {
            exp_month = (coupon_expiery.getMonth() + 1);
          } else {
            exp_month = "0" + (coupon_expiery.getMonth() + 1);
          }
          exp_year = coupon_expiery.getFullYear();

          var exp_date = exp_day + "-" + exp_month + "-" + exp_year

          return (<div>
            {exp_date}
          </div>
          )
        }
      }
    }, {
      name: "minAmount",
      label: "Minimum Amount",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (minAmount, tableMeta) => {
          return (<div>
            {
              minAmount !== undefined && minAmount !== null && minAmount !== ""
                ?
                minAmount
                :
                "-"
            }
          </div>
          )
        }
      }
    }, {
      name: "amount",
      label: "Discount Amount",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (amount, tableMeta) => {
          return (<div>
            {
              amount !== undefined && amount !== null && amount !== ""
                ?
                amount
                :
                "-"
            }
          </div>
          )
        }
      }
    }, {
      name: "CurrencyId",
      label: "Discount Currency",
      options: {
        filter: true,
        sort: true
      }
    }, {
      name: "percentage",
      label: "Discount Percentage",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (percentage, tableMeta) => {
          return (<div>
            {
              percentage !== undefined && percentage !== null && percentage !== ""
                ?
                percentage
                :
                "-"
            }
          </div>
          )
        }
      }
    }, {
      name: "id",
      label: "Action",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (id, tableMeta) => {
          return (<div>
            <Link to={"/coupons/add/" + id}
              className="m-r-15 text-muted"
              data-toggle="tooltip"
              data-placement="top" title=""
              data-original-title="Edit">
              <i className="f-20 icofont icofont-ui-edit text-custom"></i>
            </Link>
            <span onClick={this.onOpenShopModal.bind(this, id)}
              className="m-r-15 text-muted"
              data-toggle="tooltip"
              data-placement="top"
              title=""
              data-original-title="Add Shops">
              <i className="f-20 icofont icofont-plus text-warning"></i>  </span>
            <span onClick={this.deleteCoupon.bind(this, id)}
              className="m-r-15 text-muted"
              data-toggle="tooltip"
              data-placement="top"
              title=""
              data-original-title="Delete">
              <i className="f-20 icofont icofont-delete-alt text-danger"></i>  </span>
          </div>)
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
            "Sorry, No Coupons Found",
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
                      <h4>Coupon List</h4>
                    </div>
                  </div>
                  <Link to="/coupons/add"
                    className="btn btn-sm btn-inverse waves-effect waves-light f-right d-inline-block md-trigger" data-modal="modal-13"> <i className="icofont icofont-plus m-r-5"></i> Add Coupon
                       </Link>
                </div>
                <div className="col-lg-4">
                  <div className="page-header-breadcrumb">
                    <ul className="breadcrumb-title">
                      <li className="breadcrumb-item">
                        <Link to="/">
                          <i className="feather icon-home"></i> </Link>
                      </li>
                      <li className="breadcrumb-item active">Coupon List</li>
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
                          title={"Coupon List"}
                          className="table-responsive"
                          data={this.state.coupon_list}
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
        <CouponWiseShopModal isOpen={this.state.isOpen} onCloseModal={this.onCloseShopModal} coupon_id={this.state.coupon_id} />
      </div>
    );
  }
}

export default CouponList;
