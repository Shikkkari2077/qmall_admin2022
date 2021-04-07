import React from "react";
import { Link } from "react-router-dom";
import $ from "jquery";
import Constant from "../../Constant";
import Swal from "sweetalert2";
import MUIDataTable from "mui-datatables";
import "react-toggle/style.css"; // for ES6 modules
import Toggle from "react-toggle";

class SectionList extends React.Component {
  state = {};


  deleteAttributeValue = (id) => {
    //console.log(id)
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
        data.append("SectionId", id);
        fetch(Constant.getAPI() + "/shop/section/delete", {
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
            Swal.fire("Deleted!", "Section deleted.", "success");
            that.getCategoryList();
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
  handleStatusChange = (sid) => {
    var isChecked = $("#category_status_" + sid);
    isChecked.prop("checked", !isChecked.prop("checked"));
    if (!isChecked.prop("checked") === true) {
      var status = true;
    } else {
      var status = false;
    }
    var that = this;
    var data = new URLSearchParams();
    // this.setState({ isSaving: true });
    data.append("status", status);
    data.append("SectionId", sid);

    fetch(Constant.getAPI() + "/shop/section/update", {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: localStorage.getItem("q8_mall_auth"),
      },
      body: data,
    })
      .then(function (response) {
        return response
      })
      .then(function (response) {
            
        if (response.status === 200) {

          Swal.fire("Update Status!", "Status has been updated.", "success");
          that.getCategoryListAdmin();
        } else {
          Swal.fire({
            title: "Something went wrong. Try again after some Time.!",
            icon: "error",
            text: "",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ok",
          });
        }
      });
  };
  deleteCategory = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this !",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.value) {
        var that = this;
        var data = new URLSearchParams();
        // this.setState({ isSaving: true });
        data.append("CategoryId", id);
        fetch(Constant.getAPI() + "/category/delete", {
          method: "post",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: localStorage.getItem("q8_mall_auth"),
          },
          body: data,
        })
          .then(function (response) {
            return response.json();
          })
          .then(function (json) {
            if (json.status === true) {
              Swal.fire("Deleted!", "Tyre Category deleted.", "success");
              that.getCategoryList();
            } else {
              Swal.fire({
                title: "Something went wrong. Try again after some Time.!",
                icon: "error",
                text: "",
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Ok",
              });
            }
          });
      }
    });
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
          that.setState({ category_data: json.data, isSaving: false });
        } else {
          that.setState({ category_data: [], isSaving: false });

          Swal.fire({
            title: "Something went wrong. Try again after some Time.!",
            icon: "error",
            text: "",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ok",
          });
        }
      });

  }
  getCategoryListAdmin(){
    var that = this;
    this.setState({ isSaving: true });
    var data = new URLSearchParams();
   fetch(Constant.getAPI() + "/shop/section/get-all", {
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
       console.log(json.data)
        if (json.success === true) {
          that.setState({ category_data: json.data, isSaving: false });
        } else {
          that.setState({ category_data: [], isSaving: false });

          Swal.fire({
            title: "Something went wrong. Try again after some Time.!",
            icon: "error",
            text: "",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ok",
          });
        }
      });

  }
  getCategoryList = () => {
    var that = this;
    this.setState({ isSaving: true });
    var data = new URLSearchParams();
    // if (localStorage.getItem("q8_mall_ad_role") === "shop") {
    //   data.append("ShopId", localStorage.getItem("q8_mall_ad_uid"));
    // }
    // console.log(localStorage.getItem("q8_mall_ad_uid"), localStorage.getItem("q8_mall_auth"))


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
          that.setState({ category_data: json.data, isSaving: false });
        } else {
          that.setState({ category_data: [], isSaving: false });

          Swal.fire({
            title: "Something went wrong. Try again after some Time.!",
            icon: "error",
            text: "",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ok",
          });
        }
      });
  };
  componentDidMount() {
    if(localStorage.getItem('q8_mall_ad_role')=='admin'){

   if( this.props.match.params.shop_id !== undefined &&
      this.props.match.params.shop_id !== null &&
      this.props.match.params.shop_id !== 0 &&
      this.props.match.params.shop_id !== "")
    {
      this.getCategoryListAdmin2(this.props.match.params.shop_id );
     //console.log("hello", this.props.match.params.shop_id)
    }
    else{
      this.getCategoryListAdmin();
    }
    
  }
    else{
      this.getCategoryList();

    }
  }
  render() {
    const columns = [
      {
        name: "Medium",
        label: "Section Image",
        options: {
          filter: true,
          sort: true,
          customBodyRender: (Medium, tableMeta) => {
            return (
              <div>
                {Medium !== undefined && Medium !== null && Medium !== {} ? (
                  <img
                    src={
                      Medium.url !== undefined &&
                      Medium.url !== null &&
                      Medium.url !== ""
                        ? Medium.url
                        : "./assets/images/icon.png"
                    }
                    alt=""
                    className="img-40"
                  />
                ) : (
                  <img
                    src= {localStorage.getItem("companylogo")}
                    alt=""
                    className="img-40"
                  />
                )}
              </div>
            );
          },
        },
      },
      {
        name: "name_en",
        label: "Section Name : English",
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        name: "name_ar",
        label: "Section Name : Arabic",
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        name: "Shop",
        label: "Shop Name",
        options: {
          filter: true,
          sort: true,
          customBodyRender:(Shop)=>{
            return( Shop!==undefined && Shop!==null?<div>
              { Shop.name}<br/>
              {Shop.name_ar}
            </div>
              :null
              )
          }

        },
      },
     
      {
        name: "status",
        label: "Status",
        options: {
          filter: true,
          sort: false,
          customBodyRender: (status, tableMeta) => {
            return (<div> 
              {/* {console.log(tableMeta.rowData)} */}
              <Toggle
                id={"category_status_" + tableMeta.rowData[5]}
                checked={status === true ? true : false}
                value={status}
                onChange={this.handleStatusChange.bind(this,tableMeta.rowData[5])}
              />
              </div>
            );
          },
        },
      },
      {
        name: "id",
        label: "Action",
        options: {
          filter: true,
          sort: true,
          display:true,
          customBodyRender: (id, tableMeta) => {
            return (
              <div>
                <Link
                  to={"/section/add/" + id+"/"+tableMeta.rowData[6]}
                  className="m-r-15 text-muted"
                  data-toggle="tooltip"
                  data-placement="top"
                  title=""
                  data-original-title="Edit"
                >
                  <i className="f-20 icofont icofont-ui-edit text-custom"></i>
                </Link>
                {/* <span
                  onClick={this.deleteCategory.bind(this, id)}
                  className="m-r-15 text-muted"
                  data-toggle="tooltip"
                  data-placement="top"
                  title=""
                  data-original-title="Delete"
                >
                  <i className="f-20 icofont icofont-delete-alt text-danger"></i>{" "}
                </span> */}
              </div>
            );
          },
        },
      },
      {
        name: "ShopId",
        label: "shop id",
        options: {
          filter: true,
          sort: true,
          display:false,
        },
      },


    ];
    const shop_columns = [
      {
        name: "Medium",
        label: "Section Image",
        options: {
          filter: true,
          sort: true,
          customBodyRender: (Medium, tableMeta) => {
            return (
              <div>
                {Medium !== undefined && Medium !== null && Medium !== {} ? (
                  <img
                    src={
                      Medium.url !== undefined &&
                      Medium.url !== null &&
                      Medium.url !== ""
                        ? Medium.url
                        : "./assets/images/icon.png"
                    }
                    alt=""
                    className="img-40"
                  />
                ) : (
                  <img
                    src="./assets/images/icon.png"
                    alt=""
                    className="img-40"
                  />
                )}
              </div>
            );
          },
        },
      },
      {
        name: "name_en",
        label: "Section Name : English",
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        name: "name_ar",
        label: "Section Name : Arabic",
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        name: "priority",
        label: "Priority",
        options: {
          filter: true,
          sort: true,
        },
      },
     
    
      {
        name: "status",
        label: "status",
        options: {
          display:localStorage.getItem("q8_mall_ad_role")=='shop'?true:false,
          filter: true,
          sort: true,
          customBodyRender:(status)=>{
            return (
            status? <span className="badge badge-success">Approved</span>: <span className="badge badge-danger">Pending</span>
            )}
        },
      },
      
    

      {
        name: "id",
        label: "Action",
        options: {
          filter: true,
          sort: true,
          display:localStorage.getItem("q8_mall_ad_role")=='shop'?true:false,
          customBodyRender:(id)=>{
           return(<div>
            <Link
              to={"/section/add/"+id}
                className="m-r-15 text-muted"
               data-toggle="tooltip"
              data-placement="top"
               title=""
                data-original-title="Edit"
              >
                <i className="f-20 icofont icofont-ui-edit text-custom"></i>
                 </Link>
                 <span onClick={this.deleteAttributeValue.bind(this, id)}
              className="m-r-15 text-muted"
              data-toggle="tooltip"
              data-placement="top"
              title=""
              data-original-title="Delete">
              <i className="f-20 icofont icofont-delete-alt text-danger"></i>  </span>
                 </div>


           )
             
          }
        },

      },
    
    ];
    const options = {
      filterType: "dropdown",
      viewColumns: false,
      print: false,
      download: false,
      selectableRows: "none",
      textLabels: {
        body: {
          noMatch: this.state.isSaving
            ? "Loading data..!"
            : "Sorry, No Section Found",
          toolTip: "Sort",
          columnHeaderTooltip: (column) => `Sort for ${column.label}`,
        },
      },
    
    };
    return (
      <div className="pcoded-inner-content">
        <div className="main-body">
          <div className="page-wrapper">
            <div className="page-header">
              <div className="row align-items-end">
                <div className="col-lg-8">
                  <div className="page-header-title">
                    <div className="d-inline">
                      <h4>Section List</h4>
                    </div>
                  </div>
                  {/* {localStorage.getItem('q8_mall_ad_role') !== "shop"
                    ? */}
                    {  localStorage.getItem('q8_mall_ad_role') == "shop"?<div>
                  <Link
                    to={`/section/add`}
                    className="btn btn-sm btn-inverse waves-effect waves-light f-right d-inline-block md-trigger"
                    data-modal="modal-13"
                  >
                    {" "}
                    <i className="icofont icofont-plus m-r-5"></i> Add Section{" "}
                  </Link> 
                   
                  
                  <Link
                    to="/"
                    className="btn btn-sm btn-outline-dark waves-effect waves-light f-right d-inline-block md-trigger mx-3"
                    data-modal="modal-13"
                  >
                    {" "}
                    <i className="icofont icofont-arrow-left m-r-5"></i> Back{" "}
                  </Link>
                  </div>
                  :null}
                </div>
                <div className="col-lg-4">
                  <div className="page-header-breadcrumb">
                    <ul className="breadcrumb-title">
                      <li className="breadcrumb-item">
                        <Link to="/">
                          <i className="feather icon-home"></i>{" "}
                        </Link>
                      </li>
                      <li className="breadcrumb-item active">Section List</li>
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
                        {localStorage.getItem("q8_mall_ad_role") !== "shop" ? (
                          <MUIDataTable
                            // title={"Section List"}
                            className="table-responsive"
                            data={this.state.category_data}
                            columns={columns}
                            options={options}
                          />
                        ) : (
                          <MUIDataTable
                            title={"Section List"}
                            className="table-responsive"
                            data={this.state.category_data}
                            columns={shop_columns}
                            options={options}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SectionList;
