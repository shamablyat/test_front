<template>
  <v-tabs v-model="tab" bg-color="lightprimary" align-tabs="center">
    <v-tab value="surveyResults">{{ $t("surveyResult") }}</v-tab>
    <v-tab value="surveyAnswers">{{ $t("surveyAnswer") }}</v-tab>
  </v-tabs>

  <v-window v-model="tab" class="py-2">
    <v-window-item value="surveyResults">
      <Result
        :actions="{
          isDelete: true,
          isEdit: true
        }"
      />
    </v-window-item>

    <v-window-item value="surveyAnswers">
      <v-row>
        <v-col cols="8">
          <v-table fixedHeader height="540">
            <thead>
              <tr>
                <th class="border">{{ $t("QuestionGroup") }}</th>
                <th class="border">{{ $t("questionText") }}</th>
                <th class="border">{{ $t("answerText") }}</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="group in store.getResult.surveyAnswers.totalAnswers">
                <tr>
                  <td class="bg-light border" :rowspan="group.eldSurveyAnswers.length + 1">
                    {{ group.title }}
                  </td>
                </tr>
                <template v-for="item in group.eldSurveyAnswers">
                  <tr>
                    <td class="bg-light border">{{ item.questionText }}</td>
                    <td class="bg-light border">{{ item.answerText }}</td>
                  </tr>
                </template>
              </template>
            </tbody>
          </v-table>
        </v-col>
        <v-col cols="4">
          <v-table fixedHeader height="540">
            <thead>
              <tr>
                <th class="border">{{ $t("QuestionAnswerTemplate") }}</th>
                <th class="border">{{ $t("count") }}</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="group in store.getResult.surveyAnswers.templateAnswers">
                <tr>
                  <td class="bg-light border">
                    {{ group.questionAnswerTemplateTable }}
                  </td>
                  <td class="bg-light border">
                    {{ group.count }}
                  </td>
                </tr>
              </template>
            </tbody>
          </v-table>
        </v-col>
      </v-row>
      <!-- <v-table fixedHeader>
        <thead>
          <tr>
            <th class="border">{{ $t("QuestionGroup") }}</th>
            <th class="border">{{ $t("questionText") }}</th>
            <th class="border">{{ $t("answerText") }}</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="group in result.surveyAnswers">
            <tr>
              <td :rowspan="group.surveyAnswers.length + 1">
                {{ group.title }}
              </td>
            </tr>
            <template v-for="item in group.surveyAnswers">
              <tr>
                <td class="bg-light border">{{ item.questionText }}</td>
                <td class="bg-light border">{{ item.answerText }}</td>
              </tr>
            </template>
          </template>
        </tbody>
      </v-table> -->
    </v-window-item>
  </v-window>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Result from "./Result.vue";
import { useSurvey } from "../store/useSurvey";
const tab = ref<"surveyResults" | "surveyAnswers" | "surveyResultAlgorithms">("surveyResults");

const store = useSurvey();
</script>
