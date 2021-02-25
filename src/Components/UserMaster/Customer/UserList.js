import React from 'react';
import { Link } from 'react-router-dom'
import $ from 'jquery';
import Constant from '../../../Constant'
import Swal from 'sweetalert2'
import "react-toggle/style.css" // for ES6 modules
import Toggle from 'react-toggle'
import MUIDataTable from 'mui-datatables';


class UserList extends React.Component {
  state = {
    User_list: [],
    language_data: []
  }
  componentWillMount() {
    this.getUsersList();

  }
  handleStatusChange = (sid) => {
    var isChecked = $('#cattogBtn_' + sid);
    isChecked.prop("checked", !isChecked.prop("checked"));
    console.log(isChecked.prop('checked'), !isChecked.prop("checked"));
    if (!isChecked.prop("checked") === true) {
      var status = 'active'
    } else {
      var status = 'inactive'
    }
    let newArray = this.state.User_list;
    var a = newArray.find((element) => {
      return element.id === sid
    })
    a.status = status;
    console.log(newArray)
    this.setState({ User_list: newArray })
    Swal.fire("Update Status!", "Status has been updated.", "success");
  }

  deletedealer = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this !",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it"
    }).then(result => {
      if (result.value) {

        Swal.fire("Deleted!", "Dealer has been deleted.", "success");
      }
    });
  }
  getUsersList = () => {
    var that = this;
    var data = new URLSearchParams();
    // this.setState({ isSaving: true });
    fetch(Constant.getAPI() + "/user/get", {
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
        that.setState({ customers_data: json.data });
      } else {
        that.setState({ customers_data: [] });
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
      name: "firstName",
      label: "First Name",
      options: {
        filter: true,
        sort: true
      }
    }, {
      name: "lastName",
      label: "Last Name",
      options: {
        filter: true,
        sort: true
      }
    }, {
      name: "userName",
      label: "User Name",
      options: {
        filter: true,
        sort: true
      }
    }, {
      name: "email",
      label: "Email",
      options: {
        filter: true,
        sort: true
      }
    }, {
      name: "mobileNumber",
      label: "Contact",
      options: {
        filter: true,
        sort: true
      }
    }, {
      name: "guest",
      label: "Customer Type",
      options: {
        filter: true,
        sort: true,
        download: false,
        customBodyRender: (guest, tableMeta) => {
          return <div>{guest === true ? "Guest User " : "Normal "}</div>
        }
      }
    }, {
      name: "id",
      label: "Actions",
      options: {
        filter: true,
        sort: true,
        download: false,
        customBodyRender: (id, tableMeta) => {
          console.log(tableMeta);
          return (
            <div>
              <Link to={"/customers/" + id + "/address"}
                className="m-r-15 text-muted"
                data-toggle="tooltip"
                data-placement="top" title=""
                data-original-title="Edit">
                <i className="f-20 icofont icofont-address-book text-primary"></i>
              </Link>
            </div>
          )
        }
      }

    }];
    const options = {
      filterType: "dropdown",
      viewColumns: false,
      print: false,
      download: true,
      selectableRows: 'none',
      downloadOptions: {
        filename: 'customer_list.csv',
        filterOptions: {
          useDisplayedColumnsOnly: true,
          useDisplayedRowsOnly: true
        }
      },
      textLabels: {
        body: {
          noMatch: this.state.isSaving ?
            "Loading data..!" :
            "Sorry, No Customers Found",
          toolTip: "Sort",
          columnHeaderTooltip: column => `Sort for ${column.label}`
        }
      }
    };
    return (
      <div className="pcoded-inner-content">
        <div className="main-body">
          <div className="page-wrapper">
            <div className="row">
              <div className="col-sm-12">
                <div className="card">
                  <div className="card-header">
                    <h5>Customer List</h5>
                    {/* <Link to="/customers/add"
                      className="btn btn-sm btn-inverse waves-effect waves-light f-right d-inline-block md-trigger" data-modal="modal-13"> <i className="icofont icofont-plus m-r-5"></i> Add User
                       </Link> */}
                  </div>
                  <div className="card-block">
                    <div className="dt-responsive table-responsive">

                      <MUIDataTable
                        title={"Customer List"}
                        className="table-responsive"
                        data={this.state.customers_data}
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
    );
  }
}

export default UserList;