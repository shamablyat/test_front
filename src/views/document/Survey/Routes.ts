import {RouteRecordRaw} from "vue-router"

export const SurveyRoutes:RouteRecordRaw[] = [
    {
        path: "/document/Survey",
        name: "Survey",
        component: () => import("./index.vue"),
        meta: {
          pageTitle: "Survey",
          breadcrumbs: [
            {
              title: "Document",
              disabled: false,
              href: "#"
            },
            {
              title: "Survey",
              disabled: true,
              href: "#"
            }
          ]
        }
      },
      {
        path: "/document/Survey/edit/:id",
        name: "EditSurvey",
        component: () => import("./edit.vue"),
        meta: {
          pageTitle: "Survey",
          stopReloading: true,
          breadcrumbs: [
            {
              title: "Document",
              disabled: false,
              href: "#"
            },
            {
              title: "Survey",
              disabled: false,
              href: "/document/Survey"
            }
          ]
        }
      },
      {
        path: "/document/Survey/view/:id",
        name: "ViewSurvey",
        component: () => import("./view.vue"),
        meta: {
          pageTitle: "Survey",
          breadcrumbs: [
            {
              title: "Document",
              disabled: false,
              href: "#"
            },
            +{
              title: "Survey",
              disabled: false,
              href: "/document/Survey"
            }
          ]
        }
      },
]