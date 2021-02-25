import React from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Constant from "../../Constant.js";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

class TermsAdd extends React.Component {
  state = {
    description: ""
  };
  handleChange = value => {
    this.setState({ description: value });
  };

  onSave = () => {
    var that = this;
    var data = new URLSearchParams();
    data.append("data", that.state.description);
    data.append("LanguageId", that.props.language_id);
    fetch(Constant.getAPI() + "/terms/add", {
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
        Swal.fire("", "Terms and Conditions Updated", "success");
        that.getTermsData();
      } else {
        Swal.fire("", "Something went wrong. Please try after some Time.!", "Warning");
      }
    })
  };
  componentDidUpdate(prevProps) {
    if (prevProps.language_id !== this.props.language_id) {
      this.setState({ language_id: this.props.language_id });
      this.getTermsData();
    }
  }
  getTermsData = () => {
    var that = this;
    var data = new URLSearchParams();
    data.append("LanguageId", that.props.language_id);
    fetch(Constant.getAPI() + "/terms/get", {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": localStorage.getItem('q8_mall_auth')
      },
      body: data
    }).then(function (response) {
      // console.log("response :: " , response.headers.get("content-type"));
      return response.json();
    }).then(function (json) {
      console.log(json);
      that.setState({ description: json.data.data });
    })
  }
  render() {
    return (
      <div className="card-body">
        <div className="row">
          <div className="col-12 ">
            <ReactQuill
              value={this.state.description}
              onChange={this.handleChange}
            />
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
            <Link to={"/terms"} className="btn btn-outline-dark"> Cancel </Link>
          </div>
        </div>
      </div >
    );
  }
}

export default TermsAdd;