<script setup lang="ts">
import SurveyEdit from "./SurveyEdit.vue";
import ViewQuestions from "./ViewQuestions.vue";

interface IProps {
  id: number | string;
  elderlyVerificationId: number | string;
  eldQuestionnaireType: string;
  isView?: boolean;
  isShowFooter?: boolean;
}

defineProps<IProps>();

const emits = defineEmits<{
  (e: "createSurvey", id: string | number): void;
  (e: "changeRoute"): void;
  (e: "refreshData"): void;
  (e: "setStep"): void;
}>();

const createSurvey = (id: number | string) => {
  emits("createSurvey", id);
};
const changeRoute = () => {
  emits("changeRoute");
};
const refreshData = () => {
  emits("refreshData");
};
const setStep = () => {
  emits("setStep");
};
</script>

<template>
  <div>
    <SurveyEdit
      v-if="!isView"
      :id="id"
      :eld-questionnaire-type="eldQuestionnaireType"
      :elderly-verification-id="elderlyVerificationId"
      :isShowFooter="isShowFooter"
      @change-route="changeRoute"
      @create-survey="createSurvey"
      @refresh-data="refreshData"
      @setStep="setStep"
    />
    <ViewQuestions v-else :id="id" :elderlyVerificationId="elderlyVerificationId" :isShowFooter="isShowFooter" />
  </div>
</template>

<style lang="scss" scoped></style>
