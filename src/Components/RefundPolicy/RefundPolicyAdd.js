import React from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Constant from "../../Constant.js";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

class RefundPolicyAdd extends React.Component {
  state = {
    terms: [],
    description: "",
    refund_policy: [{
      language_id: 1,
      description: `<p> The Customer shall be entitled to cancel the Contract, return the Goods and receive a full refund(or where the goods have not been paid for, full credit), provided that the Goods have not been used in any way, have not been mounted on a rim or have not been driven on, with the packaging materials still intact and are in the same good condition in which they were received by the installer or customer.</p><p>For an early cancellation, where the goods haven’t left the warehouse, there will be no deduction from the customer. Otherwise, the Customer shall be responsible for the costs of returning the Goods and shall indemnify pitstoparabia.com for demand against all and any such costs. Pitstoparabia.com retains the right to charge the customer for any direct costs associated with the return of the goods.</p><p>No additional restocking charge or administrational charge will be added. pitstoparabia.com customer service center can be contacted for an accurate cost on returning goods as costs may vary depending on tyre specification and location.</p><p>Refunds will be done only through the Original Mode of Payment.</p>`
    }, {
      language_id: 2,
      description: `<p>يحق للعميل إلغاء العقد ، وإعادة البضائع واسترداد كامل المبلغ (أو في حالة عدم دفع ثمن البضاعة ، والائتمان الكامل) ، بشرط ألا تكون البضاعة قد استخدمت بأي شكل من الأشكال ، ولم يتم تركيبها على حافة أو لم يتم تشغيلها ، مع مواد التعبئة والتغليف لا تزال سليمة وفي نفس الحالة الجيدة التي تم استلامها من قبل المثبت أو العميل.</p><p>لإلغاء مبكر ، حيث لم تغادر البضائع المستودع ، لن يكون هناك خصم من العميل. بخلاف ذلك ، يكون العميل مسؤولاً عن تكاليف إعادة البضائع ، ويجب عليه تعويض موقع pitstoparabia.com عن الطلب مقابل جميع هذه التكاليف. يحتفظ موقع Pitstoparabia.com بالحق في فرض رسوم على العميل عن أي تكاليف مباشرة مرتبطة بإعادة البضائع.</p><p>لن يتم إضافة أي رسوم إعادة تخزين إضافية أو رسوم إدارية. يمكن الاتصال بمركز خدمة عملاء pitstoparabia.com للحصول على تكلفة دقيقة على البضائع المعادة حيث قد تختلف التكاليف حسب مواصفات الإطارات وموقعها.</p><p>لن يتم استرداد الأموال إلا من خلال طريقة الدفع الأصلية.</p>`
    }]
  };
  handleChange = value => {
    this.setState({ description: value });
  };
  componentDidMount() {
    this.getPrivacyPolicy()
  }
  onSave = () => {
    var that = this;
    var data = new URLSearchParams();
    data.append("data", that.state.description);
    fetch(Constant.getAPI() + "/refund", {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": localStorage.getItem('q8_mall_auth')
      },
      body: data
    }).then(function (response) {
      return response.json();
    }).then(function (json) {
      if (json.status == true) {
        Swal.fire("Updated !", "Refund Policy has been Updated", "success");
        that.getPrivacyPolicy();
      } else {
        Swal.fire("", "Something went wrong. Please try after some Time.!", "Warning");
      }
    })

  };

  getPrivacyPolicy = () => {
    var that = this;
    var data = new URLSearchParams();
    fetch(Constant.getAPI() + "/refund", {
      method: "get",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": localStorage.getItem('q8_mall_auth')
      }
    }).then(function (response) {
      return response.text();
    }).then(function (json) {
      console.log(json);
      that.setState({ description: json });
    })
  }
  render() {
    return (

      <div className="row">
        <div className="col-12 grid-margin">
          {
            this.state.isloading ?
              ""
              // <HashLoader
              //   css={override}
              //   sizeUnit={"px"}
              //   size={50}
              //   margin={"2px"}
              //   color={"#32323d"}
              //   loading={this.state.isloading}
              // />
              :
              <div className="">
                <div className="">
                  <ReactQuill
                    value={this.state.description}
                    onChange={this.handleChange}
                  />
                  <br />
                  <br />{" "}
                  <div className="row float-right p-3">
                    {
                      this.state.isSaving
                        ?
                        <button className="btn btn-grd-disabled mr-2" disabled>Saving...!</button>
                        :
                        <button onClick={this.onSave} className="btn btn-grd-disabled mr-2">
                          Save
                </button>
                    }

                    <Link to={"/refund_policy"} className="btn btn-outline-dark">
                      Cancel
                </Link>
                  </div>
                </div>
              </div>
          }</div>
      </div>
    );
  }
}

export default RefundPolicyAdd;
