import React from 'react';
import { Link } from 'react-router-dom'
import Constant from '../../Constant'
import Swal from 'sweetalert2'
import MUIDataTable from "mui-datatables";

class ProductPriceList extends React.Component {
  state = {}
  deleteProductPrice = (id) => {
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
        data.append("PriceId", id);
        fetch(Constant.getAPI() + "/product/stock/price/delete", {
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
            Swal.fire("Deleted!", "Product Price deleted.", "success");
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
  getProductList = () => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    // if (localStorage.getItem('q8_mall_ad_role') === "shop") {
    //   data.append("ShopId", localStorage.getItem('q8_mall_ad_uid'));
    // }
    data.append("StockId", that.props.match.params.stock_id);
    fetch(Constant.getAPI() + "/product/stock/price/get", {
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
        that.setState({ product_price_list: json.data, isSaving: false });
      } else {
        that.setState({ product_price_list: [], isSaving: false });
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
  render() {
    const columns = [{
      name: "CurrencyId",
      label: "Currency",
      options: {
        filter: true,
        sort: true
      }
    }, {
      name: "value",
      label: "Price",
      options: {
        filter: true,
        sort: true
      }
    }, {
      name: "specialPrice",
      label: "Special Price",
      options: {
        filter: true,
        sort: true
      }
    }, {
      name: "id",
      label: "Action",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (id, tableMeta) => {
          return <div>
            <Link to={"/products/price/" + this.props.match.params.stock_id + "/" + this.props.match.params.product_id + "/add/" + id}
              className="m-r-15 text-muted"
              data-toggle="tooltip"
              data-placement="top" title=""
              data-original-title="Edit">
              <i className="f-20 icofont icofont-ui-edit text-custom"></i>
            </Link>
            <span onClick={this.deleteProductPrice.bind(this, id)}
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
            "Sorry, No Product Stock wise Price Found",
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
                <div className="col-lg-7">
                  <div className="page-header-title">
                    <div className="d-inline">
                      <h4>Product Stock Wise Price List</h4>
                    </div>
                  </div>
                  <Link to={"/products/price/" + this.props.match.params.stock_id + "/" + this.props.match.params.product_id + "/add"}
                   className="btn btn-sm btn-inverse waves-effect waves-light f-right d-inline-block md-trigger" data-modal="modal-13"> 
                  <i className="icofont icofont-plus m-r-5"></i> Add Product Price </Link>
                  <div>
                  </div>
                </div>
                <div className="col-lg-5">
                  <div className="page-header-breadcrumb">
                    <ul className="breadcrumb-title">
                      <li className="breadcrumb-item">
                        <Link to="/"> <i className="feather icon-home"></i> </Link>
                      </li>
                      <li className="breadcrumb-item">
                        <Link to="/products"> Products List </Link>
                      </li>
                      <li className="breadcrumb-item">
                        <Link to={"/products/stock/" + this.props.match.params.product_id}> Products List </Link>
                      </li>
                      <li className="breadcrumb-item active">Product Stock Wise Price List</li>
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
                          title={"Product Stock Wise Price List"}
                          className="table-responsive"
                          data={this.state.product_price_list}
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

export default ProductPriceList;
