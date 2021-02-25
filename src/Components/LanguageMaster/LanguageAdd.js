import React from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Constant from "../../Constant.js";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "react-toggle/style.css" // for ES6 modules
import Toggle from 'react-toggle'
import $ from 'jquery';

class LanguageAdd extends React.Component {
  state = {
    description: '',
    rtl: false
  };

  componentDidMount() {
    if (this.props.match.params.language_id !== undefined) {
      this.setState({ language_id: this.props.match.params.language_id });
      this.getlanguagesDetails(this.props.match.params.language_id);
    }
  }
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  getlanguagesDetails = (id) => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    data.append("LanguageId", id);
    fetch(Constant.getAPI() + "/language/get", {
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
        if (json.data[0].rtl !== true) {
          that.setState({ rtl: false });
        } else {
          that.setState({ rtl: true });
        }
        that.setState({ lanugage_data: json.data[0], language_name: json.data[0].name, description: json.data[0].description, isSaving: false });
      } else {
        that.setState({ isSaving: false });
        console.log(json);
      }
    });
  }

  updateLanguage = () => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    data.append("name", that.state.language_name);
    data.append("description", that.state.description);
    data.append("LanguageId", that.props.match.params.language_id);
    data.append("rtl", that.state.rtl);
    fetch(Constant.getAPI() + "/language/update", {
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
        Swal.fire("Updated !", "Language has been Updated", "success");
        window.location.href = "#/languages"
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
  addLanguage = () => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    data.append("name", that.state.language_name);
    data.append("description", that.state.description);
    data.append("rtl", that.state.rtl);
    fetch(Constant.getAPI() + "/language/add", {
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
        Swal.fire("Added !", "languages has been Added", "success");
        window.location.href = "#/languages"
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

  onDescriptionChange = value => {
    this.setState({ description: value });
  };

  onSave = () => {
    if (this.props.match.params.language_id !== undefined) {
      this.updateLanguage()
    } else {
      this.addLanguage()
    }
  }
  handleStatusChange = (sid) => {
    var isChecked = $('#language_direction');
    isChecked.prop("checked", !isChecked.prop("checked"));
    console.log(isChecked.prop('checked'), !isChecked.prop("checked"));
    if (!isChecked.prop("checked") === true) {
      var status = true
    } else {
      var status = false
    }
    var that = this;
    that.setState({ rtl: status });
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
                    <h4>{this.props.match.params.language_id ? "Edit" : "Add"}{" "} languages</h4>
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
                    <li className="breadcrumb-item">
                      <Link to="/languages">
                        languages</Link>
                    </li>
                    <li className="breadcrumb-item active">
                      {this.props.match.params.language_id ? "Edit" : "Add"}{" "} languages
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
                                  <label className="col-sm-3 col-form-label">languages Name</label>
                                  <div className="col-sm-9">
                                    <input
                                      type="text"
                                      className="form-control"
                                      name="language_name"
                                      id="language_name"
                                      placeholder="languages Name"
                                      onChange={this.handleChange}
                                      value={this.state.language_name}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="form-group row">
                                  <label className="col-sm-3 col-form-label">Direction</label>
                                  <div className="col-sm-9">
                                    {/* <Toggle
                                      id={"language_direction"}
                                      checked={this.state.rtl === true ? true : false}
                                      value={this.state.rtl}
                                      onChange={this.handleStatusChange.bind(this)}
                                    /> */}
                                    <select className="form-control" name="rtl" id="language_direction" onChange={this.handleChange} value={this.state.rtl}>
                                      <option value="">RTL ( Right To Left )</option>
                                      <option value="true">RTL ( Right To Left )</option>
                                      <option value="false">LTR ( Left To Right )</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <label className="col-sm-2 col-form-label">Language Description</label>
                              <div className="col-sm-10">
                                <ReactQuill value={this.state.description} onChange={this.onDescriptionChange} modules={this.modules} formats={this.formats} />
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

export default LanguageAdd;
