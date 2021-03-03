import React from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Constant from "../../Constant.js";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

class GeneralSettingAdd extends React.Component {
  state = {
    description: ""
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onSave = () => {
    var that = this;
    var data = new URLSearchParams();
    data.append("facebook", that.state.facebook);
    data.append("whatsapp", that.state.whatsapp);
    data.append("twitter", that.state.twitter);
    data.append("instagram", that.state.instagram);
    data.append("youtube", that.state.youtube);
    data.append("phNumber", that.state.phNumber);
    fetch(Constant.getAPI() + "/social", {
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
        Swal.fire("", "Social Media Links Updated", "success");
        that.getGeneralSettings();
      } else {
        Swal.fire("", "Something went wrong. Please try after some Time.!", "Warning");
      }
    })
  };
  componentDidMount() {
    this.getGeneralSettings();
  }
  getGeneralSettings = () => {
    var that = this;
    var data = new URLSearchParams();
    fetch(Constant.getAPI() + "/social", {
      method: "get",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": localStorage.getItem('q8_mall_auth')
      },
      // body: data
    }).then(function (response) {
      // //console.log("response :: " , response.headers.get("content-type"));
      return response.json();
    }).then(function (json) {
      //console.log(json);
      that.setState({
        facebook: json.facebook,
        whatsapp: json.whatsapp,
        twitter: json.twitter,
        instagram: json.instagram,
        phNumber: json.phNumber,
        youtube: json.youtube
      });
    })
  }
  render() {
    return (
      <div className="card-body">
        <div className="row">
          <div className="row">
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Facebook</label>
                <div className="col-sm-9">
                  <input
                    type="url"
                    className="form-control"
                    name="facebook"
                    id="facebook"
                    placeholder="Facebook"
                    onChange={this.handleChange}
                    value={this.state.facebook}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">WhatsApp</label>
                <div className="col-sm-9">
                  <input
                    type="tel"
                    className="form-control"
                    name="whatsapp"
                    id="whatsapp"
                    placeholder="WhatsApp"
                    onChange={this.handleChange}
                    value={this.state.whatsapp}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Phone Number</label>
                <div className="col-sm-9">
                  <input
                    type="tel"
                    className="form-control"
                    name="phNumber"
                    id="phNumber"
                    placeholder="Phone Number"
                    onChange={this.handleChange}
                    value={this.state.phNumber}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Twitter</label>
                <div className="col-sm-9">
                  <input
                    type="url"
                    className="form-control"
                    name="twitter"
                    id="twitter"
                    placeholder="Twitter"
                    onChange={this.handleChange}
                    value={this.state.twitter}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Instagram</label>
                <div className="col-sm-9">
                  <input
                    type="url"
                    className="form-control"
                    name="instagram"
                    id="instagram"
                    placeholder="Instagram"
                    onChange={this.handleChange}
                    value={this.state.instagram}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">YouTube</label>
                <div className="col-sm-9">
                  <input
                    type="url"
                    className="form-control"
                    name="youtube"
                    id="youtube"
                    placeholder="YouTube"
                    onChange={this.handleChange}
                    value={this.state.youtube}
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
        <div className="card-footer">
          <div className="row float-right p-3">
            {
              this.state.isSaving
                ?
                <button className="btn btn-grd-disabled mr-2" disabled>Saving...!</button>
                :
                <button onClick={this.onSave} className="btn btn-grd-disabled mr-2"><i className="icofont icofont-save"></i> Save </button>
            }
            <Link to={"/contact-us/settings"} className="btn btn-outline-dark"> Cancel </Link>
          </div>
        </div>
      </div >
    );
  }
}

export default GeneralSettingAdd;