import React from 'react';
import { Link } from 'react-router-dom'
import $ from 'jquery';
import Swal from 'sweetalert2'
import "react-toggle/style.css" // for ES6 modules
import Toggle from 'react-toggle'
import Constant from '../../../Constant'
import MUIDataTable from "mui-datatables";

class CountryList extends React.Component {
  state = {}
  handleStatusChange = (sid) => {
    var isChecked = $('#coutry_status_' + sid);
    isChecked.prop("checked", !isChecked.prop("checked"));
    //console.log(isChecked.prop('checked'), !isChecked.prop("checked"));
    if (!isChecked.prop("checked") === true) {
      this.onActiveCountry(sid)
    } else {
      this.onInactiveCountry(sid);
    }
  }
  onInactiveCountry = (country_id) => {
    var that = this;
    var data = new URLSearchParams();
    // this.setState({ isSaving: true });
    data.append("CountryId", country_id);
    fetch(Constant.getAPI() + "/country/inactivate", {
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
        that.getCountryList();
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
  onActiveCountry = (country_id) => {
    var that = this;
    var data = new URLSearchParams();
    // this.setState({ isSaving: true });
    data.append("CountryId", country_id);
    fetch(Constant.getAPI() + "/country/activate", {
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
        that.getCountryList();
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
  deleteCountry = (id) => {
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
        data.append("countryId", id);
        fetch(Constant.getAPI() + "/country/delete", {
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
            Swal.fire("Deleted!", "Country has been deleted.", "success");
            that.getCountryList();
          } else {
            that.setState({ country_data: {} });
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
    });

  }
  componentWillMount() {
    this.getCountryList();
  }
  getCountryList = () => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    fetch(Constant.getAPI() + "/country/getAll", {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        // "Authorization": localStorage.getItem('q8_mall_auth')
      },
      body: data
    }).then(function (response) {
      return response.json();
    }).then(function (json) {
      if (json.status === true) {
        that.setState({ country_data: json.data, isSaving: false });
      } else {
        that.setState({ country_data: [], isSaving: false });
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
      name: "name",
      label: "Country Name",
      options: {
        filter: true,
        sort: true
      }
    }, {
      name: "id",
      label: "Country Short Code",
      options: {
        filter: true,
        sort: true
      }
    }, {
      name: "phone",
      label: "Country Code",
      options: {
        filter: true,
        sort: true
      }
    }, {
      name: "active",
      label: "Status",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (active, tableMeta) => {
          var country_id = tableMeta.rowData[1];
          //console.log(tableMeta);
          return <Toggle
            id={"coutry_status_" + country_id}
            checked={active}
            value={active}
            onChange={this.handleStatusChange.bind(this, country_id)}
          />
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
            "Sorry, No Country Found",
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
                      <h4>Country List</h4>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="page-header-breadcrumb">
                    <ul className="breadcrumb-title">
                      <li className="breadcrumb-item">
                        <Link to="/">
                          <i className="feather icon-home"></i> </Link>
                      </li>
                      <li className="breadcrumb-item active">Country List</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="page-body">
              <div className="row">
                <div className="col-sm-12">
                  <div className="card">
                    {/* <div className="card-header">
                    <h5>Country List</h5> */}
                    {/* <Link to="/country/add"
                      className="btn btn-sm btn-inverse waves-effect waves-light f-right d-inline-block md-trigger" data-modal="modal-13"> <i className="icofont icofont-plus m-r-5"></i> Add Country
                       </Link> */}
                    {/* </div> */}
                    <div className="card-block">
                      <div className="dt-responsive table-responsive">
                        <MUIDataTable
                          title={"Country List"}
                          className="table-responsive"
                          data={this.state.country_data}
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

export default CountryList;
