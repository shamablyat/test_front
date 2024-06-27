<script setup lang="ts">
import { useRoute } from "vue-router";
import { useQuestionnaire } from "./store/useQuestionnaire";
import { useErrorToast } from "@/utils/helpers/useErrorToast";
import UiParentCard from "@/components/UiParentCard.vue";
import { useGlobal } from "@/composables/useGlobal";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { QuestionnaireService } from "@/services/info/Questionnaire.service";
import { IUseQuestionnaireAlgorithm } from "./types";
import Algorithm from "./widgets/Algorithm.vue";
import LogList from "@/components/LogList.vue";
import QuestionnaireGroup from "./widgets/QuestionnaireGroup.vue";
import FormCanButtons from "@/components/FormCanButtons.vue";

const route = useRoute();
const { getColor } = useGlobal();
const store = useQuestionnaire();
const { setError } = useErrorToast();

const id = route.params.id as string;
const permission = "EldQuestionnaire";
const isAlgorithm = ref(false);

const selectedQuestionGroup = ref<any>();
const selectedQuestion = ref<any>();

const saveCondition = (value: IUseQuestionnaireAlgorithm[]) => {
  if (store.data) {
    store.data.eldAlgorithms = [...value];
  }
};

onMounted(() => {
  store.setData({
    id,
    err(e) {
      setError(e);
    },
    cb() {}
  });
});

onBeforeUnmount(() => {
  store.$reset();
});
</script>

<template>
  <div>
    <UiParentCard v-if="store.getLoading" class="text-center">
      <v-progress-circular indeterminate></v-progress-circular>
    </UiParentCard>
    <UiParentCard v-if="store.getData">
      <v-row>
        <v-col cols="12" lg="6" class="py-0 d-flex">
          <v-label class="mb-2 font-weight-bold">{{ $t("docNumber") }}: </v-label>
          <span>{{ store.getData.docNumber }}</span>
        </v-col>
        <v-col cols="12" lg="6" class="py-0 d-flex">
          <v-label class="mb-2 font-weight-bold"> {{ $t("docOn") }}: </v-label>
          <span>{{ store.getData.docOn }}</span>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" lg="6" class="py-0 d-flex">
          <v-label class="mb-2 font-weight-bold">{{ $t("questionnaireType") }}: </v-label>
          <span>{{ store.getData.eldQuestionnaireType }}</span>
        </v-col>
        <v-col cols="12" lg="6" class="py-0 d-flex">
          <v-label class="mb-2 font-weight-bold"> {{ $t("questionTitle") }}: </v-label>
          <span>{{ store.getData.title }}</span>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" lg="6" class="py-0 d-flex">
          <v-label class="mb-2 font-weight-bold">{{ $t("status") }}: </v-label>
          <v-chip rounded="lg" :class="`font-weight-bold px-2  mx-2 bg-${getColor(store.getData)}`" size="small">
            {{ store.getData.status }}
          </v-chip>
        </v-col>
      </v-row>
    </UiParentCard>
    <QuestionnaireGroup is-view />

    <LogList v-if="store.getData && store.getData.logList" :logs="store.getData.logList" />

    <FormCanButtons v-if="store.getData" :service="QuestionnaireService" :permission="permission" :data="store.getData" />

    <!-- MODAL -->
    <v-dialog v-model="isAlgorithm" height="100%">
      <Algorithm
        class="h-100"
        v-if="store.getData"
        :question="selectedQuestion"
        :data-algorithms="store.getData?.eldAlgorithms"
        :group="selectedQuestionGroup"
        v-model:model-value="isAlgorithm"
        @save="saveCondition"
        view
      />
    </v-dialog>
  </div>
</template>

<style lang="scss" scoped>
.answer {
  counter-increment: section;
}

ul {
  counter-reset: index;
  list-style-type: none;
}

.answerText {
  display: flex;
  align-items: center;
  position: relative;

  &::before {
    counter-increment: index;
    content: counters(index, ".", upper-alpha);
    margin-right: 10px;
  }
}
</style>
