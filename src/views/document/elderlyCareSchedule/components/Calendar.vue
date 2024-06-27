<script setup lang="ts">
import { useElderlySchedule } from "../store/useCareSchedule";
import UiParentCard from "@/components/UiParentCard.vue";
import { EditIcon, TrashIcon } from "vue-tabler-icons";
import { SubmitEventPromise } from "vuetify";
import i18n  from "@/app/config/i18n";
import { ISelectList } from "@/models/basic";
import { IElderlyScheduleTabRow } from "../types";
import DatePicker from "vue-datepicker-next";
import { WEEK_DAYS } from "@/utils/constants";
import { ref } from "vue";

interface IProps {
  isView?: boolean
}

defineProps<IProps>()

const store = useElderlySchedule();
const edit = (service: number, item: IElderlyScheduleTabRow) => {
  store.setTabRow(service, item);
};

const addRow = async (submit: SubmitEventPromise) => {
  const { valid } = await submit;
  if (valid) {
    store.setTables(store.getTabRow);
    store.clearTabRow();
  }
};

const getByName = (list: ISelectList[], id: number) => {
  const obj = list.find((el) => el.value === id);

  if (!obj) return "";

  return obj.text;
};

const hours = ref();
hours.value = Array.from({ length: 13 }).map((_, i) => i + 9);

const format = "HH:mm";
const mask = "DD.MM.YYYY";
const customRules = [
  (value: any) => {
    if (value) return true;
    // @ts-ignore
    return i18n.global.t("fieldNotEmpty");
  }
];

// const isGoBreakfast = (date: any) => {
//   return (
//     date < new Date(new Date().setHours(13, 59, 59, 59)) &&
//     date > new Date(new Date().setHours(12, 59, 59, 59))
//   );
// };

// const timeOnShortDay = (day: any) => {
//   store.tabRow.beginAt = "";
//   store.tabRow.endAt = "";
//   if (day == 6 || day == 7) {
//     return (hours.value = Array.from({ length: 7 }).map((_, i) => i + 9));
//   }

//   return (hours.value = Array.from({ length: 10 }).map((_, i) => i + 9));
// };

const itemText = (item: any) => {
  // @ts-ignore
  return i18n.global.t(item.text);
};
</script>

<template>
  <div>
    <UiParentCard class="mt-4" v-if="store.getData && store.getData?.assistantPerson">
      <v-form @submit.prevent="addRow" v-if="!isView">
        <v-row class="align-center">
          <v-col cols="12" lg="2" md="6" class="py-0">
            <form-select :list="store.getElderlyServiceList" v-model="store.getTabRow.elderlyServiceId" :label="$t('ElderlyService')" required />
          </v-col>
          <v-col cols="12" lg="2" md="6" class="py-0">
            <form-select :list="WEEK_DAYS" v-model="store.getTabRow.weekDayOn" :label="$t('weekDays')" :itemTitle="itemText" required>
              <!-- @update:model-value="timeOnShortDay" -->
            </form-select>
          </v-col>
          <v-col cols="12" lg="2" md="6" class="py-0">
            <div :style="`--divider: -50%;`">
              <v-label class="mb-2 font-weight-medium">
                {{ $t("startTime") }}
                <span class="text-error"> * </span>
              </v-label>
              <DatePicker
                v-model="store.getTabRow.beginAt"
                :placeholder="$t('timeFormat')"
                type="time"
                :hour-options="hours"
                :format="format"
                value-type="format"
                v-mask="mask"
                class="w-100"
                v-model:value="store.getTabRow.beginAt"
              >
                <template #input>
                  <v-text-field
                    class="w-100"
                    v-mask="mask"
                    :rules="customRules"
                    variant="outlined"
                    v-model="store.getTabRow.beginAt"
                    :placeholder="$t('timeFormat')"
                    color="primary"
                    validate-on="submit lazy"
                  ></v-text-field>
                </template>
              </DatePicker>
            </div>
            <!-- <form-picker
              format="HH:mm"
              required
              v-model="store.getTabRow.beginAt"
              :label="$t('startTime')"
              :placeholder="$t('timeFormat')"
              type="time"
              :hour-options="hours"
            /> -->
          </v-col>
          <v-col cols="12" lg="2" md="6" class="py-0">
            <div :style="`--divider: -50%;`">
              <v-label class="mb-2 font-weight-medium">
                {{ $t("endTime") }}
                <span class="text-error"> * </span>
              </v-label>
              <DatePicker
                v-model="store.getTabRow.beginAt"
                :placeholder="$t('timeFormat')"
                type="time"
                :hour-options="hours"
                :format="format"
                value-type="format"
                v-mask="mask"
                class="w-100"
                v-model:value="store.getTabRow.endAt"
              >
                <!-- :disabled-time="isGoBreakfast" -->
                <template #input>
                  <v-text-field
                    class="w-100"
                    v-mask="mask"
                    :rules="customRules"
                    variant="outlined"
                    v-model="store.getTabRow.endAt"
                    :placeholder="$t('timeFormat')"
                    color="primary"
                    validate-on="submit lazy"
                  ></v-text-field>
                </template>
              </DatePicker>
            </div>
          </v-col>
          <v-col cols="12" lg="2" md="6" class="py-0">
            <v-label class="mb-2 font-weight-medium">
              {{ $t("details") }}
            </v-label>
            <v-textarea rows="1" v-model="store.getTabRow.details" />
          </v-col>
          <v-col cols="12" lg="2" md="6" class="py-0">
            <v-btn :color="store.getEditIndex > -1 ? 'success' : 'info'" type="submit">
              {{ $t(store.getEditIndex > -1 ? $t("Save") : $t("AddRow")) }}
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </UiParentCard>
    <UiParentCard class="mt-4" v-if="store.getData && store.getData.tables">
      <v-table fixed-header>
        <thead>
          <tr>
            <th>{{ $t("ordernumber") }}</th>
            <th>{{ $t("serviceType") }}</th>
            <th v-for="day in WEEK_DAYS">{{ $t(day.text) }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(service, serviceIndex) in Object.keys(store.getTables)" :key="serviceIndex">
            <td>{{ serviceIndex + 1 }}</td>
            <td>
              {{ getByName(store.getElderlyServiceList, +service) }}
            </td>
            <td v-for="w in WEEK_DAYS">
              <template v-for="(item, index) in store.getTables[service]">
                <div v-if="w.value === item.weekDayOn">
                  <span v-if="item.beginAt || item.endAt">
                    {{ item.beginAt }} -
                    {{ item.endAt }}
                  </span>
                  <h4 v-if="item.details">
                    {{ $t("details") }}:
                    <v-textarea class="mt-1" readonly v-model="item.details" style="font-size: 12px !important; min-width: 196px;"> </v-textarea>
                  </h4>
                  <div class="text-right d-flex ml-auto">
                    <div class="edit" @click="edit(+service, item)" v-if="store.getEditIndex < 0">
                      <EditIcon size="14" style="cursor: pointer" />
                      <v-tooltip activator="parent" location="top">
                        {{ $t("Edit") }}
                      </v-tooltip>
                    </div>
                    <div @click="store.deleteTabRow(item.elderlyServiceId, index)" v-if="store.getEditIndex < 0">
                      <TrashIcon size="14" style="cursor: pointer" />
                      <v-tooltip activator="parent" location="top">
                        {{ $t("Delete") }}
                      </v-tooltip>
                    </div>
                  </div>
                </div>
              </template>
            </td>
          </tr>
        </tbody>
      </v-table>
    </UiParentCard>
  </div>
</template>

<style lang="scss" scoped>
.v-table {
  td {
    border: 1px solid rgba(0, 0, 0, 0.2);
  }
  th {
    border-right: 1px solid rgba(0, 0, 0, 0.2);
    text-align: center !important;
  }
}
</style>
