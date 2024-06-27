import { RouteRecordRaw } from "vue-router";

export const ElderlyRegisterRoutes: RouteRecordRaw[] = [
  {
    path: "/document/elderlyRegister",
    name: "ElderlyRegister",
    component: () => import("./index.vue"),
    meta: {
      pageTitle: "ElderlyRegister",
      breadcrumbs: [
        {
          title: "Document",
          disabled: false,
          href: "#"
        },
        {
          title: "ElderlyRegister",
          disabled: true,
          href: "#"
        }
      ]
    }
  },

  {
    path: "/document/elderlyRegister/edit/:id",
    name: "EditElderlyRegister",
    component: () => import("./edit.vue"),
    meta: {
      pageTitle: "ElderlyRegister",
      breadcrumbs: [
        {
          title: "Document",
          disabled: false,
          href: "#"
        },
        {
          title: "ElderlyRegister",
          disabled: false,
          href: "/document/elderlyRegister"
        }
      ]
    }
  },
  /* CORRECT */
  // {
  //   path: "/document/elderlyRegister/correct/:id",
  //   name: "CorrectElderlyRegister",
  //   component: () => import("./Correct.vue"),
  //   meta: {
  //     pageTitle: "ElderlyRegister",
  //     breadcrumbs: [
  //       {
  //         title: "Document",
  //         disabled: false,
  //         href: "#"
  //       },
  //       {
  //         title: "ElderlyRegister",
  //         disabled: false,
  //         href: "/document/elderlyRegister"
  //       }
  //     ]
  //   }
  // },

  {
    path: "/document/elderlyRegister/view/:id",
    name: "ViewElderlyRegister",
    component: () => import("./view.vue"),
    meta: {
      pageTitle: "ElderlyRegister",
      breadcrumbs: [
        {
          title: "Document",
          disabled: false,
          href: "#"
        },
        {
          title: "ElderlyRegister",
          disabled: false,
          href: "/document/elderlyRegister"
        }
      ]
    }
  },
];
