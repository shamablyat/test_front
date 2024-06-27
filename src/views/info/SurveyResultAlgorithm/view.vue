<script setup lang="ts">
import { onBeforeUnmount } from "vue";
import { useSurveyResultAlgorithm } from "./store/useSurveyResultAlgorithm";
import { useRoute } from "vue-router";
import { useErrorToast } from "@/utils/helpers/useErrorToast";
import UiParentCard from "@/components/UiParentCard.vue";
import { useGlobal } from "@/composables/useGlobal";
import { SurveyResultAlgorithmService } from "@/services/info/SurveyResultAlgorithm.service";
import LogList from "@/components/LogList.vue";
import Tables from "./widgets/Tables.vue";
import FormCanButtons from "@/components/FormCanButtons.vue";
import ResultServices from "./widgets/ResultServices.vue";

const store = useSurveyResultAlgorithm();
const route = useRoute();
const { setError } = useErrorToast();

const { getColor } = useGlobal();

const id = route.params.id as string;

const permission = "EldSurveyResultAlgorithm";

store.setData({
  id,
  err(e) {
    setError(e);
  },
  cb() {}
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
    <UiParentCard v-if="store.getData && !store.getLoading">
      <v-row>
        <v-col cols="12" lg="6" class="py-1 d-flex">
          <v-label class="font-weight-bold">{{ $t("docNumber") }}: </v-label>
          <span class="ml-2">{{ store.getData.docNumber }}</span>
        </v-col>
        <v-col cols="12" lg="6" class="py-1 d-flex">
          <v-label class="font-weight-bold"> {{ $t("docOn") }}: </v-label>
          <span class="ml-2">{{ store.getData.docOn }}</span>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" lg="6" class="py-1 d-flex" v-if="!store.getData.isForBall">
          <v-label class="font-weight-bold">{{ $t("Questionnaire") }}: </v-label>
          <span class="ml-2">{{ store.getData.questionnaire }}</span>
        </v-col>
        <v-col cols="12" lg="6" class="py-1 d-flex">
          <v-label class="font-weight-bold"> {{ $t("organization") }}: </v-label>
          <span class="ml-2">{{ store.getData.organization }}</span>
        </v-col>
      </v-row>
      <v-row v-if="store.getData.isForBall">
        <v-col cols="12" lg="6" class="py-1 d-flex">
          <v-label class="font-weight-bold"> {{ $t("bartelQuestion") }}: </v-label>
          <span class="ml-2">{{ store.getData.bartelEldQuestionnaire }}</span>
        </v-col>
        <v-col cols="12" lg="6" class="py-1 d-flex" v-if="store.getData.isForBall">
          <v-label class="font-weight-bold"> {{ $t("lautonQuestion") }}: </v-label>
          <span class="ml-2">{{ store.getData.lautonEldQuestionnaire }}</span>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" lg="6" class="py-1 d-flex">
          <v-label class="font-weight-bold">{{ $t("status") }}: </v-label>
          <v-chip rounded="lg" :class="`font-weight-bold px-2  mx-2 bg-${getColor(store.getData)}`" size="small">
            {{ store.getData.status }}
          </v-chip>
        </v-col>
      </v-row>
    </UiParentCard>

    <UiParentCard class="mt-4" v-if="store.getData && !store.getLoading">
      <v-label class="font-weight-bold"> {{ $t("details") }} : </v-label>
      {{ store.getData?.details }}
    </UiParentCard>

    <UiParentCard class="mt-4" v-if="store.getData?.isForBall">
      <Tables isView title="tables" />
    </UiParentCard>
    <UiParentCard v-else class="mt-4">
      <ResultServices isView title="resultServices" />
    </UiParentCard>

    <LogList v-if="store.getData && store.getData.logList && store.getData.logList.length > 0" :logs="store.getData.logList" />
    <FormCanButtons v-if="store.getData" :service="SurveyResultAlgorithmService" :permission="permission" :data="store.getData" />
  </div>
</template>
