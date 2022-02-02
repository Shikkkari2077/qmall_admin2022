import React from "react";
import { Link } from "react-router-dom";
import OrderView from "./OrderView";
import Constant from "../../Constant";


class OrderViewTab extends React.Component {
  state = {
    language_data: []
  };

  componentDidMount() {
    if (this.props.match.params.order_id !== undefined && this.props.match.params.order_id !== null && this.props.match.params.order_id !== 0 && this.props.match.params.order_id !== '') {
      this.setState({ order_id: this.props.match.params.order_id })
      //console.logog(this.props.match.params.order_id)
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
        // Swal.fire({
        //   title: "Something went wrong. Try again after some Time.!",
        //   icon: 'error',
        //   text: "",
        //   confirmButtonColor: "#3085d6",
        //   cancelButtonColor: "#d33",
        //   confirmButtonText: "Ok"
        // })
      }
    })
  }
  render() {
    return (
      <div className="main-body">
        <div className="page-wrapper">
          <div className="page-header noprint">
            <div className="row align-items-end">
              <div className="col-lg-8">
                <div className="page-header-title">
                  <div className="d-inline">
                    <h4>View Order</h4>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="page-header-breadcrumb">
                  <ul className="breadcrumb-title">
                    <li className="breadcrumb-item">
                      <Link to="/"> <i className="feather icon-home"></i> </Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link to="/orders">Orders</Link>
                    </li>
                    <li className="breadcrumb-item active" >{this.props.match.params.order_id ? "View" : "View"}{" "} Order

                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="page-body" style={{width:"793px"}}>
            <div className="row">
              <div className="col-sm-12" >
                <div className="card card-border-default">
                  {/* <div className="card-block"> */}
                  {/* <ul className="nav nav-tabs  tabs" role="tablist">
                      {
                        this.state.language_data !== undefined && this.state.language_data !== [] ? this.state.language_data.map(language =>
                          <li className="nav-item" key={language.id} onClick={this.handleLanguage.bind(this, language.id)}>
                            <a className={this.state.language_id === language.id ? "nav-link active" : "nav-link"} id={'language_' + language.id}
                              data-toggle="tab"
                              href={"#area_add_" + language.id}
                              role="tab"
                              aria-controls={"area_add_" + language.id} aria-selected="true">{language.name} </a>
                          </li>
                        ) : ""}
                    </ul>
                     */}
                  <div className="tab-content tabs">
                    <div className="tab-pane  active"
                      id={"area_add_" + this.state.language_id} role="tabpanel" aria-labelledby="">
                      {
                        this.state.order_id !== undefined &&
                          this.state.order_id !== null &&
                          this.state.order_id !== 0 &&
                          this.state.order_id !== ''
                          ?
                          <OrderView language_id={this.state.language_id}
                            goBack={this.props.history.goBack}
                            order_id={this.state.order_id} />
                          :
                          <OrderView
                            language_id={this.state.language_id}
                            goBack={this.props.history.goBack} />
                      }

                    </div>
                    {/* </div> */}
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

export default OrderViewTab;
