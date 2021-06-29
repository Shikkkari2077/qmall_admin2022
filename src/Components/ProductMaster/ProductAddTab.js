import React from "react";
import { Link } from "react-router-dom";
import ProductAdd from "./ProductAdd";
import GalleryImageList from "../GalleryMaster/GalleryImageList";
import Constant from "../../Constant";

class ProductAddTab extends React.Component {
  state = {};

  componentDidMount() {
    if (this.props.match.params.product_id !== undefined && this.props.match.params.product_id !== null && this.props.match.params.product_id !== 0 && this.props.match.params.product_id !== '') {
      this.setState({ product_id: this.props.match.params.product_id })
      //console.log(this.props.match.params.product_id)
    }
    this.getLanguageList()
  }
  getLanguageList = () => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
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
  // componentWillMount(){
  //   this.handleLanguage(this,'product')
  // }
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
                    <h4>{this.props.match.params.product_id ? "Edit" : "Add"}{" "} Product</h4>
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
                      <Link to="/products">
                        Product List</Link>
                    </li>
                    <li className="breadcrumb-item active">
                      {this.props.match.params.product_id ? "Edit" : "Add"}{" "} Product
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
                    <ul className="nav nav-tabs  tabs" role="tablist">
                      {/* {
                        this.state.language_data !== undefined && this.state.language_data !== [] ? this.state.language_data.map(language =>
                          <li className="nav-item" key={language.id} onClick={this.handleLanguage.bind(this, language.id)}>
                            <a className={this.state.language_id === language.id ? "nav-link active" : "nav-link"} id={'language_' + language.id}
                              data-toggle="tab"
                              href={"#product_add_" + language.id}
                              role="tab"
                              aria-controls={"product_add_" + language.id} aria-selected="true">{language.name} </a>
                          </li>
                        ) : ""} */}
                      {
                        this.props.match.params.product_id
                          ?<>
                          {/* <li className="nav-item" onClick={this.handleLanguage.bind(this, 'product')}>
                          <a className={this.state.language_id === 'product' ? "nav-link active" : "nav-link"} 
                            id='product'
                            data-toggle="tab"
                            href={`#products/add/${this.props.match.params.product_id}`}
                            role="tab"
                            aria-controls={`products/add/${this.props.match.params.product_id}`} 
                            aria-selected="true">Product info</a>
                            
                        </li> */}
                          
                          {/* <li className="nav-item" onClick={this.handleLanguage.bind(this, 'gallery')}>
                            <a className={this.state.language_id === 'gallery' ? "nav-link active" : "nav-link "} id='gallery'
                              data-toggle="tab"
                              href={"#product_add_gallery"}
                              role="tab"
                              aria-controls={"product_add_gallery"} aria-selected="true">Product Gallery </a>
                          </li> &nbsp; &nbsp; */}
                          {/* <div style={{color:"red", paddingTop:"20px",fontSize:"14px"}} >
                          <small> * Save Before Switching Tabs</small>
                          </div> */}
                       </>
                          : null
                      }
                    </ul>
                  
                    <div className="tab-content tabs">
                      {/* <div className="tab-pane active"
                        id={"product_add_" + this.state.language_id} role="tabpanel" aria-labelledby="">
                        {
                          this.state.product_id !== undefined &&
                            this.state.product_id !== null &&
                            this.state.product_id !== 0 &&
                            this.state.product_id !== ''
                            ?
                            <ProductAdd language_id={this.state.language_id}
                              goBack={this.props.history.goBack}
                              product_id={this.state.product_id} />
                            :
                            <ProductAdd
                              language_id={this.state.language_id}
                              goBack={this.props.history.goBack} />
                        }
                      </div> */}

                      <div className="tab-pane active"
                        id={"product_add_" + this.state.language_id} role="tabpanel" aria-labelledby="">
                        {
                          this.state.language_id == 'gallery' ?
                            <GalleryImageList product_id={this.state.product_id} />
                            :
                              this.state.product_id !== undefined &&
                              this.state.product_id !== null &&
                              this.state.product_id !== 0 &&
                              this.state.product_id !== ''
                              ?<>
                              <ProductAdd 
                                language_id={this.state.language_id}
                                goBack={this.props.history.goBack}
                                product_id={this.state.product_id}/>
                             </> :
                              <ProductAdd
                                case={"add"}
                                language_id={this.state.language_id}
                                goBack={this.props.history.goBack}/> 
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

export default ProductAddTab;
