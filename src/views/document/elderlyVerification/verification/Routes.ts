import { RouteRecordRaw } from "vue-router";

export const VerificationRoutes: RouteRecordRaw[] = [
  {
    path: "/document/ElderlyVerification/verificationList",
    name: "Verification",
    component: () => import("./index.vue")
  },
  {
    path: "/document/ElderlyVerification/verification/edit/:id",
    name: "EditVerification",
    component: () => import("./edit.vue"),
    meta: {
      pageTitle: "ElderlyVerification",
      stopReloading: true,
      breadcrumbs: [
        {
          title: "Document",
          disabled: false,
          href: "#"
        },
        {
          title: "ElderlyVerification",
          disabled: false,
          href: "/document/ElderlyVerification"
        }
      ]
    }
  },
  {
    path: "/document/ElderlyVerification/verification/view/:id",
    name: "ViewVerification",
    component: () => import("./edit.vue"),
    meta: {
      pageTitle: "ElderlyVerification",
      breadcrumbs: [
        {
          title: "Document",
          disabled: false,
          href: "#"
        },
        {
          title: "ElderlyVerification",
          disabled: false,
          href: "/document/ElderlyVerification"
        }
      ]
    }
  }
];
