import React from 'react';
import { Link } from 'react-router-dom'
import $ from 'jquery';
import Constant from '../../../Constant'
import Swal from 'sweetalert2'
import "react-toggle/style.css" // for ES6 modules
import Toggle from 'react-toggle'


class DriverList extends React.Component {
  state = {
    Driver_list: [],
    language_data: []
  }
  componentWillMount() {
    this.getDriversList();

  }
  handleStatusChange = (sid,status) => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
 
    data.append("DriverId", sid);
    data.append("status", !status);

   
    fetch(Constant.getAPI() + "/driver/update", {
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
        Swal.fire("Updated !", "Driver has been Updated", "success");
        that.getDriversList()
        that.setState({ isSaving: false });

      } else {
        that.setState({ isSaving: false });
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
  getDriversList = () => {
    var that = this;
    var data = new URLSearchParams();
    // this.setState({ isSaving: true });
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
        console.log(json.data)
        that.setState({ drivers_data: json.data });
      } else {
        that.setState({ drivers_data: [] });
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
    return (
      <div className="pcoded-inner-content">
        <div className="main-body">
          <div className="page-wrapper">
            <div className="row">
              <div className="col-sm-12">
                <div className="card">
                  <div className="card-header">
                    <h5>Driver List</h5>
                    <Link to="/driver/add"
                      className="btn btn-sm btn-inverse waves-effect waves-light f-right d-inline-block md-trigger" data-modal="modal-13"> <i className="icofont icofont-plus m-r-5"></i> Add Driver
                       </Link>
                  </div>
                  <div className="card-block">
                    <div className="dt-responsive table-responsive">
                      <table id="basic-key-table" className="table table-striped table-bordered nowrap">
                        <thead>
                          <tr>
                            <th>#ID</th>
                            <th>Image </th>
                            <th>Full Name</th>
                            <th>Driver Name</th>
                            <th>Contact</th>
                            <th>Email</th>
                            {/* <th>Civl ID</th> */}
                            {/* <th>Total Post</th> */}
                            <th>Status </th>
                            <th>Action </th>
                          </tr>
                        </thead>
                        <tbody >
                          {this.state.drivers_data !== undefined &&
                            this.state.drivers_data !== null &&
                            this.state.drivers_data !== [] &&
                            this.state.drivers_data.length > 0 ? (
                              this.state.drivers_data.map((driver, i) => (
                                <tr key={i}>
                                  <td>{i + 1}</td>
                                  <td>
                                    <img src={driver.Medium !== null? driver.Medium.url :null} className="img-fluid img-40" alt="tbl" />
                                  </td>
                                  <td>{driver.firstName} {driver.lastName}</td>
                                  <td>{driver.userName}</td>
                                  <td>{driver.mobileNumber}</td>
                                  <td>{driver.email}</td>
                                  {/* <td>{driver.post}</td> */}
                                  <td>
                                    <Toggle
                                      id={"cattogBtn_" + driver.id}
                                      checked={driver.status == true ? true : false}
                                      value={driver.status}
                                      onChange={this.handleStatusChange.bind(this, driver.id,driver.status)}
                                    />
                                  </td>
                                  <td className="action-icon ">
                                    <Link to={"/driver/add/" + driver.id} className="m-r-15 text-muted" data-toggle="tooltip" data-placement="top" title="" data-original-title="Edit">
                                      <i className="f-20 icofont icofont-ui-edit text-custom"></i>
                                    </Link>
                                    {/* <span onClick={this.deletedealer.bind(this, driver.id)} className="m-r-15 text-muted" data-toggle="tooltip" data-placement="top" title="" data-original-title="Delete">
                                      <i className="f-20 icofont icofont-delete-alt text-danger"></i>
                                    </span> */}
                                  </td>
                                </tr>
                              ))) :
                            null
                          }
                        </tbody>
                        <tfoot>
                          <tr>
                            <th>#ID</th>
                            <th>Image </th>
                            <th>Full Name</th>
                            <th>Driver Name</th>
                            <th>Contact</th>
                            <th>Email</th>
                            {/* <th>Civl ID</th> */}
                            {/* <th>Total Post</th> */}
                            <th>Status </th>
                            <th>Action </th>
                          </tr>
                        </tfoot>
                      </table>
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

export default DriverList;