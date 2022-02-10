import React from "react";
import { Link } from "react-router-dom";
import $ from "jquery";
import Swal from "sweetalert2";
import Constant from "../../Constant";
import MUIDataTable from "mui-datatables";
import Pagination from 'react-js-pagination';

// import { Height } from "@material-ui/icons";
import moment from 'moment'
class OrderList extends React.Component {
  state = {
    activePage:1,
    dataLength:1,
    datarange:0,
    value:'all'
  };
  update=(id)=>{
    
    var that = this;
    var data = new URLSearchParams();
    data.append("clicked", true);
    data.append("orderId", id);
    fetch(Constant.getAPI() + "/product/order/clicked", {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": localStorage.getItem('q8_mall_auth')
      },
      body: data
    }).then(function (response) {
      return response.json();
    }).then(function (json) {
      
    });
    
  }
  handlePageChange(pageNumber) {
   this.setState({
     orders_list:[]
   })
		const range = pageNumber * 10 - 10;
		const dataLength = this.state.dataLength;
   this.getOrdersList(dataLength,range,this.state.value)
	
		this.setState({
			datarange: range,
      activePage: pageNumber 
		});
	}
  componentDidMount(){
    setInterval(this.getOrdersList(this.state.dataLength,this.state.datarange), 60000)
  }
  handleFetch=(event)=>{
   this.setState({value: event.target.value,orders_list:[]})
   //console.log(event.target.value)
   this.getOrdersList(this.state.dataLength,1,event.target.value)
  }
  handleFetch2=(event)=>{
    this.setState({value2: event.target.value})
   }

   handleFetch3=(event)=>{
    this.setState({filterValue: event.target.value})
   }

  componentWillMount() {
    //clearInterval(this.interval);
    
    this.getOrdersList(this.state.dataLength,this.state.datarange);
    this.setState({
      role:localStorage.getItem("q8_mall_ad_role")
    })
    //console.log(localStorage.getItem("q8_mall_ad_role"))
  }
  getOrdersList = (count,startRange,fetchvalue) => {
    //console.log("here")
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    //console.log(localStorage.getItem("q8_mall_auth")  )
    if(fetchvalue =='daily' ||fetchvalue =='monthly'||fetchvalue =='weekly')
    {
      data.append("fetch",fetchvalue)
    }
    else if(fetchvalue == 'all')
    {
      
    }

    data.append("startRange",startRange)
    data.append("count",20)

    fetch(Constant.getAPI() + "/product/order/get2", {
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
          // var orders = [];
          // for (var i = 0; i < json.data.length; i++) {
          //   var order_obj = json.data[i];
          //   var total_orders = 0;
          //   var completed_orders = 0;
          //   for (var j = 0; j < json.data[i].OrderShops.length; j++) {
          //     total_orders =
          //       json.data[i].OrderShops[j].OrderStocks.length + total_orders;
          //     if (json.data[i].OrderShops[j].status === "Delivered") {
          //       completed_orders =
          //         json.data[i].OrderShops[j].OrderStocks.length +
          //         completed_orders;
          //     } else {
          //       completed_orders = completed_orders;
          //     }
          //   }
          //   order_obj.complete_status = completed_orders + " / " + total_orders;
          //   if (completed_orders === total_orders) {
          //     order_obj.complete = true;
          //   } else {
          //     order_obj.complete = false;
          //   }
          //   var order_date = new Date(order_obj.createdAt);
          //   var order_day, order_month, order_year;
          //   if (order_date.getDate() > 9) {
          //     order_day = order_date.getDate();
          //   } else {
          //     order_day = "0" + order_date.getDate();
          //   }
          //   if (order_date.getMonth() + 1 > 9) {
          //     order_month = order_date.getMonth() + 1;
          //   } else {
          //     order_month = "0" + (order_date.getMonth() + 1);
          //   }
          //   order_year = order_date.getFullYear();

          //   var created_at = order_day + "-" + order_month + "-" + order_year;
          //   order_obj.create_date = created_at;
          //   orders.push(order_obj);
          // }
          that.setState({ orders_list: json.data,countFilterWise:json.countFilterWise, isSaving: false });
        } else {
          that.setState({ orders_list: [], isSaving: false });
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

  getOrdersList2 = () => {
    var that = this;
    var filter = this.state.value2
    var filterValue = this.state.filterValue
    var data = new URLSearchParams();
    this.setState({ isSaving: true });

    if(filter=='invoice'){
      data.append("invoice",filterValue)
      if(this.state.value =='daily' ||this.state.value =='monthly'||this.state.value =='weekly')
      {
        data.append("fetch",this.state.value)
      }
      else if(this.state.value == 'all'){}
      
    }else if(filter=='date'){
      data.append("date",filterValue)
      if(this.state.value =='daily' ||this.state.value =='monthly'||this.state.value =='weekly')
      {
        data.append("fetch",this.state.value)
        data.append("startRange",this.state.dataLength)
      }
      else if(this.state.value == 'all'){}
   
    }else if(filter=='paymentMethod'){
      data.append("paymentMethod",filterValue)
      if(this.state.value =='daily' ||this.state.value =='monthly'||this.state.value =='weekly')
      {
        data.append("fetch",this.state.value)
        // data.append("startRange",this.state.dataLength)
      }
      else if(this.state.value == 'all'){}
    }

  
   
   
    data.append("count",20)

    fetch(Constant.getAPI() + "/product/order/get2", {
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
          
          that.setState({ orders_list: json.data,countFilterWise:json.countFilterWise, isSaving: false });
        } else {
          that.setState({ orders_list: [], isSaving: false });
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


  render() {
    console.log('filterValue',this.state.filterValue);
    const columns = [
      {
        name: "invoice",
        label: "Invoice Id",
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        name: "User.userName",
        label: "User Name",
        options: {
          filter: true,
          sort: true,
        },
        // }, {
        //   name: "OrderShops",
        //   label: "Delivery",
        //   options: {
        //     filter: true,
        //     sort: true,
        //     customBodyRender: (OrderShops, tableMeta) => {
        //       return <ul>
        //         {
        //           OrderShops.map(shop =>
        //             shop.DeliveryType !== null ?
        //               <li>{shop.DeliveryType.name}</li>
        //               :
        //               null
        //           )
        //         }
        //       </ul >
        //     }
        //   }
      },
      {
        name: "createdAt",
        label: "Date",
        options: {
          filter: true,
          sort: true,
          customBodyRender: (createdAt, tableMeta) => {
            

            return <div>{moment(createdAt).format(" DD-MM-YY , hh:mm A ")}</div>;
          },
        },
      },
      // {
      //   name: "OrderShops.length",
      //   label: "Shop Included",
      //   options: {
      //     filter: true,
      //     sort: true,
      //   },
      // },
      {
        name: "totalAmount",
        label: "Amount",
        options: {
          filter: true,
          sort: true,
          customBodyRender: (totalAmount, tableMeta) => {
            return parseFloat(totalAmount).toFixed(3);
          },
        },
      },
      {
        name: "paymentMethod",
        label: "Payment Type",
        options: {
          filter: true,
          sort: true,
          download: false,
          customBodyRender: (paymentMethod, tableMeta) => {
            return (
              <div>
                {paymentMethod === "cod"? (
                  <label className="badge badge-primary text-uppercase">
                    {paymentMethod}
                  </label>
                ) : (
                  <label className="badge badge-secondary text-uppercase">
                    {paymentMethod}
                  </label>
                )}
              </div>
            );
          },
        },
      },
      { 
        
        name: "complete_status",
        label: "Delivery Completed Status",
        options: {
          filter: true,
          width: "100px",
          sort: true,
          
        }

      },
      
      {
        name: "deliveredToWarehouse",
        label: " ",
        options: {
          filter: true,
          sort: true,
          download: false,
          customBodyRender: (deliveredToWarehouse, tableMeta) => {
            return (
              <div
                className={
                  deliveredToWarehouse
                    ? "warehouse-delivery-blue"
                    : "warehouse-delivery-yellow"
                }
              >
                {" "}
                &nbsp;
              </div>
            );
          },
        },
      },
      {
        name: "viewedByAdmin",
        label: "Viewed By Admin",
        options: {
          display: false,
        },
      },
      {
        name: "viewedByShop",
        label: "Viewed By Shop",
        options: {
          display: false,
        },
      },
     
      {
        name: "complete",
        label: "Delivery Status",
        options: {
          filter: true,
          sort: true,
          customBodyRender: (complete, tableMeta) => {
            return (
              <div>
                {complete === true ? (
                  <label className="badge badge-success text-uppercase">
                    Delivered
                  </label>
                ) : (
                  <label className="badge badge-danger text-uppercase">
                    Not Delivered
                  </label>
                )}
              </div>
            );
          },
        },
      },
      {
        name: "clicked",
        label: "Clicked",
        options: {
          display:false,
      }
    },
   
      {
        name: "id",
        label: "Action",
        options: {
          filter: true,
          sort: true,
          download: false,
          
          customBodyRender: (id,tableMeta) => {
            return (
              <div>
                <Link
                  to={"/orders/view/" + id}
                  className="m-r-15 text-muted"
                  data-toggle="tooltip"
                  data-placement="top"
                  title=""
                  data-original-title="View"
                  onClick={ ()=>this.update(id) }
                >
                  <i className="f-22 icofont icofont-eye text-dark"></i>
                  
                </Link>

                {
                  
                   <Link
                  to={"/orders/view-print/" + id}
                  className="m-r-15 text-muted"
                  
                  >
                  {" "}
                  <i className="f-22 icofont icofont-print text-danger"></i>{" "}
                </Link> 
              }
               
              </div>
            );
          },
        },
      },
    ];
    const options = {
 
      filterType: "dropdown",
      search:false,
      filter:false,
      viewColumns: false,
      print: false,
      pagination:false,
      download: true,
      selectableRows: "none",
     
      setRowProps: (row,dataIndex, rowIndex) => {
        ////console.log(row)
        ////console.log(this.state.orders_list)
       // this.state.orders_list[this.state.count]
         

        // :""
        if(this.state.orders_list !== undefined){
          if (row[10] === true) {
            return {
              // className: clsx({
              //   [this.props.classes.BusinessAnalystRow]: row[7] === false
              // }),
              style: { backgroundColor: "lightgoldenrodyellow" },
            };
          }
        // } else {
        //   if (row[7] === true) {
        //     return {
        //       // className: clsx({
        //       //   [this.props.classes.BusinessAnalystRow]: row[7] === false
        //       // }),
        //       style: { backgroundColor: "lightgoldenrodyellow" },
        //     };
        //   }
         }
      },
      downloadOptions: {
        filename: "orders_list.csv",
        filterOptions: {
          useDisplayedColumnsOnly: true,
          useDisplayedRowsOnly: true,
        },
      },
      textLabels: {
        body: {
          noMatch: this.state.isSaving
            ? "Loading data..!"
            : "Sorry, No Orders Found",
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
                      <h4>Order List</h4>
                    </div>

                  </div>
                  <Link
                    to="/"
                    className="btn btn-sm btn-outline-dark waves-effect waves-light f-right d-inline-block md-trigger"
                    data-modal="modal-13"
                  >
                    {" "}
                    <i className="icofont icofont-arrow-left m-r-5"></i> Back{" "}
                  </Link>
                </div>
                <div className="col-lg-4">
                  <div className="page-header-breadcrumb">
                    <ul className="breadcrumb-title">
                      <li className="breadcrumb-item">
                        <Link to="/">
                          <i className="feather icon-home"></i>{" "}
                        </Link>
                      </li>
                      <li className="breadcrumb-item active">Order List</li>
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
                    <div className="SpcialToolbar">
                          <div className="SLECTDIV">
                            {/* <h5>Filters</h5> */}
                            <select name="fetch" onChange={this.handleFetch} value={this.state.value} >
                                        <option value="all">All</option>
                                        <option value="daily" >Daily</option>
                                        <option value="weekly">Weekly</option>
                                        <option value="monthly">Monthly</option>
                            </select>
                            <select name="fetch" onChange={this.handleFetch2} value={this.state.value2} >
                                        <option value="select">- Select -</option>
                                        <option value="invoice">Invoice ID</option>
                                        <option value="date">Date</option>
                                        <option value="paymentMethod">Payment Method</option>
                            </select>
                          </div>
                          <div className="SLECTDIV_1">
                              {this.state.value2=='invoice'?(<div>
                                {/* <h5>Invoce No.</h5> */}
                                <input value={this.state.filterValue} onChange={this.handleFetch3} type="number" placeholder="Enter Invoice ID"/>
                              </div>):null}
                              
                              {this.state.value2=='date'?<div>
                                {/* <h5>Date</h5> */}
                                <input value={this.state.filterValue} onChange={this.handleFetch3} type="date" placeholder="Enter Date"/>
                              </div>:null}
                              
                              {this.state.value2=='paymentMethod'?<div>
                                {/* <h5>Payment Method</h5> */}
                                {/* <input value={this.state.filterValue}  type="text" placeholder="Enter Method here"/> */}
                                <select onChange={this.handleFetch3} value={this.state.filterValue} id="">
                                  <option value=""> -Select- </option>
                                  <option value="cod">CASH</option>
                                  <option value="online">KNET</option>
                                </select>
                              </div>:null}
                          </div>
                          <div className="SLECTDIV_2">
                            {this.state.value2=='invoice'||this.state.value2=='date'||this.state.value2=='paymentMethod'?<button onClick={this.getOrdersList2}>GO</button>:null}          
                          </div>
                        </div>
                    </div>
                  </div>
                </div>
                <div className="col-sm-12">
                  <div className="card">
                    <div className="card-block">
                      <div className="dt-responsive table-responsive">
                      
                        <MUIDataTable
                        
                          // title={"Order List"}
                          className="table-responsive"
                          data={this.state.orders_list}
                          columns={columns}
                          options={options}
                        />
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
															totalItemsCount={this.state.countFilterWise}
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

export default OrderList;
