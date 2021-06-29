import React from "react";
import Swal from "sweetalert2";
import Constant from "../Constant.js";

class Login extends React.Component {
  state = {
    role: "admin"
  };

  onInputChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onLogin = event => {
    event.preventDefault();
    var that = this;
    var data = new URLSearchParams();
    this.setState({ isSaving: true });
    data.append("email", that.state.username);
    data.append("password", that.state.password);
    fetch(Constant.getAPI() + "/" + that.state.role + "/login", {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: data
    }).then(function (response) {
      return response.json();
    }).then(function (json) {
      if (json.status === true) {
        localStorage.setItem("q8_mall_ad", true)
        localStorage.setItem("q8_mall_auth", json.auth)
        if (that.state.role === "admin") {
          localStorage.setItem("q8_mall_ad_name", json.data.userName)
          localStorage.setItem("q8_mall_ad_uid", json.data.id)
          localStorage.setItem("q8_mall_ad_email", json.data.email)
          localStorage.setItem("q8_mall_ad_role", that.state.role)
          } else {
          localStorage.setItem("q8_mall_ad_name", json.name_en)
          localStorage.setItem("q8_mall_ad_uid", json.id)
          localStorage.setItem("q8_mall_ad_email", json.email)
          localStorage.setItem("q8_mall_ad_role", that.state.role)
          localStorage.setItem("shop_media", json.MediaId)

        }
        Swal.fire({
          title: "Login Successfully ",
          // position: 'top-end',
          icon: 'success',
          text: "",
          // type: "success",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Ok"
        })
        window.location.reload();
      } else {
        Swal.fire({
          title: "Incorrect Credentials",
          // position: 'top-end',
          icon: 'error',
          text: "",
          // type: "success",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Ok"
        })
      }
    })
  }

  render() {
    return (
      <section className="login-block" >

        <div className="container">
          <div className="row">
            <div className="col-sm-12">

              <form className="md-float-material form-material">
                <div className="text-center">
                  <img src="./assets/images/Qmall_logo.png" style={{width:"100px"}} alt="QMall" />
                </div>
                <div className="auth-box card">
                  <div className="card-block">
                    <div className="row m-b-20">
                      <div className="col-md-12">
                        <h3 className="text-center">Sign In</h3>
                      </div>
                    </div>
                    <div className="form-group form-primary">
                      <select name="role" className="form-control" onChange={this.onInputChange} value={this.state.role}>
                        <option value="admin">Admin</option>
                        <option value="shop">Shop</option>
                      </select>
                    </div>
                    <div className="form-group form-primary">
                      <input type="text" name="username" className="form-control" required="" placeholder="UserName" onChange={this.onInputChange} />
                      <span className="form-bar"></span>
                    </div>
                    <div className="form-group form-primary">
                      <input type="password" name="password" className="form-control" required="" placeholder="Password" onChange={this.onInputChange} />
                      <span className="form-bar"></span>
                    </div>
                    <div className="row m-t-30">
                      <div className="col-md-12">
                        <button type="button" onClick={this.onLogin} className="btn btn-primary btn-md btn-block waves-effect waves-light text-center m-b-20">Sign in</button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default Login;
