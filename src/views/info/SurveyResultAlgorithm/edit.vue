<script setup lang="ts">
import UiParentCard from "@/components/UiParentCard.vue";
import { useSurveyResultAlgorithm } from "./store/useSurveyResultAlgorithm";
import { SubmitEventPromise } from "vuetify";
import { useRoute, useRouter } from "vue-router";
import { useErrorToast } from "@/utils/helpers/useErrorToast";
import { defineAsyncComponent, onBeforeUnmount, ref } from "vue";
import { ISelectList, ITableActions } from "@/models/basic";
import { notify } from "@kyvg/vue3-notification";
import i18n from "@/app/config/i18n";
import { TypeTables } from "./types";
import { watch } from "vue";

const store = useSurveyResultAlgorithm();
const router = useRouter();
const route = useRoute();
const { setError } = useErrorToast();

const actions: ITableActions = {
  isDelete: true,
  isEdit: true
};

const activeTab = ref<TypeTables>("tables");

const resultServices: any = {
  title: "resultServices",
  component: defineAsyncComponent(() => import("./widgets/ResultServices.vue")),
  value: false
};

const tables: any = {
  title: "tables",
  component: defineAsyncComponent(() => import("./widgets/Tables.vue")),
  value: true
};

const tabsDef = [tables, resultServices];
const tabs = ref<any[]>([]);

const id = route.params.id as string;

store.setData({
  id,
  err(e) {
    setError(e);
  },
  cb() {}
});

store.setQuestionnaireList();
store.setQuestionnaireTypeList();

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
    if (store.getData) {
      if (store.getData.tables.length === 0 && store.getData.resultServices.length === 0) {
        notify({
          // @ts-ignore
          text: i18n.global.t("mustAddTable"),
          type: "warn"
        });
        return;
      }

      store.saveData({
        cb() {
          router.push({ name: "SurveyResultAlgorithm" });
        },
        err(e) {
          setError(e);
        }
      });
    }
  }
};

const setField = (value: ISelectList, key: string) => {
  if (value) {
    // @ts-ignore
    store.data[key + "Id"] = value.value;
    // @ts-ignore
    store.data[key] = value.text;
  }
};
const clearData = () => {
  if (store.data) {
    store.data.eldQuestionnaireId = null;
  }
  if (store.data) {
    store.data.tables = [];
    store.data.resultServices = [];
  }
};

const detectIsForBallUpdated = (value: boolean | undefined) => {
  const isFind = tabsDef.find((el) => el.value === value);
  if (isFind) {
    tabs.value = [];
    tabs.value.push(isFind);
    activeTab.value = isFind.title;
    store.clearTables();
    store.clearResultServices();
  }

  if (value) {
    store.setBartelAndLautonQuestions();
  }
};

const updateISForBall = (value: boolean | undefined) => {
  detectIsForBallUpdated(value);
  clearData();
};

watch(
  () => store.data?.isForBall,
  (value) => {
    detectIsForBallUpdated(value);
  }
);

watch(
  () => activeTab.value,
  () => {
    if (store.data) {
      store.editIndex = -1;
      store.clearResultServices();
      store.clearTables();
    }
  }
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
    <v-form @submit.prevent="saveData" v-if="store.getData">
      <UiParentCard>
        <v-row class="align-center">
          <v-col cols="12" lg="3" class="py-0">
            <form-picker clearable required v-model="store.getData.docOn" :label="$t('docOn')" />
          </v-col>
          <v-col cols="12" lg="3" class="py-0">
            <form-input required v-model="store.getData.docNumber" :label="$t('docNumber')" />
          </v-col>
          <v-col cols="12" lg="3">
            <form-checkbox :label="$t('tables')" v-model="store.getData.isForBall" @update:model-value="updateISForBall"></form-checkbox>
          </v-col>
          <Transition name="fade" mode="out-in">
            <v-col cols="12" lg="3" class="py-0" v-if="!store.getData.isForBall">
              <form-select
                required
                v-model="store.getData.eldQuestionnaireId"
                :label="$t('Questionnaire')"
                :list="store.getQuestionnaireList"
                returnObject
                @update:model-value="(val:ISelectList) =>{
                setField(val, 'eldQuestionnaire')
                store.setQuestionnaireGroups(val.value)
              }"
              />
            </v-col>
          </Transition>
        </v-row>
        <Transition name="fade" mode="out-in">
          <v-row v-if="store.data?.isForBall">
            <v-col cols="12" lg="3" class="mb-5 py-0">
              <form-select
                v-model="store.getData.bartelEldQuestionnaireId"
                returnObject
                :label="$t('bartelQuestion')"
                :list="store.bartelQuestions"
                @update:model-value="(val:ISelectList) => setField(val, 'bartelEldQuestionnaire')"
                required
              >
              </form-select>
            </v-col>
            <v-col cols="12" lg="3" class="mb-5 py-0">
              <form-select
                v-model="store.getData.lautonEldQuestionnaireId"
                :label="$t('lautonQuestion')"
                required
                returnObject
                :list="store.lautonQuestions"
                @update:model-value="(val:ISelectList) => setField(val, 'lautonEldQuestionnaire')"
              >
              </form-select>
            </v-col>
          </v-row>
        </Transition>
        <v-row>
          <v-col cols="12" class="">
            <v-label class="mb-2 font-weight-medium">
              {{ $t("details") }}
            </v-label>
            <v-textarea rows="1" :placeholder="$t('enterText')" v-model="store.getData.details" />
          </v-col>
        </v-row>
      </UiParentCard>

      <v-window v-model="activeTab">
        <v-window-item v-for="tab in tabs" :value="tab.title">
          <UiParentCard class="mt-4">
            <Transition name="fade" mode="out-in">
              <component :is="tab.component" :actions="actions" :title="tab.title" />
            </Transition>
          </UiParentCard>
        </v-window-item>
      </v-window>

      <!-- <Tables :actions="actions" /> -->

      <v-row class="mt-2 px-3">
        <v-btn color="error" variant="flat" @click="router.back()" :text="$t('Back')" />
        <v-spacer />
        <v-btn v-if="store.getData" color="success" :loading="store.getSaveLoading" variant="flat" type="submit" :text="$t('Save')" />
      </v-row>
    </v-form>
  </div>
</template>
