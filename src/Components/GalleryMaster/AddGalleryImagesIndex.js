import React from 'react';
import AddGalleryImages from './AddGalleryImages.js';
import Constant from '../../Constant.js';
import { Link } from 'react-router-dom';

class AddGalleryImagesIndex extends React.Component {

  state = {}

  handleLanguage = (language_id) => {
    this.setState({ language_id: language_id })
  }
  componentDidMount() {
    if (this.props.match.params.product_id !== undefined && this.props.match.params.product_id !== null && this.props.match.params.product_id !== 0 && this.props.match.params.product_id !== '') {
      this.setState({ product_id: this.props.match.params.product_id })
    }
  }
  render() {
    return (
      <div className="main-body">
        <div className="page-wrapper">
          <div className="page-header">
            <div className="row align-items-end">
              <div className="col-lg-6">
                <div className="page-header-title">
                  <div className="d-inline">
                    <h4>{this.props.match.params.attribute_value_id ? "Edit" : "Add"}{" "} Product Media Gallery</h4>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="page-header-breadcrumb">
                  <ul className="breadcrumb-title">
                    <li className="breadcrumb-item">
                      <Link to="/">
                        <i className="feather icon-home"></i> </Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link to={"/products/gallery/" + this.props.match.params.product_id}>
                        Product Media Gallery</Link>
                    </li>
                    <li className="breadcrumb-item active">
                      {this.props.match.params.attribute_value_id ? "Edit" : "Add"}{" "} Product Media Gallery
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
                        id={"product_media" + this.state.language_id} role="tabpanel" aria-labelledby="">

                        <AddGalleryImages goBack={this.props.history.goBack} product_id={this.state.product_id} case={this.props.match.params.attribute_value_id?"edit":"add"}/>

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

export default AddGalleryImagesIndex