import React from 'react';
import { Link } from 'react-router-dom'
import Constant from '../../Constant.js';
//import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import $ from 'jquery'
import Swal from 'sweetalert2';

class AddGalleryImages extends React.Component {

  state = {
    status: 'active',
    gallery_media: []
  }

  handleImageUpload = (event) => {
    document.getElementById('banner_image_label').innerHTML = "";
    let element = $("#gallery_media").get(0);
    $("#socialize_image_section").empty();
    this.setState({ accepted: element });
    var proof_img = [];
    let obj = {};
    console.log(element.files);
    this.setState({ category_image: element.files });
    for (var i = 0; i < element.files.length; i++) {
      var file1 = element.files[i];
      var img = document.createElement("img");
      img.className = "img-responsive img-100";
      var filePath = URL.createObjectURL(file1);
      img.src = filePath;
      $("#banner_image_label").append(img);
    }
  }
  uploadMedia = () => {
    var that = this;
    var form = $('#productMedia')[0];
    var data = new FormData(form);
    fetch(Constant.getAPI() + "/media/add", {
      method: "post",
      body: data
    }).then(function (response) {
      return response.json();
    }).then(function (json) {
      if (json.status === true) {
        that.saveGalleryMedia(json.data);
      } else {
        that.setState({ gallery_media: [] });
        console.log(json.error);
      }
    });
  }
  onSaveData = () => {
    var that = this;
    that.setState({ isSaving: true });
    if (that.state.accepted) {
      that.uploadMedia();
    } else {
      that.saveGalleryMedia(that.state.media_id);
    }
  }
  saveGalleryMedia = (media) => {
    var that = this;
    var media_data = [];
    for (var i = 0; i < media.length; i++) {
      media_data.push(media[i].id);
    }
    var data = new URLSearchParams();
    data.append('ProductId', that.props.product_id);
    data.append('MediaId', media_data);
    // data.append('MediaId', JSON.stringify(media_data));
    fetch(Constant.getAPI() + "/product/media/add", {
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
        Swal.fire("Added !", "Product Media has been Added", "success");
        if(that.props.case =="add")
         {console.log(json.data[0].ProductId)}
          //window.location.href = `#/products/stock/${json.data[0].ProductId}/add`;
        else
       {window.location.href = `#/products/add/${that.props.product_id}`;}
        //console.log(this.props.match.params.product_id)
        that.setState({ isSaving: false })
      } else {
        that.setState({ isSaving: false });
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

  componentDidMount() {
    this.loadScript(process.env.PUBLIC_URL + "/theme/js/file-upload.js");
  }
  loadScript(src) {
    let script = document.createElement('script');
    script.src = src;
    script.type = "text/javascript";
    document.head.append(script);
  }
  imgLoadError = (event) => {
    event.target.src = './theme/images/default.jpg'
  }
  render() {
    return (
      <div className="">
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div className="row">
                <div className="col-sm-3">
                  Media Gallery <br/><small>(size : 220 X 220)</small>
              </div>
                <div className="col-sm-9">
                  <form id="productMedia" name="productMedia" encType="multipart/form-data" className="text-capitalize">

                    <div className="form-group">

                      <input accept="image/*" onChange={this.handleImageUpload} id="gallery_media" type="file" className="form-control" autoComplete="off" name="media" multiple
                        data-toggle="tooltip" title="Click To Upload Media Image"
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-2">
              <div id="banner_image_label" className="pt-2">
                {
                  this.state.image
                    ?
                    this.state.image !== null || this.state.image !== undefined || this.state.image !== {}
                      ?
                      <img src={this.state.image} alt="" className="img-100" onError={e => { e.target.src = "" }} />
                      :
                      ''
                    :
                    ''
                }
              </div>
            </div>
          </div>

          <div className="card-footer">
            <div className="row float-right p-3">
              {
                this.state.isSaving
                  ?
                  <button className="btn btn-grd-disabled mr-2" disabled>Saving...!</button>
                  :
                  <button onClick={this.onSaveData} className="btn btn-grd-disabled mr-2"><i className="icofont icofont-save"></i> Save</button>
              }
              <Link to={"/products"} className="btn btn-outline-dark">Cancel</Link>
            </div>
          </div>
        </div >
      </div >
    );
  }
}

export default AddGalleryImages