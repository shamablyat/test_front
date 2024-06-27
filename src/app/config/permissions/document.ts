import { CircleDotIcon } from "vue-tabler-icons";

export default [
  {
    header: "Document",
    visible: [
      "ElderlyRegisterView",
      "ElderlyRegisterSentView",
      "ElderlyCareScheduleView",
      "ElderlyRegisterAccept",
      "ElderlyCareWorkerReportView",
      "ElderlyVerificationView",
      "CanSetSocialEmployeeView",
      "ElderlyVerificationAccept",
      "ElderlyVerificationCreate",
      "ElderlyVerificationEdit",
      "EldDeleteDocView"
    ],
    isCollapse: true,
    children: [
      {
        title: "ElderlyRegister",
        to: "/document/elderlyRegister",
        visible: "ElderlyRegisterView",
        icon: CircleDotIcon
      },
      {
        title: "sentElderlyRegister",
        to: "/document/sentElderlyRegister",
        visible: "ElderlyRegisterSentView",
        icon: CircleDotIcon
      },
      {
        title: "elderlyCareSchedule",
        to: "/document/elderlyCareSchedule",
        visible: "ElderlyCareScheduleView",
        icon: CircleDotIcon
      },

      {
        title: "elderlyCareWorkerReport",
        to: "/document/elderlyCareWorkerReport",
        visible: "ElderlyCareWorkerReportView",
        icon: CircleDotIcon
      },
      {
        title: "EldApplication",
        to: "/document/EldApplication",
        visible: "ApplicationView",
        icon: CircleDotIcon
      },
      {
        title: "ElderlyVerification",
        to: "/document/ElderlyVerification/CreateVerification",
        visible: ["ElderlyVerificationView", "ElderlyVerificationCreate", "ElderlyVerificationEdit", "ElderlyVerificationViewAll"],
        icon: CircleDotIcon
      },
      {
        title: "AgreedVerification",
        to: "/document/AgreedVerification",
        visible: "ElderlyVerificationAccept",
        icon: CircleDotIcon
      },
      {
        title: "DeleteDoc",
        to: "/documents/DeleteDoc",
        visible: "EldDeleteDocView",
        icon: CircleDotIcon
      }
    ]
  }
];
