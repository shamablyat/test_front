export default [
  {
    header: "Reports",
    visible: [
      "ElderlyRegisterReportViewByRegion",
      "ElderlyRegisterReportViewWithoutAnyFilterByRegion",
      "ElderlyRegisterReportViewByDistrict",
      "ElderlyRegisterReportViewWithoutAnyFilterByDistrict",
      "ElderlyRegisterReportViewByMfy",
      "RegisteredElderlyReportViewByRegion",
      "RegisteredElderlyReportViewWithoutAnyFilterByRegion",
      "RegisteredElderlyReportViewByDistrict",
      "RegisteredElderlyReportViewWithoutAnyFilterByDistrict",
      "ElderlyVerificationReportViewAll",
      "ElderlyVerificationReportViewByRegion",
      "ElderlyVerificationReportViewByDistrict",
      "AssistantWorkingProcessReportByDistrict",
      "AssistantWorkingProcessReportByRegion",
      "ElderlyVerificationCountReportViewByRegion",
      "ElderlyVerificationCountReportViewByDistrict",
      "VerificationMonitoringCountReportViewByRegion",
      "VerificationMonitoringCountReportViewByDistrict",
      "UserRoleView",
      "ListElderlyRegisterInReestrReportViewByRegion",
      "ListElderlyRegisterInReestrReportViewByDistrict",
      "AssistantWeeklyReportReportViewByMfy",
      "AssistantWeeklyReportReportViewByDistrict",
      "AssistantWeeklyReportReportViewByRegion",
      "GetServicesReportViewByRegion",
      "GetServicesReportViewByDistrict"
    ],
    isCollapse: true,
    children: [
      {
        title: "GetElderlyRegistry1",
        to: "/report/getElderlyRegistry",
        visible: [
          "ElderlyRegisterReportViewByRegion",
          "ElderlyRegisterReportViewWithoutAnyFilterByRegion",
          "ElderlyRegisterReportViewByDistrict",
          "ElderlyRegisterReportViewWithoutAnyFilterByDistrict",
          "ElderlyRegisterReportViewByMfy"
        ]
      },
      {
        title: "GetRegisteredElderly2",
        to: "/report/getRegisteredElderly",
        visible: [
          "RegisteredElderlyReportViewByRegion",
          "RegisteredElderlyReportViewWithoutAnyFilterByRegion",
          "RegisteredElderlyReportViewByDistrict",
          "RegisteredElderlyReportViewWithoutAnyFilterByDistrict"
        ]
      },
      {
        title: "GetElderlyVerifications3",
        to: "/report/GetElderlyVerifications",
        visible: ["ElderlyVerificationReportViewAll", "ElderlyVerificationReportViewByRegion", "ElderlyVerificationReportViewByDistrict"]
      },
      {
        title: "GetRegisteredElderlyWithAssistant4",
        to: "/report/GetRegisteredElderlyWithAssistant",
        visible: [
          "RegisteredElderlyReportViewByRegion",
          "RegisteredElderlyReportViewWithoutAnyFilterByRegion",
          "RegisteredElderlyReportViewByDistrict",
          "RegisteredElderlyReportViewWithoutAnyFilterByDistrict"
        ]
      },
      {
        title: "GetAssistantWeeklyReport5",
        to: "/report/GetAssistantWeeklyReport",
        visible: ["AssistantWeeklyReportReportViewByMfy", "AssistantWeeklyReportReportViewByDistrict", "AssistantWeeklyReportReportViewByRegion"]
      },
      {
        title: "cardAssistant6",
        to: "/report/AssistantList",
        visible: ["AssistantsInforReportByRegion", "AssistantsInforReportByDistrict", "ElderlyCareWorkerReportView", "ElderlyCareWorkerReportViewAll"]
      },
      {
        title: "GetAssistantServices7",
        to: "/report/GetAssistantServices",
        visible: ["AssistantServiceReportReportByRegion", "AssistantServiceReportReportByDistrict"]
      },
      {
        title: "GetElderlyManageOutReasonsCount8",
        to: "/report/GetElderlyManageOutReasonsCount",
        visible: ["OutReasonReportReportByRegion", "OutReasonReportReportByDistrict"]
      },
      {
        title: "GetAssistantWorkingProcessCount9",
        to: "/report/GetAssistantWorkingProcessCount",
        visible: ["AssistantWorkingProcessReportByDistrict", "AssistantWorkingProcessReportByRegion"]
      },
      {
        title: "GetElderlyVerificationCount10",
        to: "/report/GetElderlyVerificationCount",
        visible: ["ElderlyVerificationCountReportViewByRegion", "ElderlyVerificationCountReportViewByDistrict"]
      },
      {
        title: "GetVerificationMonitoringCount11",
        to: "/report/GetVerificationMonitoringCount",
        visible: ["VerificationMonitoringCountReportViewByRegion", "VerificationMonitoringCountReportViewByDistrict"]
      },
      {
        title: "GetEldApplication12",
        to: "/report/GetEldApplication",
        visible: ["EldApplicationReportByRegion", "EldApplicationReportByDistrict", "EldApplicationReportByMfy"]
      },
      {
        title: "GetApplicationCountByStep13",
        to: "/report/GetApplicationCountByStep",
        visible: ["EldApplicationCountByStepReportByRegion", "EldApplicationCountByStepReportByDistrict", "EldApplicationCountByStepReportByMfy"]
      },
      {
        title: "GetNotWorkedAssistants14",
        to: "/report/GetNotWorkedAssistants",
        visible: ["NotWorkedAssistantsReportByRegion", "NotWorkedAssistantsReportByDistrict", "NotWorkedAssistantsReportByMfy"]
      },
      {
        title: "GetUserRoles15",
        to: "/report/GetUserRoles",
        visible: ["UserRoleView"]
      },
      {
        title: "GetServicesReport16",
        to: "/report/GetServicesReport",
        visible: ["GetServicesReportViewByRegion", "GetServicesReportViewByDistrict"]
      }
    ]
  }
];
