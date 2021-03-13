import React from 'react';
import { Link } from 'react-router-dom'
import $ from 'jquery';
import Constant from '../../Constant'
import Swal from 'sweetalert2'
import MUIDataTable from "mui-datatables";

class ShopWiseProductList extends React.Component {
  state = {}
  handleStatusChange = (sid) => {
    var isChecked = $('#tyre_attribute_' + sid);
    isChecked.prop("checked", !isChecked.prop("checked"));
    //console.log(isChecked.prop('checked'), !isChecked.prop("checked"));
    if (!isChecked.prop("checked") === true) {
      var status = 'active'
    } else {
      var status = 'inactive'
    }
    let newArray = this.state.tyre_attribute_list;
    var a = newArray.find((element) => {
      return element.id === sid
    })
    a.status = status;
    //console.log(newArray)
    this.setState({ tyre_attribute_list: newArray })
    Swal.fire("Update Status!", "Status has been updated.", "success");
  }
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
            that.getShopWiseProductList();
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
  getShopWiseProductList = () => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    data.append("ShopId", that.props.match.params.shop_id);
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
        var products = []
        for (var i = 0; i < json.data.length; i++) {
          var obj = json.data[i];
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
    this.getShopWiseProductList();

  }
  render() {
    const columns = [{
      name: "name",
      label: "Product Name",
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
    }, {
      name: "Category",
      label: "Product Section",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (Category, tableMeta) => {
          return <span > {
            Category !== null
              ?
              Category.name_en
              :
              "-"
          }
          </span >
        }
      }
    }, {
      name: "Attributes",
      label: "Product Attributes",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (Attributes, tableMeta) => {
          return (<div>
            {
              Attributes !== null && Attributes !== [] && Attributes.length > 0
                ?
                <ol>
                  {
                    Attributes.map(product_attr =>
                      <li key={product_attr.id}>{product_attr.name_en}</li>
                    )
                  }
                </ol>
                :
                "-"
            }
          </div>
          )
        }
      }
      // }, {
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
      //         <span onClick={this.deleteAttributeValue.bind(this, id)}
      //           className="m-r-15 text-muted"
      //           data-toggle="tooltip"
      //           data-placement="top"
      //           title=""
      //           data-original-title="Delete">
      //           <i className="f-20 icofont icofont-delete-alt text-danger"></i>  </span>
      //       </div>
      //     }

      //   }
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
            "Sorry, No Products Found for the selected Shop.!",
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
                      <h4>Shop Wise Product List</h4>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="page-header-breadcrumb">
                    <ul className="breadcrumb-title">
                      <li className="breadcrumb-item">
                        <Link to="/"><i className="feather icon-home"></i> </Link>
                      </li>
                      <li className="breadcrumb-item">
                        <Link to="/shops">Shop List</Link>
                      </li>
                      <li className="breadcrumb-item active">Shop Wise Product List</li>
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
                          title={"Shop Wise Product List"}
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
      </div>
    );
  }
}

export default ShopWiseProductList;
