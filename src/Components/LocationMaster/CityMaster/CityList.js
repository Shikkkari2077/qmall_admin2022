import React from 'react';
import { Link } from 'react-router-dom'
import $ from 'jquery';
import Constant from '../../../Constant'
import Swal from 'sweetalert2'
import "react-toggle/style.css" // for ES6 modules
import Toggle from 'react-toggle'

class CityList extends React.Component {
  state = {
    city_list: [
      {
        cityID: 1,
        cityName: "Asimah",
        status: true,
      },
      {
        cityID: 2,
        cityName: "baroda",
        status: true,
      },
      {
        cityID: 3,
        cityName: "test",
        status: true,
      },
    ],
    language_data: [
      {
        language_id: "1",
        language_name: "English",
        language_code: "EN"
      },
      {
        language_id: "2",
        language_name: "Arabic",
        language_code: "AR"
      },
    ]
  }

  componentWillMount() {
     
  }
  handleStatusChange = (sid) => {
    var isChecked = $('#cattogBtn_' + sid);
    isChecked.prop("checked", !isChecked.prop("checked"));
    console.log(isChecked.prop('checked'), !isChecked.prop("checked"));
    if (!isChecked.prop("checked") === true) {
      var status = 'active'
    } else {
      var status = 'inactive'
    }
    let newArray = this.state.city_list;
    var a = newArray.find((element) => {
      return element.cityID === sid
    })
    a.status = status;
    console.log(newArray)
    this.setState({ city_list: newArray })
    Swal.fire("Update Status!", "Status has been updated.", "success");
  }
  deleteCity = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this !",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it"
    }).then(result => {
      if (result.value) {

        Swal.fire("Deleted!", "City has been deleted.", "success");
      }
    });

  }

  render() {
    return (
      <div className="pcoded-inner-content">
        <div className="main-body">
          <div className="page-wrapper">
            <div className="row">
              <div className="col-sm-12">
                <div className="card">
                  <div className="card-header">
                    <h5>City List</h5>
                    <Link to="/city/add"
                      className="btn btn-sm btn-inverse waves-effect waves-light f-right d-inline-block md-trigger" data-modal="modal-13"> <i className="icofont icofont-plus m-r-5"></i> Add City
                       </Link>
                  </div>
                  <div className="card-block">
                    <div className="dt-responsive table-responsive">
                      <table id="basic-key-table" className="table table-striped table-bordered nowrap">
                        <thead>
                          <tr>
                            <th>#ID</th>
                            {
                              this.state.language_data.map(languagewise =>
                                <th id={'banner_title_' + languagewise.language_id} key={'banner_title_' + languagewise.language_id}>Name:{languagewise.language_name}</th>
                              )}
                            <th>Status </th>
                            <th>Action </th>
                          </tr>
                        </thead>
                        <tbody >
                          {this.state.city_list !== undefined &&
                            this.state.city_list !== null &&
                            this.state.city_list !== [] &&
                            this.state.city_list.length > 0 ? (
                              this.state.city_list.map((city, i) => (
                                <tr key={i}>
                                  <td>{i + 1}</td>

                                  <td>{city.cityName}</td>
                                  <td>{city.cityName}</td>
                                  <td>
                                    <Toggle
                                      id={"cattogBtn_" + city.cityID}
                                      checked={city.status === 'inactive' ? false : true}
                                      value={city.status}
                                      onChange={this.handleStatusChange.bind(this, city.cityID)}
                                    />
                                  </td>
                                  <td className="action-icon ">
                                    <Link to={"/city/edit/" + city.cityID}
                                      className="m-r-15 text-muted"
                                      data-toggle="tooltip"
                                      data-placement="top" title=""
                                      data-original-title="Edit">
                                      <i className="f-20 icofont icofont-ui-edit text-custom"></i>
                                    </Link>
                                    <span onClick={this.deleteCity.bind(this, city.cityID)}
                                      className="m-r-15 text-muted"
                                      data-toggle="tooltip"
                                      data-placement="top"
                                      title=""
                                      data-original-title="Delete">
                                      <i className="f-20 icofont icofont-delete-alt text-danger"></i>  </span>
                                  </td>
                                </tr>
                              ))) :
                            null
                          }
                        </tbody>
                        <tfoot>
                          <tr>
                            <th>#ID</th>

                            {
                              this.state.language_data.map(languagewise =>
                                <th id={'banner_title_' + languagewise.language_id} key={'banner_title_' + languagewise.language_id}>Name:{languagewise.language_name}</th>
                              )}
                            <th>Status </th>
                            <th>Action </th>
                          </tr>
                        </tfoot>
                      </table>


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

export default CityList;
