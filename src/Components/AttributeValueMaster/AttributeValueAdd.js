import React from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import $ from "jquery";
import Constant from "../../Constant";
import ReactQuill from "react-quill";

class AttributeValueAdd extends React.Component {
  state = {
    status: true,
    description: ""
  };
  onHandleDescriptionChange = value => {
    this.setState({ description: value });
  };
  componentDidMount(){
    this.setState({AttributeId:this.props.attribute_id});
  }
  componentDidUpdate(prevProps) {
    if (prevProps.attribute_value_id !== this.props.attribute_value_id) {
      this.setState({ attribute_value_id: this.props.attribute_value_id });
      this.getAttributeTypeDetails();
    }
    if (prevProps.language_id !== this.props.language_id) {
      if (this.props.attribute_value_id !== undefined) {
        // this.setState({ attribute_value_id: this.props.attribute_value_id });
        this.getAttributeTypeDetails();
      }
    }
  }
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  getAttributeList = () => {
    var that = this;
    var data = new URLSearchParams();
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
        that.setState({ attribute_list: json.data });
      } else {
        that.setState({ attribute_list: [] });
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
    data.append("AttributeValueId", this.props.attribute_value_id);
    data.append("LanguageId", that.props.language_id);
    fetch(Constant.getAPI() + "/attribute/value/get", {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: data
    }).then(function (response) {
      return response.json();
    }).then(function (json) {
      if (json.status === true) {
        that.setState({
          attribute_type_data: json.data[0],
          attribute_name: json.data[0].name_en,
          attribute_name_ar: json.data[0].name_ar,

          attribute_unit: json.data[0].unit,
          attribute_value: json.data[0].value,
          AttributeId: json.data[0].AttributeId
        });
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
    if (that.props.attribute_value_id !== undefined) {
      that.updateCategoryData();
    } else {
      that.addCategory();
    }
  }
  updateCategoryData = () => {
    var that = this;
    var data = new URLSearchParams();
    that.setState({ isSaving: true });
    if (that.state.AttributeId === undefined || that.state.AttributeId === null || that.state.AttributeId === "0") {
      Swal.fire("warning", "Please Select Attribute Type First.!","warning");
      that.setState({ isSaving: false });
      return false;
    }
    data.append("name_en", that.state.attribute_name);
    data.append("name_ar", that.state.attribute_name_ar);

    data.append("AttributeValueId", that.props.attribute_value_id);
    data.append("AttributeId", that.state.AttributeId);
    data.append("unit", that.state.attribute_unit);
    data.append("value", that.state.attribute_value);
    fetch(Constant.getAPI() + "/attribute/value/update", {
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
        Swal.fire("Updated !", "Attribute Value has been Updated", "success");
        window.location.href = `#/attribute-values/${that.props.attribute_type_id}/${that.props.attribute_id}`
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
    that.setState({ isSaving: true });
    if (that.state.AttributeId === undefined || that.state.AttributeId === null || that.state.AttributeId === "0") {
      Swal.fire("warning", "Please Select Attribute Type First.!","warning");
      that.setState({ isSaving: false });
      return false;
    }
    data.append("name_en", that.state.attribute_name);
    data.append("name_ar", that.state.attribute_name_ar);

    data.append("AttributeId", that.state.AttributeId);
    data.append("unit", that.state.attribute_unit);
    data.append("value", that.state.attribute_value);
    //data.append("LanguageId", that.props.language_id);
    fetch(Constant.getAPI() + "/attribute/value/add", {
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
        Swal.fire("Added !", "Attribute Value has been Added", "success");
        //console.log(json)

        window.location.href = `#/attribute-values/${that.props.attribute_type_id}/${that.props.attribute_id}`
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
    this.getAttributeList();
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
                <label className="col-sm-3 col-form-label">Name (English)</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    name="attribute_name"
                    id="attribute_name"
                    placeholder="Name"
                    onChange={this.handleChange}
                    value={this.state.attribute_name}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Name (Arabic)</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    name="attribute_name_ar"
                    id="attribute_name_ar"
                    placeholder="Name"
                    onChange={this.handleChange}
                    value={this.state.attribute_name_ar}
                  />
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Value</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    name="attribute_value"
                    id="attribute_value"
                    placeholder="Value"
                    onChange={this.handleChange}
                    value={this.state.attribute_value}
                  />
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Unit</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    name="attribute_unit"
                    id="attribute_unit"
                    placeholder="Unit"
                    onChange={this.handleChange}
                    value={this.state.attribute_unit}
                  />
                </div>
              </div>
            </div>

            {/* <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Attribute Type</label>
                <div className="col-sm-9">
                  <select name="AttributeId" className="form-control" value={this.state.AttributeId} 
                  //onChange={this.handleChange}
                  disabled>
                    <option value="0">Select Attribute Type</option>
                    {
                      this.state.attribute_list !== undefined && this.state.attribute_list !== null && this.state.attribute_list !== [] && this.state.attribute_list.length > 0
                        ?
                        this.state.attribute_list.map(attribute =>
                          <option key={attribute.id} value={attribute.id}>{attribute.name}</option>
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
                  <select name="status" className="form-control"
                   value={this.state.status} 
                  onChange={this.handleChange}>
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
              <Link to={"/attribute-values/"+this.props.attribute_type_id+"/"+this.props.attribute_id} className="btn btn-outline-dark">
                Cancel
        </Link>
            </div>
          </div>
        </div>
      </div >
    );
  }
}

export default AttributeValueAdd;
