import React from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Constant from "../../Constant.js";

class ContactDetails extends React.Component {
  state = {};

  componentDidMount() {
    this.getContactUsDetails();
  }
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  getContactUsDetails = (id) => {
    var that = this;
    // var data = new URLSearchParams();
    // this.setState({ isSaving: true });
    fetch(Constant.getAPI() + "/contactUsDetails", {
      method: "get",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }).then(function (response) {
      return response.json();
    }).then(function (json) {
      that.setState({
        contact_details: json,
        address: json.address,
        phoneNumber: json.phoneNumber,
        lat: json.lat,
        lng: json.lng,
        email: json.email,
        timings: json.timings,
        isSaving: false
      });
    });
  }

  saveContactDetails = () => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    data.append("email", that.state.email);
    data.append("address", that.state.address);
    data.append("timings", that.state.timings);
    data.append("phoneNumber", that.state.phoneNumber);
    data.append("lat", that.state.lat);
    data.append("lng", that.state.lng);
    fetch(Constant.getAPI() + "/contactUsDetails", {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: data
    }).then(function (response) {
      return response.json();
    }).then(function (json) {
      if (json.status === true) {
        Swal.fire("Saved !", "Contact Details has been Saved", "success");
        that.getContactUsDetails();
        that.setState({ isSaving: false })
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
  };

  onSave = () => {
    this.saveContactDetails()
  }

  render() {
    return (
      <div className="main-body">
        <div className="page-wrapper">
          <div className="page-header">
            <div className="row align-items-end">
              <div className="col-lg-8">
                <div className="page-header-title">
                  <div className="d-inline">
                    <h4>Add Contact Details</h4>
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
                    <li className="breadcrumb-item active">
                      Add Contact Details
                  </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="page-body">
            <div className="row">
              <div className="col-sm-12">
                <div className="card card-border-primary">
                  <div className="card-block">
                    <div className="">
                      {
                        this.state.isloading ?
                          "Loading ..!"
                          :
                          <div className="card-body">
                            <div className="row">
                              <div className="col-md-6">
                                <div className="form-group row">
                                  <label className="col-sm-3 col-form-label">Contact Email</label>
                                  <div className="col-sm-9">
                                    <input
                                      type="email"
                                      className="form-control"
                                      name="email"
                                      id="email"
                                      placeholder="Contact Email"
                                      onChange={this.handleChange}
                                      value={this.state.email}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="form-group row">
                                  <label className="col-sm-3 col-form-label">Contact Number</label>
                                  <div className="col-sm-9">
                                    <input
                                      type="tel"
                                      className="form-control"
                                      name="phoneNumber"
                                      id="phoneNumber"
                                      placeholder="Contact Number"
                                      onChange={this.handleChange}
                                      value={this.state.phoneNumber}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="form-group row">
                                  <label className="col-sm-3 col-form-label">Contact Address</label>
                                  <div className="col-sm-9">
                                    <textarea className="form-control" name="address" id="address" placeholder="Contact Address" onChange={this.handleChange} value={this.state.address} rows={3} />
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="form-group row">
                                  <label className="col-sm-3 col-form-label">Timings</label>
                                  <div className="col-sm-9">
                                    <input
                                      type="tel"
                                      className="form-control"
                                      name="timings"
                                      id="timings"
                                      placeholder="Contact Number"
                                      onChange={this.handleChange}
                                      value={this.state.timings}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="form-group row">
                                  <label className="col-sm-3 col-form-label">Latitude</label>
                                  <div className="col-sm-9">
                                    <input
                                      type="text"
                                      className="form-control"
                                      name="lat"
                                      id="lat"
                                      placeholder="Latitude"
                                      onChange={this.handleChange}
                                      value={this.state.lat}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="form-group row">
                                  <label className="col-sm-3 col-form-label">Longitude</label>
                                  <div className="col-sm-9">
                                    <input
                                      type="text"
                                      className="form-control"
                                      name="lng"
                                      id="lng"
                                      placeholder="Longitude"
                                      onChange={this.handleChange}
                                      value={this.state.lng}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="row float-right p-3">
                              {
                                this.state.isSaving
                                  ?
                                  <button className="btn btn-grd-disabled mr-2" disabled>Saving...!</button>
                                  :
                                  <button onClick={this.onSave} className="btn btn-grd-disabled mr-2"><i className="icofont icofont-save"></i> Save</button>
                              }
                              <Link to={"/languages"} className="btn btn-outline-dark">
                                Cancel
                              </Link>
                            </div>
                          </div>
                      }
                    </div >
                  </div >
                </div >
              </div >
            </div >
          </div >
        </div >
      </div >
    );
  }
}

export default ContactDetails;
