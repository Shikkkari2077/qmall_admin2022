import React from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import $ from "jquery";
import Constant from "../../Constant";
import ReactQuill from "react-quill";

class AttributeAdd extends React.Component {
  state = {
    status: true,
    description: ""
  };
  onHandleDescriptionChange = value => {
    this.setState({ description: value });
  };
  componentDidMount(){
    this.setState({AttributeTypeId:this.props.attribute_type_id});
  }
  componentDidUpdate(prevProps) {
    if (prevProps.attribute_id !== this.props.attribute_id) {
      this.setState({ attribute_id: this.props.attribute_id });
      this.getAttributeTypeDetails();
    }
    if (prevProps.language_id !== this.props.language_id) {
      if (this.props.attribute_id !== undefined) {
        // this.setState({ attribute_id: this.props.attribute_id });
        this.getAttributeTypeDetails();
      }
    }
  }
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  getAttributeTypeList = () => {
    var that = this;
    var data = new URLSearchParams();
    data.append("LanguageId", that.props.language_id);
    fetch(Constant.getAPI() + "/attribute/type/get", {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: data
    }).then(function (response) {
      return response.json();
    }).then(function (json) {
      //console.log(json.data)
      if (json.status === true) {
        that.setState({ attribute_type_list: json.data });
      } else {
        that.setState({ attribute_type_list: [] });
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
  handleImageUpload = (event) => {
    document.getElementById('id_image_section_lable').innerHTML = "";
    let element = $("#user_Image").get(0);
    $("#id_image_section").empty();
    this.setState({ accepted: element });
    var proof_img = [];
    let obj = {};
    //console.log(element.files);
    this.setState({ user_Image: element.files });
    for (var i = 0; i < element.files.length; i++) {
      var file1 = element.files[i];
      var img = document.createElement("img");
      img.className = "img-100";
      var filePath = URL.createObjectURL(file1);
      img.src = filePath;
      $("#id_image_section_lable").append(img);
    }
  }
  getAttributeTypeDetails = () => {
    var that = this;
    var data = new URLSearchParams();
    data.append("AttributeId", that.props.attribute_id);
    data.append("LanguageId", that.props.language_id);
    fetch(Constant.getAPI() + "/attribute/get", {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: data
    }).then(function (response) {
      return response.json();
    }).then(function (json) {
      if (json.status === true) {
        that.setState({ attribute_type_data: json.data[0], 
          attribute_name: json.data[0].name_en,
          attribute_name_ar: json.data[0].name_ar,

           AttributeTypeId: json.data[0].AttributeTypeId });
      } else {
        that.setState({ attribute_type_data: {} });
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
  onSaveData = () => {
    var that = this;
    that.setState({ isSaving: true });
    // if (that.state.accepted) {
    //   that.uploadMedia();
    // } else {
    //   that.editUser(that.state.media_id);
    // }
    if (that.props.attribute_id !== undefined) {
      that.updateCategoryData();
    } else {
      that.addCategory();
    }
  }
  updateCategoryData = () => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    data.append("name_en", that.state.attribute_name);
    data.append("name_ar", that.state.attribute_name_ar);
    data.append("AttributeId", that.props.attribute_id);
    data.append("AttributeTypeId", that.state.AttributeTypeId);
    fetch(Constant.getAPI() + "/attribute/update", {
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
        Swal.fire("Updated !", "Attribute has been Updated", "success");
        window.location.href = `#/attributes/${that.props.attribute_type_id}`
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

  };
  addCategory = () => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    data.append("name_en", that.state.attribute_name);
    data.append("name_ar", that.state.attribute_name_ar);

    data.append("AttributeTypeId", that.state.AttributeTypeId);
    //data.append("LanguageId", that.props.language_id);
    //console.log( that.state.attribute_name)
     //console.log(that.state.AttributeTypeId)
      //console.log(that.props.language_id)
    fetch(Constant.getAPI() + "/attribute/add", {
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
        Swal.fire("Added !", "Attribute has been Added", "success");
        //console.log(json.result.id,that.props.attribute_type_id)
        //console.log(json)
        window.location.href = `#/attributes-values/${that.props.attribute_type_id}/${json.result.id}/add`
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

  };
  componentWillMount() {
    this.getAttributeTypeList();
    this.loadScript(process.env.PUBLIC_URL + "/assets/pages/filer/jquery.fileuploads.init.js");
  }
  loadScript(src) {
    let script = document.createElement("script");
    script.src = src;
    script.type = "text/javascript";
    document.head.append(script);
  }
  render() {
    return (
      <div className="">
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Attribute Name (English)</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    name="attribute_name"
                    id="attribute_name"
                    placeholder="Attribute Name"
                    onChange={this.handleChange}
                    value={this.state.attribute_name}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Attribute Name (Arabic)</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    name="attribute_name_ar"
                    id="attribute_name"
                    placeholder="Attribute Name"
                    onChange={this.handleChange}
                    value={this.state.attribute_name_ar}
                  />
                </div>
              </div>
            </div>
            {/* <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Attribute Type</label>
                <div className="col-sm-9">
                  <select name="AttributeTypeId" className="form-control" value={this.state.AttributeTypeId} 
                  // onChange={this.handleChange} 
                  disabled>
                    {
                      this.state.attribute_type_list !== undefined && this.state.attribute_type_list !== null && this.state.attribute_type_list !== [] && this.state.attribute_type_list.length > 0
                        ?
                        this.state.attribute_type_list.map(attribute_type =>
                          <option key={attribute_type.id} value={attribute_type.id}>{attribute_type.name}</option>
                        )
                        :
                        null
                    }
                  </select>
                </div>
              </div>
            </div> */}
            {/* <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Status</label>
                <div className="col-sm-9">
                  <select name="status" className="form-control" value={this.state.status} onChange={this.handleChange}>
                    <option value="true" name="active">Active</option>
                    <option value="false" name="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div> */}
          </div>

          {/* <div className="row">
            <div className="col-md-12">
              <div className="form-group row">
                <label className="col-sm-2 col-form-label">Description</label>
                <div className="col-sm-10">
                  <ReactQuill
                    value={this.state.description}
                    onChange={this.onHandleDescriptionChange}
                    style={{ height: "200px", marginBottom: '5%' }}
                  />
                </div>
              </div>
            </div>
          </div>
          */}
          <div className="card-footer">
            <div className="row float-right p-3">
              {
                this.state.isSaving
                  ?
                  <button className="btn btn-grd-disabled mr-2" disabled>Saving...!</button>
                  :
                  <button onClick={this.onSaveData} className="btn btn-grd-disabled mr-2"><i className="icofont icofont-save"></i> Save</button>
              }
              <Link to={"/attributes/"+this.props.attribute_type_id} className="btn btn-outline-dark">
                Cancel
        </Link>
            </div>
          </div>
        </div>
      </div >
    );
  }
}

export default AttributeAdd;
