import React from "react";
import { Link } from "react-router-dom";
import CustomerAdd from "./DriverAdd";


class DriverAddTab extends React.Component {
  state = {
    language_id: '1',
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
  };

  componentDidMount() {
    if (this.props.match.params.driver_id !== undefined &&
      this.props.match.params.driver_id !== null &&
      this.props.match.params.driver_id !== 0 &&
      this.props.match.params.driver_id !== '') {
      this.setState({ driver_id: this.props.match.params.driver_id })      
    }
  }
  handleLanguage = (language_id) => {
    this.setState({ language_id: language_id })
  }
  render() {
    return (
      <div className="main-body">
        <div className="page-wrapper">
          <div className="page-header">
            <div className="row align-items-end">
              <div className="col-lg-8">
                <div className="page-header-title">
                  <div className="d-inline">
                    <h4>{this.props.match.params.driver_id ? "Edit" : "Add"}{" "} Driver</h4>
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
                    <li className="breadcrumb-item">
                      <Link to="/driver">Driver</Link>
                    </li>
                    <li className="breadcrumb-item active">
                      {this.props.match.params.driver_id ? "Edit" : "Add"}{" "} Driver
                  </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="page-body">
            <div className="row">
              <div className="col-sm-12">
                <div className="card card-border-default">
                  <div className="card-block">
                    <div className="tab-content tabs">
                      <div className="tab-pane  active"
                        id={"add_driver_" + this.state.language_id} role="tabpanel" aria-labelledby="">
                        {
                          this.state.driver_id !== undefined &&
                            this.state.driver_id !== null &&
                            this.state.driver_id !== 0 &&
                            this.state.driver_id !== ''
                            ?
                            <CustomerAdd
                              language_id={this.state.language_id}
                              goBack={this.props.history.goBack}
                              driver_id={this.state.driver_id} />
                            :
                            <CustomerAdd
                              language_id={this.state.language_id}
                              goBack={this.props.history.goBack} />
                        }

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div >
      </div >
    );

  }
}

export default DriverAddTab;
