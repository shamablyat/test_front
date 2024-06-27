<script setup lang="ts">
import { IVerificationResultDto, VerificationResultTabs } from "../types";
import { IFields } from "@/models/basic";
import FormTabRow from "@/components/form/FormTabRow.vue";

interface IProps {
  data: IVerificationResultDto;
  type: VerificationResultTabs;
  isView?: boolean;
}

defineProps<IProps>();

const fields: IFields[] = [
  {
    key: "dayCount",
    label: "day",
    tdClass: "border",
    thClass: "border font-weigh-bold text-dark"
  },
  {
    key: "dailyHour",
    label: "dailyHour",
    tdClass: "border",
    thClass: "border font-weigh-bold  text-dark"
  },
  {
    key: "eldSrType",
    label: "typeSurveyResult",
    tdClass: "border",
    thClass: "border font-weigh-bold  text-dark"
  }
];
</script>

<template>
  <div>
    <FormTabRow v-if="data?.tables" :fields="fields" :items="data.tables"> </FormTabRow>
  </div>
</template>
