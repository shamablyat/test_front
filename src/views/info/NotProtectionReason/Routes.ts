import { RouteRecordRaw } from "vue-router";

export const NotProtectionReasonRoutes: RouteRecordRaw[] = [
  {
    path: "/info/NotProtectionReason",
    name: "NotProtectionReason",
    component: () => import("./index.vue"),
    meta: {
      pageTitle: "notProtectionReason",
      breadcrumbs: [
        {
          title: "Info",
          disabled: false,
          href: "#"
        },
        {
          title: "notProtectionReason",
          disabled: true,
          href: "#"
        }
      ]
    }
  },
  {
    path: "/info/NotProtectionReason/edit/:id",
    name: "EditNotProtectionReason",
    component: () => import("./edit.vue"),
    meta: {
      pageTitle: "notProtectionReason",
      breadcrumbs: [
        {
          title: "Info",
          disabled: false,
          href: "#"
        },
        {
          title: "notProtectionReason",
          disabled: false,
          href: "/document/NotProtectionReason"
        }
      ]
    }
  }
];
