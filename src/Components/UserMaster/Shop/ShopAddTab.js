import React from "react";
import { Link } from "react-router-dom";
import ShopAdd from "./ShopAdd";
import Constant from "../../../Constant.js";

class ShopAddTab extends React.Component {
  state = {};
  getLanguages = () => {
    var that = this;
    var data = new URLSearchParams();
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
        //console.log("languages not found");
      }
    })
  }
  componentDidMount() {
    this.getLanguages();
    if (this.props.match.params.shop_id !== undefined && this.props.match.params.shop_id !== null && this.props.match.params.shop_id !== 0 && this.props.match.params.shop_id !== '') {
      this.setState({ shop_id: this.props.match.params.shop_id })
      //console.log(this.props.match.params.shop_id)
    }
    if (localStorage.getItem('q8_mall_ad_role') === "shop") {
      this.setState({ shop_id: localStorage.getItem('q8_mall_ad_uid') })
      //console.log(this.props.match.params.shop_id)
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
                    {
                      localStorage.getItem('q8_mall_ad_role') === "shop"
                        ?
                        <h4>Edit Profile</h4>
                        :
                        <h4>{this.props.match.params.shop_id ? "Edit" : "Add"}{" "} Shop</h4>
                    }
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="page-header-breadcrumb">
                  {
                    localStorage.getItem('q8_mall_ad_role') === "shop"
                      ?
                      <ul className="breadcrumb-title">
                        <li className="breadcrumb-item">
                          <Link to="/">
                            <i className="feather icon-home"></i> </Link>
                        </li>
                        <li className="breadcrumb-item active">Edit Profile</li>
                      </ul>
                      :
                      <ul className="breadcrumb-title">
                        <li className="breadcrumb-item">
                          <Link to="/">
                            <i className="feather icon-home"></i> </Link>
                        </li>
                        <li className="breadcrumb-item">
                          <Link to="/shops">
                            Shop</Link>
                        </li>
                        <li className="breadcrumb-item active">
                          {this.props.match.params.shop_id ? "Edit" : "Add"}{" "} Shop
                    </li>
                      </ul>
                  }
                </div>
              </div>
            </div>
          </div>
          <div className="page-body">
            <div className="row">
              <div className="col-sm-12">
                <div className="card card-border-default">
                  <div className="card-block">
                    <ul className="nav nav-tabs  tabs" role="tablist">
                      {
                        this.state.language_data !== undefined && this.state.language_data !== [] ? this.state.language_data.map(language =>
                          <li className="nav-item" key={language.id} onClick={this.handleLanguage.bind(this, language.id)}>
                            <a className={this.state.language_id === language.id ? "nav-link active" : "nav-link"} id={'language_' + language.id}
                              data-toggle="tab"
                              href={"#add_dealer_" + language.id}
                              role="tab"
                              aria-controls={"add_dealer_" + language.id} aria-selected="true">{language.name} </a>
                          </li>
                        ) : ""}
                    </ul>
                    <div className="tab-content tabs">
                      {console.log("again")}
                      <div
                       className="tab-pane  active"
                        id={"add_dealer_" + this.state.language_id} 
                        role="tabpanel" 
                        aria-labelledby="">
                        {
                          this.state.shop_id !== undefined &&
                            this.state.shop_id !== null &&
                            this.state.shop_id !== 0 &&
                            this.state.shop_id !== ''
                            ?
                            <ShopAdd language_id={this.state.language_id}
                              goBack={this.props.history.goBack}
                              shop_id={this.state.shop_id} />
                            :
                            <ShopAdd
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

export default ShopAddTab;
