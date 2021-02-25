import React from 'react';
import "react-responsive-modal/styles.css";
import { Modal } from 'react-responsive-modal';
import Constant from "../../Constant.js";
import Swal from "sweetalert2";
import $ from "jquery";

class CouponWiseShopModal extends React.Component {
  state = {
    selected_shops: []
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.isOpen !== prevProps.isOpen && this.props.isOpen !== false) {
      this.getShopList();
    }
  }
  getShopList = () => {
    var that = this;
    var data = new URLSearchParams();
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
        that.setState({ shop_list: json.data });
        that.getCouponsShops();
      } else {
        that.setState({ shop_list: [] });
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
  getCouponsShops = () => {
    var that = this;
    var data = new URLSearchParams();
    data.append("CouponId", that.props.coupon_id);
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
        var selected_shop = []
        for (var i = 0; i < json.data.length; i++) {
          $('#offer_tyre_collection_' + json.data[i].id).prop("checked", true);
          selected_shop.push(json.data[i].id);
        }
        that.setState({ coupon_shop_list: json.data, selected_shops: selected_shop });
      } else {
        that.setState({ coupon_shop_list: [] });
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
  removeShopFromCoupon = (shop_id) => {

    console.log(shop_id);
    // return false;
    var that = this;
    var data = new URLSearchParams();
    data.append("ShopId", shop_id);
    data.append("CouponId", that.props.coupon_id);
    fetch(Constant.getAPI() + "/coupon/shop/delete", {
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
        // Swal.fire("Saved!", "Shops Added to the Coupon.!", "success");
        // that.props.onCloseModal();
        that.getCouponsShops();
      } else {
        // that.setState({ shop_list: [] });
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
  onAddShopToCoupon = () => {
    var that = this;
    var data = new URLSearchParams();
    data.append("ShopId", that.state.selected_shops);
    data.append("CouponId", that.props.coupon_id);
    fetch(Constant.getAPI() + "/coupon/shop/add", {
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
        Swal.fire("Saved!", "Shops Added to the Coupon.!", "success");
        that.props.onCloseModal();
      } else {
        // that.setState({ shop_list: [] });
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
  changeShopSelection = (event) => {
    var id = event.target.value;

    let arr = this.state.selected_shops;
    var index = -1;
    arr.find(function (value, i) {
      if (value === id) {
        index = i;
      }
    }.bind(this))
    if (index !== -1) {
      arr.splice(index, 1);
      // console.log("value : ", id);
      this.removeShopFromCoupon(id)
      this.setState({ selected_shops: arr });
    } else {
      // obj = id;
      arr.push(id);
      this.setState({ selected_shops: arr });
    }
  }
  render() {
    return (
      <Modal open={this.props.isOpen} onClose={this.props.onCloseModal} center classNames={{ modal: 'customModal', overlay: 'customOverlay' }}>
        <div className="card-header">
          <h4>Select Shops to Apply Coupons</h4>
        </div>
        <div className="card-block">
          <div className="row">
            {
              this.state.shop_list !== undefined &&
                this.state.shop_list !== null &&
                this.state.shop_list !== [] &&
                this.state.shop_list.length > 0 ? (
                  this.state.shop_list.map((tyre_collection, i) =>
                    <div className=" col-sm-4">
                      <div className="checkbox-fade fade-in-primary">
                        <label>
                          <input type="checkbox" id={"offer_tyre_collection_" + tyre_collection.id} value={tyre_collection.id} onChange={this.changeShopSelection} />
                          <span className="cr">
                            <i className="cr-icon icofont icofont-ui-check txt-primary"></i>
                          </span>
                          <span>{tyre_collection.name}</span>
                        </label>
                      </div>
                    </div>
                  )) : ""
            }
          </div>
        </div>
        <div className="card-footer">
          <button className="btn btn-sm btn-inverse waves-effect waves-light f-right d-inline-block md-trigger" onClick={this.onAddShopToCoupon}> <i className="icofont icofont-save m-r-5"></i> Save </button>
        </div>
      </Modal>
    );
  }
}

export default CouponWiseShopModal;