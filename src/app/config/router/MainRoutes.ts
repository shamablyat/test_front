import { RouteRecordRaw } from "vue-router";
import { DocumentRoutes } from "@/views/document/Routes";
import { InfoRoutes } from "@/views/info/Routes";
import { ReportRoutes } from "@/views/report/Routes";

const MainRoutes: RouteRecordRaw = {
  path: "/main",
  component: () => import("@/app/config/layouts/FullLayout.vue"),
  children: [
    ...InfoRoutes,
    ...DocumentRoutes,
    ...ReportRoutes,
    {
      path: "/",
      redirect: "/home",
    },
    {
      name: "Dashboard",
      path: "/home",
      component: () => import("@/views/dashboard.vue"),
    },
  ],
};

export default MainRoutes;
