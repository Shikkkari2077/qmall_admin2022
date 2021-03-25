import React from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import $ from "jquery";
import Constant from "../../Constant";
import ReactQuill from "react-quill";
import Loader from "../../Loader";
// import { CropLandscapeOutlined } from "@material-ui/icons";

class CategoryAdd extends React.Component {
  state = {
    status: true,
    description: "",
  };
  onHandleDescriptionChange = (value) => {
    this.setState({ description: value });
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.language_id !== this.props.language_id) {
      this.setState({ language_id: nextProps.language_id });
      setTimeout(() => {
        this.getCategoryList();
      }, 100);
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.category_id !== this.props.category_id) {
      this.setState({ category_id: this.props.category_id });
      this.getCategoryDetails();
    }
    if (prevProps.language_id !== this.props.language_id) {
      if (this.props.category_id !== undefined) {
        // this.setState({ category_id: this.props.category_id });
        this.getCategoryDetails();
        this.getCategoryList();
      }
    }
  }
  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
   // console.log([event.target.name],event.target.value )
  };
  getCategoryDetails = () => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isLoading: true });
    if (localStorage.getItem("q8_mall_ad_role") === "shop") {
      data.append("ShopId", localStorage.getItem("q8_mall_ad_uid"));
    }
    data.append("CategoryId", that.props.category_id);
    data.append("LanguageId", that.props.language_id);
    fetch(Constant.getAPI() + "/category/get", {
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
          //console.log(json.data)
          if (json.data[0].parent !== null) {
            that.setState({
              category_data: json.data[0],
              category_name: json.data[0].name_en,
              category_name_ar: json.data[0].name_ar,

              priority: json.data[0].priority,
              categoryId: json.data[0].parent.id,
              isLoading: false,
            });
          } else {
            that.setState({
              category_data: json.data[0],
              priority: json.data[0].priority,
              category_name: json.data[0].name_en,
              category_name_ar: json.data[0].name_ar,

              isLoading: false,
            });
          }
          if (json.data[0].Medium !== null) {
            that.setState({
              image: json.data[0].Medium.url,
              MediaId: json.data[0].MediaId,
            });
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
  };
  getCategoryList = () => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isLoading: true });
    if (localStorage.getItem("q8_mall_ad_role") === "shop") {
      data.append("ShopId", localStorage.getItem("q8_mall_ad_uid"));
    }
    data.append("LanguageId", that.props.language_id);
    fetch(Constant.getAPI() + "/category/get", {
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
      if (that.props.category_id !== undefined) {
        that.updateCategoryData(that.state.MediaId);
      } else {
        that.addCategory(that.state.MediaId);
      }
    }
  };
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
          if (that.props.category_id !== undefined) {
            that.updateCategoryData(json.data[0].id);
          } else {
            that.addCategory(json.data[0].id);
          }
        } else {
          // that.setState({ category_data: [] });
          //console.log(json.error);
        }
      });
  };
  updateCategoryData = (media_id) => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    data.append("name_en", that.state.category_name);
    data.append("name_ar", that.state.category_name_ar);

    data.append("priority", that.state.priority);
    // if (
    //   that.state.categoryId !== undefined &&
    //   that.state.categoryId !== null &&
    //   that.state.categoryId !== "0"
    // ) {
    //   data.append("ParentId", that.state.categoryId);
    // } else {
    //   data.append("deleteParent", true);
    // }
    //data.append("LanguageId", that.props.language_id);
    data.append("CategoryId", that.props.category_id);
    data.append("MediaId", media_id);
    fetch(Constant.getAPI() + "/category/update", {
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
          Swal.fire("Updated !", "category has been Updated", "success");
          window.location.href = "#/category";
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
    this.setState({ isSaving: true });
    if (localStorage.getItem("q8_mall_ad_role") === "shop") {
      if (
        that.state.categoryId === undefined ||
        that.state.categoryId === null ||
        that.state.categoryId === "0"
      ) {
        Swal.fire({
          title: "Select Parent Category..!",
          icon: "warning",
          text: "",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Ok",
        });
        that.setState({ isSaving: false });
        return false;
      }
    }
    data.append("name_en", that.state.category_name);
    data.append("name_ar", that.state.category_name_ar);

    data.append("priority", that.state.priority);
    if (
      that.state.categoryId !== undefined &&
      that.state.categoryId !== null &&
      that.state.categoryId !== "0"
    ) {
      data.append("ParentId", that.state.categoryId);
    }
    //console.log( that.state.categoryId)
    //data.append("LanguageId", that.props.language_id);
    data.append("MediaId", media_id);
    //console.log(data)
    //console.log(that.props.language_id)
    fetch(Constant.getAPI() + "/category/add", {
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
          //console.log(json)
          Swal.fire("Added !", "category has been Added", "success");
          window.location.href = "#/category";
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
  handleImageUpload = (event) => {
    document.getElementById("category_image_label").innerHTML = "";
    let element = $("#category_image").get(0);
    // $("#id_image_section").empty();
    this.setState({ accepted: element });
    var proof_img = [];
    let obj = {};
    //console.log(element.files);
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
  componentDidMount() {
    this.getCategoryList();
    this.loadScript(
      process.env.PUBLIC_URL + "/assets/pages/filer/jquery.fileuploads.init.js"
    );
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
                    Category Name (English)
                  </label>
                  <div className="col-sm-9">
                    <input
                      type="text"
                      className="form-control"
                      name="category_name"
                      id="category_name"
                      placeholder="Category Name"
                      onChange={this.handleChange}
                      value={this.state.category_name}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group row">
                  <label className="col-sm-3 col-form-label">
                    Category Name (Arabic)
                  </label>
                  <div className="col-sm-9">
                    <input
                      type="text"
                      className="form-control"
                      name="category_name_ar"
                      id="category_name"
                      placeholder="Category Name"
                      onChange={this.handleChange}
                      value={this.state.category_name_ar}
                    />
                  </div>
                </div>
              </div>
              {/* <div className="col-md-6">
                <div className="form-group row">
                  <label className="col-sm-3 col-form-label">
                    Parent Category
                  </label>
                  <div className="col-sm-9">
                    <select
                      name="categoryId"
                      className="form-control"
                      value={this.state.categoryId}
                      onChange={this.handleChange}
                    >
                      <option value="0">Select Parent Category</option>
                      {this.state.category_list !== undefined &&
                      this.state.category_list !== null &&
                      this.state.category_list !== [] &&
                      this.state.category_list.length > 0
                        ? this.state.category_list.map((brands) => (
                            <option key={brands.id} value={brands.id}>
                              {//console.log(brands.id)}
                              {brands.name_en + "/" + brands.name_ar}
                            </option>
                          ))
                        : null}
                    </select>
                  </div>
                </div>
              </div> */}
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

export default CategoryAdd;
