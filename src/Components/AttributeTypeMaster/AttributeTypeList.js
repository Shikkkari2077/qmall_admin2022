import React from 'react';
import { Link } from 'react-router-dom'
// import $ from 'jquery';
import Constant from '../../Constant'
import Swal from 'sweetalert2';
import MUIDataTable from "mui-datatables";

class AttributeTypeList extends React.Component {
  state = {}

  deleteAttributeType = (id) => {
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
        data.append("AttributeTypeId", id);
        fetch(Constant.getAPI() + "/attribute/type/delete", {
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
            Swal.fire("Deleted!", "Attribute Type deleted.", "success");
            that.getAttributeTypeList();
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
  getAttributeTypeList = () => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    fetch(Constant.getAPI() + "/attribute/type/get", {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: data
    }).then(function (response) {
      return response.json();
    }).then(function (json) {
      if (json.status === true) {
      
        var attribute=json.data
        for(let i=0;i<json.data.length;i++){
          if(json.data[i].name == "")
          {   
              console.log( json.data[i] )
              attribute.splice(i, 1);
            
          }
          console.log(attribute)
        }
        that.setState({ attribute_type_list:attribute });
        //console.log(json.data)
      } else {
        that.setState({ attribute_type_list: [] });
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
    this.getAttributeTypeList();
  }
  render() {
    const columns = [{
      name: "name_en",
      label: "Attribute Type Name (English)",

      options: {
        filter: true,
        sort: true,
        sortDirection:'asc'
      }
    },
    {
      name: "name_ar",
      label: "Attribute Type Name (Arabic)",

      options: {
        filter: true,
        sort: true,
        sortDirection:'asc'
      }
    },
     {
      name: "Attributes",
      label: "Attributes",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (Attributes, tableMeta) => {
          return <div>
            {
              Attributes !== null && Attributes !== [] && Attributes.length > 0
                ?
                <ol>
                  {
                    Attributes.map(attribute_value =>
                      <li key={attribute_value.id}>{attribute_value.name_en}</li>
                    )
                  }
                </ol>
                :
                "-"
            }
          </div>
        }
      }
    }, {
      name: "id",
      label: "Action",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (id, tableMeta) => {
          return <div>
           
            <Link to={"/attributes/" + id}
              className="m-r-15 text-muted"
              data-toggle="tooltip"
              data-placement="top" title=""
              data-original-title="Edit">
              <i className="f-20 icofont icofont-plus text-instagram"></i>
            </Link>
            {localStorage.getItem("q8_mall_ad_role")=='admin'? <>
            <Link to={"/attribute-types/add/" + id}
              className="m-r-15 text-muted"
              data-toggle="tooltip"
              data-placement="top" title=""
              data-original-title="Edit">
              <i className="f-20 icofont icofont-ui-edit text-custom"></i>
            </Link>
            <span onClick={this.deleteAttributeType.bind(this, id)}
              className="m-r-15 text-muted"
              data-toggle="tooltip"
              data-placement="top"
              title=""
              data-original-title="Delete">
              <i className="f-20 icofont icofont-delete-alt text-danger"></i>  </span>   </>         :null}

          </div>
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
            "Sorry, No Attribute Type Found",
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
                      <h4>Attribute Type List</h4>
                    </div>
                  </div>
                  {localStorage.getItem("q8_mall_ad_role")=='admin'? <>

                  <Link to="/attribute-types/add"
                   className="btn btn-sm btn-inverse waves-effect waves-light f-right d-inline-block md-trigger"
                    data-modal="modal-13"> <i className="icofont icofont-plus m-r-5"></i> Add Attribute Type </Link> </>         :null}
                </div>
                <div className="col-lg-4">
                  <div className="page-header-breadcrumb">
                    <ul className="breadcrumb-title">
                      <li className="breadcrumb-item">
                        <Link to="/">
                          <i className="feather icon-home"></i> </Link>
                      </li>
                      <li className="breadcrumb-item active">Attribute Type List</li>
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
                          title={"Attribute Type List"}
                          className="table-responsive"
                          data={this.state.attribute_type_list}
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

export default AttributeTypeList;
