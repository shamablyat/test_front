<script setup lang="ts">
import { useSurvey } from "./store/useSurvey";
import { useRouter } from "vue-router";
import { useErrorToast } from "@/utils/helpers/useErrorToast";
import UiParentCard from "@/components/UiParentCard.vue";
import { onBeforeUnmount, ref } from "vue";
import { useGlobal } from "@/composables/useGlobal";
import { notify } from "@kyvg/vue3-notification";
import i18n from "@/app/config/i18n";
import QuestionnaireGroups from "./widgets/QuestionnaireGroups.vue";
import LogList from "@/components/LogList.vue";
import { SurveyService } from "@/services/document/Survey.service";
import FormCanButtons from "@/components/FormCanButtons.vue";
import { XIcon } from "vue-tabler-icons";

interface IProps {
  id: number | string;
  elderlyVerificationId: number | string;
  isShowFooter?: boolean;
  isView?: boolean;
}
const props = defineProps<IProps>();

const store = useSurvey();
const { getColor } = useGlobal();
const router = useRouter();
const { setError } = useErrorToast();
const permission = "EldSurvey";
const isComplete = ref<boolean>(false);
const saveLoading = ref<boolean>(false);
const isCompleteLoading = ref<boolean>(false);

const getFalseValues = (list: any[], key: string): boolean => {
  return list.some((el) => el[key] == true);
};

const refreshData = () => {
  store.setData({
    id: props.id,
    err(e) {
      setError(e);
    },
    cb() {}
  });
};

const completeSurveyAndGetInfo = () => {
  if (store.getData) {
    for (let i = 0; i < store.getData.eldSurveyGroups.length; i++) {
      let group = store.getData.eldSurveyGroups[i];
      for (let j = 0; j < group.eldSurveyQuestions.length; j++) {
        let question = group.eldSurveyQuestions[j];
        // CHECK TO CAN CHECK ANSWER
        if (question.answerTypeId !== 3 && question.isVisible && question.isRequired && !getFalseValues(question.eldSurveyAnswers, "isChecked")) {
          notify({
            // @ts-ignore
            text: i18n.global.t("mustAddAnswer", {
              questionText: question.questionText,
              questionNumber: `${i + 1}. ${j + 1}`
            }),
            type: "warn"
          });
          isComplete.value = false;
          return;
        }
        // CHECK TO TEXT ANSWER
        if (
          question.answerTypeId === 3 &&
          question.isRequired &&
          !question.isVisible &&
          question.eldSurveyAnswers.some((el) => el.textAnswer?.length == 0)
        ) {
          notify({
            // @ts-ignore
            text: i18n.global.t("mustAddAnswer", {
              questionText: question.questionText,
              questionNumber: `${i + 1}. ${j + 1}`
            }),
            type: "warn"
          });
          isComplete.value = false;

          return;
        }
      }
    }

    isCompleteLoading.value = true;
    store.completeSurvey(
      () => {
        notify({
          // @ts-ignore
          text: i18n.global.t("completedSuccess"),
          type: "success"
        });
        isComplete.value = true;

        refreshData();
      },
      (e) => {
        setError(e);
      },
      () => {
        isCompleteLoading.value = false;
      }
    );
  }
};

const saveResult = () => {
  saveLoading.value = true;

  SurveyService.SaveResults(store.result)
    .then(() => {
      isComplete.value = false;
      router.push({
        name: "Survey"
      });
    })
    .catch((e) => {
      setError(e);
    })
    .finally(() => {
      saveLoading.value = false;
    });
};

store.setQuestionnaires();
refreshData();

onBeforeUnmount(() => {
  store.$reset();
});
</script>

<template>
  <div>
    <UiParentCard v-if="store.getLoading" class="text-center">
      <v-progress-circular indeterminate></v-progress-circular>
    </UiParentCard>
    <div v-if="store.getData && !store.getLoading">
      <UiParentCard v-if="store.getData">
        <v-row>
          <v-col cols="6" class="py-0 d-flex">
            <v-label class="mb-2 font-weight-bold">{{ $t("docNumber") }}: </v-label>
            <span class="ml-1">{{ store.getData.docNumber }}</span>
          </v-col>
          <v-col cols="6" class="py-0 d-flex">
            <v-label class="mb-2 font-weight-bold"> {{ $t("docOn") }}: </v-label>
            <span class="ml-1">{{ store.getData.docOn }}</span>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6" class="py-0 d-flex align-center">
            <v-label class="mb-2 font-weight-bold"  style="white-space: nowrap; width: max-content;" > {{ $t("organization") }}: </v-label>
            <span class="ml-1" style="flex: 1;" >{{ store.getData.organization || "-" }}</span>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6" class="py-0 d-flex">
            <v-label class="mb-2 font-weight-bold">{{ $t("startDate") }}: </v-label>
            <span class="ml-1">{{ store.getData.startAt || "-" }}</span>
          </v-col>
          <v-col cols="6" class="py-0 d-flex">
            <v-label class="mb-2 font-weight-bold"> {{ $t("endDate") }}: </v-label>
            <span class="ml-1">{{ store.getData.endAt || "-" }}</span>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6" class="py-0 d-flex">
            <v-label class="mb-2 font-weight-bold">{{ $t("status") }}: </v-label>
            <v-chip rounded="lg" :class="`font-weight-bold px-2  mx-2 bg-${getColor(store.getData)}`" size="small">
              {{ store.getData.status }}
            </v-chip>
          </v-col>
        </v-row>
      </UiParentCard>
      <QuestionnaireGroups
        v-if="store.getData && !!store.getData.startAt"
        isView
        :data="store.getData.eldSurveyGroups"
        :algorithms="store.getData.eldAlgorithms"
      />

      <LogList v-if="store.getData && store.getData.logList && store.getData.logList.length > 0" :logs="store.getData.logList" />

      <FormCanButtons v-if="isShowFooter" :service="SurveyService" :permission="store.getData.endAt ? permission : ''" :data="store.getData">
        <v-btn v-if="store.getData && !store.getData.endAt" color="success" class="mr-4" @click="completeSurveyAndGetInfo" variant="flat">
          {{ $t("completeSurvey") }}
        </v-btn>
      </FormCanButtons>

      <v-dialog v-model="isComplete" persistent height="100%">
        <v-card height="100%" class="px-5 py-5">
          <v-card-title>
            <v-row>
              <v-col>
                <h2>{{ $t("surveyResult") }}</h2>
              </v-col>
              <v-col class="text-right">
                <XIcon class="cursor-pointer" size="32" @click="isComplete = false" />
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text>
            <Tabs />
          </v-card-text>
          <v-card-actions>
            <v-row>
              <v-col>
                <v-btn :text="$t('Back')" variant="flat" color="error" @click="isComplete = false" />
              </v-col>
              <v-col class="text-right">
                <v-btn :text="$t('Save')" variant="flat" color="success" @click="saveResult" />
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>
