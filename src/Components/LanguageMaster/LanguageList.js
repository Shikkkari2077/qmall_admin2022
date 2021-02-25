import React from 'react';
import { Link } from 'react-router-dom'
import $ from 'jquery';
import Swal from 'sweetalert2'
import Constant from '../../Constant'
import MUIDataTable from "mui-datatables";

class LanguageList extends React.Component {
  state = {
    language_data: []
  }

  deletelanguage = (id) => {
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
        this.setState({ isSaving: true });
        data.append("LanguageId", id);
        fetch(Constant.getAPI() + "/language/delete", {
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
            Swal.fire("Deleted!", "language has been deleted.", "success");
            that.getLanguages()
          } else {
            Swal.fire("", "Something went wrong. Please try again after sometime.", "success");
          }
        });
      }
    });

  }
  componentWillMount() {
    this.getLanguages();
  }
  getLanguages = () => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    // data.append("email", that.state.username);
    // data.append("password", that.state.password);
    fetch(Constant.getAPI() + "/language/get", {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: data
    }).then(function (response) {
      return response.json();
    }).then(function (json) {
      if (json.status === true) {
        that.setState({ language_data: json.data });
      } else {
        Swal.fire({
          title: "Something went wrong. Try again after some Time.!",
          icon: 'error',
          text: "",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Ok"
        })
      }
    })
  }
  render() {
    const columns = [{
      name: "name",
      label: "Language Name",
      options: {
        filter: true,
        sort: true
      }
    }, {
      name: "rtl",
      label: "Direction",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (rtl, tableMeta) => {
          return (
            <div>{rtl === true ? "rtl" : "ltr"}</div>
          )
        }
      }
    }, {
      name: "id",
      label: "Actions",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (id, tableMeta) => {
          console.log(tableMeta);
          return (
            <div>
              <Link to={"/languages/add/" + id}
                className="m-r-15 text-muted"
                data-toggle="tooltip"
                data-placement="top" title=""
                data-original-title="Edit">
                <i className="f-20 icofont icofont-ui-edit text-custom"></i>
              </Link>
              <span onClick={this.deletelanguage.bind(this, id)}
                className="m-r-15 text-muted"
                data-toggle="tooltip"
                data-placement="top"
                title=""
                data-original-title="Delete">
                <i className="f-20 icofont icofont-delete-alt text-danger"></i>  </span>
            </div>)
        }

      }
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
            "Sorry, No Language Found",
          toolTip: "Sort",
          columnHeaderTooltip: column => `Sort for ${column.label}`
        }
      }
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
                      <h4>Language List</h4>
                    </div>
                  </div>
                  <Link to="/languages/add" className="btn btn-sm btn-inverse waves-effect waves-light f-right d-inline-block md-trigger" data-modal="modal-13">
                    <i className="icofont icofont-plus m-r-5"></i> Add language
                    </Link>
                </div>
                <div className="col-lg-4">
                  <div className="page-header-breadcrumb">
                    <ul className="breadcrumb-title">
                      <li className="breadcrumb-item">
                        <Link to="/">
                          <i className="feather icon-home"></i> </Link>
                      </li>
                      <li className="breadcrumb-item active">Languages</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="page-body">
              <div className="row">
                <div className="col-sm-12">
                  <div className="card">
                    {
                      this.state.isloading ?
                        "Loading.. !"
                        :
                        <div className="card-block">
                          <div className="dt-responsive table-responsive">
                            <MUIDataTable
                              title={"Language List"}
                              className="table-responsive"
                              data={this.state.language_data}
                              columns={columns}
                              options={options}
                            />
                          </div>
                        </div>
                    }
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

export default LanguageList;
