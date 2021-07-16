import React from 'react';
import { Link } from 'react-router-dom'
import $ from 'jquery';
import Constant from '../../../Constant'
import Swal from 'sweetalert2'
import Barcode from 'react-barcode' // Generate Barcode
import './test1.css';



class BarcodePrint1 extends React.Component {
  state = {}


  getBarcodeList = () => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    // data.append("BranchId", that.props.match.params.branch_id);
    data.append("CurrencyId", Constant.getDefaultCurrrency());
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
          for(var i=0;i<json.data.length;i++)
          {
              if(json.data[i].barNumber == that.props.match.params.barnumber)
              {
                  that.setState({ barcode:json.data[i], isSaving:false});
                  break;
              }
          }
        //that.setState({ barcode_list: json.data, isSaving: false });
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
    console.log(this.props.match.params.barnumber)
    console.log(this.props.match.params.css)
    
  
    console.log()
  }
  componentDidUpdate(prevState) {
    var that = this;
    console.log(prevState)
   // if (prevState.isOrderData !== this.state.isOrderData && this.state.isOrderData !== false) {
      setTimeout(function () { that.onPrint() }, 200);
    //}
  }

  onPrint = () => {
    var that = this;
    window.onbeforeprint = function (event) {
      //   // alert("beforePrint")
      // if (localStorage.getItem('q8_mall_ad_role') !== "shop") {
      //   document.getElementById('admin_menu').classList.remove('pcoded-navbar');
      //   document.getElementById('admin_content').classList.remove('pcoded-content');
      // }
      document.getElementById('print-barcode-html').classList.remove('hide');
    //   for (var i = 0; i < that.state.barcode_list.length; i++) {
    //     console.log(that.state.barcode_list[i].barNumber)
        document.getElementById('barcode_print_' + that.state.barcode.barNumber).classList.remove('noprint');
      //}
      //   // return (<RetailerPrintInvoice />)
      document.title = `${that.state.barcode.name +"-" +that.state.barcode.barNumber }`;
    };
    window.onafterprint = function (event) {
      // alert("Printing completed...");
      // document.getElementById('invoice_detail').innerHTML = hidePrint
      // if (localStorage.getItem('q8_mall_ad_role') !== "shop") {
      //   document.getElementById('admin_menu').classList.add('pcoded-navbar');
      //   document.getElementById('admin_content').classList.add('pcoded-content');
      // }
    //   document.getElementById('print-barcode-html').classList.add('hide');
    //   for (var i = 0; i < that.state.barcode_list.length; i++) {
        
        document.getElementById('barcode_print_' + that.state.barcode.barNumber).classList.add('noprint');
      //}
      document.title = "QMall";
      
    };
    window.print();
    window.location.href = "#/barcode";
  }

//   printBarcode = (barNumber) => {
//     this.setState( {barcheck:barNumber})
//     //alert("barNumber : " + barNumber);
//     window.onbeforeprint = function (event) {
//       //   // alert("beforePrint")
//       console.log(barNumber)
//       if (localStorage.getItem('q8_mall_ad_role') !== "shop") {
//         document.getElementById('admin_menu').classList.remove('pcoded-navbar');
//         document.getElementById('admin_content').classList.remove('pcoded-content');
//       }
//       console.log('barcode_print_' + barNumber)

//       document.getElementById('print-barcode-html').classList.remove('hide');
//       document.getElementById('barcode_print_' + barNumber).classList.remove('noprint');
//       //   // return (<RetailerPrintInvoice />)
//       document.title = "barcode_list";

//     };
//     window.onafterprint = function (event) {
//       // alert("Printing completed...");
//       // document.getElementById('invoice_detail').innerHTML = hidePrint
//       if (localStorage.getItem('q8_mall_ad_role') !== "shop") {
//         document.getElementById('admin_menu').classList.add('pcoded-navbar');
//         document.getElementById('admin_content').classList.add('pcoded-content');
//       }
//       document.getElementById('print-barcode-html').classList.add('hide');
//       console.log('barcode_print_' + barNumber)
//       document.getElementById('barcode_print_' + barNumber).classList.add('noprint');
//       document.title = "QMall";
//       // document.title = 'barcode_print_' + barNumber;
//     };
//     window.print();
//   }
  
  render() {
    return (
      

             <div className="hide" id="print-barcode-html">
               
                 <div className="col-lg-8">
                 { this.state.barcode !== undefined ?
                 <div className="row" key={this.state.barcode.barNumber} id={"barcode_print_" +this.state.barcode.barNumber}>
                        <page size="">
                          <div class="mainDiv">
                            <div class="rowC">{this.state.barcode.name}  </div>
                            <div class="rowD"><strong>Price : {this.state.barcode.price ? this.state.barcode.price : '0'} {Constant.getDefaultCurrrency()}</strong></div>
                            <div class="rowA"><Barcode value={this.state.barcode.barNumber} /*format="EAN13" */ height="45px" width="2" displayValue={false} /></div>
                            <div class="rowB">{this.state.barcode.barNumber}</div>
                            </div>
                        </page>
                        <div class="page-divide" />
                      </div>
                  
                        :null} 
                        </div>
              </div>
             
    )
             
  }
}

export default BarcodePrint1;
