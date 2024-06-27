import { RouteRecordRaw } from "vue-router";

export const SurveyResultAlgorithmRoutes: RouteRecordRaw[] = [
  {
    path: "/info/SurveyResultAlgorithm",
    name: "SurveyResultAlgorithm",
    component: () => import("./index.vue"),
    meta: {
      pageTitle: "SurveyResultAlgorithm",
      breadcrumbs: [
        {
          title: "Info",
          disabled: false,
          href: "#"
        },
        {
          title: "SurveyResultAlgorithm",
          disabled: true,
          href: "#"
        }
      ]
    }
  },
  {
    path: "/info/SurveyResultAlgorithm/edit/:id",
    name: "EditSurveyResultAlgorithm",
    component: () => import("./edit.vue"),
    meta: {
      pageTitle: "SurveyResultAlgorithm",
      breadcrumbs: [
        {
          title: "Info",
          disabled: false,
          href: "#"
        },
        {
          title: "SurveyResultAlgorithm",
          disabled: false,
          href: "/info/SurveyResultAlgorithm"
        }
      ]
    }
  },
  {
    path: "/info/SurveyResultAlgorithm/view/:id",
    name: "ViewSurveyResultAlgorithm",
    component: () => import("./view.vue"),
    meta: {
      pageTitle: "SurveyResultAlgorithm",
      breadcrumbs: [
        {
          title: "Info",
          disabled: false,
          href: "#"
        },
        {
          title: "SurveyResultAlgorithm",
          disabled: false,
          href: "/info/SurveyResultAlgorithm"
        }
      ]
    }
  }
];
