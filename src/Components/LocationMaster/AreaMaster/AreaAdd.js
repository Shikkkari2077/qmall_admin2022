import React from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import $ from "jquery";
import Constant from "../../../Constant.js";

class AreaAdd extends React.Component {
  state = {
    status: true,
    active: true,
    deliveryCharge: 0,
    description: 'desc'
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.language_id !== undefined) {
      if (prevProps.area_id !== this.props.area_id) {
        this.setState({ area_id: this.props.area_id });
        this.getAreaDetails();
      }
      if (this.props.language_id !== prevProps.language_id) {
        this.getAreaDetails();
        this.getGovernorateList();
      }
      if (this.state.country_id !== prevState.country_id) {
        this.getGovernorateList();
      }
    }
  }
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  getAreaDetails = () => {
    var that = this;
    var data = new URLSearchParams();
    // this.setState({ isSaving: true });
    this.setState({ AreaId: that.props.area_id });
    //data.append("LanguageId", that.props.language_id);
    data.append("AreaId", that.props.area_id);
    fetch(Constant.getAPI() + "/area/get", {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: data
    }).then(function (response) {
      return response.json();
    }).then(function (json) {
      if (json.status === true) {
        for (var i = 0; i < json.data.length; i++) {
          if (json.data[i].id === that.props.area_id) {
            that.setState({
              area_data: json.data[i],
              area_name: json.data[i].name_en,
              area_name_ar: json.data[i].name_ar,
              governorate_id: json.data[i].StateId,
              deliveryCharge: json.data[i].deliveryCharge,
              status: json.data[i].status
            })
            if (json.data[i].deliveryCharge !== null) {
              that.setState({
                deliveryCharge: json.data[i].deliveryCharge
              })
            } else {
              that.setState({
                deliveryCharge: 0
              })
            }
            if (json.data[i].active === true) {
              that.setState({
                active: json.data[i].active
              })
            } else {
              that.setState({
                active: false
              })
            }
          }
        }
      } else {
        that.setState({ area_data: [] });
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

  updateAreaDetails = () => {
    var that = this;
    var data = new URLSearchParams();
    // this.setState({ isSaving: true });
    data.append("name_en", that.state.area_name);
    data.append("name_ar", that.state.area_name_ar);
    data.append("StateId", that.state.governorate_id);
    data.append("active", that.state.active);
    data.append("deliveryCharge", that.state.deliveryCharge);
    //data.append("LanguageId", that.props.language_id);
    data.append("AreaId", that.props.area_id);
    fetch(Constant.getAPI() + "/area/update", {
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
        Swal.fire("Updated !", "Area has been Updated", "success");
        window.location.href = "#/area"
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
  addArea = () => {
    var that = this;
    var data = new URLSearchParams();
    // this.setState({ isSaving: true });
    data.append("name_en", that.state.area_name);
    data.append("name_ar", that.state.area_name_ar);
    data.append("StateId", that.state.governorate_id);
    data.append("active", that.state.active);
    data.append("deliveryCharge", that.state.deliveryCharge);
    //data.append("LanguageId", that.props.language_id);
    fetch(Constant.getAPI() + "/area/add", {
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
        Swal.fire("Added !", "Area has been Added", "success");
        window.location.href = "#/area"
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
    // this.getGovernorateList();
    // this.getCountryList();
  }
  loadScript(src) {
    let script = document.createElement("script");
    script.src = src;
    script.type = "text/javascript";
    document.head.append(script);
  }
  onSaveData = () => {
    var that = this;
    if (that.props.area_id !== undefined) {
      that.updateAreaDetails();
    } else {
      that.addArea();
    }
  }
  getCountryList = () => {
    var that = this;
    var data = new URLSearchParams();
    // this.setState({ isSaving: true });
    fetch(Constant.getAPI() + "/country/get", {
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
        that.setState({ country_data: json.data, country_id: json.data[0].id });
      } else {
        that.setState({ country_data: [] });
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
  getGovernorateList = () => {
    var that = this;
    var data = new URLSearchParams();
    // this.setState({ isSaving: true });
    // data.append("countryId", that.state.country_id)
    //data.append("LanguageId", that.props.language_id);
    fetch(Constant.getAPI() + "/state/get", {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: data
    }).then(function (response) {
      return response.json();
    }).then(function (json) {
      if (json.status === true) {
        that.setState({ governorate_data: json.data });
        // that.setState({ governorate_data: json.data, governorate_id: json.data[0].id });
      } else {
        that.setState({ governorate_data: [] });
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
      <div className="">
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Area Name (English)</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    name="area_name"
                    id="area_name"
                    placeholder="Area Name"
                    onChange={this.handleChange}
                    value={this.state.area_name}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Area Name (Arabic)</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    name="area_name_ar"
                    id="area_name_ar"
                    placeholder="Area Name"
                    onChange={this.handleChange}
                    value={this.state.area_name_ar}
                  />
                </div>
              </div>
            </div>
            {/* <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Area Code</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    name="area_short_code"
                    id="area_short_code"
                    placeholder="Area Code"
                    onChange={this.handleChange}
                    defaultValue={this.state.area_short_code}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Pincode</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    name="pincode"
                    id="pincode"
                    placeholder="Pincode"
                    onChange={this.handleChange}
                    value={this.state.pincode}
                  />
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Select Country</label>
                <div className="col-sm-9">
                  <select name="country_id" className="form-control form-control-inverse" onChange={this.handleChange} value={this.state.country_id}>
                    <option value="0">Select Country</option>
                    {
                      this.state.country_data !== undefined && this.state.country_data !== null && this.state.country_data !== [] && this.state.country_data.length > 0
                        ?
                        this.state.country_data.map(country_list =>
                          <option value={country_list.id}>{country_list.name}</option>
                        )
                        :
                        null
                    }
                  </select>
                </div>
              </div>
            </div>
             */}
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Select Governorate</label>
                <div className="col-sm-9">
                  <select name="governorate_id" className="form-control form-control-inverse" onChange={this.handleChange} value={this.state.governorate_id}>
                    <option value="opt1">Select Governorate</option>
                    {
                      this.state.governorate_data !== undefined && this.state.governorate_data !== null && this.state.governorate_data !== [] && this.state.governorate_data.length > 0
                        ?
                        this.state.governorate_data.map(governorate_data =>
                        <option value={governorate_data.id}>{governorate_data.name_en+"/"+governorate_data.name_ar}</option>
                        )
                        :
                        null
                    }
                  </select>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Status</label>
                <div className="col-sm-9">
                  <select name="active" className="form-control" value={this.state.active} onChange={this.handleChange}>
                    <option value="true" name="active">Active</option>
                    <option value="false" name="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Delivery Charge</label>
                <div className="col-sm-9">
                  <input
                    type="number"
                    className="form-control"
                    onChange={this.handleChange}
                    name="deliveryCharge"
                    id="deliveryCharge"
                    value={this.state.deliveryCharge}
                    placeholder="Delivery Charge"
                    aria-label="DeliveryCharge"
                    aria-describedby="basic-addon1" />
                </div>
              </div>
            </div>
            {/* <div className="col-md-6">
              <div className="form-group ">
                <div className="input-group mb-3">
                  <div className="input-group-addon">
                    <span className="input-group-text" id="basic-addon1">Latitude</span>
                  </div>
                  <input
                    type="number"
                    className="form-control"
                    onChange={this.handleChange}
                    name="lat"
                    id="lat"
                    value={this.state.lat}
                    placeholder="Latitude"
                    aria-label="Username"
                    aria-describedby="basic-addon1" />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group ">
                <div className="input-group mb-3">
                  <div className="input-group-addon">
                    <span className="input-group-text" id="basic-addon1">Longitude</span>
                  </div>
                  <input
                    type="number"
                    onChange={this.handleChange}
                    name="lng"
                    id="lng"
                    placeholder="Longitude"
                    value={this.state.lng}
                    className="form-control"
                    aria-label="Longitude" aria-describedby="basic-addon1" />
                </div>
              </div>
            </div>
          */}
          </div>
          <div className="row float-right p-3">
            {
              this.state.isSaving
                ?
                <button className="btn btn-grd-disabled mr-2" disabled>Saving...!</button>
                :
                <button onClick={this.onSaveData} className="btn btn-grd-disabled mr-2"><i className="icofont icofont-save"></i> Save</button>
            }
            <Link to={"/area"} className="btn btn-outline-dark">
              Cancel
        </Link>
          </div>
        </div >
      </div >
    );
  }
}

export default AreaAdd;
