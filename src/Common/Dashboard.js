import React from "react";
import AdminDashboard from "./AdminDashboard";
import ShopAdminDashboard from "./ShopAdminDashboard";

class Dashboard extends React.Component {
  componentWillMount() { }

  render() {
    return (
      localStorage.getItem('q8_mall_ad_role') === "shop"
        ?
        <ShopAdminDashboard />
        :
        <AdminDashboard />
    );
  }
}

export default Dashboard;
