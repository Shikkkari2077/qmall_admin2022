import React from 'react';
import { Link } from 'react-router-dom'
import $ from 'jquery';
import Constant from '../../../Constant'
import Swal from 'sweetalert2'
import MUIDataTable from "mui-datatables";

class CustomerAddressList extends React.Component {
  state = {}

  deleteAddress = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this !",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it"
    }).then(result => {
      if (result.value) {
        var that = this;
        var data = new URLSearchParams();
        // this.setState({ isSaving: true });
        data.append("AddressId", id);
        fetch(Constant.getAPI() + "/shop/address/delete", {
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
            Swal.fire("Deleted!", "Shop Address deleted.", "success");
            that.getCustomerAddressList();
          } else {
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
    });
  }
  getCustomerAddressList = () => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    data.append("UserId", that.props.match.params.customer_id);
    fetch(Constant.getAPI() + "/address/get", {
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
        that.setState({ address_list: json.data, isSaving: false });
      } else {
        that.setState({ address_list: [], isSaving: false });
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
  componentWillMount() {
    this.getCustomerAddressList();
  }
  render() {
    return (
      <div className="pcoded-inner-content" >
        <div className="main-body">
          <div className="page-wrapper">
            <div className="page-header">
              <div className="row align-items-end">
                <div className="col-lg-8">
                  <div className="page-header-title">
                    <div className="d-inline">
                      <h4>User Address List</h4>
                    </div>
                  </div>
                  {/* <Link to={"/customers/" + this.props.match.params.shop_id + "/branch/" + this.props.match.params.branch_id + "/address/add"} className="btn btn-sm btn-inverse waves-effect waves-light f-right d-inline-block md-trigger" data-modal="modal-13"> <i className="icofont icofont-plus m-r-5"></i> Add Shop Address </Link> */}
                </div>
                <div className="col-lg-4">
                  <div className="page-header-breadcrumb">
                    <ul className="breadcrumb-title">
                      <li className="breadcrumb-item">
                        <Link to="/">
                          <i className="feather icon-home"></i> </Link>
                      </li>
                      <li className="breadcrumb-item">
                        <Link to={"/customers"}>Customer List</Link>
                      </li>
                      <li className="breadcrumb-item active">Customer Address List</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="page-body">
              <div className="row">
                {
                  this.state.address_list !== undefined && this.state.address_list !== null && this.state.address_list !== [] && this.state.address_list.length > 0
                    ?
                    this.state.address_list.map(address =>
                      <div className="col-md-4" key={address.id}>
                        <div className={address.isPrimary ? "card bg-light" : "card"}>
                          <div className="card-header">
                            <h5>{address.title}</h5>
                            <div className="card-header-right">
                              {/* <ul className="list-unstyled card-option">
                                <li><Link to={"/shops/" + this.props.match.params.shop_id + "/branch/" + this.props.match.params.branch_id + "/address/add/" + address.id}><i className="feather icon-edit"></i></Link></li>
                                <li><i className="feather icon-trash-2" onClick={this.deleteAddress.bind(this, address.id)}></i></li>
                              </ul> */}
                            </div>
                          </div>
                          <div className="card-block">
                            <label>Type : {address.type}</label>
                            <br />
                            <label className="text-underline">Address :</label>
                            <div>
                              {address.houseNo} , {address.flatNo} , {address.floorNo} , {address.block} , {address.avenue} , {address.street} ,
                            {address.Area.name}
                              <br />
                              <span>Direction : </span>{address.direction}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                    : null
                }
              </div>
            </div>
          </div>
        </div>
      </div >
    );
  }
}

export default CustomerAddressList;
