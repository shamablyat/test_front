import { RouteRecordRaw } from "vue-router";

export const ElderlyServiceRoutes: RouteRecordRaw[] = [
  {
    path: "/info/elderlyService",
    name: "ElderlyService",
    component: () => import("./index.vue"),
    meta: {
      pageTitle: "ElderlyService",
      breadcrumbs: [
        {
          title: "Info",
          disabled: false,
          href: "#"
        },
        {
          title: "ElderlyService",
          disabled: true,
          href: "#"
        }
      ]
    }
  },
  {
    path: "/info/elderlyService/edit/:id",
    name: "EditElderlyService",
    component: () => import("./edit.vue"),
    meta: {
      pageTitle: "ElderlyService",
      breadcrumbs: [
        {
          title: "Info",
          disabled: false,
          href: "#"
        },
        {
          title: "ElderlyService",
          disabled: false,
          href: "/document/elderlyService"
        }
      ]
    }
  }
];
