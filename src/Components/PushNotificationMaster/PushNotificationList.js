import React from 'react';
import { Link } from 'react-router-dom'
import Constant from '../../Constant'
import Swal from 'sweetalert2'
import MUIDataTable from "mui-datatables";
import moment from 'moment';

class PushNotificationList extends React.Component {
  state = {}
  componentWillMount() {
    this.getPushNotificationList();
    // setInterval(this.getPushNotificationList, 7000)


  }
  deletePushNotification = (notification_id) => {
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
        data.append("PushNotificationId", notification_id);
        fetch(Constant.getAPI() + "/notification/delete", {
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
            Swal.fire("Deleted!", "PushNotification deleted.", "success");
            that.getPushNotificationList();
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
  getPushNotificationList = () => {
    //console.log("here")
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    fetch(Constant.getAPI() + "/notification/list", {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": localStorage.getItem('q8_mall_auth')
      },
      body: data
    }).then(function (response) {
      return response.json();
    }).then(function (json) {
      console.log(json)
      if (json.status === true) {
        that.setState({ notification_list: json.data, isSaving: false });
      } else {
        that.setState({ notification_list: [], isSaving: false });
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
  onOpenShopModal = (notification_id) => {
    this.setState({ isOpen: true, notification_id: notification_id });
  }
  onCloseShopModal = () => {
    this.setState({ isOpen: false, notification_id: "" });
  }
  render() {
    const columns = [{
      name:"Medium",
      label:"Image",
      options:{
        customBodyRender:(Medium)=>{
          return(
            Medium !== null && Medium.url !== undefined ?
            <img className="img-fluid img-thumbnail" src={Medium.url} alt="Image" style={{maxHeight:"100px",maxWidth:"150px"}}/>
            :<img className="img-fluid img-thumbnail" src="" alt="No Image" style={{maxHeight:"100px",maxWidth:"150px"}}/>
          )
        }
      }
    },
      {

      name: "title_en",
      label: "Title (English)",
      options: {
        filter: false,
        sort: false,
        
        
      }
    }, 
    {

      name: "title_ar",
      label: "Title (Arabic)",
      options: {
        filter: false,
        sort: false,
        
        
      }
    },
    {
      name: "text_en",
      label: "Text (English)",
      options: {
        filter: false,
        sort: false,
      }
    },
    {
      name: "text_ar",
      label: "Text (Arabic)",
      options: {
        filter: false,
        sort: false,
      }
    },
    {
      name:"createdAt",
      label:"Sended At",
      options:{
        customBodyRender:(createdAt)=>{
          return(
            moment(createdAt).format("DD-MM-YYYY hh:mm A")
          )
        }
      }
    }
  ];
    const options = {
      filterType: "dropdown",
      viewColumns: false,
      print: false,
      download: false,
      selectableRows: 'none',
      textLabels: {
        body: {
          noMatch: this.state.isSaving ?
            "Loading data..!" :
            "Sorry, No PushNotifications Found",
          toolTip: "Sort",
          columnHeaderTooltip: column => `Sort for ${column.label}`
        }
      }
    };
    return (
      <div className="pcoded-inner-content">
        <div className="main-body">
          <div className="page-wrapper">
            <div className="page-header">
              <div className="row align-items-end">
                <div className="col-lg-8">
                  <div className="page-header-title">
                    <div className="d-inline">
                      <h4>PushNotification List</h4>
                    </div>
                  </div>
                  <Link to="/notification/add"
                    className="btn btn-sm btn-inverse waves-effect waves-light f-right d-inline-block md-trigger" 
                    data-modal="modal-13"> <i className="icofont icofont-plus m-r-5"></i> Send PushNotification
                       </Link>
                </div>
                <div className="col-lg-4">
                  <div className="page-header-breadcrumb">
                    <ul className="breadcrumb-title">
                      <li className="breadcrumb-item">
                        <Link to="/">
                          <i className="feather icon-home"></i> </Link>
                      </li>
                      <li className="breadcrumb-item active">PushNotification List</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="page-body">
              <div className="row">
                <div className="col-sm-12">
                  <div className="card">
                    <div className="card-block">
                      <div className="dt-responsive table-responsive">

                        <MUIDataTable
                          className="table-responsive"
                          data={this.state.notification_list}
                          columns={columns}
                          options={options}
                        />
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

export default PushNotificationList;
