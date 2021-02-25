import React from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import $ from "jquery";
import Constant from "../../Constant";
import ReactQuill from "react-quill";

class ShopDeliveryChargeAdd extends React.Component {
  state = {
    status: true,
    description: ""
  };
  onHandleDescriptionChange = value => {
    this.setState({ description: value });
  };
  componentDidUpdate(prevProps) {
    if (prevProps.delivery_charge_id !== this.props.delivery_charge_id) {
      this.setState({ delivery_charge_id: this.props.delivery_charge_id });
      this.getAttributeTypeDetails();
    }
    if (prevProps.language_id !== this.props.language_id) {
      if (this.props.delivery_charge_id !== undefined) {
        // this.setState({ delivery_charge_id: this.props.delivery_charge_id });
        this.getAttributeTypeDetails();
      }
    }
  }
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  getAttributeList = () => {
    var that = this;
    var data = new URLSearchParams();
    fetch(Constant.getAPI() + "/delivery/type/get", {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: data
    }).then(function (response) {
      return response.json();
    }).then(function (json) {
      if (json.status === true) {
        that.setState({ delivery_type_list: json.data });
      } else {
        that.setState({ delivery_type_list: [] });
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
  getAttributeTypeDetails = () => {
    var that = this;
    var data = new URLSearchParams();
    data.append("DeliveryId", this.props.delivery_charge_id);
    fetch(Constant.getAPI() + "/delivery/get", {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: data
    }).then(function (response) {
      return response.json();
    }).then(function (json) {
      if (json.status === true) {
        that.setState({
          delivery_charge_details: json.data[0],
          name: json.data[0].name,
          price: json.data[0].price,
          DeliveryTypeId: json.data[0].DeliveryTypeId
        });
      } else {
        that.setState({ delivery_charge_details: {} });
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
    // if (that.state.accepted) {
    //   that.uploadMedia();
    // } else {
    //   that.editUser(that.state.media_id);
    // }
    if (that.props.delivery_charge_id !== undefined) {
      that.updateDeliveryChargeDetails();
    } else {
      that.addShopDeliveryCharge();
    }
  }
  updateDeliveryChargeDetails = () => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    data.append("name", that.state.name);
    data.append("DeliveryId", that.props.delivery_charge_id);
    data.append("DeliveryTypeId", that.state.DeliveryTypeId);
    data.append("price", that.state.price);
    fetch(Constant.getAPI() + "/delivery/update", {
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
        Swal.fire("Updated !", "Shop Delivery Charge has been Updated", "success");
        window.location.href = `#/delivery-charges/${that.props.shop_id}`
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
  addShopDeliveryCharge = () => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    data.append("name", that.state.name);
    data.append("ShopId", that.props.shop_id);
    data.append("DeliveryTypeId", that.state.DeliveryTypeId);
    data.append("price", that.state.price);
    fetch(Constant.getAPI() + "/delivery/add", {
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
        Swal.fire("Added !", "Shop Delivery Charge has been Added", "success");
        window.location.href = `#/delivery-charges/${that.props.shop_id}`
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
    this.getAttributeList();
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
                <label className="col-sm-3 col-form-label">Name</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    id="name"
                    placeholder="Name"
                    onChange={this.handleChange}
                    value={this.state.name}
                  />
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Price</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    name="price"
                    id="price"
                    placeholder="Price"
                    onChange={this.handleChange}
                    value={this.state.price}
                  />
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Delivery Type</label>
                <div className="col-sm-9">
                  <select name="DeliveryTypeId" className="form-control" value={this.state.DeliveryTypeId} onChange={this.handleChange}>
                    <option value="0">Select Delivery Type</option>
                    {
                      this.state.delivery_type_list !== undefined && this.state.delivery_type_list !== null && this.state.delivery_type_list !== [] && this.state.delivery_type_list.length > 0
                        ?
                        this.state.delivery_type_list.map(delivery_type =>
                          <option key={delivery_type.id} value={delivery_type.id}>{delivery_type.name}</option>
                        )
                        :
                        null
                    }
                  </select>
                </div>
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
              <Link to={"/delivery-charges/" + this.props.shop_id} className="btn btn-outline-dark">
                Cancel
        </Link>
            </div>
          </div>
        </div>
      </div >
    );
  }
}

export default ShopDeliveryChargeAdd;
