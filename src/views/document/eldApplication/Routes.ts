import { RouteRecordRaw } from "vue-router";

export const EldApplicationRoutes: RouteRecordRaw[] = [
  {
    path: "/document/EldApplication",
    name: "EldApplication",
    component: () => import("./index.vue"),
    meta: {
      pageTitle: "EldApplication",
      breadcrumbs: [
        {
          title: "Document",
          disabled: false,
          href: "#"
        },
        {
          title: "EldApplication",
          disabled: true,
          href: "#"
        }
      ]
    }
  },
  {
    path: "/document/EldApplication/view/:id",
    name: "ViewEldApplication",
    component: () => import("./view.vue"),
    meta: {
      pageTitle: "EldApplication",
      breadcrumbs: [
        {
          title: "Document",
          disabled: false,
          href: "#"
        },
        {
          title: "ViewEldApplication",
          disabled: true,
          href: "#"
        }
      ]
    }
  }
];
