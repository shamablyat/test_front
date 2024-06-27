import { RouteRecordRaw } from "vue-router";

export const ElderlyCareScheduleRoutes:RouteRecordRaw[] = [
    {
        path: "/document/elderlyCareSchedule",
        name: "ElderlyCareSchedule",
        component: () => import("./index.vue"),
        meta: {
          pageTitle: "elderlyCareSchedule",
          breadcrumbs: [
            {
              title: "Document",
              disabled: false,
              href: "#"
            },
            {
              title: "elderlyCareSchedule",
              disabled: true,
              href: "#"
            }
          ]
        }
      },
      {
        path: "/document/elderlyCareSchedule/view/:id",
        name: "ViewElderlyCareSchedule",
        component: () => import("./view.vue"),
        meta: {
          pageTitle: "elderlyCareSchedule",
          breadcrumbs: [
            {
              title: "Document",
              disabled: false,
              href: "#"
            },
            {
              title: "elderlyCareSchedule",
              disabled: false,
              href: "/document/elderlyCareSchedule"
            }
          ]
        }
      },
      {
        path: "/document/elderlyCareSchedule/edit/:id",
        name: "EditElderlyCareSchedule",
        component: () => import("./edit.vue"),
        meta: {
          pageTitle: "elderlyCareSchedule",
          breadcrumbs: [
            {
              title: "Document",
              disabled: false,
              href: "#"
            },
            {
              title: "elderlyCareSchedule",
              disabled: false,
              href: "/document/elderlyCareSchedule"
            }
          ]
        }
      },
]