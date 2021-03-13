import React from "react";
import { Link } from "react-router-dom";
import SectionAdd from "./SectionAdd";
import Constant from "../../Constant";

class SectionAddTab extends React.Component {
  state = {};

  componentDidMount() {
    this.getLanguageList(); 
    if (
      this.props.match.params.secton_id !== undefined &&
      this.props.match.params.secton_id !== null &&
      this.props.match.params.secton_id !== 0 &&
      this.props.match.params.secton_id !== ""
    ) {
      this.setState({ secton_id: this.props.match.params.secton_id });
    }
  }
  getLanguageList = () => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isLoading: true });
    fetch(Constant.getAPI() + "/language/get", {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: data,
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        if (json.status === true) {
          that.setState({
            language_data: json.data,
            language_id: json.data[0].id,
            isLoading: false,
          });
        } else {
          // Swal.fire({
          //   title: "Something went wrong. Try again after some Time.!",
          //   icon: 'error',
          //   text: "",
          //   confirmButtonColor: "#3085d6",
          //   cancelButtonColor: "#d33",
          //   confirmButtonText: "Ok"
          // })
        }
      });
  };
  handleLanguage = (language_id) => {
    this.setState({ language_id: language_id });
  };
  render() {
    return (
      <div className="main-body">
        <div className="page-wrapper">
          <div className="page-header">
            <div className="row align-items-end">
              <div className="col-lg-8">
                <div className="page-header-title">
                  <div className="d-inline">
                    <h4>
                      {this.props.match.params.secton_id ? "Edit" : "Add"}{" "}
                      Section
                    </h4>
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
                    <li className="breadcrumb-item">
                      <Link to="/section">Section</Link>
                    </li>
                    <li className="breadcrumb-item active">
                      {this.props.match.params.secton_id ? "Edit" : "Add"}{" "}
                      Section
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
                    {/* <ul className="nav nav-tabs  tabs" role="tablist">
                      {this.state.language_data !== undefined &&
                      this.state.language_data !== []
                        ? this.state.language_data.map((language) => (
                            <li
                              className="nav-item"
                              key={language.id}
                              onClick={this.handleLanguage.bind(
                                this,
                                language.id
                              )}
                            >
                              <a
                                className={
                                  this.state.language_id === language.id
                                    ? "nav-link active"
                                    : "nav-link"
                                }
                                id={"language_" + language.id}
                                data-toggle="tab"
                                href={"#tyre_category_" + language.id}
                                role="tab"
                                aria-controls={"tyre_category_" + language.id}
                                aria-selected="true"
                              >
                                {language.name}{" "}
                              </a>
                            </li>
                          ))
                        : ""}
                    </ul> */}

                    <div className="tab-content tabs">
                      <div
                        className="tab-pane  active"
                        id={"tyre_category_" + this.state.language_id}
                        role="tabpanel"
                        aria-labelledby=""
                      >
                        {this.props.match.params.secton_id !== undefined &&
                        this.props.match.params.secton_id !== null &&
                        this.props.match.params.secton_id !== 0 &&
                        this.props.match.params.secton_id !== "" ? (
                          <SectionAdd
                            language_id={this.state.language_id}
                            goBack={this.props.history.goBack}
                            secton_id={this.props.match.params.secton_id}
                          />
                        ) : (
                          <SectionAdd
                            language_id={this.state.language_id}
                            goBack={this.props.history.goBack}
                          />
                        )}
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

export default SectionAddTab;
