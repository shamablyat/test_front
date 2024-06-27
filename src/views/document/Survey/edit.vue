<script setup lang="ts">
import QuestionIndex from "@/features/Questions/QuestionIndex.vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

const id = route.params.id as string;
const elderlyVerificationId = route.query.elderlyVerificationId as string;
const eldQuestionnaireType = route.query.eldQuestionnaireType as string;

const changeRoute = () => {
  router.push({ name: "Survey" });
};
const createSurvey = (cbId: string | number) => {
  router.replace({
    name: "EditSurvey",
    params: {
      id: cbId
    },
    query: {
      elderlyVerificationId: elderlyVerificationId || undefined
    }
  });
};
</script>

<template>
  <div>
    <QuestionIndex
      :id="id"
      :elderly-verification-id="elderlyVerificationId"
      :eld-questionnaire-type="eldQuestionnaireType"
      @createSurvey="createSurvey"
      @change-route="changeRoute"
      isShowFooter
    />
    <!-- <SurveyEdit
      :id="id"
      :elderly-verification-id="elderlyVerificationId"
      :eld-questionnaire-type="eldQuestionnaireType"
      @createSurvey="createSurvey"
      @change-route="changeRoute"
    /> -->
  </div>
</template>

<style lang="scss" scoped></style>
