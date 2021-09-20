import React from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Constant from "../../Constant.js";
import $ from "jquery";
import ReactQuill from "react-quill";
import Datetime from 'react-datetime';
import moment from 'moment'
import Select from "react-select";

class PushNotificationAdd extends React.Component {
  state = {
    status: true,
    text: "",
    checked:false,
    text_ar:"",
    text_en:"",
    title_ar:"",
    title_en:"",
    
  };
  onHandleNotificationTextChange = value => {
    this.setState({ text: value });
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  componentDidMount=()=>{
    this.getUsersList()
  }
  getUsersList = () => {
    var that = this;
    var data = new URLSearchParams();
    // this.setState({ isSaving: true });
    fetch(Constant.getAPI() + "/user/get", {
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
        that.setState({ customers_data: json.data });
      } else {
        that.setState({ customers_data: [] });
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
  addPushNotification = (media_id) => {
    console.log(media_id)
    if(this.state.text_en ==''){
      Swal.fire("Error !", "Add Notification Text in English", "warning");
      return false
    }
    else if(this.state.text_ar == '')
    {
      Swal.fire("Error !", "Add Notification Text in Arabic", "warning");
      return false
    }
    else if(this.state.title_ar == '')
    {
      Swal.fire("Error !", "Add Notification Title in Arabic", "warning");
      return false
    }  else if(this.state.title_en == '')
    {
      Swal.fire("Error !", "Add Notification Text in English", "warning");
      return false
    }
   else if(this.state.UserArray.length>0){
      
     
      var arr=this.state.UserArray
      var userArray=[]
      for(let i=0;i<arr.length;i++){
        userArray[i] = arr[i].id
      }


      var that = this;
      // var data = new URLSearchParams();
      // this.setState({ isSaving: true });
      // data.append("title_en", that.state.title_en);
      // data.append("title_ar", that.state.title_ar);
      // data.append("userArray", JSON.stringify(userArray));

      // data.append("text_en", that.state.text_en);
      // data.append("text_ar", that.state.text_ar);
      // data.append("mediaId", media_id);
      var aa={
      title_en: that.state.title_en,
      title_ar: that.state.title_ar,
      userArray:userArray,
      text_en: that.state.text_en,
      text_ar: that.state.text_ar,
      mediaId: media_id

      }
      var data= JSON.stringify(aa)
      console.log(data)
  
  
      fetch(Constant.getAPI() + "/notification/add", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Authorization": localStorage.getItem('q8_mall_auth')
        },
        body: data
      }).then(function (response) {
        return response.json();
      }).then(function (json) {
        if (json.status === true) {
          Swal.fire("Sent !", "Push Notification has been Sent", "success");
           window.location.href = "#/notifications/list"
         // window.location.reload();
          that.setState({ isSaving: false });
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
      })

    }
    else{
      Swal.fire("Error !", "Select Users", "warning");
      return false
    }

   
  };
  handleUsers=(e)=>{
  console.log(e)
    this.setState({
      UserArray:e
    })
  }
  onSaveData = () => {
    var that = this;
    that.setState({ isSaving: true });

   this.uploadMedia()

    
  }

  uploadMedia = () => {
    var that = this;
    var form = $("#categoryImage")[0];
    var data = new FormData(form);
    fetch(Constant.getAPI() + "/media/add", {
      method: "post",
      body: data,
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        if (json.status === true) {
          if(json.data[0]!== undefined && json.data[0].id !== undefined){
            that.addPushNotification(json.data[0].id);

          }
          else{
            Swal.fire("Error !", "Select Image", "warning");
            return false
          }
        }
        else{
          window.alert("Error With Image Upload")
        }
      });
  };

  selectAll=(e)=>{
    console.log(e)
    if(e == true){
      this.setState({
        checked:e,
        //disabled:true,
        UserArray:this.state.customers_data
      })

    }
    else if(e == false){
      this.setState({
        checked:e,
        //disabled:false,
        UserArray:[]
      })
    }
   
  }

  handleImageUpload = (event) => {
    document.getElementById("category_image_label").innerHTML = "";
    let element = $("#category_image").get(0);
    // $("#id_image_section").empty();
    this.setState({ accepted: element });
    var proof_img = [];
    let obj = {};
    //console.log(element.files);
    this.setState({ category_image: element.files });
    for (var i = 0; i < element.files.length; i++) {
      var file1 = element.files[i];
      var img = document.createElement("img");
      img.className = "img-100";
      var filePath = URL.createObjectURL(file1);
      img.src = filePath;
      $("#category_image_label").append(img);
    }
  };



  render() {
     const customStyles = {
      option: (provided, state) => ({
        ...provided,
        borderBottom: "1px dotted grey",
        color: state.isSelected ? "red" : "black",
        padding: 8,
      }),
      input: (provided) => ({
        ...provided,
        display: "flex",
        height: "30px",
      }),
    };
    return (
      <div className="">
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Notification Title English</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    id="title"
                    placeholder="Notification Title"
                    onChange={(e)=>{this.setState({title_en:e.target.value})}}
                    value={this.state.title_en}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Notification Title Arabic</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    id="title"
                    placeholder="Notification Title"
                    onChange={(e)=>{this.setState({title_ar:e.target.value})}}
                    value={this.state.title_ar}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Notification Text</label>
                <div className="col-sm-9">
                  <textarea
                    //value={this.state.text_en}
                    className="form-control"
                    onChange={(e)=>{this.setState({text_en:e.target.value}) }}
                    style={{ height: "100px", marginBottom: '5%' }}
                  />
                </div>
              </div>
              </div>
              <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Notification Text</label>
                <div className="col-sm-9">
                  <textarea
                   className="form-control"
                    //value={this.state.text_ar}
                    onChange={(e)=>{this.setState({text_ar:e.target.value})}}
                    style={{ height: "100px", marginBottom: '5%' }}
                  />
                </div>
              </div>
             </div>
            
          </div>
          <br/>
          <div className="row">

          <div className="col-md-6">
                <div className="form-group row">
                  <label className="col-sm-3 col-form-label">Select Users</label>
                  <div className="col-sm-9">
                    <Select
                      styles={customStyles}
                      isMulti={true}
                      isDisabled={this.state.disabled}
                      value={this.state.UserArray}
                      getOptionLabel={(option) => `${option.firstName +" "+option.lastName}`}
                      getOptionValue={(option) => `${option.id}`}
                     onChange={this.handleUsers}
                      options={this.state.customers_data}
                    />
                  </div>
                  
                </div>
              </div>
              <div className="col-md-5"> 
              <div className="col-sm-6">
              <input type="checkbox" style={{width:"20px",height:"20px"}} 
              className="form-control" 
              onClick={(e)=>{this.selectAll(e.target.checked)}}
              checked={this.state.checked}
                  />
              </div>
                <label className="col-sm-4 col-form-label">Select All Users</label>
                
              </div>

           </div>

          <div className="row">
              <div className="col-md-6">
                <div className="form-group row">
                  <div className="col-sm-3">Display Image <br/></div>
                  
                  <div className="col-sm-9">
                    <form
                      id="categoryImage"
                      name="categoryImage"
                      encType="multipart/form-data"
                      className="text-capitalize"
                    >
                      <div className="form-group">
                        {/* <input onChange={this.handleChange} id="shop_Image" type="text" className="form-control" name="image" /> */}
                        <input
                          accept="image/*"
                          onChange={this.handleImageUpload}
                          id="category_image"
                          type="file"
                          className="form-control"
                          autoComplete="off"
                          name="media"
                          data-toggle="tooltip"
                          title="Click To Upload Notification Image"
                        />
                      </div>
                    </form>
                  </div>
                  </div>

                </div>
              </div>
              <div className="row">
                <div className="col-md-2"></div>
              <div className="col-md-6 mb-2">
                <div id="category_image_label" className="pt-2">
                  {this.state.image ? (
                    this.state.image !== null ||
                    this.state.image !== undefined ||
                    this.state.image !== {} ? (
                      <img
                        src={this.state.image}
                        alt=""
                        className="img-100"
                        onError={(e) => {
                          e.target.src = "";
                        }}
                      />
                    ) : (
                      ""
                    )
                  ) : (
                    ""
                  )}
                </div>
                </div>
              </div>

          

         





          <div className="row float-right p-3">
            {
              this.state.isSaving
                ?
                <button className="btn btn-grd-disabled mr-2" disabled>Sending...!</button>
                :
                <button onClick={this.onSaveData} className="btn btn-grd-disabled mr-2"><i className="icofont icofont-save"></i> Send</button>
            }
            {/* <Link to={"/notifications"} className="btn btn-outline-dark">
              Cancel
        </Link> */}
          </div>
        
        </div>
      </div >

    );
  }
}

export default PushNotificationAdd;
