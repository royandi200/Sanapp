import React, { Suspense, useContext, useEffect } from "react";
import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, IonPage } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
/* Core CSS required for Ionic components to work properly */
import "@ionic/core/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/core/css/normalize.css";
import "@ionic/core/css/structure.css";
import "@ionic/core/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/core/css/padding.css";
import "@ionic/core/css/float-elements.css";
import "@ionic/core/css/text-alignment.css";
import "@ionic/core/css/text-transformation.css";
import "@ionic/core/css/flex-utils.css";
import "@ionic/core/css/display.css";

/* Theme variables */
import "./theme/variables.css";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Catalogue from "./pages/Catalogue/Catalogue";
import Category from "./pages/Category/Category";
import Intro from "./pages/Intro/Intro";
import Document from "./pages/Document/Document";
import PreOrder from "./pages/PreOrder/PreOrder";
import Promotion from "./pages/Promotion/Promotion";
import DeliveryOrders from "./pages/DeliveryOrders/DeliveryOrders";
import FastOrder from "./pages/FastOrder/FastOrder";
import Voucher from "./pages/Voucher/Voucher";
import Account from "./pages/Account/Account";
import Profile from "./pages/Profile/Profile";
import MyOrder from "./pages/MyOrder/MyOrder";
import Support from "./pages/Support/Support";
import SupportUse from "./pages/SupportUse/SupportUse";
import SupportTransaction from "./pages/SupportTransaction/SupportTransaction";
//import { App } from "@capacitor/core";

import AppUrlListener from "./AppUrlListener";

const AppContainer: React.FunctionComponent = (props) => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonPage id="main">
          <IonRouterOutlet>
            <Suspense fallback={null}>
              <Route path="/login" component={Login} exact={true} />
              <Route path="/register" component={Register} exact={true} />
              <Route path="/catalogue" component={Catalogue} exact={true} />
              <Route path="/category" component={Category} exact={true} />
              <Route path="/intro" component={Intro} exact={true} />
              <Route path="/document" component={Document} exact={true} />
              <Route path="/promotion" component={Promotion} exact={true} />
              <Route path="/preOrder" component={PreOrder} exact={true} />
              <Route
                path="/deliveryOrders"
                component={DeliveryOrders}
                exact={true}
              />
              <Route path="/fastOrder" component={FastOrder} exact={true} />
              <Route path="/voucher" component={Voucher} exact={true} />
              <Route path="/account" component={Account} exact={true} />
              <Route path="/profile" component={Profile} exact={true} />
              <Route path="/myOrder" component={MyOrder} exact={true} />
              <Route path="/support" component={Support} exact={true} />
              <Route path="/supportUse" component={SupportUse} exact={true} />
              <Route
                path="/supportTransaction"
                component={SupportTransaction}
                exact={true}
              />

              <Route
                path="/"
                render={() => <Redirect to="/login" />}
                exact={true}
              />
            </Suspense>
          </IonRouterOutlet>
        </IonPage>
        <AppUrlListener />
      </IonReactRouter>
    </IonApp>
  );
};

export default AppContainer;
