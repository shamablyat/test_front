import { RouteRecordRaw } from "vue-router";
import { VerificationRoutes } from "./verification/Routes";
import { SocialEmployeeRoutes } from "./SocialEmployee/Routes";

export const ElderlyVerificationRoutes: RouteRecordRaw[] = [
  {
    path: "document/ElderlyVerification",
    name: "ElderlyVerification",
    component: () => import("./index.vue"),
    children: [...VerificationRoutes, ...SocialEmployeeRoutes]
  }
];
