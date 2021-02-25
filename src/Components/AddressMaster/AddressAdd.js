import React from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Constant from "../../Constant";

class AddressAdd extends React.Component {
  state = {
    isPrimary: false
  };
  componentDidUpdate(prevProps) {
    if (this.props.language_id !== undefined) {
      if (prevProps.address_id !== this.props.address_id) {
        this.setState({ address_id: this.props.address_id });
        this.getAddressDetails();
      }
      if (prevProps.language_id !== this.props.language_id) {
        if (this.props.address_id !== undefined) {
          // this.setState({ address_id: this.props.address_id });
          this.getAddressDetails();
        }
        this.getAreaList();
      }
    }
  }
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  getAreaList = () => {
    var that = this;
    var data = new URLSearchParams();
    // data.append("AddressId", that.props.address_id);
    // data.append("BranchId", that.props.branch_id);
    data.append("LanguageId", that.props.language_id);

    fetch(Constant.getAPI() + "/area/get", {
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
        that.setState({
          area_list: json.data
        });
      } else {
        that.setState({ area_list: {} });
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
  getAddressDetails = () => {
    var that = this;
    var data = new URLSearchParams();
    data.append("AddressId", that.props.address_id);
    data.append("BranchId", that.props.branch_id);
    fetch(Constant.getAPI() + "/shop/address/get", {
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
        that.setState({
          address_data: json.data[0],
          title: json.data[0].title,
          houseNo: json.data[0].houseNo,
          flatNo: json.data[0].flatNo,
          floorNo: json.data[0].floorNo,
          block: json.data[0].block,
          avenue: json.data[0].avenue,
          street: json.data[0].street,
          area: json.data[0].Area.name,
          AreaId: json.data[0].AreaId,
          lat: json.data[0].lat,
          lng: json.data[0].lng,
          direction: json.data[0].direction,
          type: json.data[0].type,
          isPrimary: json.data[0].isPrimary,
        });
      } else {
        that.setState({ address_data: {} });
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
    if (that.props.address_id !== undefined) {
      that.updateAddressData();
    } else {
      that.addAddress();
    }
  }
  updateAddressData = () => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    data.append("BranchId", that.props.branch_id);
    data.append("title", that.state.title);
    data.append("type", that.state.type);
    data.append("AreaId", that.state.AreaId);
    data.append("block", that.state.block);
    data.append("street", that.state.street);
    data.append("avenue", that.state.avenue);
    data.append("houseNo", that.state.houseNo);
    data.append("lat", that.state.lat);
    data.append("lng", that.state.lng);
    data.append("floorNo", that.state.floorNo);
    data.append("flatNo", that.state.flatNo);
    data.append("direction", that.state.direction);
    data.append("isPrimary", that.state.isPrimary);
    data.append("AddressId", that.props.address_id);
    fetch(Constant.getAPI() + "/shop/address/update", {
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
        Swal.fire("Updated !", "Address has been Updated", "success");
        window.location.href = `#/shops/${that.props.shop_id}/branch/${that.props.branch_id}/address`
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
  addAddress = () => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    data.append("BranchId", that.props.branch_id);
    data.append("title", that.state.title);
    data.append("type", that.state.type);
    data.append("AreaId", that.state.AreaId);
    data.append("block", that.state.block);
    data.append("street", that.state.street);
    data.append("avenue", that.state.avenue);
    data.append("houseNo", that.state.houseNo);
    data.append("lat", that.state.lat);
    data.append("lng", that.state.lng);
    data.append("floorNo", that.state.floorNo);
    data.append("flatNo", that.state.flatNo);
    data.append("direction", that.state.direction);
    data.append("isPrimary", that.state.isPrimary);
    fetch(Constant.getAPI() + "/shop/address/add", {
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
        Swal.fire("Added !", "Address has been Added", "success");
        window.location.href = `#/shops/${that.props.shop_id}/branch/${that.props.branch_id}/address`
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
  render() {
    return (
      <div className="">
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Address Title</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    id="title"
                    placeholder="Address Title"
                    onChange={this.handleChange}
                    value={this.state.title}
                  />
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Address Type</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    name="type"
                    id="type"
                    placeholder="Address Type"
                    onChange={this.handleChange}
                    value={this.state.type}
                  />
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Block</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    name="block"
                    id="block"
                    placeholder="Block"
                    onChange={this.handleChange}
                    value={this.state.block}
                  />
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">House Number</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    name="houseNo"
                    id="houseNo"
                    placeholder="House Number"
                    onChange={this.handleChange}
                    value={this.state.houseNo}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Flat Number</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    name="flatNo"
                    id="flatNo"
                    placeholder="Flat Number"
                    onChange={this.handleChange}
                    value={this.state.flatNo}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Floor Number</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    name="floorNo"
                    id="floorNo"
                    placeholder="Floor Number"
                    onChange={this.handleChange}
                    value={this.state.floorNo}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Avenue</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    name="avenue"
                    id="avenue"
                    placeholder="Avenue"
                    onChange={this.handleChange}
                    value={this.state.avenue}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Street</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    name="street"
                    id="street"
                    placeholder="Street"
                    onChange={this.handleChange}
                    value={this.state.street}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Direction</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    name="direction"
                    id="direction"
                    placeholder="Direction"
                    onChange={this.handleChange}
                    value={this.state.direction}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Area</label>
                <div className="col-sm-9">
                  <select className="form-control" name="AreaId" id="AreaId" onChange={this.handleChange} value={this.state.AreaId}>
                    <option value="0">Select Area</option>
                    {
                      this.state.area_list !== undefined && this.state.area_list !== null && this.state.area_list !== [] && this.state.area_list.length > 0
                        ?
                        this.state.area_list.map(areas =>
                          <option key={areas.id} value={areas.id}>{areas.name}</option>
                        )
                        :
                        null
                    }
                  </select>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Latitude</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    name="lat"
                    id="lat"
                    placeholder="Latitude"
                    onChange={this.handleChange}
                    value={this.state.lat}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Longitude</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    name="lng"
                    id="lng"
                    placeholder="Longitude"
                    onChange={this.handleChange}
                    value={this.state.lng}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Primary Address</label>
                <div className="col-sm-9">
                  <select className="form-control" name="isPrimary" id="isPrimary" onChange={this.handleChange} value={this.state.isPrimary}>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
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
              <Link to={"/shops/" + this.props.shop_id + "/branch/" + this.props.branch_id + "/address"} className="btn btn-outline-dark">
                Cancel
        </Link>
            </div>
          </div>
        </div>
      </div >
    );
  }
}

export default AddressAdd;
