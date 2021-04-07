import React from "react";
import { Link } from "react-router-dom";
import Constant from "../Constant";
import { format, render, Cancel, register } from 'timeago.js';


class Header extends React.Component {
  state={

  }
  componentWillMount(){
    clearInterval(this.interval);
    if(localStorage.getItem('q8_mall_ad_role')=='shop'){
    this.getShopDetails()}

  }
  getShopDetails = () => {
    //console.log("shopDetails")
    var that = this;
    var data = new URLSearchParams();
    // this.setState({ isSaving: true });
    data.append("ShopId", localStorage.getItem("q8_mall_ad_uid"));
    // data.append("LanguageId", that.props.language_id);
    fetch(Constant.getAPI() + "/shop/get", {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        // "Authorization": localStorage.getItem('q8_mall_auth')
      },
      body: data
    }).then(function (response) {
      return response.json();
    }).then(function (json) {
      //console.log(json.data)
      if (json.status === true) {
    ////console.log(json.data[0])
    if(json.data !== null && json.data !==undefined && json.data[0]!==undefined && json.data[0]!==null ){
    var image=json.data[0].Medium.url
    localStorage.setItem("companylogo",image)

     that.setState({image});
       }
    if( json.data[0]!==undefined &&  json.data[0]!==null && json.data[0].name !== null && json.data[0].name !== undefined ){
    var name=json.data[0].name
    that.setState({name});
    }


    }})
  }
  componentDidMount() {
    var that = this;
    
    setInterval(this.getPushNotificationList, 9000)

    // that.getPushNotificationList();
    // setTimeout(function () {
    //   that.getPushNotificationList();
    // }, 5 * 60 * 1000)

    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    }

    else if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }
  showNotifications = (notification_data) => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    }

    else if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    } else {
      var date = new Date(notification_data.createdAt);
      var day, month, year, date_read;
      year = date.getFullYear();
      if (date.getMonth() > 8) {
        month = date.getMonth() + 1
      } else {
        month = '0' + (date.getMonth() + 1)
      }
      if (date.getDate() > 9) {
        day = date.getDate()
      } else {
        day = '0' + (date.getDate())
      }

      date_read = `${day}-${month}-${year}`;
      var notification = new Notification(`${notification_data.title}`, {
        icon: './assets/images/icon.png',
        body: `${notification_data.text} placed on ${date_read}`,
        silent: false
      });
      notification.onclick = function () {
        var url = 'http://www.qmallapp.com/#/orders/view/' + notification_data.OrderId
        window.open(url);
      };
    }
  }
  getPushNotificationList = () => {
    //console.log("here")
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isLoading: true });

    data.append('viewedByShop', false);
    fetch(Constant.getAPI() + "/notification/getAll", {
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
        var notify_arr = [];
        for (var i = 0; i < json.result.length; i++) {
          if (localStorage.getItem('q8_mall_notify') === undefined || localStorage.getItem('q8_mall_notify') === null) {
            that.showNotifications(json.result[i]);
            notify_arr.push(json.result[i].id);
          } else {
            var old_notifictaions = JSON.parse(localStorage.getItem('q8_mall_notify'))
            if (!(old_notifictaions.includes(json.result[i].id))) {
              that.showNotifications(json.result[i]);
            }
            notify_arr.push(json.result[i].id);
          }

        }
        localStorage.setItem('q8_mall_notify', JSON.stringify(notify_arr));
        that.setState({ notification_list: json.result })
      } else {
        //console.log(json);
      }
    });
  }
  state = {
    notification_list: []
  }
  Signout = () => {
    localStorage.clear();
    window.location.href = "#/"
    window.location.reload();
  };

  render() {
    return (
      <nav className="navbar header-navbar pcoded-header noprint">
        <div className="navbar-wrapper">
          <div className="navbar-logo">
            <a className="mobile-menu" id="mobile-collapse" href="javascript:void(0)">
              <i className="feather icon-menu"></i>
            </a>
            <Link to="/" >
              {/* <img className="img-fluid img-50" src="./assets/images/app_logo.png" alt="Theme-Logo" /> */}
              <h2 classNAme="text-primary">QMall</h2>
            </Link>
            <a className="mobile-options">
              <i className="feather icon-more-horizontal"></i>
            </a>
          </div>
          <div className="navbar-container container-fluid">
            <ul className="nav-right">
              {
                localStorage.getItem('q8_mall_ad_role') === "shop"
                  ?
                  <li class="header-notification">
                    <div class="dropdown-primary dropdown">
                      <div class="dropdown-toggle" data-toggle="dropdown">
                        {/* <div style={{width:"200px", height:"200px"}}> */}
                        <i class="feather icon-bell f-24"  ></i></div>
                        <span class="badge bg-c-pink">{this.state.notification_list.length}</span>
                      {/* </div> */}
                      <ul class="show-notification notification-view dropdown-menu notification-box-height" data-dropdown-in="fadeIn" data-dropdown-out="fadeOut">
                        <li>
                          <h6>Notifications</h6>
                          {/* <label class="label label-danger">New</label> */}
                        </li>
                        {
                          this.state.notification_list !== undefined && 
                          this.state.notification_list !== null && 
                          this.state.notification_list !== [] &&
                           this.state.notification_list.length > 0
                            ?
                            this.state.notification_list.map(notification =>
                              <li key={notification.id}>
                                <Link to={'/orders/view/' + notification.OrderId}>
                                  <div class="media">
                                    <img class="d-flex align-self-center img-radius " src="./assets/images/icon.png" alt="" style={{}} />
                                    <div class="media-body">
                                      <h5 class="notification-user">{notification.title}</h5>
                                      <p class="notification-msg">{notification.text}</p>
                                      <span class="notification-time">{format(new Date(notification.createdAt))}</span>
                                    </div>
                                  </div>
                                </Link>
                              </li>
                            )
                            :
                            <li>
                              <span className="">No New Notifications.!</span>
                            </li>
                        }
                      </ul>
                    </div>
                  </li>
                  : null
              }
              {/* {
                localStorage.getItem('q8_mall_ad_role') === "shop"
                  ?
                  <Link to={"/shops/add/" + localStorage.getItem('q8_mall_ad_uid')}>
                    <li className="user-profile header-notification">
                      <img src="./assets/images/user.png" className="img-radius" alt="User-Profile-Image" />
                      <span>{localStorage.getItem("q8_mall_ad_name")}</span>
                    </li>
                  </Link>
                  : */}
              <li className="user-profile header-notification">
                <img src={this.state.image !== null && 
                  this.state.image !== undefined &&
                  this.state.image !== ''?this.state.image: "./assets/images/user.png"} className="img-radius" alt="User-Profile-Image" />
                <span>{localStorage.getItem("q8_mall_ad_name") }</span>
              </li>
              {/* } */}
              <li>
                <button className="btn bg-transparent" onClick={this.Signout} dataToggle="tooltip" title="Logout">
                  <i className="feather icon-log-out"></i>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav >
    );
  }
}

export default Header;
