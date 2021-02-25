import React from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import $ from "jquery";
import Constant from "../../../Constant.js";
import ReactQuill from "react-quill";

class CountryAdd extends React.Component {
  state = {
    status: true,
    description: "",
    country_list: [{
      countryID: 1,
      language_wise_data: [{
        language_id: "1",
        country_name: "India",
        description: `India , officially the Republic of India , is a country in South Asia. It is the seventh-largest country by area, the second-most populous country, and the most populous democracy in the world. Bounded by the Indian Ocean on the south, the Arabian Sea on the southwest, and the Bay of Bengal on the southeast, it shares land borders with Pakistan to the west; China, Nepal, and Bhutan to the north; and Bangladesh and Myanmar to the east. In the Indian Ocean, India is in the vicinity of Sri Lanka and the Maldives; its Andaman and Nicobar Islands share a maritime border with Thailand and Indonesia.`
      }, {
        language_id: "2",
        country_name: "الهند",
        description: `الهند ، رسميا جمهورية الهند ، هي دولة في جنوب آسيا. إنها سابع أكبر دولة حسب المنطقة ، وثاني أكبر دولة من حيث عدد السكان ، وأكثر ديمقراطية من حيث عدد السكان في العالم. يحدها المحيط الهندي من الجنوب وبحر العرب في الجنوب الغربي وخليج البنغال في الجنوب الشرقي ، ويشترك في الحدود البرية مع باكستان من الغرب. الصين ونيبال وبوتان في الشمال ؛ وبنغلاديش وميانمار من الشرق. في المحيط الهندي ، تقع الهند بالقرب من سري لانكا وجزر المالديف. تشترك جزر أندامان ونيكوبار في الحدود البحرية مع تايلاند وإندونيسيا.`
      }],
      country_code: "IN",
      country_currency: "₹ (Indian rupee)",
      status: true
    }, {
      countryID: 2,
      language_wise_data: [{
        language_id: "1",
        country_name: "Kuwait",
        description: `Kuwait , officially the State of Kuwait , is a country in Western Asia. Situated in the northern edge of Eastern Arabia at the tip of the Persian Gulf, it shares borders with Iraq and Saudi Arabia. As of 2016, Kuwait has a population of 4.5 million people: 1.3 million are Kuwaitis and 3.2 million are expatriates. Expatriates account for approximately 70% of the population.`
      }, {
        language_id: "2",
        country_name: "الكويت",
        description: `الكويت ، رسميا دولة الكويت ، هي دولة في غرب آسيا. تقع في الطرف الشمالي من شرق الجزيرة العربية عند طرف الخليج الفارسي ، وتشترك في الحدود مع العراق والمملكة العربية السعودية. في عام 2016 ، بلغ عدد سكان الكويت 4.5 مليون نسمة: 1.3 مليون كويتي و 3.2 مليون أجنبي. يمثل المغتربون حوالي 70٪ من السكان.`
      }],
      country_code: "KW",
      country_currency: "KWD",
      status: true
    }]
  };

  componentDidUpdate(prevProps) {
    if (prevProps.country_id !== this.props.country_id) {
      this.setState({ country_id: this.props.country_id });
      this.getCountryDetails();
    }
    if (prevProps.language_id !== this.props.language_id) {
      if (this.props.country_id !== undefined) {
        this.getCountryDetails();
      }
    }
  }
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  getCountryDetails = () => {
    var that = this;
    var data = new URLSearchParams();
    // this.setState({ isSaving: true });
    data.append("countryId", that.props.country_id);
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
        that.setState({
          country_data: json.data[0],
          country_name: json.data[0].name,
          description: json.data[0].description,
          country_code: json.data[0].code,
          status: json.data[0].status
        });
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

  updateCountry = () => {
    var that = this;
    var data = new URLSearchParams();
    // this.setState({ isSaving: true });
    data.append("countryId", that.props.country_id);
    data.append("name", that.state.country_name);
    data.append("description", that.state.description);
    data.append("status", that.state.status);
    data.append("code", that.state.country_code);
    data.append("LanguageId", that.props.language_id);
    data.append("domainId", Constant.defaultDomain());
    fetch(Constant.getAPI() + "/country/update", {
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
        Swal.fire("Updated !", "Country has been Updated", "success");
        window.location.href = "#/country"
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
  addCountry = () => {
    var that = this;
    var data = new URLSearchParams();
    // this.setState({ isSaving: true });
    data.append("name", that.state.country_name);
    data.append("description", that.state.description);
    data.append("status", that.state.status);
    data.append("code", that.state.country_code);
    data.append("LanguageId", that.props.language_id);
    data.append("domainId", Constant.defaultDomain());
    fetch(Constant.getAPI() + "/country/add", {
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
        Swal.fire("Added !", "Country has been Added", "success");
        window.location.href = "#/country"
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
  onHandleDescriptionChange = value => {
    this.setState({ description: value });
  };
  onSaveData = () => {
    var that = this
    if (that.props.country_id !== undefined) {
      that.updateCountry();
    } else {
      that.addCountry();
    }
  }
  render() {
    return (
      <div className="">
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Country Name</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    name="country_name"
                    id="country_name"
                    placeholder="Country Name"
                    onChange={this.handleChange}
                    value={this.state.country_name}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Country Code</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    name="country_code"
                    id="country_code"
                    placeholder="Country Code"
                    onChange={this.handleChange}
                    value={this.state.country_code}
                  />
                </div>
              </div>
            </div>
            {/* <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Country Currency</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    name="country_currency"
                    id="country_currency"
                    placeholder="Country Currency"
                    onChange={this.handleChange}
                    value={this.state.country_currency}
                  />
                </div>
              </div>
            </div> */}

            <div className="col-md-6">
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
          </div>
          <div className="row">
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
          </div>

          <div className="card-footer">
            <div className="row">
              <div className="text-right col-6 offset-6">
                <Link to="/country" className="btn btn-outline-secondary">
                  <i className="icofont icofont-rounded-double-left"></i>
                      Back
                      </Link>
                {
                  this.state.isSaving
                    ?
                    <button className="btn hor-grd btn-grd-inverse offset-1" disabled>Saving...!</button>
                    :
                    <button onClick={this.onSaveData} className="btn hor-grd btn-grd-inverse offset-1"><i className="ti-save"></i>Save</button>
                }
              </div>
            </div>
          </div>
        </div>
      </div >
    );
  }
}

export default CountryAdd;
