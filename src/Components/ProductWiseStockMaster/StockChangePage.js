import React from 'react';
import { Link } from 'react-router-dom'
import Constant from '../../Constant'
import Loader from '../../Loader'
import Swal from 'sweetalert2'
import MUIDataTable from "mui-datatables";
import "react-toggle/style.css" // for ES6 modules
import Toggle from 'react-toggle'
import $ from 'jquery';

class StockChangePage extends React.Component {
  state = {

    count:'',
    StockId:'',
    ProductId:''
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
       console.log(json.data)

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
 

  changeStock(id,productId,e){
   console.log(e.target.value,id,productId)
   this.setState({
    count:e.target.value,
    StockId:id,
         ProductId:productId
   })
  }

  updateStock(){
        var that = this;
       
        var data = new URLSearchParams();
        this.setState({ isSaving: true });
        data.append("count", that.state.count);
        
        data.append("ProductId", that.state.ProductId);
        data.append("StockId", that.state.StockId);
       
        fetch(Constant.getAPI() + "/product/stock/update", {
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
            Swal.fire("Stock Updated!", "", "success");
            that.getProductList()

           // window.location.href = `#/products/stock/${that.props.product_id}`
            that.setState({ isSaving: false, count:'',
                StockId:'',
                     ProductId:'' })
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
 
 
  render() {
    const shop_columns = [{
      name: "productMedia",
      label: "Image",
      options: {
          filter:false,
          sort:false,
      
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
      label: "Product Name",
      options: {
        filter: true,
        sort: true,
        customBodyRender:(name_en,tableMeta)=>{
            return(
                name_en+" "+"/"+" "+tableMeta.rowData[3]
            )
        }
        
      }
    },
     {
      name: "name_ar",
      label: "Product Name:Arabic",
      options: {
          display:false,
        filter: true,
        sort: true
      }
    },
    {
        name: "id",
        label: "ProductId",
        options: {
            display:false,
      
        }
      },

     {
      name: "stock",
      label: "Product Total Stock",
      options: {
        filter: true,
        sort: true
      }
    },
     {
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
    },
    {
        name: "Stocks",
        label: "Barcode",
        options: {
          filter: true,
          sort: true,
          customBodyRender:(Stocks)=>{
              return(
                  Stocks.map(stock=>(
                      <li >{
                    stock.barNumber
          }</li>
                      
                  ))
              )

          }
        }
      },
   
    {
        name: "Stocks",
        label: "Attribute Value Stock Wise",
        options: {
          filter: true,
          sort: true,
          customBodyRender:(Stocks)=>{
              return(
                  Stocks.map(stock=>(
                      //console.log(stock)
                      <li style={{listStyle:"decimal"}}>{
                      stock.AttributeValues.map(attribute=>(
                        //   <li style={{ listStyle:"disc" }}>{
                            attribute.name+" "+","+" "
                            // }</li>
                      ))
          }</li>
                      
                  ))
              )

          }
        }
      },
      {
        name: "Stocks",
        label: "Price",
        options: {
          filter: true,
          sort: true,
          customBodyRender:(Stocks)=>{
              return(
                  Stocks.map(stock=>(
                      <li>{
                       stock.Prices.map(price=>(
                        price.value
                     ))
          }</li>
                      
                  ))
              )

          }
        }
      },
      {
        name: "Stocks",
        label: "Stock",
        options: {
          filter: true,
          sort: true,
          customBodyRender:(Stocks)=>{
              return(
                  Stocks.map(stock=>(
                      <li>{
                     stock.count}</li>))
              )}}
      },
      {
        name: "Stocks",
        label: "Update Stock",
        options: {
          filter: true,
          sort: true,
          customBodyRender:(Stocks,tableMeta)=>{
              return(
                  Stocks.map(stock=>(
                    <div style={{paddingBottom:"5px"}}>
                        
                       <li >
                           
                        <input 
                        style={{width:"50px",height:"30px"}}
                        type="number" 
                        //value={}
                        onChange={this.changeStock.bind(this,stock.id,tableMeta.rowData[4])}/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                        
             <span onClick={this.updateStock.bind(this)}
              className="m-r-15 text-muted"
              data-toggle="tooltip"
              data-placement="top"
              title=""
              data-original-title="tick">
              <i className="f-24 icofont icofont-refresh text-primary"></i>  </span> 
                        </li>
                        </div>
                      
                  ))
              )

          }
        }
      },
  
    
   
    //  {
    //   name: "status",
    //   label: "Status",
    //   options: {
    //     filter: true,
    //     sort: false,
    //     customBodyRender: (status, tableMeta) => {
    //       return <div>
    //         {
    //           status
    //             ?
    //             <span className="badge badge-success">Approved</span>
    //             :
    //             <span className="badge badge-danger">Pending</span>
    //         }
    //       </div>
    //     }
    //   }
    // },
    //  {
    //   name: "id",
    //   label: "Action",
    //   options: {
    //     filter: true,
    //     sort: true,
    //     customBodyRender: (id, tableMeta) => {
    //       return <div>
    //         <Link to={"/products/add/" + id}
    //           className="m-r-15 text-muted"
    //           data-toggle="tooltip"
    //           data-placement="top" title=""
    //           data-original-title="Edit">
    //           <i className="f-20 icofont icofont-ui-edit text-custom"></i>
    //         </Link>
    //         {/* <Link to={"/products/gallery/" + id}
    //           className="m-r-15 text-muted"
    //           data-toggle="tooltip"
    //           data-placement="top" title=""
    //           data-original-title="Product Gallery">
    //           <i className="f-20 icofont icofont-picture text-primary"></i>
    //         </Link> */}
    //         {/* {
    //           localStorage.getItem('q8_mall_ad_role') === "shop"
    //             ?
    //             <Link to={"/products/stock/" + id}
    //               className="m-r-15 text-muted"
    //               data-toggle="tooltip"
    //               data-placement="top" title=""
    //               data-original-title="Product Stock Details">
    //               <i className="f-20 icofont icofont-stock-mobile text-warning"></i>
    //             </Link>
    //             :
    //             null
    //         }
    //         <span onClick={this.deleteAttributeValue.bind(this, id)}
    //           className="m-r-15 text-muted"
    //           data-toggle="tooltip"
    //           data-placement="top"
    //           title=""
    //           data-original-title="Delete">
    //           <i className="f-20 icofont icofont-delete-alt text-danger"></i>  </span> */}
    //       </div >
    //     }

    //   }
    // }
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
