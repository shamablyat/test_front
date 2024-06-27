<script setup lang="ts">
import { useRouter } from "vue-router";
import { useSurvey } from "./store/useSurvey";
import { useErrorToast } from "@/utils/helpers/useErrorToast";
import UiParentCard from "@/components/UiParentCard.vue";
import { SubmitEventPromise } from "vuetify";
import { useManualStore } from "@/app/config/store/Manual";
import { onBeforeUnmount, ref, watch } from "vue";
import i18n  from "@/app/config/i18n";
import { notify } from "@kyvg/vue3-notification";
import { XIcon } from "vue-tabler-icons";
import QuestionnaireGroups from "./widgets/QuestionnaireGroups.vue";
import Tabs from "./widgets/Tabs.vue";
import { SurveyService } from "@/services/document/Survey.service";
import Doc from "./widgets/Doc.vue";
import { VForm } from "vuetify/components";

interface IProps {
  id: number | string;
  elderlyVerificationId: number | string;
  eldQuestionnaireType: string;
  isShowFooter?: boolean;
}

const emits = defineEmits<{
  (e: "createSurvey", id: string | number): void;
  (e: "changeRoute"): void;
  (e: "refreshData"): void;
  (e: "setStep"): void;
}>();

const props = defineProps<IProps>();

const isChanged = ref(false);
const cachedData = ref<any>();

const store = useSurvey();
const manualStore = useManualStore();
const cbId = ref<any>(null);
const router = useRouter();
const { setError } = useErrorToast();
cbId.value = parseInt(props.id as string) > 0 ? props.id : null;
const isComplete = ref<boolean>(false);
const isCompleteLoading = ref<boolean>(false);
const isModal = ref<boolean>(false);

const saveData = async (submit: SubmitEventPromise) => {
  const { valid, errors } = await submit;
  if (errors && errors.length > 0) {
    document
      // @ts-ignore
      .getElementById(errors[0].id)
      ?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "center"
      });
  }

  if (valid) {
    isCompleteLoading.value = false;
    const promise = new Promise((resolve, reject) => {
      store.saveData({
        cb(e) {
          if (cbId.value) {
            notify({
              // @ts-ignore
              text: i18n.global.t("SaveSuccess"),
              type: "success"
            });
            emits("changeRoute");
            emits("refreshData");
            emits("setStep");
            resolve("success");
          } else {
            if (e.result.id) {
              cbId.value = e.result.id;
              emits("createSurvey", e.result.id);
            }
          }
        },
        err(e) {
          setError(e);
          reject(e);
          emits("refreshData");
        }
      });
    });

    return promise;
  }
};

const startSurvey = () => {
  SurveyService.StartSurvey(cbId.value).then((res) => {
    store.setData({
      id: cbId.value,
      err() {},
      cb() {
        if (store.data) {
          store.data.eldSurveyGroups = res.data;
        }
      }
    });
  });
};

const getFalseValues = (list: any[], key: string): boolean => {
  return list.some((el) => el[key] == true);
};

const completeSurvey = () => {
  if (store.getData) {
    for (let i = 0; i < store.getData.eldSurveyGroups.length; i++) {
      let group = store.getData.eldSurveyGroups[i];
      for (let j = 0; j < group.eldSurveyQuestions.length; j++) {
        let question = group.eldSurveyQuestions[j];
        // CHECK TO CAN CHECK ANSWER
        if (question.answerTypeId !== 3 && question.isVisible && question.isRequired && !getFalseValues(question.eldSurveyAnswers, "isChecked")) {
          notify({
            // @ts-ignore
            text: i18n.global.t("requiredAnswer", {
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
            text: i18n.global.t("requiredAnswer", {
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
        isComplete.value = false;
        // isModal.value = true;
        notify({
          // @ts-ignore
          text: i18n.global.t("completedSuccess"),
          type: "success"
        });
        emits("changeRoute");
        emits("setStep");
      },
      (e) => {
        setError(e);
      },
      () => {
        isComplete.value = false;
        emits("refreshData");
      }
    );
  }
};

const get = () => {
  store.$reset();
  store.setData({
    id: props.id,
    elderlyVerificationId: props.elderlyVerificationId,
    questionnaireType: props.eldQuestionnaireType,
    err(e) {
      setError(e);
    },
    cb() {
      cachedData.value = JSON.parse(JSON.stringify(store.getData));
      manualStore.setRegions();
      store.setQuestionnaires();
    }
  });
};

const saveLoading = ref<boolean>(false);

const form = ref<Partial<typeof VForm>>();

defineExpose({
  saveData,
  form: form,
  isChanged: isChanged
});

watch(
  () => props.eldQuestionnaireType,
  () => {
    get();
  },
  { immediate: true }
);

watch(
  () => store.data,
  () => {
    isChanged.value = false;
    if (JSON.stringify(store.data) !== JSON.stringify(cachedData.value)) {
      isChanged.value = true;
    }
  },
  { deep: true }
);

onBeforeUnmount(() => {
  store.$reset();
});
</script>

<template>
  <div>
    <UiParentCard v-if="store.getLoading" class="text-center">
      <v-progress-circular indeterminate></v-progress-circular>
    </UiParentCard>

    <v-form @submit.prevent="saveData" ref="form">
      <div v-if="store.getData && !store.getLoading">
        <Doc />
        <UiParentCard
          class="mt-4 d-flex align-items-center justify-content-center text-center"
          v-if="store.getData && !store.getData.startAt && cbId"
        >
          <h3>{{ $t("clickForStartingTest") }}</h3>
          <v-btn class="mt-3" :text="$t('startTest')" color="success" @click="startSurvey" />
        </UiParentCard>

        <QuestionnaireGroups
          v-if="store.getData && !!store.getData.startAt"
          :data="store.getData.eldSurveyGroups"
          :algorithms="store.getData.eldAlgorithms"
          :end-at="store.getData.endAt"
          :is-view="!!store.getData.endAt"
        />

        <v-row class="mt-4 px-3">
          <v-btn :text="$t('Back')" color="error" @click="router.back()" v-if="isShowFooter" />
          <v-spacer />
          <div>
            <v-dialog v-model="isComplete" width="450">
              <template #activator="{ props }">
                <v-btn
                  v-if="store.getData && cbId && store.getData.startAt && !store.getData.endAt"
                  :text="$t('completeSurvey')"
                  color="success"
                  v-bind="props"
                />
              </template>
              <v-card class="pa-5" height="100%">
                <v-card-title>
                  <v-row>
                    <v-col> </v-col>
                    <v-col class="text-right py-0">
                      <XIcon @click="isComplete = false" class="cursor-pointer" />
                    </v-col>
                  </v-row>
                </v-card-title>
                <v-card-text>
                  <h3 class="text-center font-weight-bold">
                    {{ $t("areUComplete") }}
                  </h3>
                  <v-row class="mt-2">
                    <v-col cols="6">
                      <v-btn :text="$t('no')" variant="flat" color="error" :loading="isCompleteLoading" class="w-100" @click="isComplete = false" />
                    </v-col>
                    <v-col cols="6">
                      <v-btn :text="$t('yes')" variant="flat" color="success" :loading="isCompleteLoading" class="w-100" @click="completeSurvey" />
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-dialog>
          </div>
          <v-btn
            v-if="!store.getData.endAt"
            class="mx-5"
            :text="cbId ? $t('Save') : $t('createSurvey')"
            color="success"
            type="submit"
            :loading="store.getSaveLoading"
          />
        </v-row>
      </div>
    </v-form>

    <v-dialog v-model="isModal" persistent height="100%">
      <v-card height="100%" class="px-5 py-5">
        <v-card-title>
          <v-row>
            <v-col>
              <h2>{{ $t("surveyResult") }}</h2>
            </v-col>
            <v-col class="text-right">
              <XIcon class="cursor-pointer" size="32" @click="isModal = false" />
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text>
          <Tabs />
        </v-card-text>
        <v-card-actions>
          <v-row>
            <v-col>
              <v-btn :text="$t('Back')" variant="flat" color="error" @click="isModal = false" />
            </v-col>
            <v-col class="text-right">
              <v-btn :text="$t('Save')" variant="flat" color="success" @click="saveData" :loading="saveLoading" />
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<style>
.v-card-title {
  white-space: pre-wrap;
}
</style>
