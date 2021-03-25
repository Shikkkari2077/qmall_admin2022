import React from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import $ from "jquery";
import Constant from "../../Constant";
import ReactQuill from "react-quill";
// import { ContactsOutlined } from "@material-ui/icons";

class ProductWiseStockAdd extends React.Component {
  state = {
    status: true,
    description: "",
    selected_attributes: []
  };
  onHandleDescriptionChange = value => {
    this.setState({ description: value });
  };
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.product_id !== this.props.product_id) {
      this.setState({ product_id: this.props.product_id });
      this.getProductDetails();
    }
    if (prevProps.product_id !== this.props.product_id || prevProps.stock_id !== this.props.stock_id) {
      this.setState({ product_id: this.props.product_id });
      this.getProductWiseStockList();
    }
    if (prevProps.language_id !== this.props.language_id) {
      if (this.props.product_id !== undefined) {
        // this.setState({ product_id: this.props.product_id });
        this.getProductDetails();
      }
      if (this.props.stock_id !== undefined) {
        // this.setState({ product_id: this.props.product_id });
        this.getProductWiseStockList();
      }
    }
  }
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleImageUpload = (event) => {
    document.getElementById('banner_image_label').innerHTML = "";
    let element = $("#product_stock_media").get(0);
    // $("#id_image_section").empty();
    this.setState({ accepted: element });
    var proof_img = [];
    let obj = {};
    //console.logog(element.files);
    this.setState({ product_stock_media: element.files });
    for (var i = 0; i < element.files.length; i++) {
      var file1 = element.files[i];
      var img = document.createElement("img");
      img.className = "img-100 img-preview";
      var filePath = URL.createObjectURL(file1);
      img.src = filePath;
      $("#banner_image_label").append(img);
    }
  }
  getProductWiseStockList = () => {
    var that = this;
    var data = new URLSearchParams();
    // this.setState({ isSaving: true });
    // if (localStorage.getItem('q8_mall_ad_role') === "shop") {
    //   data.append("ShopId", localStorage.getItem('q8_mall_ad_uid'));
    // }
    data.append("ProductId", that.props.product_id);
    // data.append("StockId", that.props.stock_id);
    fetch(Constant.getAPI() + "/product/stock/get", {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": localStorage.getItem('q8_mall_auth')
      },
      body: data
    }).then(function (response) {
      return response.json();
    }).then(function (json) {
      console.log(json.data)
      if (json.status === true) {
        for (var i = 0; i < json.data.length; i++) {
          if (json.data[i].id === that.props.stock_id) {
            var attributes = []
            for (var j = 0; j < json.data[i].AttributeValues.length; j++) {
              attributes.push(json.data[i].AttributeValues[j].id)
              //console.logog("Selected Attributes : ", attributes)
              $("#product_attributes_value_" + json.data[i].AttributeValues[j].id).prop("checked", true)
            }
            that.setState({
              product_stock_list: json.data[i],
              count: json.data[i].count,
              selected_attributes: attributes,
              isSaving: false,
              barNumber:json.data[i].barNumber,
              value:json.data[i].Prices[0].value,
              specialPrice:json.data[i].Prices[0].specialPrice,
              CurrencyId:json.data[i].Prices[0].CurrencyId,
              
            });

          }
        }
      } else {
        that.setState({ product_stock_list: [], isSaving: false });
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
  getProductDetails = () => {
    var that = this;
    var data = new URLSearchParams();
    data.append("ProductId", this.props.product_id);
    //console.logog(this.props.product_id)
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
      console.log(json.data)
      if (json.status === true && json.data[0].productMedia!== undefined) {
        var attribute_list = []
        // if (json.data[0].Attributes !== null && json.data[0].Attributes !== [] && json.data[0].Attributes.length > 0) {
        //   for (var i = 0; i < json.data[0].Attributes.length; i++) {
        //     for (var j = 0; j < json.data[0].Attributes[i].AttributeValues.length; j++) {
        //       attribute_list.push(json.data[0].Attributes[i].AttributeValues[j]);
        //     }
        //   }
        // }
         //console.logog(json.data[0].Attributes)
        if (json.data[0].productMedia !== null) {
          that.setState({
            attribute_type_data: json.data[0],
            product_name: json.data[0].name,
            attribute_unit: json.data[0].unit,
            attribute_value: json.data[0].value,
            CategoryId: json.data[0].CategoryId,
            attribute_list: json.data[0].Attributes,
          });
        } else {
          that.setState({
            attribute_type_data: json.data[0],
            product_name: json.data[0].name,
            attribute_unit: json.data[0].unit,
            attribute_value: json.data[0].value,
            CategoryId: json.data[0].CategoryId,
            attribute_list: json.data[0].Attributes
          });
        }
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
    if (that.state.accepted) {
      that.uploadMedia();
    } else {
      if (that.props.stock_id !== undefined) {
        that.updateProductWiseStockData(that.state.MediaId);
      } else {
        that.addProductWiseStockData(that.state.MediaId);
      }
    }
  }
  uploadMedia = () => {
    var that = this;
    var form = $('#productStockMedia')[0];
    var data = new FormData(form);
    // data.append('upload_for', 'user');
    fetch(Constant.getAPI() + "/media/add", {
      method: "post",
      body: data
    }).then(function (response) {
      return response.json();
    }).then(function (json) {
      if (json.status === true) {
        that.addProductWiseStockData(json.data);
      } else {
        // that.setState({ category_data: [] });
        //console.logog(json.error);
      }
    });
  }
  updateProductWiseStockData = (media_id) => {
    var that = this;
    var media_data = [];
    if (media_id !== undefined && media_id !== null && media_id !== [] && media_id.length > 0) {
      for (var media = 0; media < media_id.length; media++) {
        media_data.push(media_id[media].id);
      }
    }
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    data.append("count", that.state.count);
    data.append("LanguageId", that.props.language_id);
    data.append("barNumber", that.state.barNumber);
    data.append("deliveryOptions", that.state.product_stock_list.deliveryOptions);
    data.append("ProductId", that.props.product_id);
    data.append("StockId", that.props.stock_id);
    data.append("AttributeValueIds", JSON.stringify(that.state.selected_attributes));
    //console.log(that.state.product_stock_list.barNumber)
    fetch(Constant.getAPI() + "/product/stock/update", {
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
        window.location.href = `#/products/stock/${that.props.product_id}`
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
  // componentWillMount() {
  //   this.getCountryList();
  //   this.loadScript(process.env.PUBLIC_URL + "/assets/pages/filer/jquery.fileuploads.init.js");
  // }
  addProductWiseStockData = (media_id) => {
    var that = this;
    //console.logog(media_id)
    var media_data = [];
    if (media_id !== undefined && media_id !== null && media_id !== [] && media_id.length > 0) {
      for (var media = 0; media < media_id.length; media++) {
        media_data.push(media_id[media].id);
      }
    }
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    data.append("count", that.state.count);
    data.append("LanguageId", that.props.language_id);
    data.append("MediaIds", JSON.stringify(media_data));
    data.append("deliveryOptions", that.state.deliveryOptions);
    // //console.logog(localStorage.getItem('q8_mall_auth'))
    //console.logog(that.state.selected_attributes)
     ////console.logog(that.state.deliveryOptions)
    ////console.logog(JSON.stringify(media_data))
    //data.append("ProductId", that.props.product_id);
    // if (this.props.product_id !== undefined) {
      data.append("ProductId", that.props.product_id);
      data.append("barNumber", that.state.barNumber);

       //console.logog(this.props.product_id)
    // } else {
    //   data.append("ProductId", that.props.match.params.product_id);
    //   //console.logog(that.props.match.params.product_id)
    // }
   
    data.append("AttributeValueIds",JSON.stringify(that.state.selected_attributes));
    //console.logog(that.state.selected_attributes)
    fetch(Constant.getAPI() + "/product/stock/add", {
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
        //Swal.fire("Added !", "Product Stock has been added", "success");
        //console.logog(json)
        //window.location.href = `#/products/stock/${that.props.product_id}`
        //window.location.href = `#/products/price/${json.data.id}/${json.data.ProductId}/add`
        that.addProductPrice(json.data.id,json.data.ProductId)
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
    this.getCountryList();
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
  getCountryList = () => {
    var that = this;
    var data = new URLSearchParams();
    fetch(Constant.getAPI() + "/country/getActive", {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: data
    }).then(function (response) {
      return response.json();
    }).then(function (json) {
      if (json.status === true) {
        that.setState({ country_list: json.data });
      } else {
        that.setState({ country_list: [] });
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
  addProductPrice = (id,pid) => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    data.append("value", that.state.value);
    data.append("specialPrice", that.state.specialPrice);
    data.append("LanguageId", that.props.language_id);
    data.append("CurrencyId", that.state.CurrencyId);
    data.append("barNumber", that.state.barNumber);

    // if(that.props.stock_id)
    // { //console.logog("props")
      data.append("StockId",id);
     
    // }
    // else
    // { //console.logog("param")
    //   data.append("StockId", that.props.match.params.stock_id);
    //  }
      //console.logog(that.state.value, that.state.specialPrice, 
        //that.props.language_id,that.state.CurrencyId,that.props.stock_id)
      //data.append("StockId", that.props.stock_id);
    fetch(Constant.getAPI() + "/product/stock/price/add", {
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
        Swal.fire("Added !", "Product Stock and  Price has been Added", "success");
        //console.logog(json)
        //if(that.props.status="add"){
       // window.location.href = `#/products`
      //}
        // else
        // {window.location.href = `#/products/price/${that.props.stock_id}/${that.props.product_id}`}
        // window.location.href = `#/products/add/${pid}`
        //console.logog(pid)
        //console.logog(json.data)
         window.location.href = `#/products/stock/${pid}`

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
  updateProductPriceData = () => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    data.append("value", that.state.value);
    data.append("LanguageId", that.props.language_id);
    data.append("CurrencyId", that.state.CurrencyId);
    data.append("specialPrice", that.state.specialPrice);
    data.append("PriceId", that.props.price_id);
    fetch(Constant.getAPI() + "/product/stock/price/update", {
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
        Swal.fire("Updated !", "Product Price has been Updated", "success");
        window.location.href = `#/products/price/${that.props.stock_id}/${that.props.product_id}`
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
  render() {
    return (
      <div className="">
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Stock</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    name="count"
                    id="count"
                    placeholder="Stock"
                    onChange={this.handleChange}
                    value={this.state.count}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Barcode</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    name="barNumber"
                    id="barNumber"
                    placeholder="Enter Barcode"
                    onChange={this.handleChange}
                    value={this.state.barNumber}
                  />
                </div>
              </div>
            </div>
            {/* <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Delivery Options</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    name="deliveryOptions"
                    id="deliveryOptions"
                    placeholder="Delivery Options"
                    onChange={this.handleChange}
                    value={this.state.deliveryOptions}
                  />
                </div>
              </div>
            </div> */}

            {/* <div className="col-md-6">
              <div className="row">
                <div className="col-sm-3">
                  Product Media
                </div>
                <div className="col-sm-9">
                  <form id="productStockMedia" name="productStockMedia" encType="multipart/form-data" className="text-capitalize">

                    <div className="form-group">
                      <input accept="image/*" onChange={this.handleImageUpload} id="product_stock_media" type="file" className="form-control" autoComplete="off" name="media" multiple
                        data-toggle="tooltip" title="Click To Upload Stock Media"
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
                      <img src={this.state.image} alt="" className="img-100 img-preview" onError={e => { e.target.src = "" }} />
                      :
                      ''
                    :
                    ''
                }
              </div>
              </div> */}
          </div>


          <div className="row">
            <div className="col-md-12">
              <div className="form-group row">
                <label className="col-sm-2 col-form-label">Attributes</label>
                <div className="col-sm-10">
                  <div className="p-20 z-depth-right-1 waves-effect " data-toggle="tooltip" data-placement="top" title="" data-original-title="Service List">
                    {/* <div className="row"> */}
                    {
                      this.state.attribute_list !== undefined && this.state.attribute_list !== null && this.state.attribute_list !== [] && this.state.attribute_list.length > 0
                        ?
                        this.state.attribute_list.map(attributes =>
                          <div className="row" key={attributes.id}>
                            <div className="col-sm-3">
                              <label>{attributes.name}</label>
                            </div>
                            {attributes.AttributeValues.map(attribute_val =>
                                attribute_val.name !=="Default Attribute Value" ?
                              <div className=" col-sm-3" key={attribute_val.id}>
                                <div className="checkbox-fade fade-in-primary">
                                  <label>
                                    <input type="checkbox" id={"product_attributes_value_" + attribute_val.id} value={attribute_val.id} onChange={this.changeAttributesSelection} />
                                    <span className="cr">
                                      <i className="cr-icon icofont icofont-ui-check txt-primary"></i>
                                    </span>
                                    <span>{attribute_val.name}</span>
                                  </label>
                                </div>
                              </div>
                              :null
                            )}
                          </div>
                        )
                        : ""
                    }
                    {/* </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Price</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    name="value"
                    id="value"
                    placeholder="Price"
                    onChange={this.handleChange}
                    value={this.state.value}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Special Price</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    name="specialPrice"
                    id="specialPrice"
                    placeholder="Special Price"
                    onChange={this.handleChange}
                    value={this.state.specialPrice}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Country ( Currancy )</label>
                <div className="col-sm-9">
                  <select name="CurrencyId" className="form-control" value={this.state.CurrencyId} onChange={this.handleChange}>
                    <option value="0">Select Country</option>
                    {
                      this.state.country_list !== undefined && this.state.country_list !== null && this.state.country_list !== [] && this.state.country_list.length > 0
                        ?
                        this.state.country_list.map(currency =>
                          <option key={currency.id} value={currency.currency}>{currency.name} - ({currency.currency})</option>
                        )
                        :
                        null
                    }
                  </select>
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
              <Link to={"/products/stock/" + this.props.product_id} className="btn btn-outline-dark">Cancel</Link>
            </div>
          </div>
        </div >
      </div >
    );
  }
}

export default ProductWiseStockAdd;
