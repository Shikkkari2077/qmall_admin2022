import React from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Constant from "../../../Constant.js";
import $ from "jquery";
import ReactQuill from "react-quill";

class GovernorateAdd extends React.Component {
  state = {
    status: true,
    description: ""
  };

  componentDidUpdate(prevProps) {
    if (this.props.language_id !== undefined) {
      if (prevProps.governorate_id !== this.props.governorate_id) {
        this.setState({ governorate_id: this.props.governorate_id });
        this.getGovernorateDetails();
      }
      if (prevProps.language_id !== this.props.language_id) {
        if (this.props.governorate_id !== undefined) {
          this.getGovernorateDetails();
        }
        this.getCountryList();
      }
    }
  }
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  getGovernorateDetails = () => {
    var that = this;
    var data = new URLSearchParams();
    // this.setState({ isSaving: true });
    data.append("StateId", that.props.governorate_id);
    //data.append("LanguageId", that.props.language_id);
    fetch(Constant.getAPI() + "/state/get", {
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
        that.setState({
          governorate_data: json.data[0],
          governorate_name: json.data[0].name_en,
          governorate_name_ar: json.data[0].name_ar,

          description: json.data[0].description,
          country_id: json.data[0].countryId,
          status: json.data[0].status
        });
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
  getCountryList = () => {
    var that = this;
    var data = new URLSearchParams();
    // this.setState({ isSaving: true });
    data.append("LanguageId", that.props.language_id);
    fetch(Constant.getAPI() + "/country/getActive", {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: data
    }).then(function (response) {
      return response.json();
    }).then(function (json) {
      if (json.status === true) {
        that.setState({ country_data: json.data });
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
  updateGovernorateData = () => {
    var that = this;
    var data = new URLSearchParams();
    // this.setState({ isSaving: true });
    data.append("StateId", that.props.governorate_id);
    data.append("name_en", that.state.governorate_name);
    data.append("name_ar", that.state.governorate_name_ar);

    // data.append("description", that.state.description);
    // data.append("status", that.state.status);
    data.append("countryId", that.state.country_id);
    //data.append("LanguageId", that.props.language_id);
    fetch(Constant.getAPI() + "/state/update", {
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
        Swal.fire("Updated !", "Governorate has been Updated", "success");
        window.location.href = "#/governorate"
        that.setState({ isSaving: false })
      } else {
        that.setState({ isSaving: false })
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
  addGovernorate = () => {
    var that = this;
    var data = new URLSearchParams();
    // this.setState({ isSaving: true });
    // data.append("governorateId", that.props.governorate_id);
    data.append("name_en", that.state.governorate_name);
    data.append("name_ar", that.state.governorate_name_ar);

    // data.append("description", that.state.description);
    // data.append("status", that.state.status);
    data.append("countryId", that.state.country_id);
   // data.append("LanguageId", that.props.language_id);
    fetch(Constant.getAPI() + "/state/add", {
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
        Swal.fire("Added !", "Governorate has been Added", "success");
        window.location.href = "#/governorate"
        that.setState({ isSaving: false })
      } else {
        that.setState({ isSaving: false })
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
  onHandleDescriptionChange = value => {
    this.setState({ description: value });
  };
  onSaveData = () => {
    var that = this;
    if (that.props.governorate_id !== undefined) {
      that.updateGovernorateData()
    } else {
      that.addGovernorate()
    }
  }
  render() {
    return (
      <div className="">
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Governorate Name (English)</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    name="governorate_name"
                    id="governorate_name"
                    placeholder="Governorate Name"
                    onChange={this.handleChange}
                    value={this.state.governorate_name}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Governorate Name (Arabic)</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    name="governorate_name_ar"
                    id="governorate_name_ar"
                    placeholder="Governorate Name"
                    onChange={this.handleChange}
                    value={this.state.governorate_name_ar}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Select Country</label>
                <div className="col-sm-9">
                  <select name="country_id" className="form-control form-control-inverse" onChange={this.handleChange} value={this.state.country_id}>
                    <option value="opt1">Select Country</option>
                    {
                      this.state.country_data !== undefined && this.state.country_data !== null && this.state.country_data !== [] && this.state.country_data.length > 0
                        ?
                        this.state.country_data.map(country_data =>
                          <option value={country_data.id} key={country_data.id}>{country_data.name}</option>
                        )
                        :
                        null
                    }
                  </select>
                </div>
              </div>
            </div>
            {/* <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Status</label>
                <div className="col-sm-9">
                  <select name="status" className="form-control" value={this.state.status} onChange={this.handleChange}>
                    <option value="true" name="active">Active</option>
                    <option value="false" name="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
           */}
          </div>
          {/* <div className="row">
            <div className="col-md-12">
              <div className="form-group row">
                <label className="col-sm-2 col-form-label">Description</label>
                <div className="col-sm-10">
                  <ReactQuill
                    value={this.state.description}
                    onChange={this.onHandleDescriptionChange}
                    style={{ height: "200px", marginBottom: '5%' }}
                  />
                </div>
              </div>
            </div>
          </div> */}

          <div className="row float-right p-3">
            {
              this.state.isSaving
                ?
                <button className="btn btn-grd-disabled mr-2" disabled>Saving...!</button>
                :
                <button onClick={this.onSaveData} className="btn btn-grd-disabled mr-2"><i className="icofont icofont-save"></i> Save</button>
            }
            <Link to={"/governorate"} className="btn btn-outline-dark">
              Cancel
        </Link>
          </div>
        </div>
      </div >
    );
  }
}

export default GovernorateAdd;
