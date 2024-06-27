import { RouteRecordRaw } from "vue-router";
import { AssistantRoutes } from "./Assistant/Routes";

export const ReportRoutes: RouteRecordRaw[] = [
  /* GetElderlyRegistry */
  {
    path: "/report/getElderlyRegistry",
    name: "GetElderlyRegistry",
    component: () => import("@/views/report/getElderlyRegistry.vue"),
    meta: {
      pageTitle: "GetElderlyRegistry",
      breadcrumbs: [
        {
          title: "Reports",
          disabled: false,
          href: "#"
        },
        {
          title: "GetElderlyRegistry",
          disabled: true,
          href: "#"
        }
      ]
    }
  },
  /* GetRegisteredElderly */
  {
    path: "/report/getRegisteredElderly",
    name: "GetRegisteredElderly",
    component: () => import("@/views/report/getRegisteredElderly.vue"),
    meta: {
      pageTitle: "GetRegisteredElderly",
      breadcrumbs: [
        {
          title: "Reports",
          disabled: false,
          href: "#"
        },
        {
          title: "GetRegisteredElderly",
          disabled: true,
          href: "#"
        }
      ]
    }
  },
  /* GetRegisteredElderlyWithAssistant */
  {
    path: "/report/GetRegisteredElderlyWithAssistant",
    name: "GetRegisteredElderlyWithAssistant",
    component: () => import("@/views/report/GetRegisteredElderlyWithAssistant.vue"),
    meta: {
      pageTitle: "GetRegisteredElderlyWithAssistant",
      breadcrumbs: [
        {
          title: "Reports",
          disabled: false,
          href: "#"
        },
        {
          title: "GetRegisteredElderlyWithAssistant",
          disabled: true,
          href: "#"
        }
      ]
    }
  },
  //   Get

  {
    path: "/report/GetElderlyVerifications",
    name: "GetElderlyVerifications",
    component: () => import("@/views/report/getElderlyVerifications.vue"),
    meta: {
      pageTitle: "GetElderlyVerifications",
      breadcrumbs: [
        {
          title: "Reports",
          disabled: false,
          href: "#"
        },
        {
          title: "GetElderlyVerifications",
          disabled: true,
          href: "#"
        }
      ]
    }
  },
  {
    path: "/report/GetAssistantServices",
    name: "GetAssistantServices",
    component: () => import("@/views/report/GetAssistantServices.vue"),
    meta: {
      pageTitle: "GetAssistantServices",
      breadcrumbs: [
        {
          title: "Reports",
          disabled: false,
          href: "#"
        },
        {
          title: "GetAssistantServices",
          disabled: true,
          href: "#"
        }
      ]
    }
  },
  {
    path: "/report/GetElderlyManageOutReasonsCount",
    name: "GetElderlyManageOutReasonsCount",
    component: () => import("@/views/report/GetElderlyManageOutReasonsCount.vue"),
    meta: {
      pageTitle: "GetElderlyManageOutReasonsCount",
      breadcrumbs: [
        {
          title: "Reports",
          disabled: false,
          href: "#"
        },
        {
          title: "GetElderlyManageOutReasonsCount",
          disabled: true,
          href: "#"
        }
      ]
    }
  },
  {
    path: "/report/GetAssistantWorkingProcessCount",
    name: "GetAssistantWorkingProcessCount",
    component: () => import("@/views/report/GetAssistantWorkingProcessCount.vue"),
    meta: {
      pageTitle: "GetAssistantWorkingProcessCount",
      breadcrumbs: [
        {
          title: "Reports",
          disabled: false,
          href: "#"
        },
        {
          title: "GetAssistantWorkingProcessCount",
          disabled: true,
          href: "#"
        }
      ]
    }
  },
  {
    path: "/report/GetElderlyVerificationCount",
    name: "GetElderlyVerificationCount",
    component: () => import("@/views/report/GetElderlyVerificationCount.vue"),
    meta: {
      pageTitle: "GetElderlyVerificationCount",
      breadcrumbs: [
        {
          title: "Reports",
          disabled: false,
          href: "#"
        },
        {
          title: "GetElderlyVerificationCount",
          disabled: true,
          href: "#"
        }
      ]
    }
  },
  {
    path: "/report/GetVerificationMonitoringCount",
    name: "GetVerificationMonitoringCount",
    component: () => import("@/views/report/GetVerificationMonitoringCount.vue"),
    meta: {
      pageTitle: "GetVerificationMonitoringCount",
      breadcrumbs: [
        {
          title: "Reports",
          disabled: false,
          href: "#"
        },
        {
          title: "GetVerificationMonitoringCount",
          disabled: true,
          href: "#"
        }
      ]
    }
  },
  {
    path: "/report/GetEldApplication",
    name: "GetEldApplication",
    component: () => import("@/views/report/GetEldApplication.vue"),
    meta: {
      pageTitle: "GetEldApplication",
      breadcrumbs: [
        {
          title: "Reports",
          disabled: false,
          href: "#"
        },
        {
          title: "GetEldApplication",
          disabled: true,
          href: "#"
        }
      ]
    }
  },
  {
    path: "/report/GetApplicationCountByStep",
    name: "GetApplicationCountByStep",
    component: () => import("./GetApplicationCountByStep.vue"),
    meta: {
      pageTitle: "GetApplicationCountByStep",
      breadcrumbs: [
        {
          title: "Reports",
          disabled: false,
          href: "#"
        },
        {
          title: "GetApplicationCountByStep",
          disabled: true,
          href: "#"
        }
      ]
    }
  },
  {
    path: "/report/GetUserRoles",
    name: "GetUserRoles",
    component: () => import("@/views/report/GetUserRoles.vue"),
    meta: {
      pageTitle: "GetUserRoles",
      breadcrumbs: [
        {
          title: "Reports",
          disabled: false,
          href: "#"
        },
        {
          title: "GetUserRoles",
          disabled: true,
          href: "#"
        }
      ]
    }
  },
  {
    path: "/report/GetNotWorkedAssistants",
    name: "GetNotWorkedAssistants",
    component: () => import("@/views/report/GetNotWorkedAssistants.vue"),
    meta: {
      pageTitle: "GetNotWorkedAssistants",
      breadcrumbs: [
        {
          title: "Reports",
          disabled: false,
          href: "#"
        },
        {
          title: "GetNotWorkedAssistants",
          disabled: true,
          href: "#"
        }
      ]
    }
  },
  {
    path: "/report/GetAssistantWeeklyReport",
    name: "GetAssistantWeeklyReport",
    component: () => import("@/views/report/GetAssistantWeeklyReport.vue"),
    meta: {
      pageTitle: "GetAssistantWeeklyReport",
      breadcrumbs: [
        {
          title: "Reports",
          disabled: false,
          href: "#"
        },
        {
          title: "GetAssistantWeeklyReport",
          disabled: true,
          href: "#"
        }
      ]
    }
  },
  {
    path: "/report/GetServicesReport",
    name: "GetServicesReport",
    component: () => import("@/views/report/GetServicesReport.vue"),
    meta: {
      pageTitle: "GetServicesReport",
      breadcrumbs: [
        {
          title: "Reports",
          disabled: false,
          href: "#"
        },
        {
          title: "GetServicesReport",
          disabled: true,
          href: "#"
        }
      ]
    }
  },
  ...AssistantRoutes
];
