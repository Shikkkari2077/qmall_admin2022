import React from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Constant from "../../Constant.js";
import $ from "jquery";
import ReactQuill from "react-quill";
import Datetime from 'react-datetime';
import moment from 'moment'

class DeliveryTimeAdd extends React.Component {
  state = {
    isDeliveryTimeExist: false,
    delivery_time_text: ""
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  addDeliveryTime = () => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    data.append("text", that.state.delivery_time_text);
    data.append("LanguageId", that.props.language_id);
    fetch(Constant.getAPI() + "/deliverytime/add", {
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
        Swal.fire("Added !", "Delivery Time has been Added", "success");
        // window.location.href = "#/notifications"
        window.location.reload();
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
  updateDeliveryTimeData = () => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    data.append("LanguageId", that.props.language_id);
    data.append("deliverytimeId", that.state.deliverytimeId);
    data.append("text", that.state.delivery_time_text);
    fetch(Constant.getAPI() + "/deliverytime/update", {
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
        Swal.fire("Updated !", "Delivery Time has been Updated", "success");
        // window.location.href = "#/category"
        window.location.reload();
        that.setState({ isSaving: false })
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
    });

  };
  onSaveData = () => {
    var that = this;
    that.setState({ isSaving: true });
    if (that.state.isDeliveryTimeExist) {
      that.updateDeliveryTimeData();
    } else {
      that.addDeliveryTime();
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.language_id !== this.props.language_id) {
      // if (this.props.category_id !== undefined) {
      this.getDeliveryTimeList();
      // }
    }
  }
  getDeliveryTimeList = () => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isLoading: true });
    // data.append('LanguageId', that.props.language_id);
    fetch(Constant.getAPI() + "/deliverytime/get", {
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
        if (json.data.length > 0) {
          that.setState({ delivery_time_list: json.data[0], deliverytimeId: json.data[0].id, delivery_time_text: json.data[0].text, isDeliveryTimeExist: true, isLoading: false });
        } else {
          that.setState({ delivery_time_list: json.data, isDeliveryTimeExist: false, isLoading: false });
        }
      } else {
        that.setState({ isLoading: false, delivery_time_list: [], isDeliveryTimeExist: false, });
        //console.log(json);
      }
    });
  }
  render() {
    return (
      <div className="">
        <div className="card-body">
          <div className="row">
            <div className="col-md-12">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Delivery Time Title</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    name="delivery_time_text"
                    id="delivery_time_text"
                    placeholder="Delivery Time Title"
                    onChange={this.handleChange}
                    value={this.state.delivery_time_text}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="row float-right p-3">
            {
              this.state.isSaving
                ?
                <button className="btn btn-grd-disabled mr-2" disabled>Saveing...!</button>
                :
                <button onClick={this.onSaveData} className="btn btn-grd-disabled mr-2"><i className="icofont icofont-save"></i> Save</button>
            }
            {/* <Link to={"/notifications"} className="btn btn-outline-dark">
              Cancel
        </Link> */}
          </div>
        </div>
      </div >

    );
  }
}

export default DeliveryTimeAdd;
