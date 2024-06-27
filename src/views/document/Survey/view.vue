<script setup lang="ts">
import QuestionIndex from "@/features/Questions/QuestionIndex.vue";
import { useRoute } from "vue-router";

const route = useRoute();

const id = route.params.id as string;
const elderlyVerificationId = route.query.elderlyVerificationId as string;
const eldQuestionnaireType = route.query.eldQuestionnaireType as string;
</script>

<template>
  <div>
    <QuestionIndex isShowFooter :id="id" :elderly-verification-id="elderlyVerificationId" :eld-questionnaire-type="eldQuestionnaireType" is-view />
  </div>
</template>

<style lang="scss" scoped></style>
