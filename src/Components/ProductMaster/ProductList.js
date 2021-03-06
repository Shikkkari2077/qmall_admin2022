import React from 'react';
import { Link } from 'react-router-dom'
import Constant from '../../Constant'
import Loader from '../../Loader'
import Swal from 'sweetalert2'
import MUIDataTable from "mui-datatables";
import "react-toggle/style.css" // for ES6 modules
import Toggle from 'react-toggle'
import Pagination from 'react-js-pagination';

import $ from 'jquery';
import { ContactSupportOutlined } from '@material-ui/icons';

class ProductList extends React.Component {
  state = {
    datarange:0,
    checkedLang:false,
    dataLength:20,
    activePage:1,
    lang:"",
    value2:'productID',
    filterValue2:'selectSection',
    filterValue:''
  }
  deleteAttributeValue = (id,ShopId) => {
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
        data.append("productId", id);
        data.append("ShopId",ShopId);
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
            that.getProductList(that.state.dataLength,that.state.datarange,that.state.byID,that.state.byname);
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
 
  getProductList = (count,startRange, uniqueidentifier,name,lang) => {
    var that = this;
    var data ={}
    this.setState({ isSaving: true });
    // if (localStorage.getItem('q8_mall_ad_role') === "shop") {
     
    //   data={
    //   count,
    //   startRange,
    //   ShopId:localStorage.getItem('q8_mall_ad_uid')
    //   } 
    // }
    // else{
    //   data={
    //     count,
    //     startRange,
    //   }
    // }
    // if(name !== "" )
    // {
    //   data={...data,'keyword':name,'lang':lang}
    // }
    // if(uniqueidentifier !== "")
    // {
    //   data={...data,'unique_identifier':uniqueidentifier}
    // }


    data = {
      count:this.state.dataLength,
      startRange:this.state.datarange,
    }
    if(this.state.value2=='productID' && this.state.filterValue){
      data = {ProductId:parseInt(this.state.filterValue)}
    }else{
      if(this.state.value2='shopName'){
        data = {...data,ShopId:this.state.filterValue}
      }else{}
    }

    if(this.state.filterValue2!='selectSection'){
      data = {...data,SectionId:this.state.filterValue2}
    }else{}


    fetch(Constant.getAPI() + "/product/getByAdmin2", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem('q8_mall_auth')
      },
      body:JSON.stringify(data)
    }).then(function (response) {
      return response.json();

    }).then(function (json) {

      if (json.status == true) {
        var products = []
        // for (var i = 0; i < json.data.length; i++) {
        //   var obj = json.data[i];
        //   if (json.data[i].Shop !== null) {
        //     obj.Shop_name = json.data[i].Shop.name_en
        //   } else {
        //     obj.Shop_name = '-'
        //   }
        //   var stock = 0;
        //   // if (json.data[i].Stocks !== null) {
        //   //   for (var j = 0; j < json.data[i].Stocks.length; j++) {
        //   //     stock = parseInt(stock) + parseInt(json.data[i].Stocks[j].count)
        //   //   }
        //   // }
         
        //   obj.stock = stock
        //   products.push(obj);
        //   console.log(products)
        // }
       // that.setState({ product_list: products, isSaving: false });
        that.setState({ product_list: json.data,count:json.count,totalProducts:json.totalProducts, isSaving: false });
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
      //console.log(json)
      if (json.status === true) {
        that.setState({ users_data: json.data, isSaving: false });
      } else {
        that.setState({ users_data: [], isSaving: false });
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
  componentDidMount() {
    if(localStorage.getItem('Productaction') == 'true'){
      console.log(activePage,localStorage.getItem('ProductPage'))

      localStorage.setItem('Productaction',false)
      this.getProductList(this.state.dataLength,JSON.parse(localStorage.getItem('ProductPage')))

       var activePage 
       if(localStorage.getItem('ProductPage') === 0)
        activePage=1
       else
        activePage=localStorage.getItem('ProductPage')/this.state.dataLength + 1

      console.log(activePage,localStorage.getItem('ProductPage'))

      this.setState({
        activePage
      })
    }
    else{
    this.getProductList(this.state.dataLength,this.state.datarange)
    }

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
      if (json.status === 200) {
        Swal.fire("Product Activation!", "Product activation has been updated.", "success");
        that.getProductList(0,10,this.state.byID,this.state.byname,this.state.lang);
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
      if (json.status == true) {
        //Swal.fire("Update Status!", "Status has been updated.", "success");
        that.getProductList(that.state.dataLength,that.state.datarange,that.state.byID,that.state.byname,that.state.lang);
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
      console.log(json)
      if (json.status === true) {
        that.getProductList(that.state.dataLength,that.state.datarange,that.state.byID,that.state.byname,that.state.lang);

        
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
        that.getProductList(that.state.dataLength,that.state.datarange,that.state.byID,that.state.byname,that.state.lang);
        ;
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
 
  handlePageChange(pageNumber) {

		const range = pageNumber * 10 - 10;
		const dataLength = this.state.dataLength;
   this.getProductList(dataLength,range,this.state.byID,this.state.byname)
	
		this.setState({
			datarange: range,
      activePage: pageNumber 
		});
	}
  search=(e)=>{
    if(e.target.value.length == 0)
    { this.getProductList(10,0)
      this.setState({
        byname:"",
        byID:"",
        search:"",
      })
    }
   this.setState({
     search:e.target.value
   })
  

  }
  checkedbox=(event)=>{
    if(event.target.checked == true){
      this.setState({
        checkedLang:event.target.checked,
        lang:"ar"
      })
      
    }else{
      this.setState({
        checkedLang:event.target.checked,
        lang:""
      })
    }
   
  }
  byID=()=>{
    this.getProductList(10,0,this.state.search)
    this.setState({
      startRange:0,
      byID:this.state.search,
      byname:"",
      activePage:1
})

  }
  byName=()=>{
    this.getProductList(10,0,"",this.state.search,this.state.lang)
    this.setState({
      startRange:0,

      byname:this.state.search,
      byID:"",
      activePage:1

    })

  }
  handleFetch2=(event)=>{
    this.setState({value2: event.target.value})
   }

   handleFetch3=(event)=>{
    this.setState({filterValue: event.target.value})
   }
   handleFetch4=(event)=>{
    this.setState({filterValue2: event.target.value})
   }



  render() {
    const shop_columns = [{
      name: "productMedia",
      label: "Image",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (productMedia, tableMeta) => {
          return (<img src={productMedia !== undefined
             && productMedia !== null 
             && productMedia !== {} ? productMedia.url : localStorage.getItem("companylogo")} className="img-fluid img-40" alt="tbl" />)
        }
      }
    },
    {
      name: "unique_identifier",
      label: "Product ID",
      options: {
        filter: false,
        sort: false
      }
    },  {
      name: "name_en",
      label: "Product Name:English",
      options: {
        filter: false,
        sort: false
      }
    }, {
      name: "name_ar",
      label: "Product Name:Arabic",
      options: {
        filter: false,
        sort: false
      }
    }, {
      name: "stock",
      label: "Product Total Stock",
      options: {
        display:false,
        filter: false,
        sort: false
      }
    },
    {
      name: "Section",
      label: "Product Section",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (Section, tableMeta) => {
          return <div>
            {
              Section !== null && Section !== undefined
                ?
                <div>{Section.name_en 
                }<br/>{Section.name_ar
                }
                  </div>
                :
                null
            }
          </div >
        }
      }
    },
    // {
    //   name: "Category",
    //   label: "Product Sub Category",
    //   options: {
    //     filter: false,
    //     sort: false,
    //     customBodyRender: (Category, tableMeta) => {
    //       return <div>
    //         {
    //           Category !== undefined && Category !== null 
    //           && Category.parent !== undefined && Category.parent !== null
              
    //             ?
    //             Category.parent.name !== undefined 
    //             &&  Category.parent.name !== null && Category.parent.name !== '0'
    //             ?<div>
    //              {Category.parent.name_en} <br/>{Category.parent.name_ar}
    //              </div> 
    //             :""
    //             :null
    //         }
    //       </div >
    //     }
    //   }
    // },
    // {
    //   name: "Attributes",
    //   label: "Product Attributes",
    //   options: {
    //     filter: true,
    //     sort: false,
    //     customBodyRender: (Attributes, tableMeta) => {
    //       return <div>
    //         {/* {console.log(Attributes)} */}
    //         {      

    //           Attributes !== null && Attributes !== [] && Attributes.length > 0
    //             ?
    //             <ol>
    //               { 
    //                 Attributes.map(product_attr =>
    //                   product_attr.name_en !== "Default Attribute"?
    //                   <li key={product_attr.id}>{product_attr.name_en}</li>
    //                   :null
    //                 )
    //               }
    //             </ol>
    //             :
    //             "-"
    //         }
    //       </div >
    //     }
    //   }
    // },
     {
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
        filter: false,
        sort: true,
        customBodyRender: (id, tableMeta) => {
          return <div>
            <Link to={"/products/add/" + id}
              className="m-r-15 text-muted"
              data-toggle="tooltip"
              data-placement="top" title=""
              data-original-title="Edit"
              onClick={()=>{
                    
                localStorage.setItem('ProductPage',this.state.datarange)
                
              }}>
              <i className="f-20 icofont icofont-ui-edit text-custom"
              ></i>
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
                  data-original-title="Product Stock Details"
                  onClick={()=>{
                    
                    localStorage.setItem('ProductPage',this.state.datarange)
                    
                  }}>
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
        filter: false,
        sort: false,
        customBodyRender: (productMedia, tableMeta) => {
          return (<img src={productMedia !== undefined && productMedia !== null && productMedia !== {} ? productMedia.url : "./assets/images/icon.png"} className="img-fluid img-40" alt="tbl" />)
        }
      }
    }, {
      name: "unique_identifier",
      label: "Product ID",
      options: {
        filter: false,
        sort: false
      }
    },  {
      name: "name_en",
      label: "Product Name",
      options: {
        filter: false,
        sort: true
      }
    },
    {
      name: "name_ar",
      label: "Product Name:Arabic",
      options: {
        filter: false,
        sort: true
      }
    },{
      name: "stock",
      label: "Product Total Stock",
      options: {
        filter: true,
        sort: true,
        display:false,
      }
    }, {
      name: "Shop",
      label: "Shop Name",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (Shop, tableMeta) => {
          return <div>
            {
              Shop !== null
                ? Shop.name_en
                :"-"
            }
          </div >
        }
      }
    },
    
    {
      name: "Section",
      label: "Product Section",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (Section, tableMeta) => {
          return <div>
            {
              Section !== null && Section !== undefined
                ?
                <div>{Section.name_en 
                }<br/>{Section.name_ar
                }
                  </div>
                :
                null
            }
          </div >
        }
      }
    },
    // {
    //   name: "Category",
    //   label: "Product Sub Category",
    //   options: {
    //     filter: false,
    //     sort: false,
    //     customBodyRender: (Category, tableMeta) => {
    //       return <div>
    //         {
    //           Category !== undefined && Category !== null 
    //           && Category.parent !== undefined && Category.parent !== null
              
    //             ?
    //             Category.parent.name !== undefined 
    //             &&  Category.parent.name !== null && Category.parent.name !== '0'
    //             ?<div>
    //              {Category.parent.name_en} <br/>{Category.parent.name_ar}
    //              </div> 
    //             :""
    //             :null
    //         }
    //       </div >
    //     }
    //   }
    // },
    //  {
    //   name: "Attributes",
    //   label: "Product Attributes",
    //   options: {
    //     filter: false,
    //     sort: false,
    //     customBodyRender: (Attributes, tableMeta) => {
    //       return <div>
    //         {
    //           Attributes !== null && Attributes !== [] 
    //           && Attributes.length > 0
    //             ?
    //             <ol>
    //               {
    //                 Attributes.map(product_attr =>
    //                   product_attr.name_en !== "Default Attribute"?

    //                   <li key={product_attr.id}>{product_attr.name_en}</li>
    //                   :null
    //                 )
    //               }
    //             </ol>
    //             :
    //             null
    //         }
    //       </div >
    //     }
    //   }
    // }, 
    {
      name: "isActive",
      label: "Active",
      options: {
        filter: true,
        sort: false,
        display:false,
        customBodyRender: (isActive, tableMeta) => {
          return <Toggle
            id={"product_isActive_" + tableMeta.rowData[11]}
            checked={isActive === true ? true : false}
            value={isActive}
            onChange={this.handleIsActiveChange.bind(this, tableMeta.rowData[11])}
          />
        }

      }
    }, {
      name: "status",
      label: "Active",
      options: {
        display:true,

        filter: true,
        sort: false,
        customBodyRender: (status, tableMeta) => {
          return (<div>
            {/* * {//console.log(tableMeta.rowData)} */}
          <Toggle
            id={"product_status_" + tableMeta.rowData[11]}
            checked={status === true ? true : false}
            value={status}
            onChange={this.handleStatusChange.bind(this, tableMeta.rowData[11])}
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
            id={"product_media_" + tableMeta.rowData[11] }
            checked={mediaStatus === true ? true : false}
            value={mediaStatus}
            onChange={this.handleMediaChange.bind(this, tableMeta.rowData[11])}
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
            id={"product_description_" + tableMeta.rowData[11]}
            checked={descriptionStatus === true ? true : false}
            value={descriptionStatus}
            onChange={this.handleDescriptionChange.bind(this, tableMeta.rowData[11])}
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
              data-original-title="Edit"
              onClick={()=>{
                localStorage.setItem('ProductPage',this.state.datarange)
              }}>
              <i className="f-20 icofont icofont-ui-edit text-custom"></i>
              
            </Link>
           
             <Link to={"/products/stock/" + id}
                  className="m-r-15 text-muted"
                  data-toggle="tooltip"
                  data-placement="top" title=""
                  data-original-title="Product Stock Details"
                  onClick={()=>{
                    
                    localStorage.setItem('ProductPage',this.state.datarange)
                    
                  }}>
                  
                  <i className="f-20 icofont icofont-stock-mobile text-warning"></i>
             </Link>
             
            <span onClick={this.deleteAttributeValue.bind(this, id,tableMeta.rowData[12])}
              className="m-r-15 text-muted"
              data-toggle="tooltip"
              data-placement="top"
              title=""
              data-original-title="Delete">
              <i className="f-20 icofont icofont-delete-alt text-danger"></i>  </span>
          </div >
        }

      }
    },
    {  name:"Shop.id",
       options:{
         display:"false"
       }

    }
    ];
    const options = {
      search:false,
      pagination:false,
      filterType: "dropdown",
      filter:false,
      viewColumns: false,
      print: false,
      download: false,
      selectableRows: 'none',
      // pagination:false,
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
                          className="btn btn-sm btn-inverse waves-effect waves-light d-inline-block md-trigger"
                            data-modal="modal-13">Import Sheet</Link>
                        
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
                    <div className="SpcialToolbar" style={{
                      gridTemplateColumns:'2fr 2fr 2fr 3fr',
                      gap:'0'
                    }}>
                      <div className="SLECTDIV">
                        {/* <h5>Filters</h5> */}
                        <select name="fetch" onChange={this.handleFetch2} value={this.state.value2} style={{width:'90%'}}>
                                    <option value="productID">Product ID</option>
                                    <option value="shopName">Shop Name</option>
                                    {/* <option value="sectionName">Section Name</option> */}
                        </select>
                      </div>
                      <div className="SLECTDIV_1">
                          {this.state.value2=='productID'?<div>
                            {/* <h5>Product ID</h5> */}
                            <input style={{width:'90%', marginLeft:'0rem'}} value={this.state.filterValue} onChange={this.handleFetch3} type="number" placeholder="Enter Product ID"/>
                          </div>:null}

                          {this.state.value2=='shopName'?(<div>
                            <select style={{width:'90%', marginLeft:'0rem'}} value={this.state.filterValue} onChange={this.handleFetch3}>
                                <option value="">- Select Shop -</option>
                                {this.state.users_data!=undefined?this.state.users_data.map(shop=>(
                                  <option value={shop.id}>{shop.name_en}</option>
                                  )):<option value='shop'>Shop Name</option>}
                            </select>
                          </div>):null}
                      </div>

                        <div className="SLECTDIV3">
                          <select style={{width:'90%', marginLeft:'-1rem'}} value={this.state.filterValue2} onChange={this.handleFetch4}>
                              <option value="">- Select Section -</option>
                              {this.state.category_data!=undefined?this.state.category_data.map(section=>(
                                <option value={section.id}>{section.name_en}</option>
                                )):<option value='section'>Section Name</option>}
                          </select>
                        </div>
                     
                      <div className="SLECTDIV_2">
                        {this.state.value2=='shopName'||this.state.value2=='productID'||this.state.value2=='sectionName'?<button onClick={this.getProductList}>GO</button>:null}          
                      </div>
                    </div>
                    </div>
                  </div>
                </div>
                <div className="col-sm-12">
                  <div className="card">
                    <div className="card-block">
                      <div className="dt-responsive table-responsive">

                        {
                          localStorage.getItem('q8_mall_ad_role') === "shop"
                            ?
                            <MUIDataTable
                              className="table-responsive"
                              data={this.state.product_list}
                              columns={shop_columns}
                              options={options}
                            />
                            :
                            <MUIDataTable
                              className="table-responsive"
                              data={this.state.product_list}
                              columns={columns}
                              options={options}
                            />
                        }
                        	<nav
													aria-label="Page navigation example "
													className="display-flex float-right"
												>
													<ul class="pagination">
														<li class="page-item mx-2 py-2">
															Count : {this.state.datarange}-
															{this.state.datarange + this.state.dataLength}
														</li>
													
														<Pagination
															itemClass="page-item"
															linkClass="page-link"
															activePage={this.state.activePage}
															itemsCountPerPage={10}
															totalItemsCount={this.state.totalProducts}
															pageRangeDisplayed={20}
															onChange={this.handlePageChange.bind(this)}
														/>
													</ul>
												</nav>

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
