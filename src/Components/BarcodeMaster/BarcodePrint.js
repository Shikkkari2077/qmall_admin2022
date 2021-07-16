import React from 'react';
import { Link } from 'react-router-dom'
import $ from 'jquery';
import Constant from '../../Constant'
import Swal from 'sweetalert2'
import Barcode from 'react-barcode' // Generate Barcode
import './barcode-print.css';



class BarcodePrint extends React.Component {
  state = {}


  getBarcodeList = () => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
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
              if(json.data[i].barCode == that.props.match.params.barnumber)
              {
                  that.setState({ barcode:json.data[i], isSaving:false});
                  break;
                  
              }
          }
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
  componentDidUpdate(prevState) {
    var that = this;
   
      setTimeout(function () { that.onPrint() }, 200);
    
  }

  onPrint = () => {
    var that = this;
    window.onbeforeprint = function (event) {
   
      document.getElementById('print-barcode-html').classList.remove('hide');
  
      document.getElementById('barcode_print_' + that.state.barcode.barCode).classList.remove('noprint');
      
      document.title = `${that.state.barcode.Product.name_en +"-" +that.state.barcode.barCode }`;
    };
    window.onafterprint = function (event) {
  
      document.getElementById('barcode_print_' + that.state.barcode.barCode).classList.add('noprint');
      
      document.title = "QMall";
      
    };
    window.print();
    window.location.href = "#/barcode";
  }


  
  render() {
    return (
      

             <div className="hide" id="print-barcode-html">
               {console.log("Printing here")}
                 <div className="col-lg-8">
                 { this.state.barcode !== undefined ?
                 <div className="row" key={this.state.barcode.barCode} id={"barcode_print_" +this.state.barcode.barCode}>
                        <page size="">
                          <div class="mainDiv">
                            <div class="rowC">{this.state.barcode.Product.name_en}</div>
                            <div class="rowD"><strong>Price : {this.state.barcode.price ? this.state.barcode.price : '0'} {Constant.getDefaultCurrrency()}</strong></div>
                            <div class="rowA"><Barcode value={this.state.barcode.barCode} /*format="EAN13" */ height="45px" width="2" displayValue={false} /></div>
                            <div class="rowB">{this.state.barcode.barCode}</div>
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

export default BarcodePrint;
