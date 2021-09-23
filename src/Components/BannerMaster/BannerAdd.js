import React from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import $ from "jquery";
import Constant from "../../Constant";
import Loader from "../../Loader";
import Select from 'react-select'
class BannerAdd extends React.Component {
  state = {
    status: true
  };
  componentDidUpdate(prevProps, prevState) {
    if (this.props.language_id !== undefined) {
      if (prevProps.banner_id !== this.props.banner_id) {
        this.setState({ banner_id: this.props.banner_id });
        this.getBannerDetails();
      }
      if (prevProps.language_id !== this.props.language_id) {
        if (this.props.banner_id !== undefined) {
          // this.setState({ banner_id: this.props.banner_id });
          this.getBannerDetails();
        }
        this.getProductList();
        this.getShopList();
      }
      if (prevState.ShopId !== this.state.ShopId) {
        this.getProductList();
      }
    }
  }
  handleChange = event => {
   
    this.setState({ [event.target.name]: event.target.value });
  };
  handleChangeProduct = event=>{
    console.log(event)
    if( parseInt(this.state.type) === 2){
      this.setState({
        ProductId:event.id
      })
    }
    
  }
  getBannerDetails = () => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isLoading: true });
    data.append("BannerId", that.props.banner_id);
    data.append("LanguageId", that.props.language_id);
    fetch(Constant.getAPI() + "/banner/get", {
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
        var end_date = new Date(json.data[0].end_date);
        var year, month, day;
        year = end_date.getFullYear();
        if (end_date.getMonth() > 8) {
          month = end_date.getMonth() + 1;
        } else {
          month = "0" + (end_date.getMonth() + 1);
        }
        if (end_date.getDate() > 9) {
          day = end_date.getDate();
        } else {
          day = "0" + (end_date.getDate());
        }
        var banner_end_date = year + "-" + month + "-" + day;
        var start_date = new Date(json.data[0].start_date);
        var year, month, day;
        year = start_date.getFullYear();
        if (start_date.getMonth() > 8) {
          month = start_date.getMonth() + 1;
        } else {
          month = "0" + (start_date.getMonth() + 1);
        }
        if (start_date.getDate() > 9) {
          day = start_date.getDate();
        } else {
          day = "0" + (start_date.getDate());
        }
        var banner_start_date = year + "-" + month + "-" + day;
        that.setState({
          banner_data: json.data[0],
          priority: json.data[0].priority,
          bannerId: json.data[0].id,
          url: json.data[0].url,
          ProductId: json.data[0].ProductId,
          ShopId: json.data[0].ShopId,
          type: json.data[0].type,
          end_date: banner_end_date,
          start_date: banner_start_date,
          isLoading: false
        })
        if (json.data[0].Medium !== null) {
          that.setState({
            image: json.data[0].Medium.url,
            MediaId: json.data[0].MediumId
          })
        }
      } else {
        that.setState({ isLoading: false });
        Swal.fire({
          title: "Something went wrong. Try again after some Time.!",
          icon: 'error',
          text: "",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Ok"
        });
      }
    });
  }
  onSaveData = () => {
    var that = this;
    that.setState({ isSaving: true });
    if (that.state.accepted) {
      that.uploadMedia();
    } else if ((that.state.MediaId === undefined || that.state.MediaId === null || that.state.MediaId === "") && (that.state.image === undefined || that.state.image === null || that.state.image === "")) {
      Swal.fire("Error", "Select Banner Image First..! ", "warning");
      that.setState({ isSaving: false });
      return false;
    } else {
      if (that.props.banner_id !== undefined) {
        that.updateBannerData(that.state.MediaId);
      } else {
        that.addBanner(that.state.MediaId);
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
        if (that.props.banner_id !== undefined) {
          that.updateBannerData(json.data[0].id);
        } else {
          that.addBanner(json.data[0].id);
        }
      } else {
        // that.setState({ banner_data: [] });
        //console.log(json.error);
      }
    });
  }
  updateBannerData = (media_id) => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });

    data.append("priority", that.state.priority);
    data.append("end_date", that.state.end_date);
    data.append("start_date", that.state.start_date);
    // data.append("date", that.state.date);
    if (that.state.url !== undefined && that.state.url !== null && that.state.url !== "undefined" && that.state.url !== "null") {
      data.append("url", that.state.url);
    }
    if (that.state.ShopId !== undefined && that.state.ShopId !== null && that.state.ShopId !== "undefined" && that.state.ShopId !== "null") {
      data.append("ShopId", that.state.ShopId);
    }
    if (that.state.ProductId !== undefined && that.state.ProductId !== null && that.state.ProductId !== "undefined" && that.state.ProductId !== "null") {
      data.append("ProductId", that.state.ProductId);
    }
    data.append("LanguageId", that.props.language_id);
    data.append("MediaId", media_id);
    data.append("BannerId", that.props.banner_id);
    fetch(Constant.getAPI() + "/banner/update", {
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
        Swal.fire("Updated !", "banner has been Updated", "success");
        window.location.href = "#/banner"
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
  addBanner = (media_id) => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    data.append("priority", that.state.priority);
    // data.append("date", that.state.date);
    data.append("end_date", that.state.end_date);
    data.append("start_date", that.state.start_date);
    if (that.state.url !== undefined && that.state.url !== null && that.state.url !== "undefined" && that.state.url !== "null") {
      data.append("url", that.state.url);
    }
    if (that.state.ShopId !== undefined && that.state.ShopId !== null && that.state.ShopId !== "undefined" && that.state.ShopId !== "null") {
      data.append("ShopId", that.state.ShopId);
    }
    if (that.state.ProductId !== undefined && that.state.ProductId !== null && that.state.ProductId !== "undefined" && that.state.ProductId !== "null") {
      data.append("ProductId", that.state.ProductId);
    }
    data.append("LanguageId", that.props.language_id);
    data.append("MediaId", media_id);
    fetch(Constant.getAPI() + "/banner/add", {
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
        Swal.fire("Added !", "banner has been Added", "success");
        window.location.href = "#/banner"
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
    document.getElementById('banner_image_label').innerHTML = "";
    let element = $("#banner_image").get(0);
    // $("#id_image_section").empty();
    this.setState({ accepted: element });
    var proof_img = [];
    let obj = {};
    //console.log(element.files);
    this.setState({ banner_image: element.files });
    for (var i = 0; i < element.files.length; i++) {
      var file1 = element.files[i];
      var img = document.createElement("img");
      img.className = "img-100";
      var filePath = URL.createObjectURL(file1);
      img.src = filePath;
      $("#banner_image_label").append(img);
    }
  }
  componentWillMount() {
    this.loadScript(process.env.PUBLIC_URL + "/assets/pages/filer/jquery.fileuploads.init.js");
    // this.getShopList();
    // this.getProductList();
  }
  loadScript(src) {
    let script = document.createElement("script");
    script.src = src;
    script.type = "text/javascript";
    document.head.append(script);
  }
  getShopList = () => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    data.append("LanguageId", that.props.language_id);
    fetch(Constant.getAPI() + "/shop/get", {
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
        that.setState({ Shop_list: json.data, isSaving: false });
      } else {
        that.setState({ Shop_list: [], isSaving: false });
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
  }
  getProductList = () => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    if (that.state.ShopId !== undefined && that.state.ShopId !== null && that.state.ShopId !== "") {
      data.append("ShopId", that.state.ShopId);
    }
    data.append("LanguageId", that.props.language_id);
    fetch(Constant.getAPI() + "/product/getByAdmin", {
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
        var product_list = []
        for (var i = 0; i < json.data.length; i++) {
          if (json.data[i].status === true) {
            product_list.push(json.data[i]);
          }
        }
        that.setState({ product_list: product_list, isSaving: false });
      } else {
        that.setState({ product_list: [], isSaving: false });
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
  render() {

    const customStyles = {
      option: (provided, state) => ({
        ...provided,
        borderBottom: "1px dotted grey",
        color: state.isSelected ? "red" : "black",
        padding: 8,
      }),
      input: (provided) => ({
        ...provided,
        display: "flex",
        height: "30px",
      }),
    };

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
                    <label className="col-sm-3 col-form-label">Banner Priority</label>
                    <div className="col-sm-9">
                      <input
                        type="text"
                        className="form-control"
                        name="priority"
                        id="priority"
                        placeholder="Banner Priority"
                        onChange={this.handleChange}
                        value={this.state.priority}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label">Banner Start Date</label>
                    <div className="col-sm-9">
                      <input
                        type="date"
                        className="form-control"
                        name="start_date"
                        id="start_date"
                        placeholder="Banner Start Date"
                        onChange={this.handleChange}
                        value={this.state.start_date}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label">Banner End Date</label>
                    <div className="col-sm-9">
                      <input
                        type="date"
                        className="form-control"
                        name="end_date"
                        id="end_date"
                        placeholder="Banner End Date"
                        onChange={this.handleChange}
                        value={this.state.end_date}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label">Banner Type</label>
                    <div className="col-sm-9">
                      <select name="type" className="form-control" value={this.state.type} onChange={this.handleChange}>
                        <option value="">Select Banner Type</option>
                        <option value="1">URL</option>
                        <option value="2" >Product Wise</option>
                        <option value="3" >Shop Wise</option>
                      </select>
                    </div>
                  </div>
                </div>
                {
                  parseInt(this.state.type) === 3
                    ?
                    <div className="col-md-6">
                      <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Shop</label>
                        <div className="col-sm-9">
                          <select name="ShopId" className="form-control" value={this.state.ShopId} onChange={this.handleChange}>
                            <option value="">Select Shop</option>
                            {
                              this.state.Shop_list !== undefined && this.state.Shop_list !== null && this.state.Shop_list !== [] && this.state.Shop_list.length > 0
                                ?
                                this.state.Shop_list.map(shops =>
                                  <option value={shops.id}>{shops.name_en +"/"+shops.name_ar}</option>
                                )
                                :
                                null
                            }
                          </select>
                        </div>
                      </div>
                    </div>
                    :
                    parseInt(this.state.type) === 2
                      ?
                      <div className="col-md-6">
                        <div className="form-group row">
                          <label className="col-sm-3 col-form-label">Product</label>
                          <div className="col-sm-9">
                            {/* <select 
                            name="ProductId" 
                            className="form-control" 
                            value={this.state.ProductId} onChange={this.handleChange}>
                              <option value="">Select Product</option>
                              {
                                this.state.product_list !== undefined && this.state.product_list !== null && this.state.product_list !== [] && this.state.product_list.length > 0
                                  ?
                                  this.state.product_list.map(product =>
                                    
                                    
                                    <option value={product.id}>{product.name_en}</option>
                                  )
                                  :
                                  null
                              }
                            </select> */}
                            <Select
                            name="ProductId"
                            styles={customStyles}
                            
                            //value={}
                            getOptionLabel={(option) => `${option.name_en}`}
                            getOptionValue={(option) => `${option.id}`}
                            onChange={this.handleChangeProduct}
                            options={this.state.product_list}
                      
                    />
                          </div>
                        </div>
                      </div>
                      :
                      parseInt(this.state.type) === 1
                        ?
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label className="col-sm-3 col-form-label">Banner URL</label>
                            <div className="col-sm-9">
                              <input
                                type="url"
                                className="form-control"
                                name="url"
                                id="url"
                                placeholder="Banner URL"
                                onChange={this.handleChange}
                                value={this.state.url}
                              />
                            </div>
                          </div>
                        </div>
                        :
                        null
                }

                <div className="col-md-6">
                  <div className="row">
                    <div className="col-sm-3">
                      Display Image<br/><small>(size: 640 X 340) </small>
                </div>
                    <div className="col-sm-9">
                      <form id="bannerImage" name="bannerImage" encType="multipart/form-data" className="text-capitalize">

                        <div className="form-group">

                          {/* <input onChange={this.handleChange} id="shop_Image" type="text" className="form-control" name="image" /> */}
                          <input accept="image/*" onChange={this.handleImageUpload} id="banner_image" type="file" className="form-control" autoComplete="off" name="media"
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
                  {
                    this.state.isSaving
                      ?
                      <button className="btn btn-grd-disabled mr-2" disabled>Saving...!</button>
                      :
                      <button onClick={this.onSaveData} className="btn btn-grd-disabled mr-2"><i className="icofont icofont-save"></i> Save</button>
                  }
                  <Link to={"/banner"} className="btn btn-outline-dark">
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

export default BannerAdd;
