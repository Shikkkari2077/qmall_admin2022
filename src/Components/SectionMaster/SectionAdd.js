import React from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import $ from "jquery";
import Constant from "../../Constant";
import ReactQuill from "react-quill";
import Loader from "../../Loader";
// import { CropLandscapeOutlined } from "@material-ui/icons";

class SectionAdd extends React.Component {
  state = {
    status: true,
    description: "",
  };
  onHandleDescriptionChange = (value) => {
    this.setState({ description: value });
  };
  
  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
   // console.log([event.target.name],event.target.value )
  };
  getCategoryDetails = () => {
    //console.log("called")
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isLoading: true });
    // data.append("ShopId", localStorage.getItem("q8_mall_ad_uid"))

    data.append("SectionId", that.props.secton_id);
    fetch(Constant.getAPI() + "/shop/section/get", {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: localStorage.getItem("q8_mall_auth"),
      },
      body: data,
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        //console.log(json)
        if(json !== undefined){
            that.setState({
              section_name: json.name_en,
              section_name_ar: json.name_ar,
              image:json.Medium.url,
              priority: json.priority,
              isLoading: false,
            });
          }
       } );
  };
  getCategoryList = () => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isLoading: true });
    if (localStorage.getItem("q8_mall_ad_role") === "shop") {
      data.append("ShopId", localStorage.getItem("q8_mall_ad_uid"));
    }
    data.append("LanguageId", that.props.language_id);
    fetch(Constant.getAPI() + "/shop/section/get", {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: data,
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        if (json.status === true) {
          that.setState({ category_list: json.data, isLoading: false });
        } else {
          that.setState({ isLoading: false, category_list: [] });
          //console.log(json);
        }
      });
  };
  onSaveData = () => {
    var that = this;
    that.setState({ isSaving: true });
    if (that.state.accepted) {
      that.uploadMedia();
    } else {
      if (that.props.secton_id !== undefined) {
        that.updateCategoryData(that.state.MediaId);
      } else {
        that.addCategory(that.state.MediaId);
      }
    }
  };
  getShopDetails = () => {
    console.log("shopDetails")
    var that = this;
    var data = new URLSearchParams();
    // this.setState({ isSaving: true });
    data.append("ShopId", localStorage.getItem("q8_mall_ad_uid"));
    // data.append("LanguageId", that.props.language_id);
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
      console.log(json.data)
      if (json.status === true) {

        var categories = json.data[0].Categories
        console.log(json.data[0].Categories)
        that.setState({
             
        selected_category: categories,
               
              });
        console.log(categories)

    
      }
     
    })
  }
  uploadMedia = () => {
    var that = this;
    var form = $("#categoryImage")[0];
    var data = new FormData(form);
    // data.append('upload_for', 'user');
    fetch(Constant.getAPI() + "/media/add", {
      method: "post",
      body: data,
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        if (json.status === true) {
          if (that.props.secton_id !== undefined) {
            that.updateCategoryData(json.data[0].id);
          } else {
            that.addCategory(json.data[0].id);
          }
        } else {
          // that.setState({ category_data: [] });
        }
      });
  };
  updateCategoryData = (media_id) => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    data.append("name_en", that.state.section_name);
    data.append("name_ar", that.state.section_name_ar);

    data.append("priority", that.state.priority);
    data.append("SectionId", that.props.secton_id);

    //data.append("LanguageId", that.props.language_id);
    data.append("MediaId", media_id);
    fetch(Constant.getAPI() + "/shop/section/update", {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: localStorage.getItem("q8_mall_auth"),
      },
      body: data,
    })
      .then(function (response) {
        return response
      })
      .then(function (response) {
        if (response.status === 200) {
          Swal.fire("Updated !", "category has been Updated", "success");
          window.location.href = "#/section";
          that.setState({ isSaving: false });
        } else {
          that.setState({ isSaving: false });
          Swal.fire({
            title: "Something went wrong. Try again after some Time.!",
            icon: "error",
            text: "",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ok",
          });
        }
      });
  };
  addCategory = (media_id) => {
    var that = this;
    var data = new URLSearchParams();
    if(this.state.categoryId == undefined || this.state.categoryId == '' || this.state.categoryId == null){
    Swal.fire({
      title: "Select Category First",
      icon: "error",
      text: "",

    })
    this.setState({
      isSaving:false,
    })
  }
    else{
   
    data.append("name_en", that.state.section_name);
    data.append("name_ar", that.state.section_name_ar);
    data.append("priority", that.state.priority);
    console.log( that.state.categoryId)
    data.append("categoryId",this.state.categoryId)
    // data.append("LanguageId", that.props.language_id);
    data.append("MediaId", media_id);
    //console.log(data)
    // console.log(that.props.language_id)
    fetch(Constant.getAPI() + "/shop/section/add", {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: localStorage.getItem("q8_mall_auth"),
      },
      body: data,
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {

        if (json.status === true) {
          Swal.fire("Added !", "Section has been Added", "success");
          window.location.href = "#/section";
          that.setState({ isSaving: false });
        } else {
          that.setState({ isSaving: false });
          Swal.fire({
            title: "Something went wrong. Try again after some Time.!",
            icon: "error",
            text: "",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ok",
          });
        }
      });

    }
  };
  handleImageUpload = (event) => {
    document.getElementById("category_image_label").innerHTML = "";
    let element = $("#category_image").get(0);
    // $("#id_image_section").empty();
    this.setState({ accepted: element });
    var proof_img = [];
    let obj = {};
    this.setState({ category_image: element.files });
    for (var i = 0; i < element.files.length; i++) {
      var file1 = element.files[i];
      var img = document.createElement("img");
      img.className = "img-100";
      var filePath = URL.createObjectURL(file1);
      img.src = filePath;
      $("#category_image_label").append(img);
    }
  };
  componentWillMount(){
    if(this.props.secton_id){
      this.getCategoryDetails()
          }
          this.getShopDetails();
    console.log(this.props.secton_id)


  }
  componentDidMount() {
    
    this.loadScript(
      process.env.PUBLIC_URL + "/assets/pages/filer/jquery.fileuploads.init.js"
    );
    if(this.props.secton_id){
    this.getCategoryDetails()}

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
        {this.state.isLoading ? (
          <Loader />
        ) : (
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <div className="form-group row">
                  <label className="col-sm-3 col-form-label">
                    Section Name (English)
                  </label>
                  <div className="col-sm-9">
                    <input
                      type="text"
                      className="form-control"
                      name="section_name"
                      id="section_name"
                      placeholder="Section Name English"
                      onChange={this.handleChange}
                      value={this.state.section_name}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group row">
                  <label className="col-sm-3 col-form-label">
                    Section Name (Arabic)
                  </label>
                  <div className="col-sm-9">
                    <input
                      type="text"
                      className="form-control"
                      name="section_name_ar"
                      id="section_name_ar"
                      placeholder="Secation Name Arabic"
                      onChange={this.handleChange}
                      value={this.state.section_name_ar}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group row">
                  <label className="col-sm-3 col-form-label">
                    Category
                  </label>
                  <div className="col-sm-9">
                    <select
                      name="categoryId"
                      className="form-control"
                      value={this.state.categoryId}
                      onChange={this.handleChange}
                    >
                      <option >Select Category</option>
                      {this.state.selected_category !== undefined &&
                      this.state.selected_category !== null &&
                      this.state.selected_category !== [] &&
                      this.state.selected_category.length > 0
                        ? this.state.selected_category.map((brands) => (
                               
                            <option key={brands.id} value={brands.id}>
                              {brands.name_en + "/" + brands.name_ar}
                            </option>
                           
                          ))
                        : null}
                    </select>
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
                <div className="row">
                  <div className="col-sm-3">Display Image <br/>
                  <small>(size: 220 X 250)</small>
                  </div>
                  
                  <div className="col-sm-9">
                    <form
                      id="categoryImage"
                      name="categoryImage"
                      encType="multipart/form-data"
                      className="text-capitalize"
                    >
                      <div className="form-group">
                        {/* <input onChange={this.handleChange} id="shop_Image" type="text" className="form-control" name="image" /> */}
                        <input
                          accept="image/*"
                          onChange={this.handleImageUpload}
                          id="category_image"
                          type="file"
                          className="form-control"
                          autoComplete="off"
                          name="media"
                          data-toggle="tooltip"
                          title="Click To Upload Banner Image"
                        />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-2">
                <div id="category_image_label" className="pt-2">
                  {this.state.image ? (
                    this.state.image !== null ||
                    this.state.image !== undefined ||
                    this.state.image !== {} ? (
                      <img
                        src={this.state.image}
                        alt=""
                        className="img-100"
                        onError={(e) => {
                          e.target.src = "";
                        }}
                      />
                    ) : (
                      ""
                    )
                  ) : (
                    ""
                  )}
                </div>
              </div>

              {/* <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Status</label>
                <div className="col-sm-9">
                  <select name="status" className="form-control" value={this.state.status} onChange={this.handleChange}>
                    <option value="true" name="active">Active</option>
                    <option value="false" name="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div> */}
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
                {this.state.isSaving ? (
                  <button className="btn btn-grd-disabled mr-2" disabled>
                    Saving...!
                  </button>
                ) : (
                  <button
                    onClick={this.onSaveData}
                    className="btn btn-grd-disabled mr-2"
                  >
                    <i className="icofont icofont-save"></i> Save
                  </button>
                )}
                <Link to={"/category"} className="btn btn-outline-dark">
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default SectionAdd;
