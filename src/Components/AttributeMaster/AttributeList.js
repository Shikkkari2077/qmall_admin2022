import React from 'react';
import { Link } from 'react-router-dom'
import $ from 'jquery';
import Constant from '../../Constant'
import Swal from 'sweetalert2'
import MUIDataTable from "mui-datatables";

class AttributeList extends React.Component {
  state = {}

  deleteAttribute = (id) => {
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
        data.append("AttributeId", id);
        fetch(Constant.getAPI() + "/attribute/delete", {
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
            Swal.fire("Deleted!", "Tyre Category deleted.", "success");
            that.getAttributeList();
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
  getAttributeList = () => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    data.append("AttributeTypeId",that.props.match.params.attribute_type_id);
    fetch(Constant.getAPI() + "/attribute/get", {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: data
    }).then(function (response) {
      return response.json();
    }).then(function (json) {
      if (json.status === true) {
        //console.log(json.data)
        that.setState({ attribute_list: json.data ,isSaving:false});
      } else {
        that.setState({ attribute_list: [],isSaving:false });
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
    this.getAttributeList();
  }
  render() {
    const columns = [
      {
      name: "name",
      label: "Attribute Name",
      options: {
        filter: true,
        sort: true
      }
    }, {
      name: "AttributeType.name",
      label: "Attribute Type",
      options: {
        filter: true,
        sort: true
      }
    }, {
      name: "AttributeValues",
      label: "Attribute Value ( name - value - unit )",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (AttributeValues, tableMeta) => {
          return <div>
            {
              AttributeValues !== null && AttributeValues !== [] && AttributeValues.length > 0
                ?
                <ol>
                  {
                    AttributeValues.map(attribute_value =>
                      <li key={attribute_value.id}>{attribute_value.name} - {attribute_value.value} - {attribute_value.unit}</li>
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
              <Link to={"/attribute-values/"+this.props.match.params.attribute_type_id+"/"+ id}
              className="m-r-15 text-muted"
              data-toggle="tooltip"
              data-placement="top" title=""
              data-original-title="Edit">
              <i className="f-20 icofont icofont-plus text-instagram"></i>
            </Link>
            {localStorage.getItem("q8_mall_ad_role")=='admin'? <>
            <Link to={"/attributes/"+this.props.match.params.attribute_type_id+"/add/" + id}
              className="m-r-15 text-muted"
              data-toggle="tooltip"
              data-placement="top" title=""
              data-original-title="Edit">
              <i className="f-20 icofont icofont-ui-edit text-custom"></i>
            </Link>
          
            
            <span onClick={this.deleteAttribute.bind(this, id)}
              className="m-r-15 text-muted"
              data-toggle="tooltip"
              data-placement="top"
              title=""
              data-original-title="Delete">
              <i className="f-20 icofont icofont-delete-alt text-danger"></i>  </span>  </>         :null}
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
            "Sorry, No Attribute Found",
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
                      <h4>Attribute List</h4>
                    </div>
                  </div>
                  {localStorage.getItem("q8_mall_ad_role")=='admin'? <>
                  <Link to={"/attributes/"+this.props.match.params.attribute_type_id+"/add"}
                   className="btn btn-sm btn-inverse waves-effect waves-light f-right d-inline-block md-trigger"
                    data-modal="modal-13"> <i className="icofont icofont-plus m-r-5"></i> Add Attribute </Link>   </>         :null}
                </div>
                <div className="col-lg-4">
                  <div className="page-header-breadcrumb">
                    <ul className="breadcrumb-title">
                      <li className="breadcrumb-item">
                        <Link to="/">
                          <i className="feather icon-home"></i> </Link>
                      </li>
                      <li className="breadcrumb-item">
                        <Link to="/attribute-types">Attribute Types</Link>
                      </li>
                      <li className="breadcrumb-item active">Attribute List</li>
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
                          title={"Attribute List"}
                          className="table-responsive"
                          data={this.state.attribute_list}
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

export default AttributeList;
