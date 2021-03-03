import React from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import $ from "jquery";
import Constant from "../../Constant";
import ReactQuill from "react-quill";

class ProductPriceAdd extends React.Component {
  state = {
    status: true,
    description: "",
    selected_attributes: []
  };
  onHandleDescriptionChange = value => {
    this.setState({ description: value });
  };
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.stock_id !== this.props.stock_id) {
      this.setState({ stock_id: this.props.stock_id });
      this.getProductPriceDetails();
    }
    if (prevProps.language_id !== this.props.language_id) {
      if (this.props.stock_id !== undefined) {
        // this.setState({ stock_id: this.props.stock_id });
        this.getProductPriceDetails();
      }
    }
  }
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
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
  getProductPriceDetails = () => {
    var that = this;
    var data = new URLSearchParams();
    data.append("StockId", this.props.stock_id);
    data.append("PriceId", this.props.price_id);
    fetch(Constant.getAPI() + "/product/stock/price/get", {
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
        for (var i = 0; i < json.data.length; i++) {
          if (that.props.price_id === json.data[i].id) {
            that.setState({
              attribute_type_data: json.data[i],
              value: json.data[i].value,
              specialPrice: json.data[i].specialPrice,
              CurrencyId: json.data[i].CurrencyId,
            });
          }
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
    if (that.props.price_id !== undefined) {
      that.updateProductPriceData();
    } else {
      that.addProductPrice();
    }
  }
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
  addProductPrice = () => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    data.append("value", that.state.value);
    data.append("specialPrice", that.state.specialPrice);
    data.append("LanguageId", that.props.language_id);
    data.append("CurrencyId", that.state.CurrencyId);
    // if(that.props.stock_id)
    // { //console.log("props")
      data.append("StockId", that.props.stock_id);
     
    // }
    // else
    // { //console.log("param")
    //   data.append("StockId", that.props.match.params.stock_id);
    //  }
      //console.log(that.state.value, that.state.specialPrice, 
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
        Swal.fire("Added !", "Product Price has been Added", "success");
        //console.log(json)
        //if(that.props.status="add"){
       // window.location.href = `#/products`
      //}
        // else
        // {window.location.href = `#/products/price/${that.props.stock_id}/${that.props.product_id}`}
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
  render() {
    return (
      <div className="">
        <div className="card-body">
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
              <Link to={"/products/price/" + this.props.stock_id + "/" + this.props.product_id} className="btn btn-outline-dark">
                Cancel
        </Link>
            </div>
          </div>
        </div >
      </div >
    );
  }
}

export default ProductPriceAdd;
