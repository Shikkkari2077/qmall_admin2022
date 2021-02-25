import React from 'react';
import { Link } from 'react-router-dom'
import $ from 'jquery';
import Constant from '../../../Constant'
import Swal from 'sweetalert2'
import MUIDataTable from "mui-datatables";

class AreaList extends React.Component {
  state = {}
  handleStatusChange = (sid) => {
    var isChecked = $('#area_status_' + sid);
    isChecked.prop("checked", !isChecked.prop("checked"));
    console.log(isChecked.prop('checked'), !isChecked.prop("checked"));
    if (!isChecked.prop("checked") === true) {
      var status = 'active'
    } else {
      var status = 'inactive'
    }
    let newArray = this.state.area_list;
    var a = newArray.find((element) => {
      return element.areaID === sid
    })
    a.status = status;
    console.log(newArray)
    this.setState({ area_list: newArray })
    Swal.fire("Update Status!", "Status has been updated.", "success");
  }
  deleteArea = (id) => {
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
        data.append("AreaId", id);
        fetch(Constant.getAPI() + "/area/delete", {
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
            Swal.fire("Deleted!", "Area has been deleted.", "success");
            that.getAreaList();
          } else {
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
    });

  }
  componentWillMount() {
    this.getAreaList();
  }
  getAreaList = () => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    fetch(Constant.getAPI() + "/area/get", {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: data
    }).then(function (response) {
      return response.json();
    }).then(function (json) {
      if (json.status === true) {
        that.setState({ area_data: json.data, isSaving: false });
      } else {
        that.setState({ area_data: [], isSaving: false });
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
  render() {
    const columns = [{
      name: "name_en",
      label: "Area Name: English",
      options: {
        filter: true,
        sort: true
      }
    }, {
      name: "name_ar",
      label: "Area Name: Arabic",
      options: {
        filter: true,
        sort: true
      }
    }, {
      name: "active",
      label: "Status",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (active, tableMeta) => {
          return <div>
            {active === true ? "Active" : "Inactive"}
          </div>
        }
      }
    }, {
      name: "deliveryCharge",
      label: "Delivery Charges (in KWD)",
      options: {
        filter: true,
        sort: true
      }
    }, {
      name: "id",
      label: "Actions",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (id, tableMeta) => {
          console.log(tableMeta);
          return (
            <div>
              <Link to={"/area/add/" + id}
                className="m-r-15 text-muted"
                data-toggle="tooltip"
                data-placement="top" title=""
                data-original-title="Edit">
                <i className="f-20 icofont icofont-ui-edit text-custom"></i>
              </Link>
              <span onClick={this.deleteArea.bind(this, id)}
                className="m-r-15 text-muted"
                data-toggle="tooltip"
                data-placement="top"
                title=""
                data-original-title="Delete">
                <i className="f-20 icofont icofont-delete-alt text-danger"></i>  </span>
            </div>)
        }
      }
    }];
    const options = {
      //pagination:true,
      filterType: "dropdown",
      viewColumns: false,
      print: false,
      download: false,
      selectableRows: 'none',
      textLabels: {
        body: {
          noMatch: this.state.isSaving ?
            "Loading data..!" :
            "Sorry, No Area Found",
          toolTip: "Sort",
          columnHeaderTooltip: column => `Sort for ${column.label}`
        }
      }
    };

    return (
      <div className="pcoded-inner-content" >
        <div className="main-body">
          <div className="page-wrapper">
            <div className="page-header">
              <div className="row align-items-end">
                <div className="col-lg-8">
                  <div className="page-header-title">
                    <div className="d-inline">
                      <h4>Area List</h4>
                    </div>
                  </div>
                  <Link to="/area/add"
                    className="btn btn-sm btn-inverse waves-effect waves-light f-right d-inline-block md-trigger" data-modal="modal-13"> <i className="icofont icofont-plus m-r-5"></i> Add Area
                       </Link>
                </div>
                <div className="col-lg-4">
                  <div className="page-header-breadcrumb">
                    <ul className="breadcrumb-title">
                      <li className="breadcrumb-item">
                        <Link to="/">
                          <i className="feather icon-home"></i> </Link>
                      </li>
                      <li className="breadcrumb-item active">Area List</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="page-body">
              <div className="row">
                <div className="col-sm-12">
                  <div className="card">
                    <div className="card-block">
                      <div className="dt-responsive table-responsive">
                        <MUIDataTable
                          
                          title={"Area List"}
                          className="table-responsive"
                          data={this.state.area_data}
                          columns={columns}
                          options={options}
                        />

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >
    );
  }
}

export default AreaList;
