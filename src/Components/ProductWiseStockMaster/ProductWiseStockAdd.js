import React from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import $ from "jquery";
import Constant from "../../Constant";
import ReactQuill from "react-quill";
// import { ContactsOutlined } from "@material-ui/icons";

class ProductWiseStockAdd extends React.Component {
  state = {
    status: true,
    description: "",
    selected_attributes: [],
    attribute_list:[],
    attributeValue_list:[],
    combinationArray:[
      {
        "stock":0,
        "price":0,
        "currency":"KWD",
        "sku":"",
        "barNumber":"",
        "barCode":"",
        "variantId":"",
        "deliveryOptions":"",
        "showInListing":"false",
        "MediaId":localStorage.getItem('shop_media'),
        "attributeArray":[
                {  "AttributeId":"",
                   "AttributeValueId":""
                },
              ],
        "mediaArray":[localStorage.getItem('shop_media')]
       }
     ],
     nameArray:[
       {
        attributeArray:[
          {
            name:""
          }
        ]

       }
        

     ]

     
  };
  onHandleDescriptionChange = value => {
    this.setState({ description: value });
  };
  componentDidUpdate(prevProps, prevState) {
    //console.log(prevProps)
    if (prevProps.product_id !== this.props.product_id) { 
      this.setState({ product_id: this.props.product_id });
      this.getProductDetails();
    }
    if (prevProps.product_id !== this.props.product_id || prevProps.stock_id !== this.props.stock_id) {
      this.setState({ product_id: this.props.product_id });
      this.getProductWiseStockList();
    }
    if (prevProps.language_id !== this.props.language_id) {
      if (this.props.product_id !== undefined) {
        // this.setState({ product_id: this.props.product_id });
        this.getProductDetails();
      }
      if (this.props.stock_id !== undefined) {
        // this.setState({ product_id: this.props.product_id });
        this.getProductWiseStockList();
      }
    }
  }
  handleChange = (key,event) => {

    console.log(key)
    var combinationArray=this.state.combinationArray
    
    combinationArray[key][event.target.name] = event.target.value
    console.log(combinationArray)
    this.setState({ combinationArray });
  };
  handleChangeAtt=(index,key,event)=>{
    console.log(key,index,event.target.name,event.target.value)
    this.getAttributesValue(event.target.value)
    var combinationArray=this.state.combinationArray
    combinationArray[key].attributeArray[index][event.target.name]=event.target.value
    this.setState({
      combinationArray
    })


  }
  reset(index,key){
    console.log("vsd")
    var nameArray=this.state.nameArray
    nameArray[key].attributeArray[index].name=""

    var combinationArray=this.state.combinationArray
    combinationArray[key].attributeArray[index].AttributeValueId=""

    this.setState({
      nameArray,
      combinationArray
    })


  }
 
  handleChangeAttVal=(index,key,event)=>{
    var combinationArray=this.state.combinationArray
    combinationArray[key].attributeArray[index][event.target.name]=event.target.value
    var arr=this.state.attributeValue_list

   var nameArray=this.state.nameArray

    for(let i=0;i<arr.length;i++){
      if(event.target.value == arr[i].id){
         nameArray[key].attributeArray[index].name= arr[i].name_en
      }
    }
    console.log(nameArray)
    // var nameArray=this.state.nameArray
    // nameArray[key].attributeArray[index].name= event.target.name
    this.setState({
      combinationArray,
      nameArray
    })


  }


  handleImageUpload = (event) => {
    document.getElementById('banner_image_label').innerHTML = "";
    let element = $("#product_stock_media").get(0);
    // $("#id_image_section").empty();
    this.setState({ accepted: element });
    var proof_img = [];
    let obj = {};
    //console.logog(element.files);
    this.setState({ product_stock_media: element.files });
    for (var i = 0; i < element.files.length; i++) {
      var file1 = element.files[i];
      var img = document.createElement("img");
      img.className = "img-100 img-preview";
      var filePath = URL.createObjectURL(file1);
      img.src = filePath;
      $("#banner_image_label").append(img);
    }
  }

 

  getProductDetails = () => {
    var that = this;
    var data = new URLSearchParams();
    data.append("ProductId", this.props.product_id);
    //console.logog(this.props.product_id)
    fetch(Constant.getAPI() + "/product/get", {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": localStorage.getItem('q8_mall_auth')
      },
      body: data
    }).then(function (response) {
      return response.json();
    }).then(function (json) {
      console.log(json.data)
    
    });
  }
  componentDidMount(){
    this.getAttributes()
    console.log(localStorage.getItem('shop_media'))
    console.log(this.props.product_id)
    console.log(this.props.stock_id)
  }

  getAttributes = () => {
    var that = this;
    var data = new URLSearchParams();
    // data.append("ProductId", this.props.product_id);
    //console.logog(this.props.product_id)
    fetch(Constant.getAPI() + "/attribute/get", {
      method: "post",
      headers: {
        // "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": localStorage.getItem('q8_mall_auth')
      },
      body: data
    }).then(function (response) {
      return response.json();
    }).then(function (json) {
      console.log(json)
      var arr=json.data
      var combinationArray =that.state.combinationArray
      for(let i=0;i<arr.length;i++){
        
        if(arr[i].name_en == "Default Attribute"){
          console.log(arr[i])
          //AttributeValues[0].id
          combinationArray[0].attributeArray[0].AttributeId=arr[i].id
          combinationArray[0].attributeArray[0].AttributeValueId=arr[i].AttributeValues[0].id

        }
      }

      var attribute=json.data

      for(let i=0;i<json.data.length;i++){
        if(json.data[i].name == "Default Attribute")
        {   
            console.log( json.data[i] )
            attribute.splice(i, 1);
          
        }
      }
      console.log(attribute)
      if(json.status == true){
        that.setState({
          attribute_list:attribute
        })
      }
      
   
    });
  }
  getAttributesValue = (id) => {
    var that = this;
    var data = new URLSearchParams();
    data.append("AttributeId", id);
    //console.logog(this.props.product_id)
    fetch(Constant.getAPI() + "/attribute/value/get", {
      method: "post",
      headers: {
        // "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": localStorage.getItem('q8_mall_auth')
      },
      body: data
    }).then(function (response) {
      return response.json();
    }).then(function (json) {
      console.log(json)
      if(json.status == true){
        that.setState({
          attributeValue_list:json.data
        })
      }
      
   
    });
  }
  onSaveData = () => {
    var that = this;
    that.setState({ isSaving: true });
    if (that.state.accepted) {
      that.uploadMedia();
    } else {
      if (that.props.stock_id !== undefined) {
        that.updateProductWiseStockData(that.state.MediaId);
      } else {
        that.addProductWiseStockData(that.state.MediaId);
      }
    }
  }
  uploadMedia = () => {
    var that = this;
    var form = $('#productStockMedia')[0];
    var data = new FormData(form);
    // data.append('upload_for', 'user');
    fetch(Constant.getAPI() + "/media/add", {
      method: "post",
      body: data
    }).then(function (response) {
      return response.json();
    }).then(function (json) {
      if (json.status === true) {
        that.addProductWiseStockData(json.data);
      } else {
        // that.setState({ category_data: [] });
        //console.logog(json.error);
      }
    });
  }
  updateProductWiseStockData = (media_id) => {
    var that = this;
    var media_data = [];
    if (media_id !== undefined && media_id !== null && media_id !== [] && media_id.length > 0) {
      for (var media = 0; media < media_id.length; media++) {
        media_data.push(media_id[media].id);
      }
    }
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    data.append("count", that.state.count);
    data.append("LanguageId", that.props.language_id);
    if(this.state.barNumber !== undefined){
      data.append("barNumber", that.state.barNumber);
      }    data.append("deliveryOptions", that.state.product_stock_list.deliveryOptions);
    data.append("ProductId", that.props.product_id);
    data.append("StockId", that.props.stock_id);
    data.append("AttributeValueIds", JSON.stringify(that.state.selected_attributes));
    //console.log(that.state.product_stock_list.barNumber)
    fetch(Constant.getAPI() + "/product/stock/update", {
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
        Swal.fire("Updated !", "Product has been Updated", "success");
        window.location.href = `#/products/stock/${that.props.product_id}`
        that.setState({ isSaving: false })
      } else {
        that.setState({ isSaving: false });
        // Swal.fire({
        //   title: "Something went wrong. Try again after some Time.!",
        //   icon: 'error',
        //   text: "",
        //   confirmButtonColor: "#3085d6",
        //   cancelButtonColor: "#d33",
        //   confirmButtonText: "Ok"
        // })
      }
    });

  };
  // componentWillMount() {
  //   this.getCountryList();
  //   this.loadScript(process.env.PUBLIC_URL + "/assets/pages/filer/jquery.fileuploads.init.js");
  // }
  addProductWiseStockData = (media_id) => {
 
    var that = this;  
  
    this.setState({ isSaving: true });
    var data={
      productId:that.props.product_id,
      combinationArray:that.state.combinationArray
      
    }
    fetch(Constant.getAPI() + "/product/combination/add", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem('q8_mall_auth')
      },
      body:JSON.stringify(data)
      
    }).then(function (response) {
      return response.json();
    }).then(function (json) {
      console.log(json,json.success,json.success == true,json.success=='true',json.success === true)
      if (json.success == true) {
        Swal.fire({
          title: "Added Successful",
          icon: 'success',
          // showDenyButton: true,
          // showCancelButton: true,
          // showCancelButton: true,
  confirmButtonColor: '#3085d6',
  // cancelButtonColor: '#d33',
  confirmButtonText: 'OK'
        }).then((result)=>{
          console.log(result,result.value)
          if (result.value) {
             window.location.href="#/products"
          } 
        })
        that.setState({ isSaving: false })
      } else {
        that.setState({ isSaving: false });
        Swal.fire({
          title: "Something went wrong. Try again after some Time.!",
          icon: 'error',
          text: " ",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Ok"
        })
      }
    });

  };
  componentWillMount() {
    this.getCountryList();
    this.loadScript(process.env.PUBLIC_URL + "/assets/pages/filer/jquery.fileuploads.init.js");
  }
  loadScript(src) {
    let script = document.createElement("script");
    script.src = src;
    script.type = "text/javascript";
    document.head.append(script);
  }
  changeAttributesSelection = (event) => {
    var id = event.target.value;
    let arr = this.state.selected_attributes;
    var index = -1;
    arr.find(function (value, i) {
      if ((parseInt(value, 10) === parseInt(id, 10))) {
        index = i;
      }
    }.bind(this))
    if (index !== -1) {
      arr.splice(index, 1);
      this.setState({ selected_attributes: arr });
    } else {
      // obj = id;
      arr.push(id);
      this.setState({ selected_attributes: arr });
    }
  }
  getCountryList = () => {
    var that = this;
    var data = new URLSearchParams();
    fetch(Constant.getAPI() + "/country/getActive", {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: data
    }).then(function (response) {
      return response.json();
    }).then(function (json) {
      if (json.status === true) {
        that.setState({ country_list: json.data });
      } else {
        that.setState({ country_list: [] });
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
  addProductPrice = (id,pid) => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    data.append("value", that.state.value);
    data.append("specialPrice", that.state.specialPrice);
    data.append("LanguageId", that.props.language_id);
    data.append("CurrencyId", that.state.CurrencyId);
    // if(this.state.barNumber !== undefined){
    // data.append("barNumber", that.state.barNumber);
    // }
    // if(that.props.stock_id)
    // { //console.logog("props")
      data.append("StockId",id);
     
    // }
    // else
    // { //console.logog("param")
    //   data.append("StockId", that.props.match.params.stock_id);
    //  }
      //console.logog(that.state.value, that.state.specialPrice, 
        //that.props.language_id,that.state.CurrencyId,that.props.stock_id)
      //data.append("StockId", that.props.stock_id);
    fetch(Constant.getAPI() + "/product/stock/price/add", {
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
        Swal.fire("Added !", "Product Stock and  Price has been Added", "success");
        //console.logog(json)
        //if(that.props.status="add"){
       // window.location.href = `#/products`
      //}
        // else
        // {window.location.href = `#/products/price/${that.props.stock_id}/${that.props.product_id}`}
        // window.location.href = `#/products/add/${pid}`
        //console.logog(pid)
        //console.logog(json.data)
         window.location.href = `#/products/stock/${pid}`

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
  updateProductPriceData = () => {
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    data.append("value", that.state.value);
    data.append("LanguageId", that.props.language_id);
    data.append("CurrencyId", that.state.CurrencyId);
    data.append("specialPrice", that.state.specialPrice);
    data.append("PriceId", that.props.price_id);
    fetch(Constant.getAPI() + "/product/stock/price/update", {
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
        Swal.fire("Updated !", "Product Price has been Updated", "success");
        window.location.href = `#/products/price/${that.props.stock_id}/${that.props.product_id}`
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
  AddCombination(){
    var nameArray=this.state.nameArray
    var length=this.state.nameArray.length
    nameArray[length]= {
      attributeArray:[
        {
          name:""
        }
      ]

     }

    var combinationArray=this.state.combinationArray
    combinationArray[combinationArray.length]=  {
      'stock':0,
      'price':0,
      'currency':"KWD",
      'sku':"",
      'barNumber':"",
      'barCode':"",
      'variantId':"",
      'deliveryOptions':"",
      'showInListing':"false",
      'MediaId':"",
      'attributeArray':
            [
              {  'AttributeId':"",
                 'AttributeValueId':""
              },
            ],
      'mediaArray':[]
     }
     this.setState({
       combinationArray,
       nameArray
     })
  }
  AddAttribute(key){
    var combinationArray=this.state.combinationArray
    var length =combinationArray[key].attributeArray.length
    combinationArray[key].attributeArray[length]={
        'AttributeId':"",
        'AttributeValueId':""
    }
    var nameArray=this.state.nameArray
    var length=this.state.nameArray[key].attributeArray.length
    nameArray[key].attributeArray[length]={name:""}
    console.log(nameArray)
    this.setState({
      combinationArray,
      nameArray
    })
  }
  render() {
    const style={height:"40px",opacity:"0.8",color:"black",fontWeight:"bold",borderRadius:"10px"}

    return (
      <div className="">
        <div className="row justify-right">
          {this.props.stock_id == undefined ?
        <button className="col-2 btn btn-primary form-control" style={style} 
            onClick={this.AddCombination.bind(this,"productDetails")} 
             >
        <h6><i className="f-16 icofont icofont-plus"/><b>Add Variant</b></h6>
          </button>
          :null}
          
        </div>
        {/* {console.log(this.state.combinationArray[0].stock)} */}
        <div className="card-body" style={{margin:"20px"}}>
          {this.state.combinationArray.map((combination,key)=>{
     return(
         <div style={{borderBottom:"4px groove lightgrey",marginBottom:"10px"}}>
          {this.props.stock_id == undefined ?
           <div>
           <h5>Variant No. {key+1}</h5> 
           <br/>
           </div>
           :null
           }
          <div className="row">
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Stock</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    name='stock'
                    placeholder="Stock"
                    onChange={this.handleChange.bind(this,key)}
                    value={combination.stock}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">barCode</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    name="barCode"
                    
                    placeholder="Enter Barcode"
                    onChange={this.handleChange.bind(this,key)}
                    value={combination.barCode}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">SKU</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    name="sku"
                    
                    placeholder="Enter SKU"
                    onChange={this.handleChange.bind(this,key)}
                    value={combination.sku}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Variant ID</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    name="variantId"
                    
                    placeholder="Enter Variant ID"
                    onChange={this.handleChange.bind(this,key)}
                    value={combination.variantId}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Listing Product</label>
                <div className="col-sm-9">
                 <select
                 className="form-control"
                 value={combination.showInListing}
                 onChange={this.handleChange.bind(this,key)}

                  name="showInListing">
                    <option value=""> Select </option>
                    <option value="true">Active</option>
                    <option value="false">In-Active</option>

                 </select>
                </div>
              </div>
            </div>
            {/* <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Delivery Options</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    name="deliveryOptions"
                    id="deliveryOptions"
                    placeholder="Delivery Options"
                    onChange={this.handleChange}
                    value={this.state.deliveryOptions}
                  />
                </div>
              </div>
            </div> */}
               <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Price</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    name="price"
                    placeholder="Price"
                    onChange={this.handleChange.bind(this,key)}
                    value={combination.price}
                  />
                </div>
              </div>
            </div>

            {/* <div className="col-md-6">
              <div className="row">
                <div className="col-sm-3">
                  Variant Gallery Media
                </div>
                <div className="col-sm-9">
                  <form id="productStockMedia" name="productStockMedia" encType="multipart/form-data" className="text-capitalize">

                    <div className="form-group">
                      <input accept="image/*"
                       onChange={this.handleImageUpload} 
                       id="product_stock_media" 
                       type="file" 
                       className="form-control" 
                       autoComplete="off" 
                       name="media" 
                       multiple
                       data-toggle="tooltip" title="Click To Upload Stock Media"
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
                      <img src={this.state.image} alt="" className="img-100 img-preview" onError={e => { e.target.src = "" }} />
                      :
                      ''
                    :
                    ''
                }
              </div>
              </div>
              
         */}
            </div> 

          <div className="row">
            <div className="col-md-12">
              <div className="form-group row">
                <label className="col-sm-1 col-form-label">Attribute</label>
                <div className="col-sm-11">
                  <div className="p-20 z-depth-right-1 waves-effect"
                        data-toggle="tooltip" data-placement="top" 
                        title="" data-original-title="Select Attribute" style={{border:"2px groove lightgrey"}}>
                    <button className="col-2 btn btn-primary form-control " style={style} 
                               onClick={this.AddAttribute.bind(this,key)} 
                           > <i className="f-16 icofont icofont-plus "></i> Add 
                    </button>
                   <br/><br/>
                   {
                     console.log(this.state.attribute_list)
                   }
                    {  
                    combination.attributeArray ? 
                    combination.attributeArray.map((attribute,index)=>{

                   return(
                    <div className="row ">
                     <div className="col-md-6">
                     <div className="form-group row">
                       <label className="col-sm-3 col-form-label">Select Attribute </label>
                       <div className="col-sm-9">
                         
                        <select
                        className="form-control"
                        value={attribute.AttributeId}
                        onChange={this.handleChangeAtt.bind(this,index,key)}
       
                         name="AttributeId">
                           <option value="">Select</option>
                           {
                             this.state.attribute_list.length>0 ?
                             this.state.attribute_list.map(option=>{
                               return(
                                 <option value={option.id}>{option.name}</option>
                               )
                             })

                             :null

                           }
                           
       
                        </select>
                       </div>
                     </div>
                   </div>
                   <div className="col-md-6">
                     <div className="form-group row">
                       <label className="col-sm-3 col-form-label">Select Value</label>
                       <div className="col-sm-9">
                    {
                      attribute.AttributeValueId !== "" ?
                        <input
                        
                        className="form-control"
                        onFocus={this.reset.bind(this,index,key)}
                        value={this.state.nameArray[key].attributeArray[index].name}>

                        </input>
                   :
                        <select
                        className="form-control"
                        value={attribute.AttributeValueId}
                        onChange={this.handleChangeAttVal.bind(this,index,key)}
       
                         name="AttributeValueId">
                           <option value=""> Select </option>
                           {
                             this.state.attributeValue_list.length>0?
                             this.state.attributeValue_list.map(val=>{
                               return(
                                 <option value={val.id}>{val.name_en+"/"+val.name_ar}</option>
                               )
                             })
                             :null
                           }
       
                        </select>
                           
                           } 
                       </div>
                     </div>
                   </div>
                   
                   </div>
                   )
                    }) :null
                      // this.state.attribute_list !== undefined && this.state.attribute_list !== null && this.state.attribute_list !== [] && this.state.attribute_list.length > 0
                      //   ?
                      //   this.state.attribute_list.map(attributes =>
                      //     <div className="row" key={attributes.id}>
                      //       <div className="col-sm-3">
                      //         <label>{attributes.name}</label>
                      //       </div>
                      //       {attributes.AttributeValues.map(attribute_val =>
                      //           // attribute_val.name !=="Default Attribute Value" ?
                      //         <div className=" col-sm-3" key={attribute_val.id}>
                      //           <div className="checkbox-fade fade-in-primary">
                      //             <label>
                      //               <input type="checkbox" id={"product_attributes_value_" + attribute_val.id} value={attribute_val.id} onChange={this.changeAttributesSelection} />
                      //               <span className="cr">
                      //                 <i className="cr-icon icofont icofont-ui-check txt-primary"></i>
                      //               </span>
                      //               <span>{attribute_val.name}</span>
                      //             </label>
                      //           </div>
                      //         </div>
                      //         // :null
                      //       )}
                      //     </div>
                      //   )
                      //   : ""
                    }
                  
                  </div>
                </div>
              </div>
            </div>
          </div>
         
            {/* <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Special Price</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    name="specialPrice"
                    id="specialPrice"
                    placeholder="Special Price"
                    onChange={this.handleChange}
                    value={this.state.specialPrice}
                  />
                </div>
              </div>
            </div> */}
            {/* <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Country ( Currancy )</label>
                <div className="col-sm-9">
                  <select name="CurrencyId" className="form-control" value={this.state.CurrencyId} onChange={this.handleChange}>
                    <option value="0">Select Country</option>
                    {
                      this.state.country_list !== undefined && this.state.country_list !== null && this.state.country_list !== [] && this.state.country_list.length > 0
                        ?
                        this.state.country_list.map(currency =>
                          <option key={currency.id} value={currency.currency}>{currency.name} - ({currency.currency})</option>
                        )
                        :
                        null
                    }
                  </select>
                </div>
              </div>
            </div> */}
      
     </div>)
      }) }
          <div className="card-footer">
            <div className="row float-right p-3">
              {
                this.state.isSaving
                  ?
                  <button className="btn btn-grd-disabled mr-2" disabled>Saving...!</button>
                  :
                  <button onClick={this.onSaveData} className="btn btn-grd-disabled mr-2"><i className="icofont icofont-save"></i> Save</button>
              }
              <Link to={"/products/stock/" + this.props.product_id} className="btn btn-outline-dark">Cancel</Link>
            </div>
          </div>
        </div >
      </div >
    );
  }
}

export default ProductWiseStockAdd;
