import { CircleDotIcon } from "vue-tabler-icons";

export default [
  {
    header: "Info",
    visible: [
      "ElderlyServiceView",
      "EldQuestionnaireView",
      "EldSurveyResultAlgorithmView",
      "IndividualProgramView",
      "ElderlyManageView",
      "NotAttachAssistantReasonView",
      "ElderlyReason"
    ],
    isCollapse: true,
    children: [
      {
        title: "ElderlyManage",
        to: "/info/ElderlyManage",
        visible: "ElderlyManageView",
        icon: CircleDotIcon
      },
      {
        title: "ElderlyService",
        to: "/info/elderlyService",
        visible: "ElderlyServiceView",
        icon: CircleDotIcon
      },
      {
        title: "Questionnaire",
        to: "/info/Questionnaire",
        visible: "EldQuestionnaireView",
        icon: CircleDotIcon
      },

      {
        title: "SurveyResultAlgorithm",
        to: "/info/SurveyResultAlgorithm",
        visible: "EldSurveyResultAlgorithmView",
        icon: CircleDotIcon
      },
      {
        title: "individualProgram",
        to: "/info/individualProgram",
        visible: "IndividualProgramView",
        icon: CircleDotIcon
      },
      {
        title: "notProtectionReason",
        to: "/info/NotProtectionReason",
        visible: "NotProtectionReasonView",
        icon: CircleDotIcon
      },
      {
        title: "NotAttachAssistantReason",
        to: "/info/NotAttachAssistantReason",
        visible: "NotAttachAssistantReasonView",
        icon: CircleDotIcon
      },
      {
        title: "ElderlyReason",
        to: "/info/ElderlyReason",
        visible: "ElderlyReasonView",
        icon: CircleDotIcon
      }
    ]
  }
];
