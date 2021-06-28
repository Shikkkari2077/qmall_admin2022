import React from 'react';
import { Link } from 'react-router-dom'
import $ from 'jquery';
import Constant from '../../Constant'
import Swal from 'sweetalert2'
import AddGalleryImages from './AddGalleryImages';


class GalleryImageList extends React.Component {
  state = {}
  deleteMediaImage = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this !",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it"
    }).then(result => {
      if (result.value) {
        var that = this;
        var data = new URLSearchParams();
        // this.setState({ isSaving: true });
        if (this.props.product_id !== undefined) {
          data.append("ProductId", this.props.product_id);
        } else {
          data.append("ProductId", this.props.match.params.product_id);
        }
        data.append("MediaId", id);
        fetch(Constant.getAPI() + "/product/media/delete", {
          method: "post",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": localStorage.getItem('q8_mall_auth')
          },
          body: data
        }).then(function (response) {
          return response.json();
        }).then(function (json) {
          if (json.status === true) {
            Swal.fire("Deleted!", "Product Image deleted.", "success");
            that.getProductList();
          } else {
            Swal.fire({
              title: "Something went wrong. Try again after some Time.!",
              icon: 'error',
              text: "",
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Ok"
            });
          }
        });
      }
    });
  }
  getProductList = () => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    if (this.props.product_id !== undefined) {
      data.append("ProductId", this.props.product_id);
    } else {
      data.append("ProductId", this.props.match.params.product_id);
      //console.log(this.props.match.params.product_id)
    }
    fetch(Constant.getAPI() + "/product/getByAdmin", {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": localStorage.getItem('q8_mall_auth')
      },
      body: data
    }).then(function (response) {
      return response.json();
    }).then(function (json) {
      if (json.status === true) {
        if(json.data !==undefined && json.data[0] !== undefined){

  
        that.setState({ 
          product_list: json.data[0], 
          gallery: json.data[0].productGallery });
        }
      } else {
        that.setState({ product_list: [], gallery: [] });
        Swal.fire({
          title: "Something went wrong. Try again after some Time.!",
          icon: 'error',
          text: "",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Ok"
        })
      }
    });
  }
  componentWillMount() {
    this.getProductList();
     
  }
  imgLoadError = (event) => {
    event.target.src = './theme/images/default.jpg'
  }
  render() {
    return (
      <div className="pcoded-inner-content" >
        <div className="main-body">
          <div className="page-wrapper">
            <div className="page-header">
              <div className="row align-items-end">
                <div className="col-lg-8">
                  <div className="page-header-title">
                    <div className="d-inline">
                      <h4>Product Media Gallery</h4>
                    </div>
                  </div>
                </div>
                {/* <div className="col-lg-4">
                  <div className="page-header-breadcrumb">
                    <ul className="breadcrumb-title">
                      <li className="breadcrumb-item">
                        <Link to="/">
                          <i className="feather icon-home"></i> </Link>
                      </li>
                      <li className="breadcrumb-item">
                        <Link to="/products">Product List</Link>
                      </li>
                      <li className="breadcrumb-item active">Product Media Gallery</li>
                    </ul>
                  </div>
                </div>
               */}
              </div>
            </div>
            <div className="page-body">
              <div className="row">
                <div className="col-sm-12">
                  <div className="card">
                    {/* <div className="card-header">
                      <h5>Product Media</h5>
                      {
                        this.props.product_id ?
                          <Link to={"/products/gallery/" + this.props.product_id + "/add"}
                            className="btn btn-sm btn-inverse waves-effect waves-light f-right d-inline-block md-trigger" data-modal="modal-13"> <i className="icofont icofont-plus m-r-5"></i> Add Product Media
                       </Link>
                          :
                          <Link to={"/products/gallery/" + this.props.match.params.product_id + "/add"}
                            className="btn btn-sm btn-inverse waves-effect waves-light f-right d-inline-block md-trigger" data-modal="modal-13"> <i className="icofont icofont-plus m-r-5"></i> Add Product Media
                       </Link>
                      }
                    </div> */}
                    <div class="card-block masonry-image">
                      <div class="default-grid ">
                        <div id="lightgallery" className="lightgallery-popup">
                          {/* <Link class="media-middle" to="/"> */}
                          <AddGalleryImages product_id={this.props.product_id !== undefined ?this.props.product_id:this.props.match.params.product_id} />

                          <div class="row">
                            {
                              this.state.gallery !== undefined && this.state.gallery !== null
                               && this.state.gallery !== [] && this.state.gallery.length > 0
                                ?
                                this.state.gallery.map(gallery_img =>
                                  <div class="col-2 default-grid-item">
                                    <div class="masonry-media">
                                      <img class="img-fluid img-100" src={gallery_img.url !== undefined && gallery_img.url !== null
                                         && gallery_img.url !== "" ? gallery_img.url : "./assets/images/icon.png"} alt="" />
                                      <br />
                                      <span onClick={this.deleteMediaImage.bind(this, gallery_img.id)}><i class="icofont icofont-trash m-r-5 icofont-2x text-danger"></i></span>
                                    </div>
                                  </div>
                                )
                                :
                                <div className="text-center">No Media Available .!</div>
                            }
                            {/* </Link> */}
                          </div>
                        </div>
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

export default GalleryImageList