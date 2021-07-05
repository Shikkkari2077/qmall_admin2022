import React from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Constant from "../../../Constant.js";
import $ from "jquery";
import ReactQuill from "react-quill";

class ShopAdd extends React.Component {
  state = {
    status: "open",
    description: "",
    refundPolicy: "",
    refundPolicy_ar:"",
    selected_category: []
  };
  onHandleRefundPolicyChange = value => {
    this.setState({ refundPolicy: value });
  };
  onHandleRefundPolicyChangeArabic=value=>{
    this.setState({ refundPolicy_ar: value });

  }
  onHandleDescriptionChange = value => {
    this.setState({ description: value });
  };
  componentWillMount(){
    this.getCategoryList();

  }

  componentDidUpdate(prevProps) {
    //console.log(prevProps)
    if (this.props.language_id !== undefined) {
      //console.log("Called")

      if (prevProps.shop_id !== this.props.shop_id) {
        this.setState({ shop_id: this.props.shop_id });
        this.getShopDetails();
        this.getCategoryList();


     
      }
      if (prevProps.language_id !== this.props.language_id) {
        if (this.props.shop_id !== undefined) {
          // if (prevProps.shop_id !== this.props.shop_id) {
          //   this.setState({ shop_id: this.props.shop_id });
          // }
          this.getShopDetails();


        }
      }
    }
  }
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
    if(event.target.name == 'password')
    {
      this.setState({
        passwordChange:true
      })
    }
  };
  getShopDetails = () => {
    //console.log("shop called")
    var that = this;
    var data = new URLSearchParams();
    // this.setState({ isSaving: true });
    data.append("ShopId", that.props.shop_id);
    data.append("LanguageId", that.props.language_id);
    fetch(Constant.getAPI() + "/shop/get", {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        // "Authorization": localStorage.getItem('q8_mall_auth')
      },
      body: data
    }).then(function (response) {
      return response.json();
    }).then(function (json) {
      //console.log(json.data)
      if (json.status === true) {
        for (var i = 0; i < json.data.length; i++) {
          if (json.data[i].id === that.props.shop_id) {
            var categories = []
            for (var j = 0; j < json.data[i].Categories.length; j++) {
              $("#shop_category_" + json.data[i].Categories[j].id).prop("checked", true);
              categories.push(json.data[i].Categories[j].id);
            }
            if (json.data[i].Medium !== null) {
              that.setState({
                image: json.data[i].Medium.url
              });
            }
            that.setState({
              users_data: json.data[i],
              name: json.data[i].name,
              email: json.data[i].email,
              deliveryCharges: json.data[i].deliveryCharges,
              approxDeliveryTime: json.data[i].approxDeliveryTime,
              openTime: json.data[i].openTime,
              closeTime: json.data[i].closeTime,
              address: json.data[i].address,
              description: json.data[i].description,
              address: json.data[i].address,
              refundPolicy: json.data[i].refundPolicy_en,
              qmallCommission: json.data[i].qmallCommission,
              ibanNumber: json.data[i].ibanNumber,
              phNumber: json.data[i].phNumber,
              priority: json.data[i].priority,
              featuredpriority:json.data[i].featuredPriority,
              selected_category: categories,
              // mobile: json.data[i].mobileNumber,
              media_id: json.data[i].MediaId,
              refundPolicy_ar:json.data[i].refundPolicy_ar
            });
          }
        }
      } else {
        that.setState({ users_data: {} });
        // Swal.fire({
        //   title: "Something went wrong. Try again after some Time.!",
        //   icon: 'error',
        //   text: "",
        //   confirmButtonColor: "#3085d6",
        //   cancelButtonColor: "#d33",
        //   confirmButtonText: "Ok"
        // })
      }
    })
  }
  getCategoryList = () => {
    var that = this;
    var data = new URLSearchParams();
    //data.append("LanguageId", that.props.language_id);
    fetch(Constant.getAPI() + "/category/get", {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: data
    }).then(function (response) {
      return response.json();
    }).then(function (json) {
      if (json.status === true) {
        var category = []
        for (var i = 0; i < json.data.length; i++) {
          category.push(json.data[i]);
          // if (json.data[i].child !== null && json.data[i].child !== [] && json.data[i].child.length > 0) {
          //   for (var j = 0; j < json.data[i].child.length; j++) {
          //     category.push(json.data[i].child[j]);
          //   }
          // }
        }
        for (var j = 0; j < that.state.selected_category.length; j++) {
          $("#shop_category_" + that.state.selected_category[j]).prop("checked", true);
        }
        that.setState({ category_list: category });
      } else {
        that.setState({ category_list: [] });
        // Swal.fire({
        //   title: "Something went wrong. Try again after some Time.!",
        //   icon: 'error',
        //   text: "",
        //   confirmButtonColor: "#3085d6",
        //   cancelButtonColor: "#d33",
        //   confirmButtonText: "Ok"
        // })
      }
    });
  }
  addShop = (media_id) => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    if (media_id === undefined || media_id === null || media_id === "") {
      that.setState({ isSaving: false });
      Swal.fire("Add Shop Logo First.!");
      return false;
    }
    if (that.state.email === undefined || that.state.email === null || that.state.email === "") {
      that.setState({ isSaving: false });
      Swal.fire("Enter Email Id");
      return false;
    }
    if (that.state.password === undefined || that.state.password === null || that.state.password === "") {
      that.setState({ isSaving: false });
      Swal.fire("Enter Password");
      return false;
    }
    if (that.state.name === undefined || that.state.name === null || that.state.name === "") {
      that.setState({ isSaving: false });
      Swal.fire("Enter Shop Name");
      return false;
    }
    // if (that.state.mobile === undefined || that.state.mobile === null || that.state.mobile === "") {
    //   that.setState({ isSaving: false });
    //   Swal.fire("Enter Mobile Number");
    //   return false;
    // }
    data.append("email", that.state.email);
    data.append("password", that.state.password);
    data.append("name", that.state.name);
    if (that.state.phNumber !== undefined && that.state.phNumber !== null && that.state.phNumber !== "null" && that.state.phNumber !== "") {
      data.append("phNumber", that.state.phNumber);
    } else {
      data.append("phNumber", "");
    }
   // data.append("refundPolicy", that.state.refundPolicy);
    if (that.state.ibanNumber !== undefined && that.state.ibanNumber !== null && that.state.ibanNumber !== "null" && that.state.ibanNumber !== "") {
      data.append("ibanNumber", that.state.ibanNumber);
    } else {
      data.append("ibanNumber", "");
    }
    // data.append("deliveryCharges", that.state.deliveryCharges);
    // data.append("approxDeliveryTime", that.state.approxDeliveryTime);
    data.append("status", that.state.status);
    data.append("openTime", that.state.openTime);
    data.append("closeTime", that.state.closeTime);
    data.append("description", that.state.description);
    if (that.state.address !== undefined && that.state.address !== null && that.state.address !== "") {
      data.append("address", that.state.address);
    } else {
      data.append("address", "");
    }

    if (that.state.qmallCommission !== undefined && that.state.qmallCommission !== null && that.state.qmallCommission !== "") {
      data.append("qmallCommission", that.state.qmallCommission);
    } else {
      data.append("qmallCommission", 0);
    }
    data.append("MediaId", media_id);
    data.append("priority", that.state.priority);
    data.append("featuredPriority", that.state.featuredpriority);

    data.append("LanguageId", that.props.language_id);
    data.append("CategoryId", that.state.selected_category);
    data.append("refundPolicy_ar", that.state.refundPolicy_ar);
    data.append("refundPolicy_en", that.state.refundPolicy);

    fetch(Constant.getAPI() + "/shop/register", {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: data
    }).then(function (response) {
      return response.json();
    }).then(function (json) {
      if (json.status === true) {
        Swal.fire("Added !", "Dealer has been Added", "success");
        window.location.href = "#/shops"
        that.setState({ isSaving: false });
      } else {
        that.setState({ isSaving: false });
        Swal.fire({
          title: json.message,
          // title: "Something went wrong. Try again after some Time.!",
          icon: 'error',
          text: "",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Ok"
        })
      }
    })
  };
  updateShopDetails = (media_id) => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    // if (media_id === undefined || media_id === null || media_id === "") {
    //       that.setState({ isSaving: false });
    //       Swal.fire("Add Shop Logo First.!");
    //       return false;
    //     }
    // data.append("email", that.state.email);
   // data.append("email", that.state.email);
    data.append("name", that.state.name);
    if (that.state.phNumber !== undefined && that.state.phNumber !== null && that.state.phNumber !== "null" && that.state.phNumber !== "") {
      data.append("phNumber", that.state.phNumber);
    } 
    if (that.state.passwordChange == true) {
      data.append("password", that.state.password);
    } 

    data.append("status", that.state.status);
    if (that.state.qmallCommission !== undefined && that.state.qmallCommission !== null && that.state.qmallCommission !== "") {
      data.append("qmallCommission", that.state.qmallCommission);
    } 
    if (that.state.ibanNumber !== undefined && that.state.ibanNumber !== null && that.state.ibanNumber !== "null" && that.state.ibanNumber !== "") {
      data.append("ibanNumber", that.state.ibanNumber);
    }
    data.append("openTime", that.state.openTime);
    data.append("closeTime", that.state.closeTime);
    if (that.state.description !== undefined && that.state.description !== null) {
      data.append("description", that.state.description);
    } 
    if (that.state.address !== undefined && that.state.address !== null && that.state.address !== "") {
      data.append("address", that.state.address);
    } 
    if (media_id !== undefined && media_id !== null) {
      data.append("MediaId", media_id);
     
    }
    data.append("LanguageId", that.props.language_id);
    data.append("ShopId", that.props.shop_id);
    data.append("CategoryId", that.state.selected_category);
    data.append("priority", that.state.priority);
    data.append("featuredPriority", that.state.featuredpriority);
    data.append("refundPolicy_ar", that.state.refundPolicy_ar);
    data.append("refundPolicy_en", that.state.refundPolicy);
 

    fetch(Constant.getAPI() + "/shop/update", {
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
        Swal.fire("Updated !", "Dealer has been Updated", "success");
        if (localStorage.getItem('q8_mall_ad_role') === "shop") {
          window.location.href = "#/"
        } else {
          window.location.href = "#/shops"
        }
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
  uploadMedia = () => {
    var that = this;
    var form = $('#userImage')[0];
    var data = new FormData(form);
    // data.append('upload_for', 'user');
    fetch(Constant.getAPI() + "/media/add", {
      method: "post",
      body: data
    }).then(function (response) {
      return response.json();
    }).then(function (json) {
      if (json.status === true) {
        if (that.props.shop_id !== undefined) {
          that.updateShopDetails(json.data[0].id);
        } else {
          that.addShop(json.data[0].id);
        }
      } else {
        // that.setState({ category_data: [] });
        //console.log(json.error);
      }
    });
  }
  onSaveData = () => {
    var that = this;
    that.setState({ isSaving: true });
    if (that.state.accepted) {
      that.uploadMedia();
    } else if (that.props.shop_id !== undefined) {
      that.updateShopDetails(that.state.media_id);
    } else {
      that.addShop(that.state.media_id);
    }

  }
  changeCategorySelection = (event) => {
    var id = event.target.value;
    let arr = this.state.selected_category;
    var index = -1;
    arr.find(function (value, i) {
      if ((parseInt(value, 10) === parseInt(id, 10))) {
        index = i;
      }
    }.bind(this))
    if (index !== -1) {
      arr.splice(index, 1);
      this.setState({ selected_category: arr });
    } else {
      // obj = id;
      arr.push(id);
      this.setState({ selected_category: arr });
    }
  }
  render() {
    return (
      <div className="">
        <div className="card-body">
          <div className="row">

            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Shop Name</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    id="name"
                    placeholder="Shop Name"
                    onChange={this.handleChange}
                    value={this.state.name}
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
                    id="shop_phNumber"
                    placeholder="Phone Number"
                    onChange={this.handleChange}
                    value={this.state.phNumber}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Email</label>
                <div className="col-sm-9">
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    id="shop_email"
                    placeholder="Email"
                    onChange={this.handleChange}
                    value={this.state.email}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Password</label>
                <div className="col-sm-9">
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    id="shop_password"
                    placeholder="Password"
                    onChange={this.handleChange}
                    value={this.state.password}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Address</label>
                <div className="col-sm-9">
                  <textarea
                    rows={3}
                    // cols={}
                    className="form-control"
                    name="address"
                    id="address"
                    placeholder="Address"
                    onChange={this.handleChange}
                    value={this.state.address}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Qmall Commission (in %)</label>
                <div className="col-sm-9">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    className="form-control"
                    name="qmallCommission"
                    id="qmallCommission"
                    placeholder="Qmall Commission (in %)"
                    onChange={this.handleChange}
                    value={this.state.qmallCommission}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">IBAN Number</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    name="ibanNumber"
                    id="ibanNumber"
                    placeholder="IBAN Number"
                    onChange={this.handleChange}
                    value={this.state.ibanNumber}
                  />
                </div>
              </div>
            </div>
            {/* <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Delivery Charges(in KWD)</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    name="deliveryCharges"
                    id="deliveryCharges"
                    placeholder="Delivery Charges (in KWD)"
                    onChange={this.handleChange}
                    value={this.state.deliveryCharges}
                  />
                </div>
              </div>
            </div> */}
            {/* <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Approx Delivery Time</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    name="approxDeliveryTime"
                    id="approxDeliveryTime"
                    placeholder="Approx Delivery Time"
                    onChange={this.handleChange}
                    value={this.state.approxDeliveryTime}
                  />
                </div>
              </div>
            </div> */}
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Shop Opening Time</label>
                <div className="col-sm-9">
                  <input
                    type="time"
                    className="form-control"
                    name="openTime"
                    id="openTime"
                    placeholder="Shop Opening Time"
                    onChange={this.handleChange}
                    value={this.state.openTime}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Shop Closing Time</label>
                <div className="col-sm-9">
                  <input
                    type="time"
                    className="form-control"
                    name="closeTime"
                    id="closeTime"
                    placeholder="Shop Closing Time"
                    onChange={this.handleChange}
                    value={this.state.closeTime}
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

                      {/* <input onChange={this.handleChange} id="shop_Image" type="text" className="form-control" name="image" /> */}
                      <input accept="image/*" onChange={this.handleImageUpload} id="user_Image" type="file" className="form-control" autoComplete="off" name="media"
                        data-toggle="tooltip" title="Click To Upload Photo"
                      />
                      <div id="id_image_section_lable" className="pt-2">
                        {
                          this.state.image
                            ?
                            this.state.image !== null || this.state.image !== undefined || this.state.image !== {}
                              ?
                              <img src={this.state.image} alt=""
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
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Priority</label>
                <div className="col-sm-9">
                  <input
                    type="number"
                    min={0}
                    className="form-control"
                    name="priority"
                    id="priority"
                    placeholder="Priority"
                    onChange={this.handleChange}
                    value={this.state.priority}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Featured Priority</label>
                <div className="col-sm-9">
                  <input
                    type="number"
                    min={0}
                    className="form-control"
                    name="featuredpriority"
                    id="priority"
                    placeholder="Featured Priority"
                    onChange={this.handleChange}
                    value={this.state.featuredpriority}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Status</label>
                <div className="col-sm-9">
                  <select name="status" className="form-control" value={this.state.status} onChange={this.handleChange}>
                    <option value="open" name="open">Open</option>
                    <option value="closed" name="close">Closed</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="row">
            <div className="col-md-12">
              <div className="form-group row">
                <label className="col-sm-2 col-form-label">Shop Description</label>
                <div className="col-sm-10">
                  <ReactQuill
                    value={this.state.description}
                    onChange={this.onHandleDescriptionChange}
                    style={{ height: "200px", marginBottom: '5%' }}
                  />
                </div>
              </div>
            </div>
          </div> */}

          <div className="row">
            <div className="col-md-12">
              <div className="form-group row">
                <label className="col-sm-2 col-form-label">Refund Policy (English)</label>
                <div className="col-sm-10">
                  <ReactQuill
                    value={this.state.refundPolicy}
                    onChange={this.onHandleRefundPolicyChange}
                    style={{ height: "200px", marginBottom: '5%' }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="form-group row">
                <label className="col-sm-2 col-form-label">Refund Policy (Arabic)</label>
                <div className="col-sm-10">
                  <ReactQuill
                    value={this.state.refundPolicy_ar}
                    onChange={this.onHandleRefundPolicyChangeArabic}
                    style={{ height: "200px", marginBottom: '5%' }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="form-group row">
                <label className="col-sm-2 col-form-label">Category</label>
                <div className="col-sm-10">
                  <div className="p-20 z-depth-right-1 waves-effect " data-toggle="tooltip" data-placement="top" title="" data-original-title="Service List">
                    <div className="row">
                      {
                        this.state.category_list !== undefined &&
                          this.state.category_list !== null &&
                          this.state.category_list !== [] &&
                          this.state.category_list.length > 0 ? (
                            this.state.category_list.map(category =>
                              <div className=" col-sm-4" key={category.id}>
                                <div className="checkbox-fade fade-in-primary">
                                  <label>
                                    <input type="checkbox" id={"shop_category_" + category.id} value={category.id} onChange={this.changeCategorySelection} />
                                    <span className="cr">
                                      <i className="cr-icon icofont icofont-ui-check txt-primary"></i>
                                    </span>
                                    <span>{category.name}</span>
                                  </label>
                                </div>
                              </div>
                            )) : ""
                      }
                    </div>
                  </div>
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
            {
              localStorage.getItem('q8_mall_ad_role') === "shop"
                ?
                <Link to={"/"} className="btn btn-outline-dark"> Cancel </Link>
                :
                <Link to={"/shops"} className="btn btn-outline-dark"> Cancel </Link>
            }
          </div>
        </div>
      </div >

    );
  }
}

export default ShopAdd;
