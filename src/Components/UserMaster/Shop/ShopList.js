import React from 'react';
import { Link } from 'react-router-dom'
import Constant from '../../../Constant'
import Swal from 'sweetalert2'
import MUIDataTable from "mui-datatables";
import "react-toggle/style.css" // for ES6 modules
import Toggle from 'react-toggle'
import $ from 'jquery';

class ShopList extends React.Component {
  state = {}
  componentWillMount() {
    this.getVendorsList();
  }
  getVendorsList = () => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    fetch(Constant.getAPI() + "/shop/get", {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": localStorage.getItem('q8_mall_auth')
      },
      body: data
    }).then(function (response) {
      return response.json();
    }).then(function (json) {
      //console.log(json)
      if (json.status === true) {
        that.setState({ users_data: json.data, isSaving: false });
      } else {
        that.setState({ users_data: [], isSaving: false });
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
  deleteCategory = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this !",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.value) {
        var that = this;
        var data = new URLSearchParams();
        // this.setState({ isSaving: true });
        data.append("ShopId", id);
        fetch(Constant.getAPI() + "/shop/delete", {
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
              Swal.fire("Deleted!", " Shop deleted.", "success");
              window.location.reload()
            } else {
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
      }
    });
  };

  
  handleActiveChange = (sid) => {
    var isChecked = $('#shop_active_status_' + sid);
    isChecked.prop("checked", !isChecked.prop("checked"));
    //console.log(isChecked.prop('checked'), !isChecked.prop("checked"));
    if (!isChecked.prop("checked") === true) {
      var status = true
    } else {
      var status = false
    }
    var that = this;
    var data = new URLSearchParams();
    // this.setState({ isSaving: true });
    data.append("active", status);
    data.append("ShopId", sid);
    fetch(Constant.getAPI() + "/shop/toggleActive", {
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
        Swal.fire("Update Status!", "Status has been updated.", "success");
        that.getVendorsList();
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
  render() {
    const columns = [{
      name: "Medium",
      label: "Image",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (Medium, tableMeta) => {
          return (<img src={Medium !== undefined && Medium !== null && Medium !== {} ? Medium.url : "./assets/images/icon.png"} className="img-fluid img-40" alt="tbl" />)
        }
      }
    }, {
      name: "name_en",
      label: "Name : English",
      options: {
        filter: true,
        sort: true
      }
    }, {
      name: "name_ar",
      label: "Name : Arabic",
      options: {
        filter: true,
        sort: true
      }
      // }, {
      //   name: "approxDeliveryTime",
      //   label: "Approx Delivery Time",
      //   options: {
      //     filter: true,
      //     sort: true
      //   }
      // }, {
      //   name: "deliveryCharges",
      //   label: "Delivery Charges (in KWD)",
      //   options: {
      //     filter: true,
      //     sort: true
      //   }
    }, {
      name: "qmallCommission",
      label: "Qmall Commission (in %)",
      options: {
        filter: true,
        sort: true
      }
    }, {
      name: "ibanNumber",
      label: "IBAN Number",
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: "Categories",
      label: "Shop Categories",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (Categories, tableMeta) => {
          return <div>
            {
              Categories !== null && Categories !== undefined
                ?
                Categories.map(cat=>(
                     <li>{cat.name_en+"/"+cat.name_ar}</li> 
                  ))
               
                :
                null
            }
          </div >
        }
      }
    },
      {
      name: "openTime",
      label: "Shop Open Time",
      options: {
        filter: true,
        sort: true
      }
    }, {
      name: "closeTime",
      label: "Shop Closing Time",
      options: {
        filter: true,
        sort: true
      }
    }, {
      name: "active",
      label: "Active",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (active, tableMeta) => {
          return <Toggle
            id={"shop_active_status_" + tableMeta.rowData[10]}
            checked={active === true ? true : false}
            value={active}
            onChange={this.handleActiveChange.bind(this, tableMeta.rowData[10])}
          />
        }
      }
    }, {
      name: "status",
      label: "Status",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (status, tableMeta) => {
          return (
            <div>
              {
                status === 'open'
                  ?
                  <span className="badge badge-success">Open</span> :
                  <span className="badge badge-danger">Closed</span>
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
            <Link to={"/shops/add/" + id}
              className="m-r-15 text-muted"
              data-toggle="tooltip"
              data-placement="top" title=""
              data-original-title="Edit">
              <i className="f-20 icofont icofont-ui-edit text-custom"></i>
            </Link>
            <Link to={"/shops/branch/" + id}
              className="m-r-15 text-muted"
              data-toggle="tooltip"
              data-placement="top" title=""
              data-original-title="Edit">
              <i className="f-20 icofont icofont-building-alt text-purple"></i>
            </Link>
          
            <Link
              to={"/shop/products/" + id}
              className="m-r-15 text-muted"
              data-toggle="tooltip"
              data-placement="top"
              title=""
              data-original-title="View Shop Products ">
              <i className="f-22 icofont icofont-eye text-dark"></i>
            </Link>
            <Link to={"/section/shop/" + id}
              className="m-r-15 text-muted"
              data-toggle="tooltip"
              data-placement="top" title=""
              data-original-title="Add Delivery Charges">
          <i className="feather icon-slack f-22"></i></Link>
          <span
                  onClick={this.deleteCategory.bind(this, id)}
                  className="m-r-15 text-muted"
                  data-toggle="tooltip"
                  data-placement="top"
                  title=""
                  data-original-title="Delete"
                >
                  <i className="f-20 icofont icofont-delete-alt text-danger"></i>{" "}
                </span>
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
            "Sorry, No Shop Found",
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
                      <h4>Shop List</h4>
                    </div>
                  </div>
                  <Link to="/shops/add"
                    className="btn btn-sm btn-inverse waves-effect waves-light f-right d-inline-block md-trigger" data-modal="modal-13"> <i className="icofont icofont-plus m-r-5"></i> Add Shop
                       </Link>
                </div>
                <div className="col-lg-4">
                  <div className="page-header-breadcrumb">
                    <ul className="breadcrumb-title">
                      <li className="breadcrumb-item">
                        <Link to="/">
                          <i className="feather icon-home"></i> </Link>
                      </li>
                      <li className="breadcrumb-item active">Shop List</li>
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
                          title={"Shop List"}
                          className="table-responsive"
                          data={this.state.users_data}
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

export default ShopList;
