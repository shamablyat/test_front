<script setup lang="ts">
import i18n from "@/app/config/i18n";
import FormTabRow from "@/components/form/FormTabRow.vue";
import { ISelectList, ITableActions } from "@/models/basic";
import { SubmitEventPromise } from "vuetify";
import { useSurveyResultAlgorithm } from "../store/useSurveyResultAlgorithm";
import { notify } from "@kyvg/vue3-notification";
import { computed } from "vue";

interface IProps {
  actions?: ITableActions;
  isView?: boolean;
  title?: string;
}

defineProps<IProps>();

const addRow = async (submit: SubmitEventPromise) => {
  const { valid } = await submit;

  if (valid) {
    if (!store.data?.isForBall) {
      if (store.data?.tables.some((el) => el.eldSurveyResultTypeId === store.tables.eldSurveyResultTypeId)) {
        notify({
          // @ts-ignore
          text: i18n.global.t("includedSurveyResultType"),
          type: "warn"
        });
        return;
      }
    }

    store.addRow("tables");
  }
};

const store = useSurveyResultAlgorithm();
store.setSurveyResultTypeSelectList();

const fields = [
  {
    key: "eldSurveyResultType",
    // @ts-ignore
    label: i18n.global.t("eldSurveyResultType")
  },
  {
    key: "fromBall",
    label: i18n.global.t("fromBall")
  },
  {
    key: "toBall",
    label: i18n.global.t("toBall")
  },
  {
    key: "dayCount",
    label: i18n.global.t("day")
  },
  {
    key: "dailyHour",
    label: i18n.global.t("dailyHour")
  },
  {
    key: "action",
    label: i18n.global.t("actions")
  }
];

const setField = (value: ISelectList, key: string) => {
  if (value) {
    // @ts-ignore
    store.tables[key + "Id"] = value.value;
    // @ts-ignore
    store.tables[key] = value.text;
  }
};

const fromMoreThanTo = () => {
  if (store.tables && store.tables.fromBall && store.tables.toBall) {
    store.tables.fromBall = +store.tables.fromBall > +store.tables.toBall ? store.tables.toBall : store.tables.fromBall;
  }
};

const calculateWeeklyHour = computed(() => {
  if (store.tables.dailyHour && store.tables.dayCount) {
    return Math.abs(store.tables.dayCount * store.tables.dailyHour).toFixed(2);
  }

  return null;
});

const setMaxValue = (value: string) => {
  if (value) {
    return +value > 7 ? (store.tables.dayCount = 7) : value;
  }
};

const parseWeeklyHour = (value: number | string | null) => {
  if (value) {
    let hour = String(value).split(".")[0];
    let min = String(value).split(".")[1];

    if (min && +min != 0) {
      return `${hour}${i18n.global.t("hms.h")}  ${min}  ${i18n.global.t("hms.m")}`;
    } else {
      return `${hour} ${i18n.global.t("hms.h")}`;
    }
  }
};
</script>

<template>
  <div v-if="store.getData">
    <h2 v-if="title">{{ $t(title) }}</h2>
    <h4 class="mt-3">{{ $t("weeklyHour") }} : {{ parseWeeklyHour(calculateWeeklyHour) || parseWeeklyHour(store.getData.weeklyHour) || 0 }}</h4>
    <FormTabRow
      :fields="fields"
      :items="store.getData.tables"
      v-model:editIndex="store.editIndex"
      :actions="actions"
      @editTabRow="(val) => store.editRow(val, 'tables')"
      @deleteTabRow="(val) => store.deleteRow(val, 'tables')"
      @clear-tab-row="store.clearTables()"
    >
      <v-form @submit.prevent="addRow" v-if="!isView">
        <v-row class="align-center mb-3">
          <v-col cols="12" lg="3" md="6" class="py-0">
            <form-select
              :label="$t('eldSurveyResultType')"
              v-model="store.getTables.eldSurveyResultTypeId"
              :list="store.getEldSurveyResultTypeList"
              required
              returnObject
              @update:model-value="(val:ISelectList) => setField(val, 'eldSurveyResultType')"
            />
          </v-col>
          <v-col class="py-0" cols="12" lg="3" md="6">
            <form-input
              required
              v-model="store.tables.fromBall"
              :label="$t('fromBall')"
              type="number"
              :step="0.1"
              :canAddZero="true"
              @update:model-value="fromMoreThanTo"
            />
          </v-col>
          <v-col cols="12" lg="3" md="6" class="py-0">
            <form-input
              v-model="store.tables.toBall"
              :label="$t('toBall')"
              required
              type="number"
              :step="0.1"
              :canAddZero="true"
              @update:model-value="fromMoreThanTo"
            />
          </v-col>
          <v-col class="py-0" cols="12" lg="3" md="6">
            <form-input
              required
              v-model="store.tables.dayCount"
              :canAddZero="true"
              mask="#"
              maxValue="7"
              @update:model-value="setMaxValue"
              :label="$t('day')"
            />
          </v-col>

          <v-col class="py-0" cols="12" lg="3" md="6">
            <form-input required v-model="store.tables.dailyHour" :canAddZero="true" type="number" :label="$t('dailyHour')" />
          </v-col>

          <div class="py-0 mt-1">
            <v-btn :text="store.editIndex > -1 ? $t('Save') : $t('AddRow')" type="submit" :color="store.editIndex > -1 ? 'success' : 'info'" />
          </div>
        </v-row>
      </v-form>
    </FormTabRow>
  </div>
</template>
