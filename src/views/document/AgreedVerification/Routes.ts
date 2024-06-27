import { RouteRecordRaw } from "vue-router";

export const AgreedVerification: RouteRecordRaw[] = [
  {
    path: "/document/AgreedVerification",
    name: "AgreedVerification",
    component: () => import("./index.vue"),
    meta: {
      pageTitle: "AgreedVerification",
      stopReloading: true,
      breadcrumbs: [
        {
          title: "Document",
          disabled: false,
          href: "#"
        },
        {
          title: "AgreedVerification",
          disabled: false,
          href: "/document/AgreedVerification"
        }
      ]
    }
  }
];
