import React from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import $ from "jquery";

class UserAdd extends React.Component {
  state = {
    status: true,
    Customer_list: [
      {
        CustomerID: 1,
        CustomerName: "Mustafa",
        last_name:"Baiwala",
        civil_id: "0145869265",
        post: "5",
        duration: "7 Day",
        status: true,
        email: "mustafa@design-master.com",
        PhoneNo: "85858585",
        WhatsAppNo: "7878747850",
        CustomersImage: "./assets/images/user.png"
      },
      {
        CustomerID: 2,
        CustomerName: "car user2 ",
        post: "4",
        civil_id: "0145869265",
        duration: "7 Day",
        status: true,
        email: "user@gmail.com",
        PhoneNo: "7878747850",
        WhatsAppNo: "7878747850",
        CustomersImage: "./assets/images/user.png"
      },
    ],
  };

  componentWillMount() {
    if (this.props.user_id !== undefined) {
      this.setState({ user_id: this.props.user_id });
      this.getdealerDetails();
    }
  }
  componentDidUpdate(prevProps) {
  
    if (prevProps.user_id !== this.props.user_id) {
      this.setState({ user_id: this.props.user_id });
      this.getdealerDetails();
    }
  }
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  getdealerDetails = () => {
    var a = this.state.Customer_list.find((element) => {
      return element.CustomerID === this.props.user_id;
    })
    //console.log(a)
    this.setState({
      sellers_data: a,
      first_name: a.CustomerName,
      last_name:a.last_name,
      Email: a.email,
      Mobile: a.PhoneNo,
      WhatsAppNo: a.WhatsAppNo,
      image_url: a.CustomersImage,
      CivilId:a.civil_id 
    });
  }
  adddealer = () => {
    var that = this;
    var data = new FormData();
    that.setState({ isSaving: true })
    if (
      that.state.first_name === undefined ||
      that.state.first_name === null ||
      that.state.first_name === ""
    ) {
      document.getElementById("first_name").focus();
      that.setState({ isSaving: false })
      return false;
    }
    Swal.fire("Added !", "user has been Added", "success");
    window.location.href = "#/customers"
    that.setState({ isSaving: false })
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
  handleImageUpload = (event) => {
    document.getElementById('id_image_section_lable').innerHTML = "";
    let element = $("#user_Image").get(0);
    $("#id_image_section").empty();
    this.setState({ accepted: element });
    var proof_img = [];
    let obj = {};
    //console.log(element.files);
    this.setState({ user_Image: element.files });
    for (var i = 0; i < element.files.length; i++) {
      var file1 = element.files[i];
      var img = document.createElement("img");
      img.className = "img-100";
      var filePath = URL.createObjectURL(file1);
      img.src = filePath;
      $("#id_image_section_lable").append(img);
    }
  }
  // uploadMedia = () => {
  //   var that = this;
  //   var form = $('#userImage')[0];
  //   var data = new FormData(form);
  //   data.append('upload_for', 'user');
  //   fetch(Constant.getAPI() + "/mediaUpload", {
  //     method: "post",
  //     body: data
  //   }).then(function (response) {
  //     return response.json();
  //   }).then(function (json) {
  //     if (json.error === "SFD") {
  //       that.editUser(json.data.media_id);
  //     } else {
  //       that.setState({ category_data: [] });
  //       console.log(json.error);
  //     }
  //   });
  // }
  onSaveData = () => {
    var that = this;
    that.setState({ isSaving: true });
    if (that.state.accepted) {
      that.uploadMedia();
    } else {
      that.editUser(that.state.media_id);
    }
  }
  render() {
    return (
      <div className="">
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">First Name</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    name="first_name"
                    id="first_name"
                    placeholder="First Name"
                    onChange={this.handleChange}
                    value={this.state.first_name}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Last Name</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    name="last_name"
                    id="last_name"
                    placeholder="Last Name"
                    onChange={this.handleChange}
                    value={this.state.last_name}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Email</label>
                <div className="col-sm-9">
                  <input
                    type="Email"
                    className="form-control"
                    name="Email"
                    id="Email"
                    placeholder="Email"
                    onChange={this.handleChange}
                    value={this.state.Email}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Password</label>
                <div className="col-sm-9">
                  <input
                    type="Password"
                    className="form-control"
                    name="Password"
                    id="Password"
                    placeholder="Password"
                    onChange={this.handleChange}
                    value={this.state.Password}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Mobile</label>
                <div className="col-sm-9">
                  <input
                    type="number"
                    className="form-control"
                    name="Mobile"
                    id="Mobile"
                    placeholder="Mobile"
                    onChange={this.handleChange}
                    value={this.state.Mobile}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Civil Id</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    name="CivilId"
                    id="CivilId"
                    placeholder="Civil Id Number "
                    onChange={this.handleChange}
                    value={this.state.CivilId}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="row">
                <div className="col-sm-3">
                  User Image
                </div>
                <div className="col-sm-9">
                  <form id="userImage" name="userImage" encType="multipart/form-data" className="text-capitalize">

                    <div className="form-group">

                      <input accept="image/*" onChange={this.handleImageUpload} id="user_Image" type="file" className="form-control" autoComplete="off" name="media[]"
                        data-toggle="tooltip" title="Click To Upload Photo"
                      />
                      <div id="id_image_section_lable" className="pt-2">
                        {
                          this.state.image_url
                            ?
                            this.state.image_url !== null || this.state.image_url !== undefined || this.state.image_url !== {}
                              ?
                              <img src={this.state.image_url} alt=""
                                className="img-100" onError={e => {
                                  e.target.src = ""
                                }} />
                              :
                              ''
                            :
                            ''
                        }
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-addon" id="basic-addon4">Status</span>
                <select name="status" className="form-control" value={this.state.status} onChange={this.handleChange}>
                  <option value="active" name="active">Active</option>
                  <option value="inactive" name="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
          <div className="row float-right p-3">
            {
              this.state.isSaving
                ?
                <button className="btn btn-grd-disabled mr-2" disabled>Saving...!</button>
                :
                <button onClick={this.adddealer}  className="btn btn-grd-disabled mr-2"><i className="icofont icofont-save"></i> Save</button>
            }
            <Link to={"/customers"} className="btn btn-outline-dark">
              Cancel
        </Link>
          </div>
        </div>
      </div >

    );
  }
}

export default UserAdd;
