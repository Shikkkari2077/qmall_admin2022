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
    isSaving:false,
    status: true,
    description: "",
    description_ar:'',
    activePage:"productDetails",
    priority: 1,
    refund_policy: "",
    isDisabled:true,
    refund_policy_ar: "",
    media_id:"",
    selected_attributes: [],
    gallery_media: []

  };
  saveGalleryMedia = (media,id) => {
    var that = this;
    var media_data = [];
    for (var i = 0; i < media.length; i++) {
      media_data.push(media[i].id);
    }
    var data = new URLSearchParams();
    data.append('ProductId',this.state.ProductId);
    data.append('MediaId', media_data);
    // data.append('MediaId', JSON.stringify(media_data));
    fetch(Constant.getAPI() + "/product/media/add", {
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
        Swal.fire("Added !", "NOW ADD STOCK", "success");
        // if(that.props.case =="add")
        //  {//console.log(json.data[0].ProductId)
          window.location.href = `#/products/stock/${json.data[0].ProductId}/add`;
      //   else
      //  {window.location.href = `#/products/add/${that.props.product_id}`;}
        //console.log(json.data)
        that.setState({ isSaving: false })
      } else {
        //console.log("gallery")

        that.setState({ isSaving: false });
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
  handleGalleryImageUpload = (event) => {
    document.getElementById('gallery_image_label').innerHTML = "";
    let element = $("#gallery_media").get(0);
    $("#socialize_image_section").empty();
    this.setState({ acceptedgallery: element });
    var proof_img = [];
    let obj = {};
    //console.log(element.files);
    this.setState({ category_image: element.files, galleryupload:true });
    for (var i = 0; i < element.files.length; i++) {
      var file1 = element.files[i];
      var img = document.createElement("img");
      img.className = "img-responsive img-100";
      var filePath = URL.createObjectURL(file1);
      img.src = filePath;
      $("#gallery_image_label").append(img);
    }
  }
  onHandleDescriptionChange = value => {
    this.setState({ description: value });
  };
  onHandleDescriptionChangeAr = value => {
    this.setState({ description_ar: value });
  };
  onHandleRefundPolicyChange = value => {
    this.setState({ refund_policy: value });
  };
  onHandleRefundPolicyChangeAr= (value) => {
    this.setState({ refund_policy_ar: value });
  };
  // onHandleRefundPolicyChangeAr = value => {
  //   this.setState({ refund_policy_ar: value });
  // };
  componentDidMount() {
    if (this.props.language_id !== undefined) {
      if (this.props.product_id !== undefined) {
        // this.setState({ product_id: this.props.product_id });
        this.getProductDetails();
        this.getAttributeList();
        if(localStorage.getItem("q8_mall_ad_role")=='shop'){
        this.getCategoryList();}
        this.getShopList();
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
        if(localStorage.getItem("q8_mall_ad_role")=='shop'){
        this.getCategoryList();}
        this.getShopList();
      
      }
    }
  }
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
 getCategoryListAdmin2(id){
    var that = this;
    this.setState({ isSaving: true });
    var data = new URLSearchParams();
    data.append("ShopId",id)
   fetch(Constant.getAPI() + "/shop/section/get", {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: localStorage.getItem("q8_mall_auth"),

      },
   body:data,
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {

        if (json.success === true) {
          that.setState({ category_list: json.data, isSaving: false });
        } else {
          that.setState({ category_list: [], isSaving: false });

         
        }
      });

  }
  getCategoryList = () => {
    var that = this;
    this.setState({ isSaving: true });
    var data = new URLSearchParams();
  fetch(Constant.getAPI() + "/shop/section/get", {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: localStorage.getItem("q8_mall_auth"),

      },

    })
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        //console.log(json)

        if (json.success === true) {
          that.setState({ category_list: json.data, isSaving: false });
        } else {
          that.setState({ category_list: [], isSaving: false });

          // Swal.fire({
          //   title: "Something went wrong. Try again after some Time.!",
          //   icon: "error",
          //   text: "",
          //   confirmButtonColor: "#3085d6",
          //   cancelButtonColor: "#d33",
          //   confirmButtonText: "Ok",
          // });
        }
      });
  };
  // getCategoryList = () => {
  //   var that = this;
  //   var data = new URLSearchParams();
  //   if (localStorage.getItem('q8_mall_ad_role') === "shop") {
  //     data.append("ShopId", localStorage.getItem('q8_mall_ad_uid'))
  //   }
  //   //data.append("LanguageId", that.props.language_id);
  //   fetch(Constant.getAPI() + "/category/get", {
  //     method: "post",
  //     headers: {
  //       "Content-Type": "application/x-www-form-urlencoded",
  //       Authorization: localStorage.getItem("q8_mall_auth"),

  //     },
  //     body: data
  //   }).then(function (response) {
  //     return response.json();
  //   }).then(function (json) {
  //     //console.log(json.data[0])
  //     if (json.status === true) {
  //       var category = []
  //       for (var i = 0; i < json.data.length; i++) {
  //         if (json.data[i].child !== null && json.data[i].child !== [] && json.data[i].child.length > 0) {
  //           for (var j = 0; j < json.data[i].child.length; j++) {
  //             category.push(json.data[i].child[j]);
  //           }
  //           // } else {
  //           //   category.push(json.data[i]);
  //         }
  //       }
  //       that.setState({ category_list: category });
  //       //console.log(category)
  //     } else {
  //       that.setState({ category_list: [] });
       
  //     }
  //   });
  // }
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
       
      }
    });
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  getAttributeList = () => {
    
    console.log("attribute")
    var that = this;
    var data = new URLSearchParams();
    fetch(Constant.getAPI() + "/attribute/get", {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: data
    }).then(function (response) {
      return response.json();
    }).then(function (json) {
      console.log(json.data)

      if (json.status === true) {
        that.setState({ attribute_list: json.data });
      } else {
        that.setState({ attribute_list: [] });
      
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
    //console.log(element.files);
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
   // data.append("LanguageId", that.props.language_id);
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
      //console.log(json.data)

      if (json.status === true) {
        var selected_attributes = []
        if (json.data[0].Attributes !== null && json.data[0].Attributes !== [] && json.data[0].Attributes.length > 0) {
          for (var i = 0; i < json.data[0].Attributes.length; i++) {
            selected_attributes.push(json.data[0].Attributes[i].id);
            $("#product_attributes_" + json.data[0].Attributes[i].id).prop("checked", true)
          }
        }
        if (json.data[0].productMedia !== null) {
          that.setState({
            attribute_type_data: json.data[0],
            product_name: json.data[0].name_en,
            product_name_ar: json.data[0].name_ar,

            priority: json.data[0].priority,
            description: json.data[0].description_en,
            description_ar: json.data[0].description_ar,

            refund_policy: json.data[0].refundPolicy_en,
            refund_policy_ar: json.data[0].refundPolicy_ar,
            Product_unique_id:json.data[0].unique_identifier,
            attribute_unit: json.data[0].unit,
            attribute_value: json.data[0].value,
            image: json.data[0].productMedia.url,
            MediaId: json.data[0].MediaId,
            selected_attributes: selected_attributes
          });
          if(json.data[0].Section !== null && json.data[0].Section !== undefined){
            that.setState({
              SectionId: json.data[0].Section.id,

            })
          }
          if(localStorage.getItem('q8_mall_ad_role') =='admin'){
            that.getCategoryListAdmin2(json.data[0].ShopId)
            //console.log(json.data[0].ShopId)
          }
        } else {
          that.setState({
            attribute_type_data: json.data[0],
            product_name: json.data[0].name_en,
            product_name_ar: json.data[0].name_ar,
            Product_unique_id:json.data[0].unique_identifier,

            priority: json.data[0].priority,
            description: json.data[0].description_en,
            description_ar: json.data[0].description_ar,
            refund_policy_ar: json.data[0].refundPolicy_ar,

            refund_policy: json.data[0].refundPolicy_en,
            attribute_unit: json.data[0].unit,
            attribute_value: json.data[0].value,
            MediaId: json.data[0].MediaId,
            selected_attributes: selected_attributes
          });
          if(json.data[0].Section !== null && json.data[0].Section !== undefined ){
            that.setState({
              SectionId: json.data[0].Section.id,

            })
          }
          if(localStorage.getItem('q8_mall_ad_role') =='admin'){
            that.getCategoryListAdmin2(json.data[0].ShopId)
            //console.log(json.data[0].ShopId)
          }
        }
      } else {
        that.setState({ attribute_type_data: {} });
    
      }
    });
  }
  onNext(){
    this.setState({
      activePage:"gallery"
    })
  }
  onSaveData = () => {
    var that = this;
    that.setState({ isSaving: true });
    if (that.state.accepted) {
      {that.uploadMedia()}

    
    } else {
      if (that.props.product_id !== undefined) {
        that.updateCategoryData(that.state.MediaId);
      } else {
        that.addCategory(that.state.MediaId);
        // that.saveGalleryMedia(that.state.media_id);

      }
    }
  }
  uploadGalleryMedia = () => {
    var that = this;
    var form = $('#productMedia')[0];
    var data = new FormData(form);
    fetch(Constant.getAPI() + "/media/add", {
      method: "post",
      body: data
    }).then(function (response) {
      return response.json();
    }).then(function (json) {
      if (json.status === true) {
        if(json.data !== undefined){
        that.saveGalleryMedia(json.data);}
      } else {
        that.setState({ gallery_media: [] });
        //console.log(json.error);
      }
    });
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
        //console.log(json.error);
      }
    });
  }
  updateCategoryData = (media_id) => {
    console.log(media_id)
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    if (that.state.SectionId === undefined || that.state.SectionId === null || that.state.SectionId === "" || that.state.SectionId === "0") {
      Swal.fire("Warning !", "Please Select Product Section First. !", "warning");
      that.setState({ isSaving: false });
      return false;
    }
    data.append("name_en", that.state.product_name);
    data.append("name_ar", that.state.product_name_ar);
    data.append("unique_identifier", that.state.Product_unique_id);

    data.append("priority", that.state.priority);
    data.append("description_en", that.state.description);
    data.append("description_ar", that.state.description_ar);

    data.append("refundPolicy_en", that.state.refund_policy);
    data.append("refundPolicy_ar", that.state.refund_policy_ar);

    data.append("LanguageId", that.props.language_id);
    data.append("MediaId", media_id);
    data.append("SectionId", that.state.SectionId);
    // data.append("ShopId", that.state.ShopId);
    data.append("ProductId", that.props.product_id);
    if(that.state.selected_attributes.length != 0)
    {data.append("AttributeIds", JSON.stringify(that.state.selected_attributes));}
    //console.log(that.state.selected_attributes)
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
    //console.log(this.state.selected_attributes)
    //console.log(this.setState.SectionId)
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    if (that.state.SectionId === undefined || that.state.SectionId === null || that.state.SectionId === "" || that.state.SectionId === "0") {
      Swal.fire("Warning !", "Please Select Product Section First. !", "warning");
      that.setState({ isSaving: false });
      return false;
    }
    data.append("name_en", that.state.product_name);
    data.append("name_ar", that.state.product_name_ar);

    data.append("priority", that.state.priority);
   // data.append("description", that.state.description);
    data.append("description_en", that.state.description);
    data.append("description_ar", that.state.description_ar);

    data.append("refundPolicy_en", that.state.refund_policy);
    data.append("refundPolicy_ar", that.state.refund_policy_ar);
    if(media_id !== undefined)
    {data.append("MediaId", media_id);}
    else
    {data.append("MediaId",[])}
    data.append("SectionId", that.state.SectionId);
    // data.append("ShopId", that.state.ShopId);
    data.append("LanguageId", that.props.language_id);
    data.append("unique_identifier", that.state.Product_unique_id);

    //data.append("AttributeIds", JSON.stringify(that.state.selected_attributes));
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
        console.log(json)

        //console.log(json.result.id)
        //Swal.fire("Added !", "Add Product Image", "success");
        const product_id =json.result.id
        that.setState({
          ProductId:product_id
        })
     
       if(that.state.galleryupload == true ){
        that.uploadGalleryMedia()

      }
      else{
        Swal.fire("Added !", "NOW ADD STOCK", "success");
        window.location.href = `#/products/stock/${json.result.id}/add`;

      }
        that.setState({ isSaving: false })
        

    } else {
      //console.log("addproduct")

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
    //console.log(id)
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
  ActivePage(v){
    console.log(v)
   this.setState({
     activePage:v
   })
  }
  render() {
    const style={height:"40px",opacity:"0.8",color:"black",fontWeight:"bold",borderRadius:"10px"}
    const style2={borderRadius:"18px",color:"black",fontSize:"15px",justifyContent:"center",background:"#f5c856",opacity:"0.8"}
    return (
     <div>
       <div className="row p-2 mb-1 " style={style2}>
        <b>Save Product Details & Gallery Before Adding Attributes!!</b>
       </div>
      <div className="row">
        <div className="col-2 p-2" style={{background:"#e6e6e6"}} >
          <button className="btn btn-primary form-control" style={style} 
             onClick={this.ActivePage.bind(this,"productDetails")} >
           Product Details
          </button><br/><br/>
          <button className="btn btn-primary form-control" style={style} 
             onClick={this.ActivePage.bind(this,"gallery")} >
           Gallery
          </button><br/><br/>
          <button className="btn btn-primary form-control" style={style} 
              onClick={this.ActivePage.bind(this,"attributes")} disabled={this.state.isDisabled} >
           Attributes
          </button>
         

        </div>
       
       { this.state.activePage == "productDetails"?
        <div className="col-9 card-body "style={{marginLeft:"15px"}} >
          <div className="row">
          <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Product Id</label>
                <div className="col-sm-9">
                <input
                    type="text"
                    className="form-control"
                    name="Product_unique_id"
                    id="Product_unique_id"
                    placeholder="Priduct Id"
                    onChange={this.handleChange}
                    value={this.state.Product_unique_id}
                  />

               </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label"></label>
               
                
                
              </div>
            </div>
            

            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Name (English)</label>
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
                <label className="col-sm-3 col-form-label">Name (Arabic)</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    name="product_name_ar"
                    id="product_name_ar"
                    placeholder="Name"
                    onChange={this.handleChange}
                    value={this.state.product_name_ar}
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
                  <select name="SectionId" className="form-control" value={this.state.SectionId} onChange={this.handleChange}>
                    <option value="0">Select Product Section</option>
                    {
                      this.state.category_list !== undefined && this.state.category_list !== null && this.state.category_list !== [] && this.state.category_list.length > 0
                        ?
                        this.state.category_list.map(category =>
                          <option key={category.id} value={category.id}>{category.name_en + " / " + category.name_ar}</option>
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

                      <input accept="image/*" onChange={this.handleImageUpload.bind(this)}
                       id="product_banner_image" type="file" className="form-control" autoComplete="off" name="media"
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
                <label className="col-sm-2 col-form-label">Description (English)</label>
                <div className="col-sm-10">
                  <ReactQuill
                    value={this.state.description}
                    onChange={this.onHandleDescriptionChange}
                    style={{ height: "140px", marginBottom: '5%' }}
                  />
                </div>
              </div>
             </div>
            </div>
            <div className="row">
            <div className="col-md-12">
              <div className="form-group row">
                <label className="col-sm-2 col-form-label">Refund Policy (English) </label>
                <div className="col-sm-10">
                  <ReactQuill
                    value={this.state.refund_policy}
                    onChange={this.onHandleRefundPolicyChange}
                    style={{ height: "140px", marginBottom: '5%' }}
                  />
                </div>
              </div>
            </div>
            </div>
           <div className="row">
            <div className="col-md-12">
              <div className="form-group row">
                <label className="col-sm-2 col-form-label">Description (Arabic)</label>
                <div className="col-sm-10">
                  <ReactQuill
                    value={this.state.description_ar }
                    onChange={this.onHandleDescriptionChangeAr}
                    style={{ height: "140px", marginBottom: '5%' }}
                  />
                </div>
              </div>
             </div>
             </div>
          
         
            <div className="row">
            <div className="col-md-12">
              <div className="form-group row">
                <label className="col-sm-2 col-form-label">Refund Policy (Arabic) </label>
                <div className="col-sm-10">
                  <ReactQuill
                    value={this.state.refund_policy_ar}
                    onChange={this.onHandleRefundPolicyChangeAr}
                    style={{ height: "140px", marginBottom: '5%' }}
                  />
                </div>
              </div>
            </div>
            </div>
            
             
          
          {/* <div className="row">
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
                              attributes.name_en !=="Default Attribute"?
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
                                      {  attributes.name_ar !== "" ?
                                      attributes.name_en + " / " + attributes.name_ar 
                                      :
                                      attributes.name_en
                                      }</span>
                                  </label>
                                </div>
                              </div>
                               :null

                          ))) : ""
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
          {/* {this.props.case === "add" ?<div>
          <div className="row">
            <div className="col-md-6">
              <div className="row">
                <div className="col-sm-3">
                  Media Gallery <br/><small>(size : 220 X 220)</small>
              </div>
                <div className="col-sm-9">
                  <form id="productMedia" name="productMedia" encType="multipart/form-data" className="text-capitalize">

                    <div className="form-group">

                      <input accept="image/*" onChange={this.handleGalleryImageUpload} id="gallery_media" type="file" className="form-control" autoComplete="off" name="media" multiple
                        data-toggle="tooltip" title="Click To Upload Media Image"
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-2">
              <div id="gallery_image_label" className="pt-2">
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
          </div>
          </div>:"" } */}
    
          
          <div className="card-footer">
            {this.props.product_id !==undefined  ?  
            <div className="row float-right p-3">

              <button onClick={this.onSaveData} className="btn btn-grd-disabled mr-2">
                  <i className="icofont icofont-save"></i> Save
              </button>
              <Link to={"/products"} className="btn btn-outline-dark">
                Cancel
             </Link>
            </div>
             :
             <div className="row float-right p-3">

             <button onClick={this.onNext.bind(this)} className="btn btn-grd-disabled mr-2">
                Next
             </button>
            
           </div>
             
             }

          </div>


        </div >
        :null}
        {
          this.state.activePage == "gallery"?
          <div className="col-9 card-body "style={{marginLeft:"15px"}} >
          
           
          
      {this.props.case === "add" ?
        <div>
          <div className="row">
            <div className="col-md-6">
              <div className="row">
                <div className="col-sm-3">
                  Media Gallery <br/><small>(size : 220 X 220)</small>
              </div>
                <div className="col-sm-9">
                  <form id="productMedia" name="productMedia" encType="multipart/form-data" className="text-capitalize">

                    <div className="form-group">

                      <input accept="image/*" onChange={this.handleGalleryImageUpload} id="gallery_media" type="file" className="form-control" autoComplete="off" name="media" multiple
                        data-toggle="tooltip" title="Click To Upload Media Image"
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-2">
              <div id="gallery_image_label" className="pt-2">
                {
                  this.state.image
                    ?
                    this.state.image !== null || this.state.image !== undefined || this.state.image !== {}
                      ?
                      <div className="col">
                      <img src={this.state.image} alt="" className="img-100" onError={e => { e.target.src = "" }} />
                      &nbsp;
                      </div>
                      :
                      ''
                    :
                    ''
                 }
                  </div>
                </div>
              </div>
              <div className="row float-right p-3">
 
                     <button onClick={this.onSaveData} className="btn btn-grd-disabled mr-2">
                        <i className="icofont icofont-save"></i> Save
                     </button>
                     <Link to={"/products"} className="btn btn-outline-dark">
                         Cancel
                     </Link>
              </div>

            </div>:"" }

        
             </div>
          :null
        }
      </div ></div>
    );
  }
}

export default ProductAdd;
