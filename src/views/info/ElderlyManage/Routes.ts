import { RouteRecordRaw } from "vue-router";

export const ElderlyManageRoutes: RouteRecordRaw[] = [
  {
    path: "/info/ElderlyManage",
    name: "ElderlyManage",
    component: () => import("@/features/ElderlyManage/ui.vue"),
    props:{
      createVerification: true
    },
    meta: {
      pageTitle: "ElderlyManage",
      breadcrumbs: [
        {
          title: "Info",
          disabled: false,
          href: "#"
        },
        {
          title: "ElderlyManage",
          disabled: true,
          href: "#"
        }
      ]
    }
  }
];
