import { RouteRecordRaw } from "vue-router";

export const DeleteDocRoutes: RouteRecordRaw[] = [
  {
    path: "/documents/DeleteDoc",
    name: "DeleteDoc",
    component: () => import("./index.vue"),
    meta: {
      pageTitle: "DeleteDoc",
      breadcrumbs: [
        {
          title: "Document",
          disabled: false,
          href: "#"
        },
        {
          title: "DeleteDoc",
          disabled: true,
          href: "#"
        }
      ]
    }
  },
  {
    path: "/documents/DeleteDoc/edit/:id",
    name: "EditDeleteDoc",
    component: () => import("./edit.vue"),
    meta: {
      pageTitle: "DeleteDoc",
      breadcrumbs: [
        {
          title: "Document",
          disabled: false,
          href: "#"
        },
        {
          title: "DeleteDoc",
          disabled: false,
          href: "/documents/DeleteDoc"
        }
      ]
    }
  },
  {
    path: "/documents/DeleteDoc/view/:id",
    name: "ViewDeleteDoc",
    component: () => import("./view.vue"),
    meta: {
      pageTitle: "DeleteDoc",
      breadcrumbs: [
        {
          title: "Document",
          disabled: false,
          href: "#"
        },
        {
          title: "DeleteDoc",
          disabled: false,
          href: "/documents/DeleteDoc"
        }
      ]
    }
  },
];
