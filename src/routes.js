// @material-ui/icons
import Person from "@material-ui/icons/Person";
import Done from "@material-ui/icons/Done";
import Group from "@material-ui/icons/Group";
import Info from "@material-ui/icons/Info";
import Login from "@material-ui/icons/LockOpen";
// core components/views for Admin layout
import DashboardPage from "views/Dashboard/Dashboard.jsx";
import UserProfile from "views/UserProfile/UserProfile.jsx";
import TableList from "views/TableList/TableList.jsx";
import Typography from "views/Typography/Typography.jsx";
import Icons from "views/Icons/Icons.jsx";
import Maps from "views/Maps/Maps.jsx";
import NotificationsPage from "views/Notifications/Notifications.jsx";
import UpgradeToPro from "views/UpgradeToPro/UpgradeToPro.jsx";
import LoginPage from "views/Pages/LoginPage.jsx";
import RegisterPage from "views/Pages/RegisterPage.jsx";

const dashboardRoutes = [
  {
    path: "/workers",
    name: "Работники",
    rtlName: "لوحة القيادة",
    icon: Group,
    component: DashboardPage,
    layout: "/admin"
  },
  {
    path: "/bids",
    name: "Заявки",
    rtlName: "قائمة الجدول",
    icon: "content_paste",
    component: TableList,
    layout: "/admin"
  },
  // {
  //   path: "/statistics",
  //   name: "Статистика",
  //   rtlName: "طباعة",
  //   icon: BarChart,
  //   component: Typography,
  //   layout: "/admin"
  // },
  {
    path: "/achievements",
    name: "Достижения",
    rtlName: "إخطارات",
    icon: Info,
    component: NotificationsPage,
    layout: "/admin"
  },
  {
    path: "/user",
    name: "Личный профиль",
    rtlName: "ملف تعريفي للمستخدم",
    icon: Person,
    component: UserProfile,
    layout: "/admin"
  },
  {
    path: "/login-page",
    name: "Страница входа",
    rtlName: "پشتیبانی از راست به چپ",
    icon: Login,
    component: LoginPage,
    layout: "/auth"
  },
];

export default dashboardRoutes;
