<script setup lang="ts">
import { ref } from "vue";
import { IReportByDayBody, IWorkerColumns } from "../types";
import SelectedPerson from "./SelectedPerson.vue";
import { useWorkerReport } from "../store/useWorkerReport";
import { useErrorToast } from "@/utils/helpers/useErrorToast";

type Type = "create" | "view";

interface IProps {
  columns: IWorkerColumns;
  loading: boolean;
  rows: any;
}
const store = useWorkerReport();
defineProps<IProps>();

const emits = defineEmits<{
  (e: "refresh"): void;
}>();

const rowspan = ref(2);
const isModal = ref<boolean>(false);

const setIsModal = () => {
  isModal.value = !isModal.value;
};

const { setError } = useErrorToast();
const setDetail = (item: any, day: any, type: Type) => {
  if (new Date(item.startDateIso).getTime() > new Date(day.dateOnIso).getTime()) {
    return;
  }

  if (type === "create") {
    store.setIsView(false);
    const body: IReportByDayBody = {
      elderlyManageId: item.elderlyManageId,
      dateOn: day.dateOn
    };
    store.setReportByBody(body);
    store.setReportByDay({
      err: (e) => {
        setError(e);
        isModal.value = false;
      }
    });
  } else {
    store.setIsView(true);
    store.getReport({
      id: day.workerReportId,
      err: (e) => {
        isModal.value = false;
        setError(e);

        store.setIsView(false);
      }
    });
  }

  setIsModal();
};

// const parseDay = (d: string | number) => {
//   if (isFirefox) {
//     return new Date(`${new Date().getFullYear()}-${d.toString().split(".").reverse().join("-")}`).getTime();
//   }
//   return new Date(`${d.toString().split(".").reverse().join(".")}.${new Date().getFullYear()}`).getTime();
// };

const formatDateWithOffset = (date: Date | string): Date | string => {
  const now = new Date(date);

  // Set time to 00:00:00.000
  now.setHours(5, 0, 0, 0);

  // Get the ISO date part (YYYY-MM-DD)
  const datePart = now.toISOString().split("T")[0];

  // Manually format the time part
  const timePart = "00:00:00.0000000";
  // 2024-05-29T00:00:00.0000000+05:00

  // Get the timezone offset in hours and minutes
  const offset = now.getTimezoneOffset();
  const offsetHours = Math.abs(Math.floor(offset / 60))
    .toString()
    .padStart(2, "0");
  const offsetMinutes = (Math.abs(offset) % 60).toString().padStart(2, "0");
  const offsetSign = offset > 0 ? "-" : "+";

  // Combine all parts
  const formattedDate = `${datePart}T${timePart}${offsetSign}${offsetHours}:${offsetMinutes}`;

  return formattedDate;
};

const isCreate = (day: any) => {
  const now = formatDateWithOffset(new Date());
  return (
    // new Date(day.dateOnIso).getTime() <= (item.endDate ? new Date(item.endDateIso).getTime() : new Date().getTime()) &&new Date(item.startDateIso).getTime() <= new Date(day.dateOnIso).getTime()
    new Date(day.dateOnIso).getTime() === new Date(now).getTime()
  );
};
</script>

<template>
  <div>
    <v-card elevation="0" class="border">
      <v-table fixed-header height="540" density="compact">
        <thead>
          <tr>
            <th :rowspan="rowspan" class="h6 font-weight-bold no-wrap border">
              {{ $t("ordernumber") }}
            </th>
            <th :rowspan="rowspan" class="h6 font-weight-bold border">
              {{ $t("fio") }}
            </th>
            <th :rowspan="rowspan" class="h6 font-weight-bold border">
              {{ $t("livingAddress") }}
            </th>
            <th :rowspan="rowspan" class="h6 font-weight-bold border">
              {{ $t("elderlyCategory") }}
            </th>
            <th :rowspan="rowspan" class="h6 font-weight-bold border">
              {{ $t("phoneNumber") }}
            </th>
            <th :colspan="Object.keys(columns).length" class="h6 font-weight-bold border">
              {{ $t("assistantServiceConfirm") }}
            </th>
            <th :rowspan="rowspan" colspan="2" style="white-space: nowrap; min-width: 150px" class="h6 font-weight-bold border">
              {{ $t("extraInfo") }}
            </th>
          </tr>
          <tr>
            <th v-for="column in columns" class="no-wrap border">
              {{ `${column.split("/")[0]} / ${$t(column.split("/")[1].toLowerCase())}` }}
            </th>
          </tr>
        </thead>
        <tbody v-if="!loading && rows">
          <template v-for="(item, index) in rows" :key="index">
            <tr>
              <td class="border" :rowspan="rowspan">{{ index + 1 }}</td>
              <td class="border" :rowspan="rowspan">
                {{ item.elderlyFullName }}
              </td>
              <td class="border" :rowspan="rowspan">
                {{ item.elderlyLivingAddress }}
              </td>
              <td class="border" :rowspan="rowspan">
                {{ item.elderlyCategory }}
              </td>
              <td class="border" :rowspan="rowspan">
                {{ item.elderlyPhoneNumber || "-" }}
              </td>
              <td v-for="day in item.days" class="border py-4">
                <div>
                  {{ day.scheduleServices }}
                </div>
                <div class="font-weight-bold d-block mt-3">{{ $t("done") }} : {{ day.servicePercentage }}%</div>
              </td>
              <td colspan="2" :rowspan="rowspan">
                {{ item.details || "-" }}
              </td>
            </tr>
            <tr>
              <td v-for="(day, dayIndex) in item.days" class="border text-right">
                <!-- v-if="
                    new Date(item.startDateIso).getTime() <= new Date(day.dateOnIso).getTime() &&
                    new Date().getTime() >= new Date(day.dateOnIso).getTime()
                  " -->
                <div @dblclick="setDetail(item, day, isCreate(dayIndex) && day.scheduleServices ? 'create' : 'view')">
                  <!-- && day.scheduleServices && day.servicePercentage !== 100 -->
                  <div v-if="isCreate(day)  && day.scheduleServices && day.servicePercentage !== 100" @click="setDetail(item, day, 'create')" class="cursor-pointer">
                    <v-icon> mdi mdi-plus </v-icon>
                    <v-tooltip activator="parent" location="top">
                      {{ $t("Create") }}
                    </v-tooltip>
                  </div>
                  <div
                    v-else-if="
                      item.endDateIso
                        ? new Date(item.startDateIso).getTime() <= new Date(day.dateOnIso).getTime() &&
                          new Date(day.dateOnIso).getTime() <= new Date(item.endDateIso).getTime()
                        : new Date(item.startDateIso).getTime() <= new Date(day.dateOnIso).getTime() && day.servicePercentage == 100
                    "
                    @click="setDetail(item, day, 'view')"
                    class="d-block mt-auto ml-auto cursor-pointer"
                    style="width: max-content"
                  >
                    <v-icon> mdi mdi-eye-outline </v-icon>

                    <v-tooltip activator="parent" location="top">
                      {{ $t("watch") }}
                    </v-tooltip>
                  </div>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
        <tbody class="text-center" v-if="loading">
          <td colspan="12" class="text-center py-2">
            <v-progress-circular indeterminate></v-progress-circular>
          </td>
        </tbody>
        <tbody v-if="rows && rows.length === 0 && !loading">
          <td colspan="12" class="font-weight-bold h5 text-center">
            {{ $t("NotFound") }}
          </td>
        </tbody>
      </v-table>
    </v-card>

    <!-- REPORT MODAL -->
    <v-dialog persistent v-model="isModal" height="100%">
      <SelectedPerson @set-is-modal="setIsModal" @refresh="emits('refresh')" />
    </v-dialog>
  </div>
</template>

<style scoped lang="scss">
.no-wrap {
  white-space: nowrap;
}
</style>
