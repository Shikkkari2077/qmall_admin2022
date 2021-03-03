import React from 'react';
import { Link } from 'react-router-dom'
import Constant from '../../Constant'
import Loader from '../../Loader'
import Swal from 'sweetalert2'
import MUIDataTable from "mui-datatables";
import "react-toggle/style.css" // for ES6 modules
import Toggle from 'react-toggle'
import $ from 'jquery';

class ProductList extends React.Component {
  state = {}
  deleteAttributeValue = (id) => {
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
        data.append("ProductId", id);
        fetch(Constant.getAPI() + "/product/delete", {
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
            Swal.fire("Deleted!", "Product deleted.", "success");
            that.getProductList();
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
  // getProductList = () => {
  //   var that = this;
  //   var data = new URLSearchParams();
  //   this.setState({ isSaving: true });
  //   if (localStorage.getItem('q8_mall_ad_role') === "shop") {
  //     // //console.log(localStorage.getItem('q8_mall_ad_role'))
  //     // //console.log( localStorage.getItem('q8_mall_ad_uid'))
  //     // //console.log(localStorage.getItem('q8_mall_auth'))

  //     data.append("ShopId", localStorage.getItem('q8_mall_ad_uid'));
  //   }
  //   //console.log( localStorage.getItem('q8_mall_auth'))
  //   fetch(Constant.getAPI() + "/product/get", {
  //     method: "post",
  //     headers: {
  //       "Content-Type": "application/x-www-form-urlencoded",
  //       "Authorization": localStorage.getItem('q8_mall_auth')
  //     },
  //     body: data
  //   }).then(function (response) {
  //     return response.json();
  //   }).then(function (json) {
  //     // //console.log(json.data[0])

  //     if (json.status === true) {
  //       var products = []
  //       for (var i = 0; i < json.data.length; i++) {
  //         var obj = json.data[i];
  //         if (json.data[i].Shop !== null) {
  //           obj.Shop_name = json.data[i].Shop.name_en
  //         } else {
  //           obj.Shop_name = '-'
  //         }
  //         var stock = 0;
  //         if (json.data[i].Stocks !== null) {
  //           for (var j = 0; j < json.data[i].Stocks.length; j++) {
  //             stock = parseInt(stock) + parseInt(json.data[i].Stocks[j].count)
  //           }
  //         }

  //         obj.stock = stock
  //         products.push(obj);
  //       }
  //       that.setState({ product_list: products, isSaving: false });
  //       // that.setState({ product_list: json.data, isSaving: false });
  //     } else {
  //       that.setState({ product_list: [], isSaving: false });
  //       Swal.fire({
  //         title: "Something went wrong. Try again after some Time.!",
  //         icon: 'error',
  //         text: "",
  //         confirmButtonColor: "#3085d6",
  //         cancelButtonColor: "#d33",
  //         confirmButtonText: "Ok"
  //       })
  //     }
  //   });
  // }
  getProductList = () => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    if (localStorage.getItem('q8_mall_ad_role') === "shop") {
      // //console.log(localStorage.getItem('q8_mall_ad_role'))
      // //console.log( localStorage.getItem('q8_mall_ad_uid'))
      // //console.log(localStorage.getItem('q8_mall_auth'))

      data.append("ShopId", localStorage.getItem('q8_mall_ad_uid'));
    }
    //console.log(localStorage.getItem('q8_mall_auth'))
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
       //console.log(json.data)

      if (json.status === true) {
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
  componentWillMount() {
    this.getProductList();
  }
  handleIsActiveChange = (sid) => {
    var isChecked = $('#product_isActive_' + sid);
    isChecked.prop("checked", !isChecked.prop("checked"));
    //console.log(isChecked.prop('checked'), !isChecked.prop("checked"));
    if (!isChecked.prop("checked") === true) {
      var status = true
    } else {
      var status = false
    }
    var that = this;
    var data = new URLSearchParams();
    // this.setState({ isSaving: true });
    data.append("isActive", status);
    data.append("ProductId", sid);
    fetch(Constant.getAPI() + "/product/update", {
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
        Swal.fire("Product Activation!", "Product activation has been updated.", "success");
        that.getProductList();
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
  handleStatusChange = (sid) => {
    var isChecked = $('#product_status_' + sid);
    isChecked.prop("checked", !isChecked.prop("checked"));
    //console.log(isChecked.prop('checked'), !isChecked.prop("checked"));
    if (!isChecked.prop("checked") === true) {
      var status = true
    } else {
      var status = false
    }
    var that = this;
    var data = new URLSearchParams();
    // this.setState({ isSaving: true });
    data.append("status", status);
    data.append("ProductId", sid);
    //console.log(localStorage.getItem('q8_mall_auth'))
    fetch(Constant.getAPI() + "/product/statusChange", {
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
        Swal.fire("Update Status!", "Status has been updated.", "success");
        that.getProductList();
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
  handleMediaChange=(sid)=>{
    var isChecked = $('#product_media_' + sid);
    isChecked.prop("checked", !isChecked.prop("checked"));
    //console.log(isChecked.prop("checked"), !isChecked.prop("checked"));
    if (!isChecked.prop("checked") === true) {
      var status = true;
    } else {
      var status = false;
    }
    var that = this;
    var data = new URLSearchParams();
    // this.setState({ isSaving: true });
    
    data.append("mediaStatus", status);
    data.append("ProductId", sid);
    //console.log(status,sid)
    fetch(Constant.getAPI() + "/product/mediaStatus", {
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
        //console.log(json)
        Swal.fire("Update Status!", "Status has been updated.", "success");
        that.getProductList();
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
  handleDescriptionChange=(sid)=>{
    var isChecked = $('#product_description_' + sid);
    isChecked.prop("checked", !isChecked.prop("checked"));
    //console.log(isChecked.prop("checked"), !isChecked.prop("checked"));
    if (!isChecked.prop("checked") === true) {
      var status = true;
    } else {
      var status = false;
    }
    var that = this;
    var data = new URLSearchParams();
    // this.setState({ isSaving: true });
    //console.log(status)
    data.append("descriptionStatus", status);
    data.append("ProductId", sid);
    fetch(Constant.getAPI() + "/product/descriptionStatus",{
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
        //console.log(json)
        Swal.fire("Update Status!", "Status has been updated.", "success");
        that.getProductList();
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
  // getSubCategory=(id)=>{
  //   var that = this;
  //   this.setState({ isSaving: true });
  //   var data = new URLSearchParams();
     
  //     data.append("CategoryId", id);
    
  //   fetch(Constant.getAPI() + "/category/get", {
  //     method: "post",
  //     headers: {
  //       "Content-Type": "application/x-www-form-urlencoded",
  //       Authorization: localStorage.getItem("q8_mall_auth"),
  //     },
  //     body: data,
  //   })
  //     .then(function (response) {
  //       return response.json();
  //     })
  //     .then(function (json) {
  //       if (json.status === true) {
  //         //console.log(json.data)
  //         that.setState({ SubCategory: json.data, isSaving: false });
  //       } else {
  //         that.setState({ SubCategory: [], isSaving: false });
  //         Swal.fire({
  //           title: "Something went wrong. Try again after some Time.!",
  //           icon: "error",
  //           text: "",
  //           confirmButtonColor: "#3085d6",
  //           cancelButtonColor: "#d33",
  //           confirmButtonText: "Ok",
  //         });
  //       }
  //     });

  // }
  render() {
    const shop_columns = [{
      name: "productMedia",
      label: "Image",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (productMedia, tableMeta) => {
          return (<img src={productMedia !== undefined
             && productMedia !== null 
             && productMedia !== {} ? productMedia.url : "./assets/images/icon.png"} className="img-fluid img-40" alt="tbl" />)
        }
      }
    },
    {
      name: "id",
      label: "Product ID",
      options: {
        filter: true,
        sort: true
      }
    },  {
      name: "name_en",
      label: "Product Name:English",
      options: {
        filter: true,
        sort: true
      }
    }, {
      name: "name_ar",
      label: "Product Name:Arabic",
      options: {
        filter: true,
        sort: true
      }
    }, {
      name: "stock",
      label: "Product Total Stock",
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: "Category",
      label: "Product Category",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (Category, tableMeta) => {
          return <div>
            {
              Category !== undefined && Category !== null 
              && Category.parent !== undefined && Category.parent !== null
              
                ?
                Category.parent.name !== undefined && 
                 Category.parent.name !== null && Category.parent.name !== '0'
                ?
                 Category.parent.name_en
                :""
                :
                "-"
            }
          </div >
        }
      }
    },
    
    {
      name: "Category",
      label: "Product Subcategory",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (Category, tableMeta) => {
          return <div>
            
            {
              Category !== null
                ?
                Category.name_en
                :
                "-"
            }
          </div >
        }
      }
    },{
      name: "Attributes",
      label: "Product Attributes",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (Attributes, tableMeta) => {
          return <div>
            {/* {console.log(Attributes)} */}
            {      

              Attributes !== null && Attributes !== [] && Attributes.length > 0
                ?
                <ol>
                  { 
                    Attributes.map(product_attr =>
                      product_attr.name_en !== "Default Attribute"?
                      <li key={product_attr.id}>{product_attr.name_en}</li>
                      :null
                    )
                  }
                </ol>
                :
                "-"
            }
          </div >
        }
      }
    }, {
      name: "status",
      label: "Status",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (status, tableMeta) => {
          return <div>
            {
              status
                ?
                <span className="badge badge-success">Approved</span>
                :
                <span className="badge badge-danger">Pending</span>
            }
          </div>
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
            <Link to={"/products/add/" + id}
              className="m-r-15 text-muted"
              data-toggle="tooltip"
              data-placement="top" title=""
              data-original-title="Edit">
              <i className="f-20 icofont icofont-ui-edit text-custom"></i>
            </Link>
            {/* <Link to={"/products/gallery/" + id}
              className="m-r-15 text-muted"
              data-toggle="tooltip"
              data-placement="top" title=""
              data-original-title="Product Gallery">
              <i className="f-20 icofont icofont-picture text-primary"></i>
            </Link> */}
            {
              localStorage.getItem('q8_mall_ad_role') === "shop"
                ?
                <Link to={"/products/stock/" + id}
                  className="m-r-15 text-muted"
                  data-toggle="tooltip"
                  data-placement="top" title=""
                  data-original-title="Product Stock Details">
                  <i className="f-20 icofont icofont-stock-mobile text-warning"></i>
                </Link>
                :
                null
            }
            <span onClick={this.deleteAttributeValue.bind(this, id)}
              className="m-r-15 text-muted"
              data-toggle="tooltip"
              data-placement="top"
              title=""
              data-original-title="Delete">
              <i className="f-20 icofont icofont-delete-alt text-danger"></i>  </span>
          </div >
        }

      }
    }
    ];
    const columns = [{
      name: "productMedia",
      label: "Image",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (productMedia, tableMeta) => {
          return (<img src={productMedia !== undefined && productMedia !== null && productMedia !== {} ? productMedia.url : "./assets/images/icon.png"} className="img-fluid img-40" alt="tbl" />)
        }
      }
    }, {
      name: "name_en",
      label: "Product Name",
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: "id",
      label: "Product ID",
      options: {
        filter: true,
        sort: true
      }
    },  {
      name: "name_ar",
      label: "Product Name:Arabic",
      options: {
        filter: true,
        sort: true
      }
    },{
      name: "stock",
      label: "Product Total Stock",
      options: {
        filter: true,
        sort: true
      }
    }, {
      name: "Shop_name",
      label: "Shop Name",
      options: {
        filter: true,
        sort: true,
        // customBodyRender: (Shop_name, tableMeta) => {
        //   return <div>
        //     {
        //       Shop.name !== null
        //         ?
        //         Shop.name
        //         :
        //         "-"
        //     }
        //   </div >
        // }
      }
    },
     {
      name: "Category",
      label: "Product Category",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (Category, tableMeta) => {
          return <div>
            {
              Category !== undefined && Category !== null 
              && Category.parent !== undefined && Category.parent !== null
              
                ?
                Category.parent.name !== undefined 
                &&  Category.parent.name !== null && Category.parent.name !== '0'
                ?
                 Category.parent.name_en
                :""
                :
                "-"
            }
          </div >
        }
      }
    },
    {
      name: "Category",
      label: "Product SubCategory",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (Category, tableMeta) => {
          return <div>
            {
              Category !== null
                ?
                Category.name_en
                :
                "-"
            }
          </div >
        }
      }
    }, {
      name: "Attributes",
      label: "Product Attributes",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (Attributes, tableMeta) => {
          return <div>
            {
              Attributes !== null && Attributes !== [] 
              && Attributes.length > 0
                ?
                <ol>
                  {
                    Attributes.map(product_attr =>
                      product_attr.name_en !== "Default Attribute"?

                      <li key={product_attr.id}>{product_attr.name_en}</li>
                      :null
                    )
                  }
                </ol>
                :
                "-"
            }
          </div >
        }
      }
    }, {
      name: "isActive",
      label: "Active",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (isActive, tableMeta) => {
          return <Toggle
            id={"product_isActive_" + tableMeta.rowData[12]}
            checked={isActive === true ? true : false}
            value={isActive}
            onChange={this.handleIsActiveChange.bind(this, tableMeta.rowData[12])}
          />
        }

      }
    }, {
      name: "status",
      label: "Status",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (status, tableMeta) => {
          return (<div>
            {/* * {//console.log(tableMeta.rowData)} */}
          <Toggle
            id={"product_status_" + tableMeta.rowData[12]}
            checked={status === true ? true : false}
            value={status}
            onChange={this.handleStatusChange.bind(this, tableMeta.rowData[12])}
          /></div>)
        }
      }
    }, 
   
    {
      name: "mediaStatus",
      label: "Image Status",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (mediaStatus, tableMeta) => {
          return <Toggle
            id={"product_media_" + tableMeta.rowData[12] }
            checked={mediaStatus === true ? true : false}
            value={mediaStatus}
            onChange={this.handleMediaChange.bind(this, tableMeta.rowData[12])}
          />
        }
      }
    },
    {
      name: "descriptionStatus",
      label: "description Status",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (descriptionStatus, tableMeta) => {
          return <Toggle
            id={"product_description_" + tableMeta.rowData[12]}
            checked={descriptionStatus === true ? true : false}
            value={descriptionStatus}
            onChange={this.handleDescriptionChange.bind(this, tableMeta.rowData[12])}
          />
        }
      }
    },
    {
      name: "id",
      label: "Action",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (id, tableMeta) => {
          return <div>
            <Link to={"/products/add/" + id}
              className="m-r-15 text-muted"
              data-toggle="tooltip"
              data-placement="top" title=""
              data-original-title="Edit">
              <i className="f-20 icofont icofont-ui-edit text-custom"></i>
            </Link>
            {/* <Link to={"/products/gallery/" + id}
              className="m-r-15 text-muted"
              data-toggle="tooltip"
              data-placement="top" title=""
              data-original-title="Product Gallery">
              <i className="f-20 icofont icofont-picture text-primary"></i>
            </Link> */}
            {
              localStorage.getItem('q8_mall_ad_role') === "shop"
                ?
                <Link to={"/products/stock/" + id}
                  className="m-r-15 text-muted"
                  data-toggle="tooltip"
                  data-placement="top" title=""
                  data-original-title="Product Stock Details">
                  <i className="f-20 icofont icofont-stock-mobile text-warning"></i>
                </Link>
                :
                null
            }
            <span onClick={this.deleteAttributeValue.bind(this, id)}
              className="m-r-15 text-muted"
              data-toggle="tooltip"
              data-placement="top"
              title=""
              data-original-title="Delete">
              <i className="f-20 icofont icofont-delete-alt text-danger"></i>  </span>
          </div >
        }

      }
    }
    ];
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
            'Sorry, No Product Found',
          toolTip: "Sort",
          columnHeaderTooltip: column => `Sort for ${column.label}`
          
        },
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
                      <h4>Product List</h4>
                    </div>
                  </div>
                  {
                    localStorage.getItem('q8_mall_ad_role') === "shop"
                      ?
                      <div className="f-right">
                        <Link to="/products/add" className="btn btn-sm btn-inverse waves-effect waves-light d-inline-block md-trigger" data-modal="modal-13"> <i className="icofont icofont-plus m-r-5"></i> Add Product </Link>
                        {" "+" "}
                        <Link
                          to={"/importData/"+"products"}
                          className="btn btn-sm btn-inverse waves-effect waves-light d-inline-block md-trigger"  data-modal="modal-13">Import Sheet</Link>
                        
                        <Link to="/" className="btn btn-sm btn-outline-dark waves-effect waves-light d-inline-block md-trigger ml-3" data-modal="modal-13"> <i className="icofont icofont-arrow-left m-r-5"></i> Back </Link>
                       
                      </div>
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
                      <li className="breadcrumb-item active">Product List</li>
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

                        {
                          localStorage.getItem('q8_mall_ad_role') === "shop"
                            ?
                            <MUIDataTable
                              title={"Product List"}
                              className="table-responsive"
                              data={this.state.product_list}
                              columns={shop_columns}
                              options={options}
                            />
                            :
                            <MUIDataTable
                              title={"Product List"}
                              className="table-responsive"
                              data={this.state.product_list}
                              columns={columns}
                              options={options}
                            />
                        }

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

export default ProductList;
