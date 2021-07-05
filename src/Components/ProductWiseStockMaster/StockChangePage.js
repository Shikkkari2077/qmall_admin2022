import React from 'react';
import { Link } from 'react-router-dom'
import Constant from '../../Constant'
import Loader from '../../Loader'
import Swal from 'sweetalert2'
import MUIDataTable from "mui-datatables";
import "react-toggle/style.css" // for ES6 modules
import Toggle from 'react-toggle'
import $ from 'jquery';
import Pagination from 'react-js-pagination';

class StockChangePage extends React.Component {
  state = {
   datarange:0,
   dataLength:50,
    count:'',
    product_list:[],
    StockId:'',
    ProductId:''
  }
  getProductWiseStockList = (range) => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    // if (localStorage.getItem('q8_mall_ad_role') === "shop") {
    //   data.append("ShopId", localStorage.getItem('q8_mall_ad_uid'));
    // }
    data.append("startRange",range);
    data.append("dataLength", this.state.dataLength);

    data.append("shopId", localStorage.getItem('q8_mall_ad_uid'));
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
 
  getProductList = () => {
      console.log("called")
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
       console.log(json.data)

      if (json.status === true) {
       
        that.setState({ product_list: [], isSaving: false });
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
    this.getProductWiseStockList('0');

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
handlePageChange=()=>{

}
 
previous=(event)=>{
 if(this.state.datarange>0)
 var range=this.state.datarange-50

 {
   this.setState({
     datarange:range,
   })
 }
 this.getProductWiseStockList(range)
}
next=()=>{
  var range=this.state.datarange+50
  this.setState({
    datarange:range,
  })
  this.getProductWiseStockList(range)


}
 
  render() {
    const shop_columns = [
  
    {
      name: "Product",
      label: "Product Name",
      options: {
        filter: false,
        sort: false,
        customBodyRender:(Product)=>{
          return(
            Product.name_en
          )

        }
      }
    },
     {
      name: "Product",
      label: "Product ID",
      options: {
        filter: false,
        sort: false,
        customBodyRender:(Product)=>{
          return(
            Product.unique_identifier!== undefined ? Product.unique_identifier : null
          )
      }
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
    }, 
    {
      name: "price",
      label: "Variant Pricing",
      options: {
        filter: true,
        sort: true,
        
      }
    }, {
      name: "id",
      label: "Action",
      options: {
        display:false,
        filter: true,
        sort: true,
        customBodyRender: (id, tableMeta) => {
          return <div>
            <Link to={"/products/stock/" + this.props.match.params.product_id + "/add/" + id}
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
              <i className="f-20 icofont icofont-delete-alt text-danger"></i>  </span> */}
          </div>
        }

      }
    },
   { 
     name: "stock",
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
                       onChange={this.changeStock.bind(this,tableMeta.rowData[5],tableMeta.rowData[8])}
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
      name:"ProductId",
      options:{
        display:false,
      }
    }
    ];
   
    const options = {
      filterType: "dropdown",
      viewColumns: false,
      print: false,
      download: false,
      selectableRows: 'none',
      pagination:false,
      filter:false,
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
                      <h4>Stock Update</h4>
                    </div>
                  </div>
                  {/* {
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
                  } */}
                </div>
                <div className="col-lg-4">
                  <div className="page-header-breadcrumb">
                    <ul className="breadcrumb-title">
                      <li className="breadcrumb-item">
                        <Link to="/">
                          <i className="feather icon-home"></i> </Link>
                      </li>
                      <li className="breadcrumb-item active">Stock Update</li>
                      
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
                        <h6 className="text-danger">* After enter value of stock click on <i className="f-24 icofont icofont-refresh text-primary"> </i>To Update </h6>
                        <h6 className="text-danger">* Update one stock at a time. </h6>

                      <div className="dt-responsive table-responsive">

                        {
                        //   localStorage.getItem('q8_mall_ad_role') === "shop"
                        //     ?
                            <MUIDataTable
                              className="table-responsive"
                              data={this.state.product_list}
                              columns={shop_columns}
                              options={options}
                            />
                            // :
                            // <MUIDataTable
                            //   title={"Product List"}
                            //   className="table-responsive"
                            //   data={this.state.product_list}
                            //   columns={columns}
                            //   options={options}
                            // />
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
													
														{/* <Pagination
															itemClass="page-item"
															linkClass="page-link"
															activePage={this.state.activePage}
															itemsCountPerPage={10}
															totalItemsCount={this.state.totalProducts}
															pageRangeDisplayed={20}
															onChange={this.handlePageChange.bind(this)}
														/> */}
                            <button onClick={this.previous} disabled={this.state.datarange <50 ?true:false}>
                              <i className="f-26 icofont icofont-simple-left"></i>
                           </button>&nbsp;&nbsp;
                            <button onClick={this.next} disabled={this.state.product_list.length < 50 ?true:false}>
                            <i className="f-26 icofont icofont-simple-right"></i>
                             </button>
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

export default StockChangePage;
