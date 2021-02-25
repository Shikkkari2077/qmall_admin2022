import React from "react";
import { Link } from "react-router-dom";
import GeneralSettingAdd from "./GeneralSettingAdd";
import Constant from "../../Constant.js";

class GeneralSettingAddTab extends React.Component {
  state = {};

  render() {
    return (
      <div className="main-body">
        <div className="page-wrapper">
          <div className="page-header">
            <div className="row align-items-end">
              <div className="col-lg-8">
                <div className="page-header-title">
                  <div className="d-inline">
                    <h4>Contact Us Settings </h4>
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
                    <li className="breadcrumb-item active">
                      Contact Us Settings
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
                      <div className="tab-pane active" role="tabpanel" aria-labelledby="">

                        <GeneralSettingAdd goBack={this.props.history.goBack} />
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

export default GeneralSettingAddTab;
