import React, { Component } from 'react';
import { HashRouter as Router, Route, Redirect } from 'react-router-dom';
import Login from "./Common/Login.js"
import Home from "./Common/Home.js"
import Dashboard from "./Common/Dashboard.js"
import LanguageList from './Components/LanguageMaster/LanguageList.js';
import LanguageAdd from './Components/LanguageMaster/LanguageAdd.js';

import ShopList from './Components/UserMaster/Shop/ShopList.js';
import ShopAddTab from './Components/UserMaster/Shop/ShopAddTab.js';

import CategoryList from './Components/CategoryMaster/CategoryList.js';
import CategoryAddTab from './Components/CategoryMaster/CategoryAddTab.js';

import AttributeTypeList from './Components/AttributeTypeMaster/AttributeTypeList.js';
import AttributeTypeAddTab from './Components/AttributeTypeMaster/AttributeTypeAddTab.js';

import AttributeList from './Components/AttributeMaster/AttributeList.js';
import AttributeAddTab from './Components/AttributeMaster/AttributeAddTab.js';

import CountryList from './Components/LocationMaster/CountryMaster/CountryList.js';

import GovernorateList from './Components/LocationMaster/GovernorateMaster/GovernorateList.js';
import GovernorateAddTab from './Components/LocationMaster/GovernorateMaster/GovernorateAddTab.js';

import AreaList from './Components/LocationMaster/AreaMaster/AreaList.js';
import AreaAddTab from './Components/LocationMaster/AreaMaster/AreaAddTab.js';

import AttributeValueList from './Components/AttributeValueMaster/AttributeValueList.js';
import AttributeValueAddTab from './Components/AttributeValueMaster/AttributeValueAddTab.js';

import ProductList from './Components/ProductMaster/ProductList.js';
import ProductAddTab from './Components/ProductMaster/ProductAddTab.js';
import GalleryImageList from './Components/GalleryMaster/GalleryImageList.js';
import AddGalleryImagesIndex from './Components/GalleryMaster/AddGalleryImagesIndex.js';

import ShopWiseProductList from './Components/ShopWiseProductMaster/ShopWiseProductList.js';

import OrderList from './Components/OrdersMaster/OrderList.js';

import ProductWiseStockList from './Components/ProductWiseStockMaster/ProductWiseStockList.js';
import ProductWiseStockAddTab from './Components/ProductWiseStockMaster/ProductWiseStockAddTab.js';

import ProductPriceList from './Components/ProductPriceMaster/ProductPriceList.js';
import ProductPriceAddTab from './Components/ProductPriceMaster/ProductPriceAddTab.js';
import CouponList from './Components/CouponMaster/CouponList.js';
import CouponAddTab from './Components/CouponMaster/CouponAddTab.js';

import DeliveryTypeAddTab from './Components/DeliveryTypeMaster/DeliveryTypeAddTab.js';
import DeliveryTypeList from './Components/DeliveryTypeMaster/DeliveryTypeList.js';
import RefundPolicyTab from './Components/RefundPolicy/RefundPolicyTab.js';
import TermsAddTab from './Components/Terms/TermsAddTab.js';
import ContactUsList from './Components/ContactUs/ContactUsList.js';
import ShopDeliveryChargeList from './Components/ShopDeliveryChargeMaster/ShopDeliveryChargeList.js';
import ShopDeliveryChargeAddTab from './Components/ShopDeliveryChargeMaster/ShopDeliveryChargeAddTab.js';
import BannerList from './Components/BannerMaster/BannerList.js';
import BannerAddTab from './Components/BannerMaster/BannerAddTab.js';
import ShopBranchList from './Components/ShopBranchMaster/ShopBranchList.js';
import ShopBranchAddTab from './Components/ShopBranchMaster/ShopBranchAddTab.js';
import AddressList from './Components/AddressMaster/AddressList.js';
import AddressAddTab from './Components/AddressMaster/AddressAddTab.js';
import GeneralSettingAddTab from './Components/GeneralSettingMaster/GeneralSettingAddTab.js';
import BarcodeList from './Components/BarcodeMaster/BarcodeList.js';
import DriverList from './Components/UserMaster/Driver/DriverList.js';
import DriverAddTab from './Components/UserMaster/Driver/DriverAddTab.js';
import WareHouseOrderList from './Components/WareHouseOrdersMaster/WareHouseOrderList.js';
import WareHouseOrderView from './Components/WareHouseOrdersMaster/WareHouseOrderView.js';
import DeliveryReasonList from './Components/DeliveryReasonMaster/DeliveryReasonList.js';
import DeliveryReasonAddTab from './Components/DeliveryReasonMaster/DeliveryReasonAddTab.js';
import UserList from './Components/UserMaster/Customer/UserList.js';
import UserAddTab from './Components/UserMaster/Customer/UserAddTab.js';
import CustomerAddressList from './Components/UserMaster/Customer/CustomerAddressList.js';
import PaymentMethodList from './Components/PaymentMethodMaster/PaymentMethodList.js';
import PaymentMethodAddTab from './Components/PaymentMethodMaster/PaymentMethodAddTab.js';
import OrderViewTab from './Components/OrdersMaster/OrderViewTab.js';
import PushNotificationList from './Components/PushNotificationMaster/PushNotificationList.js';
import PushNotificationAddTab from './Components/PushNotificationMaster/PushNotificationAddTab.js';
import DeliveryTimeAddTab from './Components/DeliveryTimeMaster/DeliveryTimeAddTab.js';
import OrderViewPrint from './Components/OrdersMaster/OrderViewPrint.js';
import OrderListShop from './Components/OrdersMaster/OrderListshop'
import Comingsoon from './Components/comingsoon/Comingsoon'
import BarcodePrint from "./Components/BarcodeMaster/BarcodePrint"
import ImportData from './Common/ImportData.js';
import BarcodePrint1 from './Components/BarcodeMaster/Css/BarcodePrint1.js';
import BarcodePrint2 from './Components/BarcodeMaster/Css/BarcodePrint2.js';
import BarcodePrint3 from './Components/BarcodeMaster/Css/BarcodePrint3.js';
import BarcodePrint4 from './Components/BarcodeMaster/Css/BarcodePrint4.js';
import SectionList from './Components/SectionMaster/SectionList.js';
import SectionAddTab from './Components/SectionMaster/SectionAddTab.js';
import DeliveryTimeList from './Components/DeliveryTimeMaster/DeliveryTimeList.js';
import StockChangePage from './Components/ProductWiseStockMaster/StockChangePage.js';
class Routes extends Component {

  render() {
    return (
      
      <Router baseName={"/"}>
        {

          localStorage.getItem("q8_mall_ad") !== "true"
            ?
            <Redirect to="/" />
            : null}
        {
          localStorage.getItem("q8_mall_ad") !== "true"
            ?
            <Route exact path={"/"} component={Login} />
            :
            <Home>
              <Route exact path={"/"} component={Dashboard} />
              <Route exact path={"/languages"} component={LanguageList} />
              <Route exact path={"/languages/add/:language_id?"} component={LanguageAdd} />

              <Route exact path={"/customers"} component={UserList} />
              <Route exact path={"/customers/add/:customer_id?"} component={UserAddTab} />
              <Route exact path={"/customers/:customer_id/address"} component={CustomerAddressList} />

              <Route exact path={"/driver"} component={DriverList} />
              <Route exact path={"/driver/add/:driver_id?"} component={DriverAddTab} />

              <Route exact path={"/shops"} component={ShopList} />
              <Route exact path={"/shops/add/:shop_id?"} component={ShopAddTab} />
              <Route exact path={"/profile"} component={ShopAddTab} />

              <Route exact path={"/shops/branch/:shop_id"} component={ShopBranchList} />
              <Route exact path={"/shops/:shop_id/branch/:branch_id?"} component={ShopBranchAddTab} />
              <Route exact path={"/shops/:shop_id/branch/:branch_id/address"} component={AddressList} />
              <Route exact path={"/shops/:shop_id/branch/:branch_id/address/add/:address_id?"} component={AddressAddTab} />

              <Route exact path={"/payment-methods"} component={PaymentMethodList} />
              <Route exact path={"/payment-methods/add/:payment_method_id?"} component={PaymentMethodAddTab} />

              <Route exact path={"/category"} component={CategoryList} />
              <Route exact path={"/category/add/:category_id?"} component={CategoryAddTab} />
              
              <Route exact path={"/section"} component={SectionList} />
              <Route exact path={"/section/shop/:shop_id"} component={SectionList} />

              <Route exact path={"/section/add/:secton_id/:shop_id?"} component={SectionAddTab} />
              <Route exact path={"/section/add"} exact component={SectionAddTab} />


              <Route exact path={"/notifications/list"} component={PushNotificationList} />
              <Route exact path={"/notification/add"} component={PushNotificationAddTab} />
              {/* <Route exact path={"/notifications/add"} component={PushNotificationAddTab} /> */}

              <Route exact path={"/banner"} component={BannerList} />
              <Route exact path={"/banner/add/:banner_id?"} component={BannerAddTab} />

              <Route exact path={"/attribute-types"} component={AttributeTypeList} />
              <Route exact path={"/attribute-types/add/:attribute_type_id?"} component={AttributeTypeAddTab} />

              <Route exact path={"/attributes/:attribute_type_id"} component={AttributeList} />
              <Route exact path={"/attributes/:attribute_type_id/add/:attribute_id?"} component={AttributeAddTab} />

              <Route exact path={"/attribute-values/:attribute_type_id/:attribute_id"} component={AttributeValueList} />
              <Route exact path={"/attributes-values/:attribute_type_id/:attribute_id/add/:attribute_value_id?"} component={AttributeValueAddTab} />

              <Route exact path={"/products"} component={ProductList} />
              <Route exact path={"/products/add/:product_id?"} component={ProductAddTab} />
              <Route exact path={"/products/gallery/:product_id"} component={GalleryImageList} />
              <Route exact path={"/products/gallery/:product_id/add"} component={AddGalleryImagesIndex} />

              <Route exact path={"/products/stock/:product_id"} component={ProductWiseStockList} />
              <Route exact path={"/products/stock/:product_id/add/:stock_id?"} component={ProductWiseStockAddTab} />

              <Route exact path={"/products/price/:stock_id/:product_id"} component={ProductPriceList} />
              <Route exact path={"/products/price/:stock_id/:product_id/add/:price_id?"} component={ProductPriceAddTab} />

              <Route exact path={"/coupons"} component={CouponList} />
              <Route exact path={"/coupons/add/:coupon_id?"} component={CouponAddTab} />

              <Route exact path={"/orders"} component={OrderList} />
              <Route exact path={"/stockchange"} component={StockChangePage} />

              <Route exact path={"/orders/shop"} component={OrderListShop}/>
              <Route exact path={"/orders/view/:order_id"} component={OrderViewTab} />
              <Route exact path={"/orders/view-print/:order_id"} component={OrderViewPrint} />

              <Route exact path={"/warehouse-orders"} component={WareHouseOrderList} />
              <Route exact path={"/warehouse-orders/view/:order_id"} component={WareHouseOrderView} />

              <Route exact path={"/shop/products/:shop_id"} component={ShopWiseProductList} />

              <Route exact path={"/country"} component={CountryList} />

              <Route exact path={"/governorate"} component={GovernorateList} />
              <Route exact path={"/governorate/add/:governorate_id?"} component={GovernorateAddTab} />

              <Route exact path={"/area"} component={AreaList} />
              <Route exact path={"/area/add/:area_id?"} component={AreaAddTab} />

              <Route exact path={"/delivery-type"} component={DeliveryTypeList} />
              <Route exact path={"/delivery-type/add/:delivery_type_id?"} component={DeliveryTypeAddTab} />

              <Route exact path={"/reason"} component={DeliveryReasonList} />
              <Route exact path={"/reason/add/:reason_id?"} component={DeliveryReasonAddTab} />

              <Route exact path={"/delivery-charges/:shop_id"} component={ShopDeliveryChargeList} />
              <Route exact path={"/delivery-charges/:shop_id/add/:delivery_charge_id?"} component={ShopDeliveryChargeAddTab} />

              <Route exact path={"/barcode"} component={BarcodeList} />
              <Route exact path={"/barcode/print/:barnumber"} component={BarcodePrint}/>

              <Route exact path={"/barcode/print1/:barnumber"} component={BarcodePrint1}/>
              <Route exact path={"/barcode/print2/:barnumber"} component={BarcodePrint2}/>
              <Route exact path={"/barcode/print3/:barnumber"} component={BarcodePrint3}/>
              <Route exact path={"/barcode/print4/:barnumber"} component={BarcodePrint4}/>





              <Route exact path={"/refund-policy"} component={RefundPolicyTab} />
              <Route exact path={"/terms"} component={TermsAddTab} />
              <Route exact path={"/contact-us"} component={ContactUsList} />
              <Route exact path={"/contact-us/settings"} component={GeneralSettingAddTab} />
              <Route exact path={"/delivery-time/add/:delivery_id?"} component={DeliveryTimeAddTab} />
              <Route exact path={"/delivery-time"} component={DeliveryTimeList} />

              <Route
                  exact
                  path={"/importData/:import_name?"}
                  component={ImportData}
                />
            </Home>
        }
      </Router>
    );
  }
}

export default Routes;

