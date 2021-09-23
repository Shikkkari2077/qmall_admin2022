import React from 'react';
import { Link } from 'react-router-dom'
import Constant from '../../Constant'
import Swal from 'sweetalert2'
import Toggle from 'react-toggle'

import MUIDataTable from "mui-datatables";
import ProductMediaModal from './ProductMediaModal';

class ProductWiseStockList extends React.Component {
  state = {}
  deleteStockDetails = (id) => {
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
        data.append("StockId", id);
        fetch(Constant.getAPI() + "/product/stock/delete", {
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
            Swal.fire("Deleted!", "Product Stock deleted.", "success");
            that.getProductWiseStockList();
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
  getProductWiseStockList = () => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    // if (localStorage.getItem('q8_mall_ad_role') === "shop") {
    //   data.append("ShopId", localStorage.getItem('q8_mall_ad_uid'));
    // }
    data.append("productId", that.props.match.params.product_id);
    fetch(Constant.getAPI() + "/product/combination/list", {
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
      if (json.success === true) {
        that.setState({ product_list: json.data, isSaving: false });
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

    localStorage.setItem('Productaction',true)
    this.getProductWiseStockList();

  }
  handleStatusChange=(combinationId,productId,c)=>{
    const that=this
    console.log(combinationId,productId,c.target.checked)
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    data.append("showInListing", c.target.checked);
    data.append("productId",productId);
    data.append("combinationId", combinationId);
   
    fetch(Constant.getAPI() + "/product/combination/update", {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": localStorage.getItem('q8_mall_auth')
      },
      body: data
    }).then(function (response) {
      return response.json();
    }).then(function (json) {
      if (json.success === true) {
        that.getProductWiseStockList()
         that.setState({ isSaving: false, count:'', StockId:'', ProductId:'' })
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


  }
  changeStock=(combinationId,productId,e)=>{
    console.log(e.target.value,combinationId,productId)
    this.setState({
     count:e.target.value,
     combinationId,
     productId
    })
   }
   updateStock=()=>{
    var that = this;
   if( that.state.count>=0){
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    data.append("stock", that.state.count);
    data.append("productId", that.state.productId);
    data.append("combinationId", that.state.combinationId);
   
    fetch(Constant.getAPI() + "/product/combination/update", {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": localStorage.getItem('q8_mall_auth')
      },
      body: data
    }).then(function (response) {
      return response.json();
    }).then(function (json) {
      if (json.success === true) {
        that.getProductWiseStockList()
         that.setState({ isSaving: false, count:'', StockId:'', ProductId:'' })
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
  }
  

}

  onOpenMediaModal = (stock_id) => {
    var media = []
    for (var i = 0; i < this.state.product_list.length; i++) {
      if (this.state.product_list[i].id === stock_id) {
        media = this.state.product_list[i].stockGallery
      }
    }
    this.setState({ isOpen: true, stock_media: media });
  }
  onCloseMediaModal = () => {
    var media = []
    this.setState({ isOpen: false, stock_media: media });
  }
 
  render() {
    const columns = [
      {
        name: "Product",
        label: "Product Name",
        options: {
          filter: false,
          sort: false,
          customBodyRender:(Product)=>{
            return(
              Product!==null && Product.name_en !== null ? Product.name_en :"-"
            )
  
          }
        }
      },
       {
        name: "variantId",
        label: "variant ID",
        options: {
          filter: false,
          sort: false,
         
        
      }
  
      },
    
    {
      name: "barCode",
      label: "Bar Code",
      options: {
        filter: true,
        sort: true
      }
    },
 
    {
      name: "CombinationAttributes",
      label: "Attribute Values",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (CombinationAttributes, tableMeta) => {
          return <div>
            {  
              CombinationAttributes.length>0?
              CombinationAttributes.map(comb=>{
                return(
                  comb.Attribute.name_en !== "Default Attribute" ?
                  <li>{comb.Attribute.name_en +" "+"-"+" "+ comb.AttributeValue.name_en}</li>
                  :"-"
                )
              })
 
              :"-"
            
            }
          </div>
        }
      }
    }, {
      name: "price",
      label: "Variant Pricing",
      options: {
        filter: true,
        sort: true,
        
      }
    }, 
    {
      name: "specialPrice",
      label: "special Price",
      options: {
        filter: true,
        sort: true,
        
      }
    }, 
   { name: "stock",
    label: "Variant Stock",
    options: {
      filter: true,
      sort: true
    }
  }, 
    {
      name: "stock",
      label: "Update Stock",
      options: {
        filter: true,
        sort: true,
        customBodyRender:(stock,tableMeta)=>{
            return(
                  <div style={{paddingBottom:"5px"}}>
                      
                     <li >
                         
                      <input 
                      style={{width:"50px",height:"30px"}}
                      type="number" 
                      //value={stock}
                       onChange={this.changeStock.bind(this,tableMeta.rowData[9],tableMeta.rowData[10])}
                     />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                      
           <span 
           onClick={this.updateStock}
            className="m-r-15 text-muted"
            data-toggle="tooltip"
            data-placement="top"
            title=""
            data-original-title="tick">
            <i className="f-24 icofont icofont-refresh text-primary"></i>  </span> 
                      </li>
                      </div>
                    
                )
            

        }
      }
    },
    {
      name: "showInListing",
      label: "Listing status",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (showInListing, tableMeta) => {
          return (<div>
            {/* * {//console.log(tableMeta.rowData)} */}
          <Toggle
            id={"product_status_" + tableMeta.rowData[11]}
            checked={showInListing === true ? true : false}
            value={showInListing}
            onChange={this.handleStatusChange.bind(this,tableMeta.rowData[9],tableMeta.rowData[10])}
          /></div>)
        }
      }
    }, 
    {
      name: "id",
      label: "Action",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (id, tableMeta) => {
          return <div>
            <Link to={"/products/stock/" + tableMeta.rowData[10] + "/add/"+ id}
              className="m-r-15 text-muted"
              data-toggle="tooltip"
              data-placement="top" title=""
              data-original-title="Product Country Wise Price">
              <i className="f-20 icofont icofont-ui-edit text-custom"></i>
            </Link>
            {/* <Link to={"/products/price/" + id + "/" + this.props.match.params.product_id}
              className="m-r-15 text-muted"
              data-toggle="tooltip"
              data-placement="top" title=""
              data-original-title="Product Country Wise Price">
              <i className="f-20 icofont icofont-plus text-primary"></i>
            </Link> */}
            {/* <span onClick={this.onOpenMediaModal.bind(this, id)}
              className="m-r-15 text-muted"
              data-toggle="tooltip"
              data-placement="top"
              title=""
              data-original-title="View Gallery">
              <i className="f-20 icofont icofont-picture text-warning"></i>  </span> */}

            {/* <span onClick={this.deleteStockDetails.bind(this, id)}
              className="m-r-15 text-muted"
              data-toggle="tooltip"
              data-placement="top"
              title=""
              data-original-title="Delete">
              <i className="f-20 icofont icofont-delete-alt text-danger"></i>  </span>
              */}
          </div> 
        }

      }
    },
   
    {
      name:"ProductId",
      options:{
        display:false,
      }
    },
  
  ];
    const options = {
      filterType: "dropdown",
      viewColumns: false,
      rowsPerPage:"100",
      print: false,
      download: false,
      selectableRows: 'none',
      textLabels: {
        body: {
          noMatch: this.state.isSaving ?
            "Loading data..!" :
            "Sorry, No Product Wise Stock Found",
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
                      <h4>Product Variant List</h4>
                    </div>
                  </div>
                  {/* <Link to={"/products/stock/" + this.props.match.params.product_id + "/add"} 
                        className="btn btn-sm 
                        btn-inverse waves-effect waves-light
                         f-right d-inline-block md-trigger" 
                        data-modal="modal-13">
                     <i className="icofont icofont-plus m-r-5"></i> Add Product Wise Stock </Link> */}
                </div>
                <div className="col-lg-4">
                  <div className="page-header-breadcrumb">
                    <ul className="breadcrumb-title">
                      <li className="breadcrumb-item">
                        <Link to="/"> <i className="feather icon-home"></i> </Link>
                      </li>
                      <li className="breadcrumb-item">
                        <Link to="/products"> Products List </Link>
                      </li>
                      <li className="breadcrumb-item active">Product Wise Stock List</li>
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
                          className="table-responsive"
                          data={this.state.product_list}
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
        <ProductMediaModal isOpen={this.state.isOpen} onCloseModal={this.onCloseMediaModal} product_media={this.state.stock_media} />
      </div >
    );
  }
}

export default ProductWiseStockList;
