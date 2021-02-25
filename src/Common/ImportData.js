import React from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import MUIDataTable from "mui-datatables";
// import PropTypes from "prop-types";
// import { connect } from "react-redux";
// import $, { post } from 'jquery';
import Constant from '../Constant'


import qmallsheet from "../Formats/qmall-sheet.xlsx"


class ImportData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hideOld: false,
      checkedItems: new Map(),
      check: false,
      isLoading: false,
      importname: "",
      downdata: [],
      checked: false,
      data: [],
      fileToUpload: null,
      hidedownload: false,
      fileaname: null,
      laoding:false,
      show:false
    };
  }
  productToUpload(file){
   const formData = new FormData();
          formData.append("sheet", file);
        console.log(file)

        fetch(Constant.getAPI() + "/product/upload-sheet", {
          method:"post",
          headers: {
            },
          body:formData
          }).then(function (response) {
            return response.json();
          })
          .then(function (json) {
            console.log(json)
             if (json.sucess == true) {
               console.log(json)
               Swal.fire({
                title:"Sheet Imported!",
                icon: 'success',
                text: "",
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Ok"

               }).then(function() {
                window.location.href = "#/products";
            })
           
             }
             else{
               Swal.fire({
                title: json.error,
                icon: 'error',
                text: "",
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Ok"

               }).then(function() {
                window.location.reload();
            })
               
             }
             
          })
          .catch((err) => {
            const errMsg = err.message;
            console.log(err)
            this.onError();
          });
  }

  componentDidMount() {
    // console.log(this.props.match);
    // console.log(this.props.match.params.import_name);
    this.setState({
      importname: this.props.match.params.import_name,
    });
  }
  
  onError = () => {
    Swal.fire({
      title: "Something went wrong. Try again after some Time.!",
      icon: "error",
      text: "",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ok",
    });
  };

  componentWillReceiveProps(nextProps){
    console.log('nodata',nextProps.sellerProductimported)
    console.log(nextProps.invalidata)
    if(nextProps.invalidata !==null || nextProps.invalidata!==[] || nextProps.invalidata!==undefined){
      this.setState({
        show:true
      })
    }
    this.setState({
      laoding:false
    })
  }
  
  exportCSV() {
    var csvRow = [];
    var A = [
      [
        "Row Number",
        "SKU",
        "Seller Id",
      ],
    ];
    var re = this.props.invalidata;
    for (var item = 0; item < re.length; item++) {
        A.push([
          re[item].rowNumber,
          re[item].SKU,
          re[item].SellerId,
        ]); 
    }
    console.log(A);
    let csvContent = "data:text/csv;charset=utf-8,";
    A.forEach(function (rowArray) {
      let row = rowArray.join(",");
      csvContent += row + "\r\n";
    });
    var a = document.createElement("a");
    a.href = "data:attachment/csv" + csvContent;
    a.download = "Invalid products.csv";
    document.body.appendChild(a);
    a.click();
  }
  onSaveData = (e) => {
    this.setState({
      laoding:true
    })
    if (this.state.importname === "products") {
      this.setState({
        isLoading: true,
      });
      const data = this.productToUpload(this.state.fileToUpload);
      if (data) {
        this.setState({
          isLoading: false,
        });
      }
    } 
   
    else{
    Swal.fire("Sorry Error Occured!");
    }
  };

  handleChangeFile = (event) => {
    event.preventDefault();
    const fileToUpload = event.target.files[0];
    this.setState({
      fileToUpload: fileToUpload,
    });
    console.log(fileToUpload);
  };

  openModel = () => {
    this.setState({
      open: true,
    });
  };

  handleClose = () => {
    this.setState({
      open: false,
    });
  };

  selectall = (e) => {
    this.setState({
      hidedownload: !this.state.hidedownload,
      checkedItems: new Map(),
      hideOld: !this.state.hideOld,
    });
  };

  selctSingle = (e, id) => {
    const item = e.target.name;
    const isChecked = e.target.checked;
    this.setState((prevState) => ({
      hidedownload: !this.state.hidedownload,
      checkedItems: prevState.checkedItems.set(item, isChecked),
    }));
  };

  handleChange = (e, id) => {
    const item = e.target.name;
    const isChecked = e.target.checked;
    this.setState((prevState) => ({
      hidedownload: !this.state.hidedownload,
      checkedItems: prevState.checkedItems.set(item, isChecked),
    }));
    console.log(this.state.checkedItems);
    let newArray = this.props.categoryData.data.filter((d) => {
      // console.log(d)
      let searchValue = d.id;
      return searchValue.indexOf(item) !== -1;
    });
    console.log(newArray);
    this.setState({
      downdata: [...this.state.downdata, newArray],
    });
    console.log(this.state.downdata);
  };
   
  render() {
    const columns = [
      {
        name: "rowNumber",
        label: "Row Number",
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        name: "SKU",
       label: "SKU",
       options: {
        filter: true,
        sort: true
      },
    },
      {
        name: "SellerId",
        label: "Seller ID",
        options: {
          filter: true,
          sort: true,
          customBodyRender: (SellerId, tableMeta) => {
            return SellerId ? SellerId : "";
          },
        },
      },
      
     
     
    ];
   
    const options = {
      filter: false,
      viewColumns: false,
      responsive: "scrollMaxHeight",
      pagination: false,
      search: false,
      print: false,
      download: false,
      fixedHeader: true,
      serverSide: true,
      onTableChange: (action, tableState) => {
        console.log(action, tableState);
        switch (action) {
          case "changePage":
            this.changePage(tableState.page);
            break;
          default:
        }
      },
      selectableRows: "none",
      textLabels: {
        body: {
          noMatch: this.state.laoding ? (
            <div
              style={{
                textAlign: "center",
                display: "flex",
                color: "red",
                width: "1024px",
                justifyContent: "center",
              }}
            >
              Loading data..!
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                display: "flex",
                color: "red",
                width: "1024px",
                justifyContent: "center",
              }}
            >
              <p style={{ textAlign: "center" }}>
              Sorry, No Data Found
              </p>
            </div>
          ),
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
                      <h4>Import Data</h4>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="page-header-breadcrumb">
                    <ul className="breadcrumb-title">
                      <li className="breadcrumb-item">
                        <Link to="/">
                          <i className="feather icon-home"></i>{" "}
                        </Link>
                      </li>
                      <li className="breadcrumb-item active">Import Data</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="page-body">
              <div className="card">
                <div className="card-body">
                  <div className="row"></div>
                </div>
                <div className="card-block">
                  <div className="col-md-12">
                    <div className="col-md-6">
                      <div className="form-group row">
                        <label className="col-sm-3 col-form-label">
                          Choose File
                        </label>
                        <div className="col-sm-9">
                          <input
                            type="file"
                            className="form-control"
                            name="file"
                            placeholder="Choose FIle"
                            onChange={this.handleChangeFile}
                            value={this.state.file}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-block d-flex">
                    <div className="card-footer">
                      <div className="row float-right p-3">
                        {this.state.laoding ? (
                          <button
                            className="btn btn-grd-disabled mr-2"
                            disabled
                          >
                            Saving...!
                          </button>
                        ) : (
                          <button
                            onClick={this.onSaveData}
                            className="btn btn-grd-disabled mr-2"
                          >
                            <i className="icofont icofont-save"></i> Save
                          </button>
                        )}
                        <button
                          to={this.props}
                          onClick={() => this.props.history.goBack()}
                          className="btn btn-outline-dark  mr-2"
                        >
                          Cancel
                        </button>

                        {this.state.importname === "products" ? (
                          <a
                            href={qmallsheet}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                          >
                            <button
                              target="_blank"
                              className="btn mr-2 color-info p-2"
                            >
                              <i className="icofont icofont-file-alt"></i>{" "}
                              Sample Excel
                            </button>
                          </a>
                        ) : (
                          ""
                        )}
                        
                        
                        {/* {this.state.importname === "product" ? (
                          <a
                            href={productMasterCatalouge}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                          >
                            <button
                              target="_blank"
                              className="btn mr-2 color-info p-2"
                            >
                              <i className="icofont icofont-file-alt"></i>{" "}
                              Sample Excel
                            </button>
                          </a>
                        ) : (
                          ""
                        )}
                        {this.state.importname === "sellerproduct" ? (
                          <a
                            href={sellerproduct}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                          >
                            <button
                              target="_blank"
                              className="btn mr-2 color-info p-2"
                            >
                              <i className="icofont icofont-file-alt"></i>{" "}
                              Sample Excel
                            </button>
                          </a>
                        ) : (
                          ""
                        )}
                        {this.state.importname === "seller" ? (
                          <a
                            href={AddSellerInfo}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                          >
                            <button
                              target="_blank"
                              className="btn mr-2 color-info p-2"
                            >
                              <i className="icofont icofont-file-alt"></i>{" "}
                              Sample Excel
                            </button>
                          </a>
                        ) : (
                          ""
                        )}
                        {this.state.importname === "pincode" ? (
                          <a
                            href={locationPincodeMasterSheet}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                          >
                            <button
                              target="_blank"
                              className="btn mr-2 color-info p-2"
                            >
                              <i className="icofont icofont-file-alt"></i>{" "}
                              Sample Excel
                            </button>
                          </a>
                        ) : (
                          ""
                        )}
                        {this.state.importname === "top-deals" ? (
                          <a
                            href={topDeals}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                          >
                            <button
                              target="_blank"
                              className="btn mr-2 color-info p-2"
                            >
                              <i className="icofont icofont-file-alt"></i>{" "}
                              Sample Excel
                            </button>
                          </a>
                        ) : (
                          ""
                        )}
                        {this.state.importname === "home-categories" ? (
                          <a
                            href={homeCategory}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                          >
                            <button
                              target="_blank"
                              className="btn mr-2 color-info p-2"
                            >
                              <i className="icofont icofont-file-alt"></i>{" "}
                              Sample Excel
                            </button>
                          </a>
                        ) : (
                          ""
                        )}
                        {this.state.importname === "banner" ? (
                          <a
                            href={banner}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                          >
                            <button
                              target="_blank"
                              className="btn mr-2 color-info p-2"
                            >
                              <i className="icofont icofont-file-alt"></i>{" "}
                              Sample Excel
                            </button>
                          </a>
                        ) : (
                          ""
                        )}
                        {this.state.importname === "newArrival" ? (
                          <a
                            href={arrivals}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                          >
                            <button
                              target="_blank"
                              className="btn mr-2 color-info p-2"
                            >
                              <i className="icofont icofont-file-alt"></i>{" "}
                              Sample Excel
                            </button>
                          </a>
                        ) : (
                          ""
                        )} */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
             {this.state.show ? (
              <div className="page-body">
                <div className="row">
                  <div className="col-sm-12">
                    <div className="card">
                      <div className="card-block">
                      <button
                            className="f-right bg-white b-none"
                            data-modal="modal-13"
                            onClick={() => {
                                  this.exportCSV();
                                }}
                              >
                                <i
                                  className="icofont icofont-download-alt"
                                  style={{
                                    fontSize: "30px",
                                    color: "grey",
                                  }}
                                ></i>
                             
                            </button>
                        <div className="dt-responsive table-responsive">
                            <MUIDataTable
                              title={
                                <div className="d-inline">
                                  <h4>Invalid List</h4>
                                </div>
                              }
                              className="table-responsive"
                                data={this.props.invalidata}
                              columns={columns}
                              options={options}
                            />
                          {this.props.error === false ? this.onError() : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )} 
          </div>
        </div>
      </div>
    );
  }
}
export default ImportData
