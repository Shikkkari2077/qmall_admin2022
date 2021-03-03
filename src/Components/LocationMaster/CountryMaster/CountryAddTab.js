import React from "react";
import { Link } from "react-router-dom";
import Addcountry from "./CountryAdd";
import Swal from "sweetalert2";
import Constant from "../../../Constant.js";
 

class CountryAddTab extends React.Component {
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
    if (this.props.match.params.country_id !== undefined && this.props.match.params.country_id !== null && this.props.match.params.country_id !== 0 && this.props.match.params.country_id !== '') {
            this.setState({ country_id: this.props.match.params.country_id })
      //console.log(this.props.match.params.country_id)
    }
    this.getLanguages();
  }
  handleLanguage = (language_id) => {
    this.setState({ language_id: language_id })
  }
  getLanguages = () => {
    var that = this;
    var data = new URLSearchParams();
    // this.setState({ isSaving: true });
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
        that.setState({ language_data: json.data, language_id: json.data[0].id });
         
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
    return (
      <div className="main-body">
        <div className="page-wrapper">
          <div className="page-header">
            <div className="row align-items-end">
              <div className="col-lg-8">
                <div className="page-header-title">
                  <div className="d-inline">
                    <h4>{this.props.match.params.country_id ? "Edit" : "Add"}{" "} Country</h4>
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
                      <Link to="/country">
                        Country</Link>
                    </li>
                    <li className="breadcrumb-item active">
                      {this.props.match.params.country_id ? "Edit" : "Add"}{" "} Country
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
                      {
                        this.state.language_data !== undefined && this.state.language_data !== [] ? this.state.language_data.map(language =>
                          <li className="nav-item" key={language.language_id} onClick={this.handleLanguage.bind(this, language.language_id)}>
                            <a className={this.state.language_id === language.language_id ? "nav-link active" : "nav-link"} id={'language_' + language.language_id}
                              data-toggle="tab"
                              href={"#country_add_" + language.language_id}
                              role="tab"
                              aria-controls={"country_add_" + language.language_id} aria-selected="true">{language.language_name} - {language.language_code} </a>
                          </li>
                        ) : ""}
                    </ul> */}
                    <div className="tab-content tabs">
                      <div className="tab-pane  active"
                        id={"country_add_" + this.state.language_id} role="tabpanel" aria-labelledby="">
                        {
                          this.state.country_id !== undefined &&
                            this.state.country_id !== null &&
                            this.state.country_id !== 0 &&
                            this.state.country_id !== ''
                            ?
                            <Addcountry language_id={this.state.language_id}
                              goBack={this.props.history.goBack}
                              country_id={this.state.country_id} />
                            :
                            <Addcountry
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

export default CountryAddTab;
