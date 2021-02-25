import React from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import $ from "jquery";
import Constant from "../../Constant";
import ReactQuill from "react-quill";
import Loader from "../../Loader";

class PaymentMethodAdd extends React.Component {
  state = {
    status: true,
    description: ""
  };
  onHandleDescriptionChange = value => {
    this.setState({ description: value });
  };
  componentDidUpdate(prevProps) {
    if (prevProps.payment_method_id !== this.props.payment_method_id) {
      this.setState({ payment_method_id: this.props.payment_method_id });
      this.getPaymentMethodDetails();
    }
    if (prevProps.language_id !== this.props.language_id) {
      if (this.props.payment_method_id !== undefined) {
        // this.setState({ payment_method_id: this.props.payment_method_id });
        this.getPaymentMethodDetails();
      }
    }
  }
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  getPaymentMethodDetails = () => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isLoading: true });
    data.append("PaymentId", that.props.payment_method_id);
    data.append("LanguageId", that.props.language_id);
    fetch(Constant.getAPI() + "/payment/get", {
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
        if (json.data[0].parent !== null) {
          that.setState({
            payment_method_data: json.data[0],
            title: json.data[0].title,
            type: json.data[0].type,
            isLoading: false
          })
        } else {
          that.setState({
            payment_method_data: json.data[0],
            title: json.data[0].name,
            isLoading: false
          })
        }
        if (json.data[0].active === true || json.data[0].active === 1) {
          that.setState({
            status: true
          })
        } else {
          that.setState({
            status: false
          })
        }
        if (json.data[0].Medium !== null) {
          that.setState({
            image: json.data[0].Medium.url,
            MediaId: json.data[0].MediaId
          })
        }
      } else {
        that.setState({ isLoading: false });
        // Swal.fire({
        //   title: "Something went wrong. Try again after some Time.!",
        //   icon: 'error',
        //   text: "",
        //   confirmButtonColor: "#3085d6",
        //   cancelButtonColor: "#d33",
        //   confirmButtonText: "Ok"
        // });
      }
    });
  }
  onSaveData = () => {
    var that = this;
    that.setState({ isSaving: true });
    if (that.state.accepted) {
      that.uploadMedia();
    } else {
      if (that.props.payment_method_id !== undefined) {
        that.updatePaymentMethodData(that.state.MediaId);
      } else {
        that.addPaymentMethod(that.state.MediaId);
      }
    }
  }
  uploadMedia = () => {
    var that = this;
    var form = $('#payment_methodImage')[0];
    var data = new FormData(form);
    // data.append('upload_for', 'user');
    fetch(Constant.getAPI() + "/media/add", {
      method: "post",
      body: data
    }).then(function (response) {
      return response.json();
    }).then(function (json) {
      if (json.status === true) {
        if (that.props.payment_method_id !== undefined) {
          that.updatePaymentMethodData(json.data[0].id);
        } else {
          that.addPaymentMethod(json.data[0].id);
        }
      } else {
        // that.setState({ payment_method_data: [] });
        console.log(json.error);
      }
    });
  }
  updatePaymentMethodData = (media_id) => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    data.append("title", that.state.title);
    data.append("type", that.state.type);
    data.append("active", that.state.status);
    data.append("LanguageId", that.props.language_id);
    data.append("PaymentId", that.props.payment_method_id);
    data.append("MediaId", media_id);
    fetch(Constant.getAPI() + "/payment/update", {
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
        Swal.fire("Updated !", "Payment Method has been Updated", "success");
        window.location.href = "#/payment-methods"
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
  addPaymentMethod = (media_id) => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    data.append("title", that.state.title);
    data.append("type", that.state.type);
    data.append("active", that.state.status);
    data.append("LanguageId", that.props.language_id);
    data.append("MediaId", media_id);
    fetch(Constant.getAPI() + "/payment/add", {
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
        Swal.fire("Added !", "Payment Method has been Added", "success");
        window.location.href = "#/payment-methods"
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
  handleImageUpload = (event) => {
    document.getElementById('payment_method_image_label').innerHTML = "";
    let element = $("#payment_method_image").get(0);
    // $("#id_image_section").empty();
    this.setState({ accepted: element });
    var proof_img = [];
    let obj = {};
    console.log(element.files);
    this.setState({ payment_method_image: element.files });
    for (var i = 0; i < element.files.length; i++) {
      var file1 = element.files[i];
      var img = document.createElement("img");
      img.className = "img-100";
      var filePath = URL.createObjectURL(file1);
      img.src = filePath;
      $("#payment_method_image_label").append(img);
    }
  }
  componentDidMount() {
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
        {
          this.state.isLoading
            ?
            <Loader />
            :
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label">PaymentMethod Name</label>
                    <div className="col-sm-9">
                      <input
                        type="text"
                        className="form-control"
                        name="title"
                        id="title"
                        placeholder="PaymentMethod Name"
                        onChange={this.handleChange}
                        value={this.state.title}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label">Payment Type</label>
                    <div className="col-sm-9">
                      <input
                        type="text"
                        className="form-control"
                        name="type"
                        id="type"
                        placeholder="Payment Type"
                        onChange={this.handleChange}
                        value={this.state.type}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="row">
                    <div className="col-sm-3">
                      Display Image
                </div>
                    <div className="col-sm-9">
                      <form id="payment_methodImage" name="payment_methodImage" encType="multipart/form-data" className="text-capitalize">

                        <div className="form-group">

                          {/* <input onChange={this.handleChange} id="shop_Image" type="text" className="form-control" name="image" /> */}
                          <input accept="image/*" onChange={this.handleImageUpload} id="payment_method_image" type="file" className="form-control" autoComplete="off" name="media"
                            data-toggle="tooltip" title="Click To Upload Banner Image"
                          />
                        </div>
                      </form>
                    </div>
                  </div>
                  <div id="payment_method_image_label" className="pt-2">
                    {
                      this.state.image
                        ?
                        this.state.image !== null || this.state.image !== undefined || this.state.image !== {}
                          ?
                          <img src={this.state.image} alt="" className="img-100" onError={e => { e.target.src = "" }} />
                          :
                          ''
                        :
                        ''
                    }
                  </div>
                </div>

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
          </div>
          */}
              <div className="card-footer">
                <div className="row float-right p-3">
                  {
                    this.state.isSaving
                      ?
                      <button className="btn btn-grd-disabled mr-2" disabled>Saving...!</button>
                      :
                      <button onClick={this.onSaveData} className="btn btn-grd-disabled mr-2"><i className="icofont icofont-save"></i> Save</button>
                  }
                  <Link to={"/payment-methods"} className="btn btn-outline-dark">
                    Cancel
        </Link>
                </div>
              </div>
            </div>
        }
      </div >
    );
  }
}

export default PaymentMethodAdd;
