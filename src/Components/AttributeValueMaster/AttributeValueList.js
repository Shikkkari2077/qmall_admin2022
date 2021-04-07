import React from 'react';
import { Link } from 'react-router-dom'
import Constant from '../../Constant'
import Swal from 'sweetalert2'
import MUIDataTable from "mui-datatables";

class AttributeValueList extends React.Component {
  state = {}
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
        data.append("AttributeValueId", id);
        fetch(Constant.getAPI() + "/attribute/value/delete", {
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
            Swal.fire("Deleted!", "Attribute Value deleted.", "success");
            that.getAttributeValueList();
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
  getAttributeValueList = () => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    data.append("AttributeId", this.props.match.params.attribute_id);
    fetch(Constant.getAPI() + "/attribute/value/get", {
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
        that.setState({ attribute_value_list: json.data });
      } else {
        that.setState({ attribute_value_list: [] });
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
    this.getAttributeValueList();
  }
  render() {
    const columns = [
      {
        name: "Attribute.name_en",
        label: "Attribute Name " ,
        options: {
          filter: true,
          sort: true
        }
      },
      {
        name: "name_en",
        label: "Attribute Name English",
        options: {
          filter: true,
          sort: true
        }
      },{
      name: "name_ar",
      label: "Attribute Name Arabic",
      options: {
        filter: true,
        sort: true
      }
    }, 
    // {
    //   name: "value",
    //   label: "Value",
    //   options: {
    //     filter: true,
    //     sort: true
    //   }
    // },
    //  {
    //   name: "unit",
    //   label: "Unit",
    //   options: {
    //     filter: true,
    //     sort: true
    //   }
    // },
     {
      name: "id",
      label: "Action",
      options: {
        display:localStorage.getItem("q8_mall_ad_role")=='admin'?true:false,
        filter: true,
        sort: true,
        customBodyRender: (id, tableMeta) => {
          return <div>            {localStorage.getItem("q8_mall_ad_role")=='admin'? <>

            <Link to={"/attributes-values/"+this.props.match.params.attribute_type_id+"/"+ this.props.match.params.attribute_id+"/add/" + id}
              className="m-r-15 text-muted"
              data-toggle="tooltip"
              data-placement="top" title=""
              data-original-title="Edit">
              <i className="f-20 icofont icofont-ui-edit text-custom"></i>
            </Link>
            <span onClick={this.deleteAttributeValue.bind(this, id)}
              className="m-r-15 text-muted"
              data-toggle="tooltip"
              data-placement="top"
              title=""
              data-original-title="Delete">
              <i className="f-20 icofont icofont-delete-alt text-danger"></i>  </span>
              </>         :null}
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
            "Sorry, No Attribute Value Found",
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
                      <h4>Attribute Value List</h4>
                    </div>
                  </div>
                  <Link to={"/attributes-values/"+this.props.match.params.attribute_type_id+"/"+ this.props.match.params.attribute_id+"/add"} 
                  className="btn btn-sm btn-inverse waves-effect waves-light f-right d-inline-block md-trigger" data-modal="modal-13">
                     <i className="icofont icofont-plus m-r-5"></i> Add Attribute Value
                      </Link>
                </div>
                <div className="col-lg-4">
                  <div className="page-header-breadcrumb">
                    <ul className="breadcrumb-title">
                      <li className="breadcrumb-item">
                        <Link to="/">
                          <i className="feather icon-home"></i> </Link>
                      </li>
                      <li className="breadcrumb-item">
                      <Link to="/attribute-types">
                        Attribute Types</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link to={"/attributes/"+this.props.match.params.attribute_type_id}>
                        Attributes </Link>
                    </li>
                      <li className="breadcrumb-item active">Attribute Value List</li>
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
                          title={"Attribute Value List"}
                          className="table-responsive"
                          data={this.state.attribute_value_list}
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

export default AttributeValueList;
