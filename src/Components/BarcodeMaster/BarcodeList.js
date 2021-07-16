import React from 'react';
import { Link } from 'react-router-dom'
import $ from 'jquery';
import Constant from '../../Constant'
import Swal from 'sweetalert2'
import Barcode from 'react-barcode' // Generate Barcode
import './barcode-print.css';

class BarcodeList extends React.Component {
  state = {
           startRange:0,
           count:50,
           keyword:"",
           barcode_list:[]
          }

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
  getBarcodeList = (startRange) => {
    
    var that = this;
    that.setState({
      barcode_list:[]
    })
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    // data.append("BranchId", that.props.match.params.branch_id);
    if(this.state.keyword !== ""){
      data.append("keyword", this.state.keyword);

    }
    data.append("CurrencyId", Constant.getDefaultCurrrency());
    data.append("startRange", startRange);
    data.append("count", this.state.count);

    fetch(Constant.getAPI() + "/product/combination/getPrints", {
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
    this.getBarcodeList(0,this.state.count);
  }
  onPrint = () => {
    var that = this;
    window.onbeforeprint = function (event) {
      if (localStorage.getItem('q8_mall_ad_role') !== "shop") {
        document.getElementById('admin_menu').classList.remove('pcoded-navbar');
        document.getElementById('admin_content').classList.remove('pcoded-content');
      }
      document.getElementById('print-barcode-html').classList.remove('hide');
      for (var i = 0; i < that.state.barcode_list.length; i++) {
        document.getElementById('barcode_print_' + that.state.barcode_list[i].barCode).classList.remove('noprint');
      }
      document.title = "barcode_list";
    };
    window.onafterprint = function (event) {
      
      if (localStorage.getItem('q8_mall_ad_role') !== "shop") {
        document.getElementById('admin_menu').classList.add('pcoded-navbar');
        document.getElementById('admin_content').classList.add('pcoded-content');
      }
      document.getElementById('print-barcode-html').classList.add('hide');
      for (var i = 0; i < that.state.barcode_list.length; i++) {
        
        document.getElementById('barcode_print_' + that.state.barcode_list[i].barCode).classList.add('noprint');
      }
      document.title = "QMall";
    };
    window.print();
  }
  handleChange = (event) => {
    if(event.target.value.length == 0)
    {
      this.getBarcodeList(0) ;
      this.setState({
        keyword:""
      })
    }
    else{

      this.setState({ 
        keyword: event.target.value 
      });
    }
}

  onSearch = (val) => {
    
    var that = this;
    that.setState({
      barcode_list:[]
    })
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    data.append("CurrencyId", Constant.getDefaultCurrrency());
    data.append("keyword", this.state.keyword);
    data.append("startRange", this.state.startRange);
    data.append("count", this.state.count);
    fetch(Constant.getAPI() + "/product/combination/getPrints", {
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
      if (localStorage.getItem('q8_mall_ad_role') !== "shop") {
        document.getElementById('admin_menu').classList.remove('pcoded-navbar');
        document.getElementById('admin_content').classList.remove('pcoded-content');
      }
      document.getElementById('print-barcode-html').classList.remove('hide');
      for (var i = 0; i < that.state.barcode_list.length; i++) {
        document.getElementById('barcode_print_' + that.state.barcode_list[i].barCode).classList.remove('noprint');
      }
      document.title = "barcode_list";
    };
    window.onafterprint = function (event) {
     
      if (localStorage.getItem('q8_mall_ad_role') !== "shop") {
        document.getElementById('admin_menu').classList.add('pcoded-navbar');
        document.getElementById('admin_content').classList.add('pcoded-content');
      }
      document.getElementById('print-barcode-html').classList.add('hide');
      for (var i = 0; i < that.state.barcode_list.length; i++) {
        
        document.getElementById('barcode_print_' + that.state.barcode_list[i].barCode).classList.add('noprint');
      }
      document.title = "QMall";
    };
    window.print();
  }
  
  printBarcode = (barCode) => {
    this.setState( {barcheck:barCode})
    //alert("barCode : " + barCode);
    window.onbeforeprint = function (event) {
  
      if (localStorage.getItem('q8_mall_ad_role') !== "shop") {
        document.getElementById('admin_menu').classList.remove('pcoded-navbar');
        document.getElementById('admin_content').classList.remove('pcoded-content');
      }

      document.getElementById('print-barcode-html').classList.remove('hide');
      document.getElementById('barcode_print_' + barCode).classList.remove('noprint');
      document.title = "barcode_list";

    };
    window.onafterprint = function (event) {
     
      if (localStorage.getItem('q8_mall_ad_role') !== "shop") {
        document.getElementById('admin_menu').classList.add('pcoded-navbar');
        document.getElementById('admin_content').classList.add('pcoded-content');
      }
      document.getElementById('print-barcode-html').classList.add('hide');
      document.getElementById('barcode_print_' + barCode).classList.add('noprint');
      document.title = "QMall";
      
    };
    window.print();
  }

  onprevious=()=>{
    if(this.state.startRange >=50){
    var range= this.state.startRange -50
    console.log(range)
    this.getBarcodeList(range)
    this.setState({
      startRange:range
    })
  }

  }
  onnext=()=>{
    var range= this.state.startRange +50
    console.log(range)
    this.getBarcodeList(range)
    this.setState({
      startRange:range
    })
  }
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
                          //value={this.state.keyword}
                        />
                        <button className="btn btn-outline-dark btn-sm" onClick={this.onSearch}><i className="feather icon-search"></i></button>
                     
                      </div>
                    </div><br/>
                    &nbsp;
               
                    <div className="col-lg-8">
                    <button className="f-18 btn btn-sm   waves-light f-right "
                       onClick={this.onprevious}
                       disabled={this.state.startRange < 50}>
                      <i className=" icofont icofont-rounded-left m-r-5"></i>  PREVIOUS   </button>
                    </div>
                        <div className="col-lg-2">

                      <button className="f-18 btn btn-sm "
                       disabled={this.state.barcode_list.length <50}
                       onClick={this.onnext}>
                        NEXT   <i className="icofont icofont-rounded-right m-r-5"></i></button>
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
                      barcode.barCode === this.state.barcheck
                      ?
                     <div>
                      <div className="row" key={barcode.barCode} id={"barcode_print_" + barcode.barCode}>
                        <page size="">
                          <div class="mainDiv">
                            <div class="rowC">{barcode.Product.name_en}</div>
                            <div class="rowD"><strong>Price : {barcode.price ? barcode.price : '0'} {Constant.getDefaultCurrrency()}</strong></div>
                            <div class="rowA"><Barcode value={barcode.barCode} height="55" width="2" displayValue={false} /></div>
                            <div class="rowB">{barcode.barCode}</div>
                            
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
             
{
  console.log(this.state.barcode_list)
}
              <div className="row noprint" id="print-barcode">
                {
                  this.state.barcode_list !== undefined && this.state.barcode_list !== null && this.state.barcoplde_list !== [] && this.state.barcode_list.length > 0
                    ?
                    this.state.barcode_list.map(barcode =>
                      <div className="col-4 noprint" key={barcode.barCode}>
                        <div id={"barcode_" + barcode.barCode}>
                        <div className={barcode.isPrimary ? "card bg-light text-center" : "card text-center"}>
                          <div className="card-header noprint">
                            <div className="card-header-right">
                              <ul className="list-unstyled card-option">
                                <Link to={"/barcode/print/" +barcode.barCode}><i className="feather icon-printer " style={{color:"grey"}} ></i></Link>
                             
                              </ul>
                            </div>
                          </div>
                          <page size="">
                            <div class="mainDiv">
                              <div class="rowC">{barcode.Product.name_en}</div>
                              <div class="rowD"><strong>Price : {barcode.price ? barcode.price : '0'} {Constant.getDefaultCurrrency()}</strong></div>
                              <div class="rowA"><Barcode value={barcode.barCode} /*format="EAN13" */ height="55" width="2" displayValue={true} /></div>
                              {/* <div class="rowB">{barcode.barCode}</div> */}
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
