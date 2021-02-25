import React from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import $ from "jquery";
import Constant from "../../Constant";
import GalleryImageList from "../GalleryMaster/GalleryImageList";
import ReactQuill from "react-quill";
import AddGalleryImagesIndex from "../GalleryMaster/AddGalleryImagesIndex";

class ProductAdd extends React.Component {
  state = {
    status: true,
    description: "",
    priority: 1,
    refund_policy: "",
    selected_attributes: []
  };
  onHandleDescriptionChange = value => {
    this.setState({ description: value });
  };
  onHandleRefundPolicyChange = value => {
    this.setState({ refund_policy: value });
  };
  componentDidMount() {
    if (this.props.language_id !== undefined) {
      if (this.props.product_id !== undefined) {
        // this.setState({ product_id: this.props.product_id });
        this.getProductDetails();
      }
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.language_id !== undefined) {
      if (prevProps.product_id !== this.props.product_id) {
        this.setState({ product_id: this.props.product_id });
        this.getProductDetails();
      }
      if (prevProps.language_id !== this.props.language_id) {
        if (this.props.product_id !== undefined) {
          // this.setState({ product_id: this.props.product_id });
          this.getProductDetails();
        }
        this.getAttributeList();
        this.getCategoryList();
        this.getShopList();
      }
    }
  }
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  getCategoryList = () => {
    var that = this;
    var data = new URLSearchParams();
    if (localStorage.getItem('q8_mall_ad_role') === "shop") {
      data.append("ShopId", localStorage.getItem('q8_mall_ad_uid'))
    }
    data.append("LanguageId", that.props.language_id);
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
          if (json.data[i].child !== null && json.data[i].child !== [] && json.data[i].child.length > 0) {
            for (var j = 0; j < json.data[i].child.length; j++) {
              category.push(json.data[i].child[j]);
            }
            // } else {
            //   category.push(json.data[i]);
          }
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
  getShopList = () => {
    var that = this;
    var data = new URLSearchParams();
    data.append("LanguageId", that.props.language_id);
    fetch(Constant.getAPI() + "/shop/get", {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: data
    }).then(function (response) {
      return response.json();
    }).then(function (json) {
      if (json.status === true) {
        that.setState({ shop_list: json.data });
      } else {
        that.setState({ shop_list: [] });
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
  getAttributeList = () => {
    var that = this;
    var data = new URLSearchParams();
    data.append("LanguageId", that.props.language_id);
    fetch(Constant.getAPI() + "/attribute/get", {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: data
    }).then(function (response) {
      return response.json();
    }).then(function (json) {
      if (json.status === true) {
        console.log(json.data)
        that.setState({ attribute_list: json.data });
      } else {
        that.setState({ attribute_list: [] });
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
  handleImageUpload = (event) => {
    document.getElementById('banner_image_label').innerHTML = "";
    let element = $("#product_banner_image").get(0);
    // $("#id_image_section").empty();
    this.setState({ accepted: element });
    var proof_img = [];
    let obj = {};
    console.log(element.files);
    this.setState({ product_banner_image: element.files });
    for (var i = 0; i < element.files.length; i++) {
      var file1 = element.files[i];
      var img = document.createElement("img");
      img.className = "img-100";
      var filePath = URL.createObjectURL(file1);
      img.src = filePath;
      $("#banner_image_label").append(img);
    }
  }
  getProductDetails = () => {
    var that = this;
    var data = new URLSearchParams();
    data.append("ProductId", this.props.product_id);
    data.append("LanguageId", that.props.language_id);
    fetch(Constant.getAPI() + "/product/get", {
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
        var selected_attributes = []
        if (json.data[0].Attributes !== null && json.data[0].Attributes !== [] && json.data[0].Attributes.length > 0) {
          for (var i = 0; i < json.data[0].Attributes.length; i++) {
            selected_attributes.push(json.data[0].Attributes[i].id);
            $("#product_attributes_" + json.data[0].Attributes[i].id).prop("checked", true)
          }
        }
        if (json.data[0].productMedia !== null) {
          console.log(json.data)
          that.setState({
            attribute_type_data: json.data[0],
            product_name: json.data[0].name,
            priority: json.data[0].priority,
            description: json.data[0].description,
            refund_policy: json.data[0].refundPolicy,
            attribute_unit: json.data[0].unit,
            attribute_value: json.data[0].value,
            image: json.data[0].productMedia.url,
            CategoryId: json.data[0].CategoryId,
            MediaId: json.data[0].MediaId,
            selected_attributes: selected_attributes
          });
        } else {
          that.setState({
            attribute_type_data: json.data[0],
            product_name: json.data[0].name,
            priority: json.data[0].priority,
            description: json.data[0].description,
            refund_policy: json.data[0].refundPolicy,
            attribute_unit: json.data[0].unit,
            attribute_value: json.data[0].value,
            CategoryId: json.data[0].CategoryId,
            MediaId: json.data[0].MediaId,
            selected_attributes: selected_attributes
          });
        }
      } else {
        that.setState({ attribute_type_data: {} });
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
  onSaveData = () => {
    var that = this;
    that.setState({ isSaving: true });
    if (that.state.accepted) {
      that.uploadMedia();
    } else {
      if (that.props.product_id !== undefined) {
        that.updateCategoryData(that.state.MediaId);
      } else {
        that.addCategory(that.state.MediaId);
        
      }
    }
  }
  uploadMedia = () => {
    var that = this;
    var form = $('#bannerImage')[0];
    var data = new FormData(form);
    // data.append('upload_for', 'user');
    fetch(Constant.getAPI() + "/media/add", {
      method: "post",
      body: data
    }).then(function (response) {
      return response.json();
    }).then(function (json) {
      if (json.status === true) {
        if (that.props.product_id !== undefined) {
          that.updateCategoryData(json.data[0].id);
        } else {
          that.addCategory(json.data[0].id);
        }
      } else {
        // that.setState({ category_data: [] });
        console.log(json.error);
      }
    });
  }
  updateCategoryData = (media_id) => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    if (that.state.CategoryId === undefined || that.state.CategoryId === null || that.state.CategoryId === "" || that.state.CategoryId === "0") {
      Swal.fire("Warning !", "Please Select Product Section First. !", "warning");
      that.setState({ isSaving: false });
      return false;
    }
    data.append("name", that.state.product_name);
    data.append("priority", that.state.priority);
    data.append("description", that.state.description);
    data.append("refundPolicy", that.state.refund_policy);
    data.append("LanguageId", that.props.language_id);
    data.append("MediaId", media_id);
    data.append("CategoryId", that.state.CategoryId);
    // data.append("ShopId", that.state.ShopId);
    data.append("ProductId", that.props.product_id);
    data.append("AttributeIds", JSON.stringify(that.state.selected_attributes));
    fetch(Constant.getAPI() + "/product/update", {
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
        Swal.fire("Updated !", "Product has been Updated", "success");
        window.location.href = "#/products"
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
  addCategory = (media_id) => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    if (that.state.CategoryId === undefined || that.state.CategoryId === null || that.state.CategoryId === "" || that.state.CategoryId === "0") {
      Swal.fire("Warning !", "Please Select Product Section First. !", "warning");
      that.setState({ isSaving: false });
      return false;
    }
    data.append("name", that.state.product_name);
    data.append("priority", that.state.priority);
    data.append("description", that.state.description);
    data.append("refundPolicy", that.state.refund_policy);
    data.append("MediaId", media_id);
    data.append("CategoryId", that.state.CategoryId);
    // data.append("ShopId", that.state.ShopId);
    data.append("LanguageId", that.props.language_id);
    data.append("AttributeIds", JSON.stringify(that.state.selected_attributes));
    fetch(Constant.getAPI() + "/product/add", {
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
        console.log(json.result.id)
        Swal.fire("Added !", "Add Product Image", "success");
        const product_id =json.result.id
        window.location.href = `#/products/gallery/${product_id}`;

        console.log("here")
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
  changeAttributesSelection = (event) => {
    var id = event.target.value;
    let arr = this.state.selected_attributes;
    var index = -1;
    console.log(id)
    arr.find(function (value, i) {
      if ((parseInt(value, 10) === parseInt(id, 10))) {
        index = i;
      }
    }.bind(this))
    if (index !== -1) {
      arr.splice(index, 1);
      this.setState({ selected_attributes: arr });
    } else {
      // obj = id;
      arr.push(id);
      this.setState({ selected_attributes: arr });
    }
  }
  render() {
    return (
      <div className="">
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Name</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    name="product_name"
                    id="product_name"
                    placeholder="Name"
                    onChange={this.handleChange}
                    value={this.state.product_name}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Priority</label>
                <div className="col-sm-9">
                  <input
                    type="number"
                    min={1}
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
            {/* <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Shop</label>
                <div className="col-sm-9">
                  <select name="ShopId" className="form-control" value={this.state.ShopId} onChange={this.handleChange}>
                    {
                      this.state.shop_list !== undefined && this.state.shop_list !== null && this.state.shop_list !== [] && this.state.shop_list.length > 0
                        ?
                        this.state.shop_list.map(shop =>
                          <option key={shop.id} value={shop.id}>{shop.name}</option>
                        )
                        :
                        null
                    }
                  </select>
                </div>
              </div>
            </div> */}

            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Section</label>
                <div className="col-sm-9">
                  <select name="CategoryId" className="form-control" value={this.state.CategoryId} onChange={this.handleChange}>
                    <option value="0">Select Product Section</option>
                    {
                      this.state.category_list !== undefined && this.state.category_list !== null && this.state.category_list !== [] && this.state.category_list.length > 0
                        ?
                        this.state.category_list.map(category =>
                          <option key={category.id} value={category.id}>{category.name}</option>
                          // category.child !== undefined && category.child !== null && category.child !== [] && category.child.length > 0
                          //   ?
                          //   category.child.map(child_category =>
                          //     <option key={child_category.id} value={child_category.id}>{child_category.name}</option>
                          //   )
                          //   :
                          //   null
                        )
                        :
                        null
                    }
                  </select>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="row">
                <div className="col-sm-3">
                  Display Image
                </div>
                <div className="col-sm-9">
                  <form id="bannerImage" name="bannerImage" encType="multipart/form-data" className="text-capitalize">

                    <div className="form-group">

                      {/* <input onChange={this.handleChange} id="shop_Image" type="text" className="form-control" name="image" /> */}
                      <input accept="image/*" onChange={this.handleImageUpload} id="product_banner_image" type="file" className="form-control" autoComplete="off" name="media"
                        data-toggle="tooltip" title="Click To Upload Banner Image"
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-2">
              <div id="banner_image_label" className="pt-2">
                {
                  this.state.image
                    ?
                    this.state.image !== null || 
                    this.state.image !== undefined || 
                    this.state.image !== {}
                      ?
                      <img src={this.state.image} alt="" className="img-100" onError={e => { e.target.src = "" }} />
                      :
                      ''
                    :
                    ''
                }
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
          <div className="row">
            <div className="col-md-12">
              <div className="form-group row">
                <label className="col-sm-2 col-form-label">Refund Policy</label>
                <div className="col-sm-10">
                  <ReactQuill
                    value={this.state.refund_policy}
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
                <label className="col-sm-2 col-form-label">Attributes</label>
                <div className="col-sm-10">
                  <div className="p-20 z-depth-right-1 waves-effect " data-toggle="tooltip" data-placement="top" title="" data-original-title="Service List">
                    <div className="row">
                      { 
                        this.state.attribute_list !== undefined &&
                          this.state.attribute_list !== null &&
                          this.state.attribute_list !== [] &&
                          this.state.attribute_list.length > 0 ? (
                            this.state.attribute_list.map(attributes =>(
                              // attributes.AttributeTypeId !== null ?
                              <div className=" col-sm-4" key={attributes.id}>
                                <div className="checkbox-fade fade-in-primary">
                                  <label>
                                    <input
                                     type="checkbox" 
                                     id={"product_attributes_" + attributes.id} 
                                     value={attributes.id}
                                     onChange={this.changeAttributesSelection} />
                                     <span className="cr">
                                     <i className="cr-icon icofont icofont-ui-check txt-primary"></i>
                                    </span>
                                    <span>
                                      {/* {console.log(attributes)} */}
                                      { 
                                      attributes.name }</span>
                                  </label>
                                </div>
                              </div>
                              // :""

                          ))) : ""
                      }
                    </div>
                  </div>
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
              <Link to={"/products"} className="btn btn-outline-dark">
                Cancel
             </Link>
            </div>
          </div>
        </div >
      </div >
    );
  }
}

export default ProductAdd;
