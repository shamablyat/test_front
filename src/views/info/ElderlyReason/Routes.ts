import { RouteRecordRaw } from "vue-router";

export const ElderlyReasonRoutes: RouteRecordRaw[] = [
  {
    path: "/info/elderlyReason",
    name: "ElderlyReason",
    component: () => import("./index.vue"),
    meta: {
      pageTitle: "ElderlyReason",
      breadcrumbs: [
        {
          title: "Info",
          disabled: false,
          href: "#"
        },
        {
          title: "ElderlyReason",
          disabled: true,
          href: "#"
        }
      ]
    }
  },
  {
    path: "/info/elderlyReason/edit/:id",
    name: "EditElderlyReason",
    component: () => import("./edit.vue"),
    meta: {
      pageTitle: "ElderlyReason",
      breadcrumbs: [
        {
          title: "Info",
          disabled: false,
          href: "#"
        },
        {
          title: "ElderlyReason",
          disabled: false,
          href: "/document/elderlyReason"
        }
      ]
    }
  }
];
