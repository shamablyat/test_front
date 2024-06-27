export const IndividualProgramRoutes = [
  {
    path: "/info/individualProgram",
    name: "IndividualProgram",
    component: () => import("./index.vue"),
    meta: {
      pageTitle: "individualProgram",
      breadcrumbs: [
        {
          title: "Info",
          disabled: false,
          href: "#"
        },
        {
          title: "individualProgram",
          disabled: true,
          href: "#"
        }
      ]
    }
  },
  {
    path: "/info/individualProgram/edit/:id",
    name: "EditIndividualProgram",
    component: () => import("./edit.vue"),
    meta: {
      pageTitle: "individualProgram",
      breadcrumbs: [
        {
          title: "Info",
          disabled: false,
          href: "#"
        },
        {
          title: "individualProgram",
          disabled: false,
          href: "/document/individualProgram"
        }
      ]
    }
  }
];
