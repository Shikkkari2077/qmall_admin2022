import React from 'react';
import SuperAdminSideNavBar from './SideNavBar/ForSuperAdmin'
import ForVendorSideNavBar from './SideNavBar/ForVendor';

class SideNavBar extends React.Component {

  render() {
    return (
      localStorage.getItem('q8_mall_ad_role') === "shop"
        ?
        <ForVendorSideNavBar />
        :
        <SuperAdminSideNavBar />
    );
  }
}

export default SideNavBar