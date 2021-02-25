import React from 'react';
import { Link } from 'react-router-dom'
import $ from 'jquery';
import Constant from '../../Constant'
import Swal from 'sweetalert2'
import Barcode from 'react-barcode' // Generate Barcode
import './barcode-print.css';

class BarcodeList extends React.Component {
  state = {}

  deleteBarcode = (id) => {
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
        data.append("BarcodeId", id);
        fetch(Constant.getAPI() + "/shop/barcode/delete", {
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
            Swal.fire("Deleted!", "Shop Barcode deleted.", "success");
            that.getBarcodeList();
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
  getBarcodeList = () => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    // data.append("BranchId", that.props.match.params.branch_id);
    data.append("CurrencyId", Constant.getDefaultCurrrency());
    fetch(Constant.getAPI() + "/product/stock/getPrints", {
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
        that.setState({ barcode_list: json.data, isSaving: false });
      } else {
        that.setState({ barcode_list: [], isSaving: false });
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
    this.getBarcodeList();
  }
  onPrint = () => {
    var that = this;
    window.onbeforeprint = function (event) {
      //   // alert("beforePrint")
      if (localStorage.getItem('q8_mall_ad_role') !== "shop") {
        document.getElementById('admin_menu').classList.remove('pcoded-navbar');
        document.getElementById('admin_content').classList.remove('pcoded-content');
      }
      document.getElementById('print-barcode-html').classList.remove('hide');
      for (var i = 0; i < that.state.barcode_list.length; i++) {
        console.log(that.state.barcode_list[i].barNumber)
        document.getElementById('barcode_print_' + that.state.barcode_list[i].barNumber).classList.remove('noprint');
      }
      //   // return (<RetailerPrintInvoice />)
      document.title = "barcode_list";
    };
    window.onafterprint = function (event) {
      // alert("Printing completed...");
      // document.getElementById('invoice_detail').innerHTML = hidePrint
      if (localStorage.getItem('q8_mall_ad_role') !== "shop") {
        document.getElementById('admin_menu').classList.add('pcoded-navbar');
        document.getElementById('admin_content').classList.add('pcoded-content');
      }
      document.getElementById('print-barcode-html').classList.add('hide');
      for (var i = 0; i < that.state.barcode_list.length; i++) {
        
        document.getElementById('barcode_print_' + that.state.barcode_list[i].barNumber).classList.add('noprint');
      }
      document.title = "QMall";
    };
    window.print();
  }
  handleChange = (event) => {
    if(event.target.value.length == 0)
    {this.getBarcodeList() ;
      console.log("yy")
  }
  else{
   this.onSearch(event.target.value)
  }
    this.setState({ keyword: event.target.value });
}

  onSearch = (val) => {
    // this.setState({backButton:"true"})
    
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    // data.append("BranchId", that.props.match.params.branch_id);
    data.append("CurrencyId", Constant.getDefaultCurrrency());
    data.append("keyword", val);
    fetch(Constant.getAPI() + "/product/stock/getPrints", {
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
        that.setState({ barcode_list: json.data, isSaving: false });
      } else {
        that.setState({ barcode_list: [], isSaving: false });
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
  onPrint = () => {
    var that = this;
    window.onbeforeprint = function (event) {
      //   // alert("beforePrint")
      if (localStorage.getItem('q8_mall_ad_role') !== "shop") {
        document.getElementById('admin_menu').classList.remove('pcoded-navbar');
        document.getElementById('admin_content').classList.remove('pcoded-content');
      }
      document.getElementById('print-barcode-html').classList.remove('hide');
      for (var i = 0; i < that.state.barcode_list.length; i++) {
        document.getElementById('barcode_print_' + that.state.barcode_list[i].barNumber).classList.remove('noprint');
      }
      //   // return (<RetailerPrintInvoice />)
      document.title = "barcode_list";
    };
    window.onafterprint = function (event) {
      // alert("Printing completed...");
      // document.getElementById('invoice_detail').innerHTML = hidePrint
      if (localStorage.getItem('q8_mall_ad_role') !== "shop") {
        document.getElementById('admin_menu').classList.add('pcoded-navbar');
        document.getElementById('admin_content').classList.add('pcoded-content');
      }
      document.getElementById('print-barcode-html').classList.add('hide');
      for (var i = 0; i < that.state.barcode_list.length; i++) {
        
        document.getElementById('barcode_print_' + that.state.barcode_list[i].barNumber).classList.add('noprint');
      }
      document.title = "QMall";
    };
    window.print();
  }
  
  printBarcode = (barNumber) => {
    this.setState( {barcheck:barNumber})
    //alert("barNumber : " + barNumber);
    window.onbeforeprint = function (event) {
      //   // alert("beforePrint")
      console.log(barNumber)
      if (localStorage.getItem('q8_mall_ad_role') !== "shop") {
        document.getElementById('admin_menu').classList.remove('pcoded-navbar');
        document.getElementById('admin_content').classList.remove('pcoded-content');
      }
      console.log('barcode_print_' + barNumber)

      document.getElementById('print-barcode-html').classList.remove('hide');
      document.getElementById('barcode_print_' + barNumber).classList.remove('noprint');
      //   // return (<RetailerPrintInvoice />)
      document.title = "barcode_list";

    };
    window.onafterprint = function (event) {
      // alert("Printing completed...");
      // document.getElementById('invoice_detail').innerHTML = hidePrint
      if (localStorage.getItem('q8_mall_ad_role') !== "shop") {
        document.getElementById('admin_menu').classList.add('pcoded-navbar');
        document.getElementById('admin_content').classList.add('pcoded-content');
      }
      document.getElementById('print-barcode-html').classList.add('hide');
      console.log('barcode_print_' + barNumber)
      document.getElementById('barcode_print_' + barNumber).classList.add('noprint');
      document.title = "QMall";
      // document.title = 'barcode_print_' + barNumber;
    };
    window.print();
  }
  // sample=(bar)=>{
  //   this.setState({
  //     barcheck:bar
  //   })
  //}
  render() {
    return (
      <div className="pcoded-inner-content" >
        <div className="main-body">
          <div className="page-wrapper">
            <div className="page-header noprint">
              <div className="row align-items-end">
                <div className="col-lg-8">
                  <div className="row ">
                    <div className="col-lg-5">
                      <div className="page-header-title">
                        <div className="d-inline">
                          <h4>Shop Barcode List</h4>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-5">
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          name="keyword"
                          id="keyword"
                          placeholder="Search"
                          onChange={this.handleChange}
                          value={this.state.keyword}
                        />
                        <button className="btn btn-outline-dark btn-sm" onClick={this.onSearch}><i className="feather icon-search"></i></button>
                        {/* <div className="col-lg-5">
                        { this.state.backButton ?
                        <div>  <button className="btn btn-sm btn-print-invoice btn-inverse waves-effect waves-light f-right d-inline-block md-trigger"
                        // onClick={}
                        >
                          <i className="icofont icofont-print m-r-5"></i> Barcode List </button> </div>
                        :null
                          }
                          </div> */}
                      </div>
                    </div>
                    <div className="col-lg-2">
                      {/* <button className="btn btn-sm btn-print-invoice btn-inverse waves-effect waves-light f-right d-inline-block md-trigger"
                       onClick={this.onPrint}>
                         <i className="icofont icofont-print m-r-5"></i> Print </button> */}
                    </div>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="page-header-breadcrumb">
                    <ul className="breadcrumb-title">
                      <li className="breadcrumb-item">    
                        <Link to="/">
                          <i className="feather icon-home"></i> </Link>
                      </li>
                      <li className="breadcrumb-item active">Barcode List</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="page-body">

             <div className="hide" id="print-barcode-html">
                {
                  this.state.barcode_list !== undefined && this.state.barcode_list !== null && this.state.barcode_list !== [] && this.state.barcode_list.length > 0
                    ?
                    this.state.barcode_list.map(barcode =>
                      barcode.barNumber === this.state.barcheck
                      ?
                     <div>
                       {/* {console.log("3")} */}
                      <div className="row" key={barcode.barNumber} id={"barcode_print_" + barcode.barNumber}>
                        <page size="">
                          <div class="mainDiv">
                            <div class="rowC">{barcode.name}</div>
                            <div class="rowD"><strong>Price : {barcode.price ? barcode.price : '0'} {Constant.getDefaultCurrrency()}</strong></div>
                            <div class="rowA"><Barcode value={barcode.barNumber} /*format="EAN13" */ height="55" width="2" displayValue={false} /></div>
                            <div class="rowB">{barcode.barNumber}</div>
                            
                          </div>
                        </page>
                        <div class="page-divide" />
                      </div>
                     
                    </div>
                    :null
                    )
                    : null
                }
              </div>
             

              <div className="row noprint" id="print-barcode">
                {
                  this.state.barcode_list !== undefined && this.state.barcode_list !== null && this.state.barcoplde_list !== [] && this.state.barcode_list.length > 0
                    ?
                    this.state.barcode_list.map(barcode =>
                      <div className="col-4 noprint" key={barcode.barNumber}>
                        <div id={"barcode_" + barcode.barNumber}>
                        <div className={barcode.isPrimary ? "card bg-light text-center" : "card text-center"}>
                          <div className="card-header noprint">
                            <div className="card-header-right">
                              <ul className="list-unstyled card-option">
                                {/* <Link to={"/barcode/print/" +barcode.barNumber}><i className="feather icon-printer" ></i></Link> */}
                                <Link to={"/barcode/print/" +barcode.barNumber}><i className="feather icon-printer " style={{color:"grey"}} ></i></Link>
                                {/* <Link to={"/barcode/print2/" +barcode.barNumber}><i className="feather icon-printer" ></i></Link>
                                <Link to={"/barcode/print3/" +barcode.barNumber}><i className="feather icon-printer" ></i></Link>
                                <Link to={"/barcode/print3/" +barcode.barNumber}><i className="feather icon-printer" ></i></Link> */}

                                {/* <li><i className="feather icon-printer" onClick={this.printBarcode.bind(this, barcode.barNumber)} ></i></li> */}
                              </ul>
                            </div>
                          </div>
                          <page size="">
                            <div class="mainDiv">
                              <div class="rowC">{barcode.name}</div>
                              <div class="rowD"><strong>Price : {barcode.price ? barcode.price : '0'} {Constant.getDefaultCurrrency()}</strong></div>
                              <div class="rowA"><Barcode value={barcode.barNumber} /*format="EAN13" */ height="55" width="2" displayValue={true} /></div>
                              {/* <div class="rowB">{barcode.barNumber}</div> */}
                            </div>
                          </page>
                          <div class="page-divide" />
                        </div>
                        </div>
                        {}
                      </div>
                    )
                    : null
                }
              </div>
       
              
              
            </div>
          </div>
        </div>
      </div >
    );
  }
}

export default BarcodeList;
