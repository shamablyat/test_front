import { RouteRecordRaw } from "vue-router";

export const LivingConditionRoutes: RouteRecordRaw[] = [
  {
    path: "/info/livingcondition",
    name: "LivingCondition",
    component: () => import("./index.vue"),
    meta: {
      pageTitle: "LivingCondition",
      breadcrumbs: [
        {
          title: "Info",
          disabled: false,
          href: "#"
        },
        {
          title: "LivingCondition",
          disabled: true,
          href: "#"
        }
      ]
    }
  },
  {
    path: "/info/livingcondition/edit/:id",
    name: "EditLivingCondition",
    component: () => import("./edit.vue"),
    meta: {
      pageTitle: "LivingCondition",
      breadcrumbs: [
        {
          title: "Info",
          disabled: false,
          href: "#"
        },
        {
          title: "LivingCondition",
          disabled: false,
          href: "/document/livingcondition"
        }
      ]
    }
  }
];
