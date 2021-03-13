import React from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import $ from "jquery";
import Constant from "../../../Constant";

class DriverAdd extends React.Component {
  state = {
    status: true,
    Driver_list: [],
  };

  componentWillMount() {
    if (this.props.driver_id !== undefined) {
      this.setState({ driver_id: this.props.driver_id });
      this.getdealerDetails();
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.driver_id !== this.props.driver_id) {
      this.setState({ driver_id: this.props.driver_id });
      this.getdealerDetails();
    }
  }
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  getdealerDetails = () => {
    var that = this;
    var data = new URLSearchParams();
    // this.setState({ isSaving: true });
    data.append("driverId", that.props.driver_id);
    fetch(Constant.getAPI() + "/driver/get", {
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
        for (var i = 0; i < json.data.length; i++) {
          if (json.data[i].id === that.props.driver_id) {
            that.setState({
              sellers_data: json.data[i],
              firstName: json.data[i].firstName,
              lastName: json.data[i].lastName,
              userName: json.data[i].userName,
              email: json.data[i].email,
              mobileNumber: json.data[i].mobileNumber
            });
          }
        }
      }
    })
  }
  adddealer = (media_id) => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    data.append("email", that.state.email);
    data.append("name", that.state.userName);
    data.append("firstName", that.state.firstName);
    data.append("lastName", that.state.lastName);
    if (media_id !== undefined && media_id !== null) {
      data.append("image", media_id);
    } else {
      data.append("image", "");
    }
    data.append("LanguageId", that.props.language_id);
    data.append("mobileNumber", that.state.mobileNumber);
    data.append("password", that.state.password);
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
        Swal.fire("Added !", "Driver has been Added", "success");
        window.location.href = "#/driver";
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
  };
  componentWillMount() {
    this.loadScript(process.env.PUBLIC_URL + "/assets/pages/filer/jquery.fileuploads.init.js");
  }
  loadScript(src) {
    let script = document.createElement("script");
    script.src = src;
    script.type = "text/javascript";
    document.head.append(script);
  }
  handleImageUpload = (event) => {
    document.getElementById('id_image_section_lable').innerHTML = "";
    let element = $("#driver_Image").get(0);
    $("#id_image_section").empty();
    this.setState({ accepted: element });
    var proof_img = [];
    let obj = {};
    //console.log(element.files);
    this.setState({ driver_Image: element.files });
    for (var i = 0; i < element.files.length; i++) {
      var file1 = element.files[i];
      var img = document.createElement("img");
      img.className = "img-100";
      var filePath = URL.createObjectURL(file1);
      img.src = filePath;
      $("#id_image_section_lable").append(img);
    }
  }
  uploadMedia = () => {
    var that = this;
    var form = $('#driverImage')[0];
    var data = new FormData(form);
    data.append('upload_for', 'driver');
    fetch(Constant.getAPI() + "/mediaUpload", {
      method: "post",
      body: data
    }).then(function (response) {
      return response.json();
    }).then(function (json) {
      if (json.error === "SFD") {
        if (that.props.shop_id !== undefined) {
          that.editDriver(json.data[0].id);
        } else {
          that.addDriver(json.data[0].id);
        }
      } else {
        that.setState({ category_data: [] });
        //console.log(json.error);
      }
    });
  }
  onSaveData = () => {
    var that = this;
    that.setState({ isSaving: true });
    if (that.state.accepted) {
      that.uploadMedia();
    } else if (that.props.driver_id !== undefined) {
      that.editDriver(that.state.media_id);
    } else {
      that.addDriver(that.state.media_id);
    }
  }
  editDriver = (media_id) => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    data.append("email", that.state.email);
    data.append("name", that.state.userName);
    data.append("firstName", that.state.firstName);
    data.append("lastName", that.state.lastName);
    if (media_id !== undefined && media_id !== null) {
      data.append("image", media_id);
    } else {
      data.append("image", "");
    }
    data.append("LanguageId", that.props.language_id);
    data.append("DriverId", that.props.driver_id);
    data.append("mobileNumber", that.state.mobileNumber);
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
        window.location.href = "#/driver";
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
  };
  render() {
    return (
      <div className="">
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">First Name</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    name="firstName"
                    id="firstName"
                    placeholder="First Name"
                    onChange={this.handleChange}
                    value={this.state.firstName}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Last Name</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    name="lastName"
                    id="lastName"
                    placeholder="Last Name"
                    onChange={this.handleChange}
                    value={this.state.lastName}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Email</label>
                <div className="col-sm-9">
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    id="email"
                    placeholder="Email"
                    onChange={this.handleChange}
                    value={this.state.email}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Password</label>
                <div className="col-sm-9">
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    id="driver_password"
                    placeholder="Password"
                    onChange={this.handleChange}
                    value={this.state.password}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">User Name</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    name="userName"
                    id="userName"
                    placeholder="User Name"
                    onChange={this.handleChange}
                    value={this.state.userName}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Mobile Number</label>
                <div className="col-sm-9">
                  <input
                    type="number"
                    className="form-control"
                    name="mobileNumber"
                    id="mobileNumber"
                    placeholder="Mobile Number"
                    onChange={this.handleChange}
                    value={this.state.mobileNumber}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="row">
                <div className="col-sm-3">
                  Driver Image
                </div>
                <div className="col-sm-9">
                  <form id="driverImage" name="driverImage" encType="multipart/form-data" className="text-capitalize">

                    <div className="form-group">

                      <input accept="image/*" onChange={this.handleImageUpload} id="driver_Image" type="file" className="form-control" autoComplete="off" name="media[]"
                        data-toggle="tooltip" title="Click To Upload Photo"
                      />
                      <div id="id_image_section_lable" className="pt-2">
                        {
                          this.state.image_url
                            ?
                            this.state.image_url !== null || this.state.image_url !== undefined || this.state.image_url !== {}
                              ?
                              <img src={this.state.image_url} alt=""
                                className="img-100" onError={e => {
                                  e.target.src = ""
                                }} />
                              :
                              ''
                            :
                            ''
                        }
                      </div>
                    </div>
                  </form>
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
                <button onClick={this.onSaveData} className="btn btn-grd-disabled mr-2"><i className="icofont icofont-save"></i> Save</button>
            }
            <Link to={"/driver"} className="btn btn-outline-dark"> Cancel </Link>
          </div>
        </div>
      </div >

    );
  }
}

export default DriverAdd;
