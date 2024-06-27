<script setup lang="ts">
import { InfoCircleIcon, XIcon } from "vue-tabler-icons";
import { ISrService, ISrServiceLogs } from "../../../types";
import { IFields } from "@/models/basic";
import { ref } from "vue";
import FormTabRow from "@/components/form/FormTabRow.vue";

interface IProps {
  srService?: ISrService[];
  loading: boolean;
}

defineProps<IProps>();
const selectedResultModal = ref<boolean>(false);
const selectedResult = ref<ISrServiceLogs[]>([]);

const fields: IFields[] = [
  {
    key: "eldQuestionnaireGroup",
    label: "QuestionGroup",
    tdClass: "border ",
    thClass: "border "
  },
  {
    key: "eldQuestionnaireQuestion",
    label: "questionnaireQuestion",
    tdClass: "border",
    thClass: "border"
  },
  {
    key: "eldQuestionnaireAnswer",
    label: "questionnaireAnswer",
    tdClass: "border",
    thClass: "border"
  }
];

const setSelectedResult = (item: ISrServiceLogs[]) => {
  selectedResult.value = item;
  selectedResultModal.value = true;
};
</script>

<template>
  <div>
    <v-card elevation="0">
      <v-table fixed-header style="max-height: 450px">
        <thead>
          <tr>
            <th class="border font-weight-bold text-dark h5">
              {{ $t("questionnaireType") }}
            </th>
            <th class="border font-weight-bold text-dark h5">{{ $t("ElderlyService") }}</th>
            <th class="border font-weight-bold text-dark h5">{{ $t("actions") }}</th>
          </tr>
        </thead>
        <tbody v-if="!loading">
          <template v-for="item in srService">
            <tr>
              <td class="bg-light border font-weight-black" :rowspan="item.tables.length + 1">
                {{ item.eldSurveyQuestionnaireType }}
              </td>
            </tr>
            <template v-for="service in item.tables">
              <tr>
                <td>{{ service.elderlyService }}</td>
                <td class="border bg-light">
                  <div style="width: max-content" @click="setSelectedResult(service.logs)">
                    <v-tooltip activator="parent" location="top">
                      {{ $t("View") }}
                    </v-tooltip>
                    <InfoCircleIcon size="20" class="cursor-pointer" />
                  </div>
                </td>
              </tr>
            </template>
          </template>
        </tbody>
        <tbody class="text-center" v-if="!srService">
          <td class="font-weight-bold" colspan="3">
            {{ $t("NotFound") }}
          </td>
        </tbody>
      </v-table>
    </v-card>

    <v-dialog v-model="selectedResultModal" height="100%">
      <v-card height="100%" class="px-5 py-5">
        <v-card-title>
          <v-row>
            <v-col> </v-col>
            <v-col class="text-right py-0">
              <XIcon @click="selectedResultModal = false" class="cursor-pointer" />
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text>
          <FormTabRow :fields="fields" :items="selectedResult"> </FormTabRow>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<style lang="scss" scoped></style>
