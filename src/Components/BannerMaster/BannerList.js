import React from 'react';
import { Link } from 'react-router-dom'
import $ from 'jquery';
import Constant from '../../Constant'
import Swal from 'sweetalert2'
import MUIDataTable from "mui-datatables";

class BannerList extends React.Component {
  state = {}
  handleStatusChange = (sid) => {
    var isChecked = $('#banner_' + sid);
    isChecked.prop("checked", !isChecked.prop("checked"));
    console.log(isChecked.prop('checked'), !isChecked.prop("checked"));
    if (!isChecked.prop("checked") === true) {
      var status = 'active'
    } else {
      var status = 'inactive'
    }
    let newArray = this.state.banner_list;
    var a = newArray.find((element) => {
      return element.id === sid
    })
    a.status = status;
    console.log(newArray)
    this.setState({ banner_list: newArray })
    Swal.fire("Update Status!", "Status has been updated.", "success");
  }
  deleteBanner = (id) => {
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
        data.append("BannerId", id);
        fetch(Constant.getAPI() + "/banner/delete", {
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
            Swal.fire("Deleted!", " Banner deleted.", "success");
            that.getBannerList();
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
  getBannerList = () => {
    var that = this;
    this.setState({ isSaving: true });
    var data = new URLSearchParams();
    if (localStorage.getItem('q8_mall_ad_role') === "shop") {
      data.append('ShopId', localStorage.getItem('q8_mall_ad_uid'));
    }
    fetch(Constant.getAPI() + "/banner/get", {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: data
    }).then(function (response) {
      return response.json();
      
    }).then(function (json) {
      if (json.status === true) {
        that.setState({ banner_data: json.data, isSaving: false });
        console.log(json.data)
      } else {
        that.setState({ banner_data: [], isSaving: false });
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
    this.getBannerList();

  }
  getProduct =(id)=>{
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    if (localStorage.getItem('q8_mall_ad_role') === "shop") {
      data.append("ShopId", localStorage.getItem('q8_mall_ad_uid'));
    }
    data.append("Productid",id);
    console.log(id)
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
      if (json.status === true) {
        console.log(json.data)
        var products = []
        for (var i = 0; i < json.data.length; i++) {
          var obj = json.data[i];
          if (json.data[i].Shop !== null) {
            obj.Shop_name = json.data[i].Shop.name_en
          } else {
            obj.Shop_name = '-'
          }
          var stock = 0;
          if (json.data[i].Stocks !== null) {
            for (var j = 0; j < json.data[i].Stocks.length; j++) {
              stock = parseInt(stock) + parseInt(json.data[i].Stocks[j].count)
            }
          }
         
          obj.stock = stock
          products.push(obj);
        }
        that.setState({ product_list: products, isSaving: false });
        console.log(products)
        // that.setState({ product_list: json.data, isSaving: false });
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
    const columns = [{
      name: "Medium",
      label: "Banner Image",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (Medium, tableMeta) => {
          return <div>
            {
              Medium !== undefined && Medium !== null && Medium !== {}
                ?
                <img src={Medium.url !== undefined && Medium.url !== null && Medium.url !== "" ? Medium.url : "./assets/images/icon.png"} alt="" className="img-40" />
                :
                <img src="./assets/images/icon.png" alt="" className="img-40" />
            }
          </div>
        }
      }
    }, 
    {
      name: "ProductId",
      label: "Product Name",
      options: {
        filter: true,
        sort: true,
        
        customBodyRender: (ProductId, tableMeta) => {
           
            return <div>
              {/* {this.getProduct(ProductId)} */}
              
              {/* {console.log(this.state.product_list)} */}
              </div>;
          
        }
      }
    }, 
    // {
    //   name: "Shop",
    //   label: "Shop Name",
    //   options: {
    //     filter: true,
    //     sort: true,
    //     customBodyRender: (Shop, tableMeta) => {
    //       if (Shop !== undefined && Shop !== null && Shop !== "undefined" && Shop !== "null") {
    //         return <div>{Shop.name}</div>;
    //       } else {
    //         return "-";
    //       }
    //     }
    //   }
    // }, 
    // {
    //   name: "Medium",
    //   label: "URL",
    //   options: {
    //     filter: true,
    //     sort: true,
    //     customBodyRender: (Medium, tableMeta) => {
    //       if (Medium !== undefined && Medium !== null && Medium !== "undefined" && Medium !== "null") {
    //         return <div>{Medium.url}</div>;
    //       } else {
    //         return "-";
    //       }
    //     }
    //   }
    // },
    {
      name: "priority",
      label: "Priority",
      options: {
        filter: true,
        sort: true,
        sortDirection:('desc','asc'),
        customBodyRender: (priority, tableMeta) => {
          
            return <div>{priority}</div>;
          
        }
      }
    },  {
      name: "start_date",
      label: "Banner Start Date",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (start_date, tableMeta) => {
          var newDate = new Date(start_date);
          var year, month, day;
          year = newDate.getFullYear();
          if (newDate.getMonth() > 8) {
            month = newDate.getMonth() + 1;
          } else {
            month = "0" + (newDate.getMonth() + 1);
          }
          if (newDate.getDate() > 9) {
            day = newDate.getDate();
          } else {
            day = "0" + (newDate.getDate());
          }
          var banner_date = day + "-" + month + "-" + year;
          return banner_date
        }
      }
    }, {
      name: "end_date",
      label: "Banner End Date",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (end_date, tableMeta) => {
          var newDate = new Date(end_date);
          var year, month, day;
          year = newDate.getFullYear();
          if (newDate.getMonth() > 8) {
            month = newDate.getMonth() + 1;
          } else {
            month = "0" + (newDate.getMonth() + 1);
          }
          if (newDate.getDate() > 9) {
            day = newDate.getDate();
          } else {
            day = "0" + (newDate.getDate());
          }
          var banner_date = day + "-" + month + "-" + year;
          return banner_date
        }
      }
    }, {
      name: "id",
      label: "Action",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (id, tableMeta) => {
          return <div>
            <Link to={"/banner/add/" + id}
              className="m-r-15 text-muted"
              data-toggle="tooltip"
              data-placement="top" title=""
              data-original-title="Edit">
              <i className="f-20 icofont icofont-ui-edit text-custom"></i>
            </Link>
            <span onClick={this.deleteBanner.bind(this, id)}
              className="m-r-15 text-muted"
              data-toggle="tooltip"
              data-placement="top"
              title=""
              data-original-title="Delete">
              <i className="f-20 icofont icofont-delete-alt text-danger"></i>  </span>
          </div>
        }
      }
    }];
    const options = {
      filterType: "dropdown",
      viewColumns: false,
      print: false,
      download: false,
      selectableRows: 'none',
      textLabels: {
        body: {
          noMatch: this.state.isSaving ?
            "Loading data..!" :
            "Sorry, No Banner Found",
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
                      <h4>Banner List</h4>
                    </div>
                  </div>
                  {localStorage.getItem('q8_mall_ad_role') !== "shop"
                    ?
                    <Link to="/banner/add" className="btn btn-sm btn-inverse waves-effect waves-light f-right d-inline-block md-trigger" data-modal="modal-13"> <i className="icofont icofont-plus m-r-5"></i> Add Banner </Link>
                    :
                    null
                  }
                </div>
                <div className="col-lg-4">
                  <div className="page-header-breadcrumb">
                    <ul className="breadcrumb-title">
                      <li className="breadcrumb-item">
                        <Link to="/">
                          <i className="feather icon-home"></i> </Link>
                      </li>
                      <li className="breadcrumb-item active">Banner List</li>
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
                          title={"Banner List"}
                          className="table-responsive"
                          data={this.state.banner_data}
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
      </div>
    );
  }
}

export default BannerList;
