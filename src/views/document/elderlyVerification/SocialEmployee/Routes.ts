import { RouteRecordRaw } from "vue-router";

export const SocialEmployeeRoutes: RouteRecordRaw[] = [
  {
    path: "/document/ElderlyVerification/CreateVerification",
    name: "CreateVerification",
    component: () => import("./CanCreateVrf.vue")
  }
];
