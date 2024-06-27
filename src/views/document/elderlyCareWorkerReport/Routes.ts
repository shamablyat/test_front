import { RouteRecordRaw } from "vue-router";

export const ElderlyCareWorkerReportRoutes:RouteRecordRaw[] = [
    {
        path: "/document/elderlyCareWorkerReport",
        name: "ElderlyCareWorkerReport",
        component: () => import("./index.vue"),
        meta: {
          pageTitle: "elderlyCareWorkerReport",
          breadcrumbs: [
            {
              title: "Document",
              disabled: false,
              href: "#"
            },
            {
              title: "elderlyCareWorkerReport",
              disabled: true,
              href: "#"
            }
          ]
        }
      },
]