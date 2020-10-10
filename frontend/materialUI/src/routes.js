/*!

=========================================================
* Material Dashboard React - v1.9.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// @material-ui/icons
// import LibraryBooks from "@material-ui/icons/LibraryBooks";
// import BubbleChart from "@material-ui/icons/BubbleChart";
// import LocationOn from "@material-ui/icons/LocationOn";
// import Notifications from "@material-ui/icons/Notifications";
// import Unarchive from "@material-ui/icons/Unarchive";
// import Language from "@material-ui/icons/Language";
// core components/views for Admin layout
// import Typography from "views/Typography/Typography.js";
// import Icons from "views/Icons/Icons.js";
// import Maps from "views/Maps/Maps.js";
// import NotificationsPage from "views/Notifications/Notifications.js";
//import UpgradeToPro from "views/UpgradeToPro/UpgradeToPro.js";
// core components/views for RTL layout
//import RTLPage from "views/RTLPage/RTLPage.js";
// import UserProfile from "views/UserProfile/UserProfile.js";
// import TableList from "views/TableList/TableList.js";

import Person from "@material-ui/icons/Person";
import Group from "@material-ui/icons/Group";
import User1Page from "views/User/User1.js";
import User2Page from "views/User/User2.js";
import User3Page from "views/User/User3.js";
import TeamPage from "views/Team/Team.js";

// import Dashboard from "@material-ui/icons/Dashboard";
// import DashboardPage from "views/Dashboard/Dashboard.js";


const dashboardRoutes = [
  /* {
    path: "/dashboard",
    name: "Dashboard",
    // rtlName: "لوحة القيادة",
    icon: Dashboard,
    component: Dashboard,
    layout: "/admin"
  }, */
  {
    path: "/team",
    name: "Team",
    icon: Group,
    component: TeamPage,
    layout: "/admin"
  },
  /* {
    path: "/user1",
    name: "Dancer1",
    icon: Person,
    component: User1Page,
    layout: "/admin"
  },
  {
    path: "/user2",
    name: "Dancer2",
    icon: Person,
    component: User2Page,
    layout: "/admin"
  },
  {
    path: "/user3",
    name: "Dancer3",
    icon: Person,
    component: User3Page,
    layout: "/admin"
  }, */
  /*
  {
    path: "/user",
    name: "User Profile",
    // rtlName: "ملف تعريفي للمستخدم",
    icon: Person,
    component: UserProfile,
    layout: "/admin"
  },
  {
    path: "/table",
    name: "Table List",
    // rtlName: "قائمة الجدول",
    icon: "content_paste",
    component: TableList,
    layout: "/admin"
  },
  {
    path: "/typography",
    name: "Typography",
    rtlName: "طباعة",
    icon: LibraryBooks,
    component: Typography,
    layout: "/admin"
  },
  {
    path: "/icons",
    name: "Icons",
    rtlName: "الرموز",
    icon: BubbleChart,
    component: Icons,
    layout: "/admin"
  },
  {
    path: "/notifications",
    name: "Notifications",
    rtlName: "إخطارات",
    icon: Notifications,
    component: NotificationsPage,
    layout: "/admin"
  }
  */
];

export default dashboardRoutes;
