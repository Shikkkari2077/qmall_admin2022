import React from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Constant from "../../Constant";

class DeliveryReasonAdd extends React.Component {
  state = {
    status: true
  };
  componentDidUpdate(prevProps) {
    if (prevProps.reason_id !== this.props.reason_id) {
      this.setState({ reason_id: this.props.reason_id });
      this.getAttributeTypeDetails();
    }
    if (prevProps.language_id !== this.props.language_id) {
      if (this.props.reason_id !== undefined) {
        // this.setState({ reason_id: this.props.reason_id });
        this.getAttributeTypeDetails();
      }
    }
  }
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  getAttributeTypeDetails = () => {
    var that = this;
    var data = new URLSearchParams();
    data.append("DeliveryReasonId", that.props.reason_id);
    data.append("LanguageId", that.props.language_id);
    fetch(Constant.getAPI() + "/delivery/type/get", {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: data
    }).then(function (response) {
      return response.json();
    }).then(function (json) {
      if (json.status === true) {
        that.setState({ attribute_type_data: json.data[0], name: json.data[0].name });
      } else {
        that.setState({ attribute_type_data: {} });
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
  onSaveData = () => {
    var that = this;
    that.setState({ isSaving: true });
    if (that.props.reason_id !== undefined) {
      that.updateCategoryData();
    } else {
      that.addCategory();
    }
  }
  updateCategoryData = () => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    data.append("name", that.state.name);
    data.append("LanguageId", that.props.language_id);
    data.append("DeliveryReasonId", that.props.reason_id);
    fetch(Constant.getAPI() + "/delivery/type/update", {
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
        Swal.fire("Updated !", "Delivery Reason has been Updated", "success");
        window.location.href = "#/reason"
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
  addCategory = () => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    data.append("reason", that.state.reason);
    data.append("LanguageId", that.props.language_id);
    fetch(Constant.getAPI() + "/templateReason/addTemplateReason", {
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
        Swal.fire("Added !", "Delivery Reason has been Added", "success");
        window.location.href = "#/reason"
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
  componentWillMount() {
    this.loadScript(process.env.PUBLIC_URL + "/assets/pages/filer/jquery.fileuploads.init.js");
  }
  loadScript(src) {
    let script = document.createElement("script");
    script.src = src;
    script.type = "text/javascript";
    document.head.append(script);
  }
  render() {
    return (
      <div className="">
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Delivery Reason</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    name="reason"
                    id="reason"
                    placeholder="Delivery Reason"
                    onChange={this.handleChange}
                    value={this.state.reason}
                  />
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
                  <button onClick={this.onSaveData} className="btn btn-grd-disabled mr-2"><i className="icofont icofont-save"></i> Save</button>
              }
              <Link to={"/reason"} className="btn btn-outline-dark">
                Cancel
        </Link>
            </div>
          </div>
        </div>
      </div >
    );
  }
}

export default DeliveryReasonAdd;
