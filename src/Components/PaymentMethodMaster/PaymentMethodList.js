import React from 'react';
import { Link } from 'react-router-dom'
import $ from 'jquery';
import Constant from '../../Constant'
import Swal from 'sweetalert2'
import MUIDataTable from "mui-datatables";

class PaymentMethodList extends React.Component {
  state = {}
  handleStatusChange = (sid) => {
    var isChecked = $('#tyre_payment_method_' + sid);
    isChecked.prop("checked", !isChecked.prop("checked"));
    //console.log(isChecked.prop('checked'), !isChecked.prop("checked"));
    if (!isChecked.prop("checked") === true) {
      var status = 'active'
    } else {
      var status = 'inactive'
    }
    let newArray = this.state.tyre_payment_method_list;
    var a = newArray.find((element) => {
      return element.id === sid
    })
    a.status = status;
    //console.log(newArray)
    this.setState({ tyre_payment_method_list: newArray })
    Swal.fire("Update Status!", "Status has been updated.", "success");
  }
  deletePaymentMethod = (id) => {
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
        data.append("PaymentMethodId", id);
        fetch(Constant.getAPI() + "/payment/delete", {
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
            Swal.fire("Deleted!", "Tyre PaymentMethod deleted.", "success");
            that.getPaymentMethodList();
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
  getPaymentMethodList = () => {
    var that = this;
    this.setState({ isSaving: true });
    var data = new URLSearchParams();
    if (localStorage.getItem('q8_mall_ad_role') === "shop") {
      data.append('ShopId', localStorage.getItem('q8_mall_ad_uid'));
    }
    fetch(Constant.getAPI() + "/payment/get", {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: data
    }).then(function (response) {
      return response.json();
    }).then(function (json) {
      if (json.status === true) {
        that.setState({ payment_method_data: json.data, isSaving: false });
      } else {
        that.setState({ payment_method_data: [], isSaving: false });
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
  componentWillMount() {
    this.getPaymentMethodList();

  }
  render() {
    const columns = [{
      name: "Medium",
      label: "Image",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (Medium, tableMeta) => {
          return <div>
            {
              Medium !== undefined && Medium !== null && Medium !== {}
                ?
                <img src={Medium.url !== undefined && Medium.url !== null && Medium.url !== "" ? Medium.url : "./assets/images/icon.png"} alt="" className="img-40" />
                :
                <img src="./assets/images/icon.png" alt="" className="img-40" />
            }
          </div>
        }
      }
    }, {
      name: "title_en",
      label: "PaymentMethod Name : English",
      options: {
        filter: true,
        sort: true
      }
    }, {
      name: "title_ar",
      label: "PaymentMethod Name : Arabic",
      options: {
        filter: true,
        sort: true
      }
    }, {
      name: "type",
      label: "Payment Type",
      options: {
        filter: true,
        sort: true
      }

    }, {
      name: "id",
      label: "Action",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (id, tableMeta) => {
          return <div>
            <Link to={"/payment-methods/add/" + id}
              className="m-r-15 text-muted"
              data-toggle="tooltip"
              data-placement="top" title=""
              data-original-title="Edit">
              <i className="f-20 icofont icofont-ui-edit text-custom"></i>
            </Link>
            <span onClick={this.deletePaymentMethod.bind(this, id)}
              className="m-r-15 text-muted"
              data-toggle="tooltip"
              data-placement="top"
              title=""
              data-original-title="Delete">
              <i className="f-20 icofont icofont-delete-alt text-danger"></i>  </span>
          </div>
        }
      }
    }];

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
            "Sorry, No PaymentMethod Found",
          toolTip: "Sort",
          columnHeaderTooltip: column => `Sort for ${column.label}`
        }
      }
    };
    return (
      <div className="pcoded-inner-content" >
        <div className="main-body">
          <div className="page-wrapper">
            <div className="page-header">
              <div className="row align-items-end">
                <div className="col-lg-8">
                  <div className="page-header-title">
                    <div className="d-inline">
                      <h4>PaymentMethod List</h4>
                    </div>
                  </div>
                  {/* {localStorage.getItem('q8_mall_ad_role') !== "shop"
                    ? */}
                  <Link to="/payment-methods/add" className="btn btn-sm btn-inverse waves-effect waves-light f-right d-inline-block md-trigger" data-modal="modal-13"> <i className="icofont icofont-plus m-r-5"></i> Add PaymentMethod </Link>
                  {/* :
                  } */}
                  <Link to="/" className="btn btn-sm btn-outline-dark waves-effect waves-light f-right d-inline-block md-trigger mx-3" data-modal="modal-13"> <i className="icofont icofont-arrow-left m-r-5"></i> Back </Link>
                </div>
                <div className="col-lg-4">
                  <div className="page-header-breadcrumb">
                    <ul className="breadcrumb-title">
                      <li className="breadcrumb-item">
                        <Link to="/">
                          <i className="feather icon-home"></i> </Link>
                      </li>
                      <li className="breadcrumb-item active">PaymentMethod List</li>
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
                          title={"PaymentMethod List"}
                          className="table-responsive"
                          data={this.state.payment_method_data}
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

export default PaymentMethodList;
