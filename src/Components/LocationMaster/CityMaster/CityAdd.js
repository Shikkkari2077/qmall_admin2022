import React from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

class CityAdd extends React.Component {
  state = {
    status: true,
    category_list: [{}],
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
  };

  componentDidUpdate(prevProps) {
    if (prevProps.city_id !== this.props.city_id) {
      this.setState({ city_id: this.props.city_id });
      this.getCityDetails();
    }
  }
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  getCityDetails = () => {
    var a = this.state.city_list.find((element) => {
      return element.cityID === this.props.city_id;
    })
    this.setState({
      city_data: a,
      name: a.cityName,
    });
  }

  addCity = () => {
    var that = this;
    var data = new FormData();
    that.setState({ isSaving: true })
    if (
      that.state.name === undefined ||
      that.state.name === null ||
      that.state.name === ""
    ) {
      document.getElementById("name").focus();
      that.setState({ isSaving: false })
      return false;
    }
    Swal.fire("Added !", "City has been Added", "success");
    window.location.href = "#/city"
    that.setState({ isSaving: false })

  };

  render() {
    return (
      <div className="">
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">City Name</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    id="name"
                    placeholder="City Name"
                    onChange={this.handleChange}
                    value={this.state.name}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-addon" id="basic-addon4">Select Country</span>
                <select name="select" className="form-control form-control-inverse">
                  <option value="opt1">Select Country</option>
                  <option value="opt2">India</option>
                  <option value="opt3">Kuwait</option>
                </select>
              </div>
            </div>
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-addon" id="basic-addon4">Select Governorate</span>
                <select name="select" className="form-control form-control-inverse">
                  <option value="opt1">Select Governorate</option>
                  <option value="opt2">Asimah</option>
                  <option value="opt3">Farwaniyah</option>
                  <option value="opt3">Hawalli</option>

                </select>
              </div>
            </div>

            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-addon" id="basic-addon4">Status</span>
                <select name="status" className="form-control" value={this.state.status} onChange={this.handleChange}>
                  <option value="active" name="active">Active</option>
                  <option value="inactive" name="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
          <div className="row float-right p-3">
            {
              this.state.isSaving
                ?
                <button className="btn btn-grd-disabled mr-2" disabled>Saving...!</button>
                :
                <button onClick={this.addCity}  className="btn btn-grd-disabled mr-2"><i className="icofont icofont-save"></i> Save</button>
            }
            <Link to={"/city"} className="btn btn-outline-dark">
              Cancel
        </Link>
          </div>
        </div>
      </div >
    );
  }
}

export default CityAdd;
