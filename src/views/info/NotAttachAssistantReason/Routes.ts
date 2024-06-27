import { RouteRecordRaw } from "vue-router";

export const NotAttachAssistantReasonRoutes: RouteRecordRaw[] = [
  {
    path: "/info/NotAttachAssistantReason",
    name: "NotAttachAssistantReason",
    component: () => import("./index.vue"),
    meta: {
      pageTitle: "NotAttachAssistantReason",
      breadcrumbs: [
        {
          title: "Info",
          disabled: false,
          href: "#"
        },
        {
          title: "NotAttachAssistantReason",
          disabled: true,
          href: "#"
        }
      ]
    }
  },
  {
    path: "/info/NotAttachAssistantReason/edit/:id",
    name: "EditNotAttachAssistantReason",
    component: () => import("./edit.vue"),
    meta: {
      pageTitle: "NotAttachAssistantReason",
      breadcrumbs: [
        {
          title: "Info",
          disabled: false,
          href: "#"
        },
        {
          title: "NotAttachAssistantReason",
          disabled: false,
          href: "/info/NotAttachAssistantReason"
        }
      ]
    }
  }
];
