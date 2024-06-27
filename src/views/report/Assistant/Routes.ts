import { RouteRecordRaw } from "vue-router";

export const AssistantRoutes: RouteRecordRaw[] = [
  {
    path: "/report/AssistantList",
    name: "AssistantList",
    component: () => import("./AssistantList.vue"),
    meta: {
      pageTitle: "cardAssistant",
      breadcrumbs: [
        {
          title: "Reports",
          disabled: false,
          href: "#"
        },
        {
          title: "cardAssistant",
          disabled: true,
          href: "#"
        }
      ]
    }
  },
  {
    path: "/report/cardAssistant/:id",
    name: "cardAssistant",
    component: () => import("./cardAssistant.vue"),
    meta: {
      pageTitle: "cardAssistant",
      breadcrumbs: [
        {
          title: "Reports",
          disabled: false,
          href: "#"
        },
        {
          title: "cardAssistant",
          disabled: true,
          href: "#"
        }
      ]
    }
  }
];
