export const SentElderlyRegisterRoutes = [
  {
    path: "/document/sentElderlyRegister",
    name: "SentElderlyRegister",
    component: () => import("./index.vue"),
    meta: {
      pageTitle: "sentElderlyRegister",
      breadcrumbs: [
        {
          title: "Document",
          disabled: false,
          href: "#"
        },
        {
          title: "sentElderlyRegister",
          disabled: true,
          href: "#"
        }
      ]
    }
  },
  {
    path: "/document/sentElderlyRegister/view/:id",
    name: "ViewSentElderlyRegister",
    component: () => import("./view.vue"),
    props: {
      isSent: true
    },
    meta: {
      pageTitle: "sentElderlyRegister",
      breadcrumbs: [
        {
          title: "Document",
          disabled: false,
          href: "#"
        },
        {
          title: "sentElderlyRegister",
          disabled: false,
          href: "/document/sentElderlyRegister"
        }
      ]
    }
  },
  {
    path: "/document/elderlyRegister/correct/:id",
    name: "CorrectElderlyRegister",
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
  }
];
