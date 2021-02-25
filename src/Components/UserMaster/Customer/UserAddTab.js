import React from "react";
import { Link } from "react-router-dom";
import CustomerAdd from "./UserAdd";


class UserAddTab extends React.Component {
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
    if (this.props.match.params.user_id !== undefined &&
      this.props.match.params.user_id !== null &&
      this.props.match.params.user_id !== 0 &&
      this.props.match.params.user_id !== '') {
      this.setState({ user_id: this.props.match.params.user_id })      
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
                    <h4>{this.props.match.params.user_id ? "Edit" : "Add"}{" "} User</h4>
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
                      <Link to="/customers">Customers</Link>
                    </li>
                    <li className="breadcrumb-item active">
                      {this.props.match.params.user_id ? "Edit" : "Add"}{" "} User
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
                        id={"add_user_" + this.state.language_id} role="tabpanel" aria-labelledby="">
                        {
                          this.state.user_id !== undefined &&
                            this.state.user_id !== null &&
                            this.state.user_id !== 0 &&
                            this.state.user_id !== ''
                            ?
                            <CustomerAdd
                              language_id={this.state.language_id}
                              goBack={this.props.history.goBack}
                              user_id={this.state.user_id} />
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

export default UserAddTab;
