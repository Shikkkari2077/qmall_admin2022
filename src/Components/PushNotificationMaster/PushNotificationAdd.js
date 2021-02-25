import React from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Constant from "../../Constant.js";
import $ from "jquery";
import ReactQuill from "react-quill";
import Datetime from 'react-datetime';
import moment from 'moment'

class PushNotificationAdd extends React.Component {
  state = {
    status: true,
    text: ""
  };
  onHandleNotificationTextChange = value => {
    this.setState({ text: value });
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  addPushNotification = () => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    data.append("title", that.state.title);
    data.append("text", that.state.text);
    data.append("type", "PUSH");
    fetch(Constant.getAPI() + "/notification/addBulk", {
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
        Swal.fire("Sent !", "Push Notification has been Sent", "success");
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
  onSaveData = () => {
    var that = this;
    that.setState({ isSaving: true });
    that.addPushNotification();
  }
  render() {
    return (
      <div className="">
        <div className="card-body">
          <div className="row">
            <div className="col-md-12">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Push Notification Title</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    id="title"
                    placeholder="Push Notification Title"
                    onChange={this.handleChange}
                    value={this.state.title}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="form-group row">
                <label className="col-sm-2 col-form-label">Notification Text</label>
                <div className="col-sm-10">
                  <ReactQuill
                    value={this.state.text}
                    onChange={this.onHandleNotificationTextChange}
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
                <button className="btn btn-grd-disabled mr-2" disabled>Sending...!</button>
                :
                <button onClick={this.onSaveData} className="btn btn-grd-disabled mr-2"><i className="icofont icofont-save"></i> Send</button>
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

export default PushNotificationAdd;
