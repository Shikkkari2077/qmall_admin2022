import React from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Constant from "../../Constant.js";
import $ from "jquery";
import ReactQuill from "react-quill";
import Datetime from 'react-datetime';
import moment from 'moment'

class CouponAdd extends React.Component {
  state = {
    status: true,
    description: ""
  };
  onHandleDescriptionChange = value => {
    this.setState({ description: value });
  };
  componentWillMount() {
    this.getCountryList();
  }
  componentDidUpdate(prevProps) {
    if (prevProps.language_id !== this.props.language_id) {
      if (prevProps.coupon_id !== this.props.coupon_id) {
        this.setState({ coupon_id: this.props.coupon_id });
        this.getShopDetails();
      }
    }
    if (prevProps.coupon_id !== this.props.coupon_id) {
      this.setState({ coupon_id: this.props.coupon_id });
      this.getShopDetails();
    }
  }
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  getShopDetails = () => {
    var that = this;
    var data = new URLSearchParams();
    // this.setState({ isSaving: true });
    data.append("CouponId", that.props.coupon_id);
    data.append("LanguageId", that.props.language_id);
    fetch(Constant.getAPI() + "/coupon/get", {
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
        var disc_type;
        if (json.data[0].percentage !== undefined && json.data[0].percentage !== null && json.data[0].percentage !== "") {
          disc_type = "percentage";
        } else {
          disc_type = "amount";
        }
        that.setState({
          coupon_data: json.data[0],
          code: json.data[0].code,
          CurrencyId: json.data[0].CurrencyId,
          amount: json.data[0].amount,
          percentage: json.data[0].percentage,
          status: json.data[0].status,
          expiry: moment(new Date(json.data[0].expiry), "DD-MM-YYYY"),
          start_date: moment(new Date(json.data[0].start_date), "DD-MM-YYYY"),

          description: json.data[0].description,
          minAmount: json.data[0].minAmount,
          discount_type: disc_type
        });
      } else {
        that.setState({ coupon_data: {} });
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

  addCoupon = () => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });

    data.append("code", that.state.code);
    data.append("description", that.state.description);
    data.append("status", that.state.status);
    data.append("expiry", that.state.expiry);
    data.append("start_date", that.state.start_date);

    data.append("CurrencyId", that.state.CurrencyId);
    data.append("minAmount", that.state.minAmount);
    if (that.state.discount_type === "amount") {
      data.append("amount", that.state.amount);
    } else {
      data.append("percentage", that.state.percentage);
    }
    fetch(Constant.getAPI() + "/coupon/add", {
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
        Swal.fire("Added !", "Coupon has been Added", "success");
        window.location.href = "#/coupons"
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
  updateCouponDetails = () => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });

    data.append("code", that.state.code);
    data.append("description", that.state.description);
    data.append("status", that.state.status);
    data.append("start_date", that.state.start_date);

    data.append("expiry", that.state.expiry);
    data.append("CurrencyId", that.state.CurrencyId);
    data.append("minAmount", that.state.minAmount);
    if (that.state.discount_type === "amount") {
      data.append("amount", that.state.amount);
    } else {
      data.append("percentage", that.state.percentage);
    }
    // data.append("LanguageId", that.props.language_id);
    data.append("CouponId", that.props.coupon_id);
    fetch(Constant.getAPI() + "/coupon/update", {
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
        Swal.fire("Updated !", "Coupon has been Updated", "success");
        window.location.href = "#/coupons"
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
  getCountryList = () => {
    var that = this;
    var data = new URLSearchParams();
    fetch(Constant.getAPI() + "/country/getActive", {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: data
    }).then(function (response) {
      return response.json();
    }).then(function (json) {
      if (json.status === true) {
        that.setState({ country_list: json.data });
      } else {
        that.setState({ country_list: [] });
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
  onStartChange=(value)=>{
    var date = new Date(value);
    var exp_day, exp_month, exp_year, exp_hour, exp_min, exp_sec;
    if (date.getDate() > 9) {
      exp_day = date.getDate();
    } else {
      exp_day = "0" + date.getDate();
    }
    if ((date.getMonth() + 1) > 9) {
      exp_month = (date.getMonth() + 1);
    } else {
      exp_month = "0" + (date.getMonth() + 1);
    }
    if (date.getHours() > 9) {
      exp_hour = date.getHours();
    } else {
      exp_hour = "0" + date.getHours();
    }
    if (date.getMinutes() > 9) {
      exp_min = date.getMinutes();
    } else {
      exp_min = "0" + date.getMinutes();
    }
    if (date.getSeconds() > 9) {
      exp_sec = date.getSeconds();
    } else {
      exp_sec = "0" + date.getSeconds();
    }
    exp_year = date.getFullYear();

    var exp_date = exp_year + "-" + exp_month + "-" + exp_day + " " + exp_hour + ":" + exp_min + ":" + exp_sec

    this.setState({ start_date: moment(new Date(value), "DD-MM-YYYY"), expiry_date: exp_date })
  }
  onExpireChange = (value) => {
    var date = new Date(value);
    var exp_day, exp_month, exp_year, exp_hour, exp_min, exp_sec;
    if (date.getDate() > 9) {
      exp_day = date.getDate();
    } else {
      exp_day = "0" + date.getDate();
    }
    if ((date.getMonth() + 1) > 9) {
      exp_month = (date.getMonth() + 1);
    } else {
      exp_month = "0" + (date.getMonth() + 1);
    }
    if (date.getHours() > 9) {
      exp_hour = date.getHours();
    } else {
      exp_hour = "0" + date.getHours();
    }
    if (date.getMinutes() > 9) {
      exp_min = date.getMinutes();
    } else {
      exp_min = "0" + date.getMinutes();
    }
    if (date.getSeconds() > 9) {
      exp_sec = date.getSeconds();
    } else {
      exp_sec = "0" + date.getSeconds();
    }
    exp_year = date.getFullYear();

    var exp_date = exp_year + "-" + exp_month + "-" + exp_day + " " + exp_hour + ":" + exp_min + ":" + exp_sec

    this.setState({ expiry: moment(new Date(value), "DD-MM-YYYY"), expiry_date: exp_date })
  }
  onSaveData = () => {
    var that = this;
    that.setState({ isSaving: true });
    if (that.props.coupon_id !== undefined) {
      that.updateCouponDetails();
    } else {
      that.addCoupon();
    }
  }
  render() {
    return (
      <div className="">
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Coupon Code</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    name="code"
                    id="code"
                    placeholder="Coupon Code"
                    onChange={this.handleChange}
                    value={this.state.code}
                  />
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Discount Type</label>
                <div className="col-sm-9">
                  <select name="discount_type" className="form-control" value={this.state.discount_type} onChange={this.handleChange}>
                    <option value="amount" name="amount">Amount</option>
                    <option value="percentage" name="percentage">Percentage</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Country ( Currancy )</label>
                <div className="col-sm-9">
                  <select name="CurrencyId" className="form-control" value={this.state.CurrencyId} onChange={this.handleChange}>
                    <option value="0">Select Country</option>
                    {
                      this.state.country_list !== undefined && this.state.country_list !== null && this.state.country_list !== [] && this.state.country_list.length > 0
                        ?
                        this.state.country_list.map(currency =>
                          <option key={currency.id} value={currency.currency}>{currency.name} - ({currency.currency})</option>
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
                <label className="col-sm-3 col-form-label">Minimun Amount</label>
                <div className="col-sm-9">
                  <input
                    type="number"
                    className="form-control"
                    name="minAmount"
                    id="minAmount"
                    placeholder="Minimun Amount"
                    onChange={this.handleChange}
                    value={this.state.minAmount}
                  />
                </div>
              </div>
            </div>
            {
              this.state.discount_type === "amount"
                ?
                <div className="col-md-6">
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label">Discount Amount</label>
                    <div className="col-sm-9">
                      <input
                        type="text"
                        className="form-control"
                        name="amount"
                        id="amount"
                        placeholder="Discount Amount"
                        onChange={this.handleChange}
                        value={this.state.amount}
                      />
                    </div>
                  </div>
                </div>
                :
                <div className="col-md-6">
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label">Discount Percentage</label>
                    <div className="col-sm-9">
                      <input
                        type="text"
                        className="form-control"
                        name="percentage"
                        id="percentage"
                        placeholder="Discount Percentage"
                        onChange={this.handleChange}
                        value={this.state.percentage}
                      />
                    </div>
                  </div>
                </div>
            }
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
               <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Coupon Start Date</label>
                <div className="col-sm-9">
                  <Datetime dateFormat={"DD-MM-YYYY"}
                            timeFormat 
                            closeOnSelect={true} 
                            inputProps={{ placeholder: 'Coupon Start Date' }} 
                            value={this.state.start_date} 
                            onChange={this.onStartChange.bind(this)} />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Coupon Expirey Date</label>
                <div className="col-sm-9">
                  <Datetime dateFormat={"DD-MM-YYYY"} timeFormat closeOnSelect={true}
                   inputProps={{ placeholder: 'Coupon Expirey Date' }}
                    value={this.state.expiry} onChange={this.onExpireChange.bind(this)} />
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

          <div className="row float-right p-3">
            {
              this.state.isSaving
                ?
                <button className="btn btn-grd-disabled mr-2" disabled>Saving...!</button>
                :
                <button onClick={this.onSaveData} className="btn btn-grd-disabled mr-2"><i className="icofont icofont-save"></i> Save</button>
            }
            <Link to={"/coupons"} className="btn btn-outline-dark">
              Cancel
        </Link>
          </div>
        </div>
      </div >

    );
  }
}

export default CouponAdd;
