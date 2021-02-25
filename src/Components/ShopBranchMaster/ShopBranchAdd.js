import React from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Constant from "../../Constant";

class ShopBranchAdd extends React.Component {
  state = {
    status: true
  };
  componentDidUpdate(prevProps) {
    if (prevProps.branch_id !== this.props.branch_id) {
      this.setState({ branch_id: this.props.branch_id });
      this.getShopBranchDetails();
    }
    if (prevProps.language_id !== this.props.language_id) {
      if (this.props.branch_id !== undefined) {
        // this.setState({ branch_id: this.props.branch_id });
        this.getShopBranchDetails();
      }
    }
  }
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  getShopBranchDetails = () => {
    var that = this;
    var data = new URLSearchParams();
    data.append("BranchId", that.props.branch_id);
    data.append("ShopId", that.props.shop_id);
    fetch(Constant.getAPI() + "/shop/branch/get", {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: data
    }).then(function (response) {
      return response.json();
    }).then(function (json) {
      if (json.status === true) {
        that.setState({ branch_data: json.data[0], name: json.data[0].name });
      } else {
        that.setState({ branch_data: {} });
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
    if (that.props.branch_id !== undefined) {
      that.updateCategoryData();
    } else {
      that.addCategory();
    }
  }
  updateCategoryData = () => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    data.append("name", that.state.name);
    data.append("LanguageId", that.props.language_id);
    data.append("BranchId", that.props.branch_id);
    fetch(Constant.getAPI() + "/shop/branch/update", {
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
        Swal.fire("Updated !", "Shop Branch has been Updated", "success");
        window.location.href = `#/shops/branch/${that.props.shop_id}`
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
  addCategory = () => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    data.append("name", that.state.name);
    data.append("LanguageId", that.props.language_id);
    data.append("ShopId", that.props.shop_id);
    fetch(Constant.getAPI() + "/shop/branch/add", {
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
        Swal.fire("Added !", "Shop Branch has been Added", "success");
        window.location.href = `#/shops/branch/${that.props.shop_id}`
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
                <label className="col-sm-3 col-form-label">Shop Branch</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    id="name"
                    placeholder="Shop Branch"
                    onChange={this.handleChange}
                    value={this.state.name}
                  />
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
              <Link to={"/shops/branch/" + this.props.shop_id} className="btn btn-outline-dark">
                Cancel
        </Link>
            </div>
          </div>
        </div>
      </div >
    );
  }
}

export default ShopBranchAdd;
