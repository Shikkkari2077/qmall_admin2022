import React from 'react';
import { Link } from 'react-router-dom'
import Constant from '../../Constant'
import Swal from 'sweetalert2'
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
    this.getProductWiseStockList();

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
    //   {
    //   name: "Product.name_en",
    //   label: "Product Name",
    //   options: {
    //     filter: true,
    //     sort: true
    //   }
    // },
     {
      name: "stock",
      label: "Variant Stock",
      options: {
        filter: true,
        sort: true
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
    // {
    //   name: "variantId",
    //   label: "Varient Id",
    //   options: {
    //     filter: true,
    //     sort: true
    //   }
    // },
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
        // customBodyRender: (price, tableMeta) => {
        //   return <div>
        //     {
        //       // Prices !== null && Prices !== [] && Prices.length > 0
        //       //   ?
        //       //   <ul type="square">
        //       //     {
        //       //       Prices.map(price_data =>
        //       //         <li key={price_data.id}>
        //       //           {/* <span className="text-line-through"> */}
        //       //           <span>
        //       //             Original Price : {price_data.value} {price_data.CurrencyId}
        //       //           </span> <br />
        //       //           <span>
        //       //             Special Price : {price_data.specialPrice} {price_data.CurrencyId}
        //       //           </span>
        //       //         </li>
        //       //       )
        //       //     }
        //       //   </ul>
        //       //   :
        //       //   "-"
        //     }
        //   </div>
        // }
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
            <Link to={"/products/price/" + id + "/" + this.props.match.params.product_id}
              className="m-r-15 text-muted"
              data-toggle="tooltip"
              data-placement="top" title=""
              data-original-title="Product Country Wise Price">
              <i className="f-20 icofont icofont-plus text-primary"></i>
            </Link>
            {/* <span onClick={this.onOpenMediaModal.bind(this, id)}
              className="m-r-15 text-muted"
              data-toggle="tooltip"
              data-placement="top"
              title=""
              data-original-title="View Gallery">
              <i className="f-20 icofont icofont-picture text-warning"></i>  </span> */}

            <span onClick={this.deleteStockDetails.bind(this, id)}
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
