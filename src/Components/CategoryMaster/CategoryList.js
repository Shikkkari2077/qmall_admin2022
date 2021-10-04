import React from "react";
import { Link } from "react-router-dom";
import $ from "jquery";
import Constant from "../../Constant";
import Swal from "sweetalert2";
import MUIDataTable from "mui-datatables";
import "react-toggle/style.css"; // for ES6 modules
import Toggle from "react-toggle";

class CategoryList extends React.Component {
  state = {};
  handleStatusChange = (sid) => {
    var isChecked = $("#category_status_" + sid);
    isChecked.prop("checked", !isChecked.prop("checked"));
    //console.log(isChecked.prop("checked"), !isChecked.prop("checked"));
    if (!isChecked.prop("checked") === true) {
      var status = true;
    } else {
      var status = false;
    }
    var that = this;
    var data = new URLSearchParams();
    // this.setState({ isSaving: true });
    data.append("status", status);
    data.append("CategoryId", sid);
    //console.log(sid)
    fetch(Constant.getAPI() + "/category/statusChange", {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: localStorage.getItem("q8_mall_auth"),
      },
      body: data,
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        if (json.status === true) {
          Swal.fire("Update Status!", "Status has been updated.", "success");
          ////console.log(json)
          that.getCategoryList();
        } else {
          Swal.fire({
            title: "Something went wrong. Try again after some Time.!",
            icon: "error",
            text: "",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ok",
          });
        }
      });
  };
  deleteCategory = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this !",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.value) {
        var that = this;
        var data = new URLSearchParams();
        // this.setState({ isSaving: true });
        data.append("CategoryId", id);
        fetch(Constant.getAPI() + "/category/delete", {
          method: "post",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: localStorage.getItem("q8_mall_auth"),
          },
          body: data,
        })
          .then(function (response) {
            return response.json();
          })
          .then(function (json) {
            if (json.status === true) {
              Swal.fire("Deleted!", "Tyre Category deleted.", "success");
              that.getCategoryList();
            } else {
              Swal.fire({
                title: "Something went wrong. Try again after some Time.!",
                icon: "error",
                text: "",
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Ok",
              });
            }
          });
      }
    });
  };
  getCategoryList = () => {
    var that = this;
    this.setState({ isSaving: true });
    var data = new URLSearchParams();
    if (localStorage.getItem("q8_mall_ad_role") === "shop") {
      data.append("ShopId", localStorage.getItem("q8_mall_ad_uid"));
    }

    fetch(Constant.getAPI() + "/category/get", {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: localStorage.getItem("q8_mall_auth"),
      },
      body: data,
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        if (json.status === true) {
          //console.log(json.data)
          that.setState({ category_data: json.data, isSaving: false });
        } else {
          that.setState({ category_data: [], isSaving: false });
          Swal.fire({
            title: "Something went wrong. Try again after some Time.!",
            icon: "error",
            text: "",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ok",
          });
        }
      });
  };
  componentWillMount() {
    this.getCategoryList();
    //console.log(localStorage.getItem("q8_mall_auth"))
  }
  render() {
    const columns = [
      {
        name: "Medium",
        label: "Category Image",
        options: {
          filter: true,
          sort: true,
          customBodyRender: (Medium, tableMeta) => {
            return (
              <div>
                {Medium !== undefined && Medium !== null && Medium !== {} ? (
                  <img
                    src={
                      Medium.url !== undefined &&
                      Medium.url !== null &&
                      Medium.url !== ""
                        ? Medium.url
                        : "./assets/images/icon.png"
                    }
                    alt=""
                    className="img-40"
                  />
                ) : (
                  <img
                    src="./assets/images/icon.png"
                    alt=""
                    className="img-40"
                  />
                )}
              </div>
            );
          },
        },
      },
      {
        name: "name_en",
        label: "Category Name : English",
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        name: "name_ar",
        label: "Category Name : Arabic",
        options: {
          filter: true,
          sort: true,
        },
      },
      // {
      //   name: "child",
      //   label: "Child Category",
      //   options: {
      //     filter: true,
      //     sort: true,
      //     customBodyRender: (child, tableMeta) => {
      //       return (
      //         <div>
      //           {child !== null && child !== [] && child.length > 0 ? (
      //             <ol>
      //               {child.map((child_category) => (
      //                 <li key={child_category.id}>{child_category.name}</li>
      //               ))}
      //             </ol>
      //           ) : (
      //             "-"
      //           )}
      //         </div>
      //       );
      //     },
      //   },
      // },
      {
        name: "status",
        label: "Status",
        options: {
          filter: true,
          sort: false,
          customBodyRender: (status, tableMeta) => {
            return (<div> 
              {/* {console.log(tableMeta.rowData)} */}
              <Toggle
                id={"category_status_" + tableMeta.rowData[4]}
                checked={status === true ? true : false}
                value={status}
                onChange={this.handleStatusChange.bind(this,tableMeta.rowData[4])}
              />
              </div>
            );
          },
        },
      },
      {
        name: "id",
        label: "Action",
        options: {
          filter: true,
          sort: true,
          customBodyRender: (id, tableMeta) => {
            return (
              <div>
                <Link
                  to={"/category/add/" + id}
                  className="m-r-15 text-muted"
                  data-toggle="tooltip"
                  data-placement="top"
                  title=""
                  data-original-title="Edit"
                >
                  <i className="f-20 icofont icofont-ui-edit text-custom"></i>
                </Link>
                <span
                  onClick={this.deleteCategory.bind(this, id)}
                  className="m-r-15 text-muted"
                  data-toggle="tooltip"
                  data-placement="top"
                  title=""
                  data-original-title="Delete"
                >
                  <i className="f-20 icofont icofont-delete-alt text-danger"></i>{" "}
                </span>
              </div>
            );
          },
        },
      },
    ];
    const shop_columns = [
      {
        name: "Medium",
        label: "Category Image",
        options: {
          filter: true,
          sort: true,
          customBodyRender: (Medium, tableMeta) => {
            return (
              <div>
                {Medium !== undefined && Medium !== null && Medium !== {} ? (
                  <img
                    src={
                      Medium.url !== undefined &&
                      Medium.url !== null &&
                      Medium.url !== ""
                        ? Medium.url
                        : "./assets/images/icon.png"
                    }
                    alt=""
                    className="img-40"
                  />
                ) : (
                  <img
                    src="./assets/images/icon.png"
                    alt=""
                    className="img-40"
                  />
                )}
              </div>
            );
          },
        },
      },
      {
        name: "name_en",
        label: "Category Name : English",
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        name: "name_ar",
        label: "Category Name : Arabic",
        options: {
          filter: true,
          sort: true,
        },
      },
      // {
      //   name: "child",
      //   label: "Child Category",
      //   options: {
      //     filter: true,
      //     sort: true,
      //     customBodyRender: (child, tableMeta) => {
      //       return (
      //         <div>
      //           {child !== null && child !== [] && child.length > 0 ? (
      //             <ol>
      //               {child.map((child_category) => (
      //                 <li key={child_category.id}>{child_category.name}</li>
      //               ))}
      //             </ol>
      //           ) : (
      //             "-"
      //           )}
      //         </div>
      //       );
      //     },
      //   },
      // },
    ];
    const options = {
      filterType: "dropdown",
      viewColumns: false,
      print: false,
      download: false,
      selectableRows: "none",
      textLabels: {
        body: {
          noMatch: this.state.isSaving
            ? "Loading data..!"
            : "Sorry, No Category Found",
          toolTip: "Sort",
          columnHeaderTooltip: (column) => `Sort for ${column.label}`,
        },
      },
      // expandableRows: true,
      // expandableRowsOnClick: true,
      // isRowExpandable: (dataIndex, expandedRows) => {
      //   // Prevent expand/collapse of any row if there are 4 rows expanded already (but allow those already expanded to be collapsed)
      //   if (
      //     expandedRows.data.length > this.state.category_data.length &&
      //     expandedRows.data.filter((d) => d.dataIndex === dataIndex).length ===
      //       0
      //   )
      //     return false;
      //   return true;
      // },
      // // rowsExpanded: [0, 1],
      // renderExpandableRow: (rowData, rowMeta) => {
      //   const colSpan = rowData.length + 1;
      //   console.log("colSpan : ", colSpan);
      //   var expanDetails = {};
      //   for (var i = 0; i < this.state.category_data.length; i++) {
      //     if (this.state.category_data[i].name_en === rowData[1]) {
      //       expanDetails = this.state.category_data[i];
      //     }
      //   }

      //   console.log(expanDetails);
      //   // return false;
      //   return (
      //     <tr>
      //       <td colSpan={colSpan}>
      //         <div className="table-responsive p-3">
      //           <table className="table table-bordered table-hover m-0">
      //             <thead>
      //               <tr>
      //                 <th>Category Image</th>
      //                 <th>Category Name : English</th>
      //                 <th>Category Name : Arabic</th>
      //                 <th>Action</th>
      //               </tr>
      //             </thead>
      //             <tbody>
      //               {expanDetails.child !== undefined &&
      //               expanDetails.child !== null &&
      //               expanDetails.child !== [] &&
      //               expanDetails.child.length > 0 ? (
      //                 expanDetails.child.map((child_cat) => (
      //                   <tr>
      //                     <td>
      //                       {child_cat.Medium !== undefined &&
      //                       child_cat.Medium !== null &&
      //                       child_cat.Medium !== {} ? (
      //                         <img
      //                           src={
      //                             child_cat.Medium.url !== undefined &&
      //                             child_cat.Medium.url !== null &&
      //                             child_cat.Medium.url !== ""
      //                               ? child_cat.Medium.url
      //                               : "./assets/images/icon.png"
      //                           }
      //                           alt=""
      //                           className="img-40"
      //                         />
      //                       ) : (
      //                         <img
      //                           src="./assets/images/icon.png"
      //                           alt=""
      //                           className="img-40"
      //                         />
      //                       )}
      //                     </td>
      //                     <td>{child_cat.name_en}</td>
      //                     <td>{child_cat.name_ar}</td>
      //                     <td>
      //                       <Link
      //                         to={"/category/add/" + child_cat.id}
      //                         className="m-r-15 text-muted"
      //                         data-toggle="tooltip"
      //                         data-placement="top"
      //                         title=""
      //                         data-original-title="Edit"
      //                       >
      //                         <i className="f-20 icofont icofont-ui-edit text-custom"></i>
      //                       </Link>
      //                       <span
      //                         onClick={this.deleteCategory.bind(
      //                           this,
      //                           child_cat.id
      //                         )}
      //                         className="m-r-15 text-muted"
      //                         data-toggle="tooltip"
      //                         data-placement="top"
      //                         title=""
      //                         data-original-title="Delete"
      //                       >
      //                         <i className="f-20 icofont icofont-delete-alt text-danger"></i>{" "}
      //                       </span>
      //                     </td>
      //                   </tr>
      //                 ))
      //               ) : (
      //                 <tr>
      //                   <td colSpan={2} className="text-center">
      //                     No Child Category .!
      //                   </td>
      //                 </tr>
      //               )}
      //             </tbody>
      //           </table>
      //         </div>
      //       </td>
      //     </tr>
      //   );
      // },
      // onRowsExpand: (curExpanded, allExpanded) =>
      //   console.log(curExpanded, allExpanded),
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
                      <h4>Category List</h4>
                    </div>
                  </div>
                  {/* {localStorage.getItem('q8_mall_ad_role') !== "shop"
                    ? */}
                    {  localStorage.getItem('q8_mall_ad_role') === "admin"?
                  <Link
                    to="/category/add"
                    className="btn btn-sm btn-inverse waves-effect waves-light f-right d-inline-block md-trigger"
                    data-modal="modal-13"
                  >
                    {" "}
                    <i className="icofont icofont-plus m-r-5"></i> Add Category{" "}
                  </Link> :null
                   }
                  {/* :
                  } */}
                  <Link
                    to="/"
                    className="btn btn-sm btn-outline-dark waves-effect waves-light f-right d-inline-block md-trigger mx-3"
                    data-modal="modal-13"
                  >
                    {" "}
                    <i className="icofont icofont-arrow-left m-r-5"></i> Back{" "}
                  </Link>
                </div>
                <div className="col-lg-4">
                  <div className="page-header-breadcrumb">
                    <ul className="breadcrumb-title">
                      <li className="breadcrumb-item">
                        <Link to="/">
                          <i className="feather icon-home"></i>{" "}
                        </Link>
                      </li>
                      <li className="breadcrumb-item active">Category List</li>
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
                        {localStorage.getItem("q8_mall_ad_role") !== "shop" ? (
                          <MUIDataTable
                            title={"Category List"}
                            className="table-responsive"
                            data={this.state.category_data}
                            columns={columns}
                            options={options}
                          />
                        ) : (
                          <MUIDataTable
                            title={"Category List"}
                            className="table-responsive"
                            data={this.state.category_data}
                            columns={shop_columns}
                            options={options}
                          />
                        )}
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

export default CategoryList;
