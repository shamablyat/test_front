<script setup lang="ts">
import { useElderlyRegister } from "../store/useElderlyRegister";
import { SubmitEventPromise } from "vuetify";
import { notify } from "@kyvg/vue3-notification";
import { useI18n } from "vue-i18n";
import { ref } from "vue";
import FormTabRow from "@/components/form/FormTabRow.vue";
import { ITableActions } from "@/models/basic";
import ElderlyManage from "./ElderlyManage.vue";
import { useRoute } from "vue-router";
import UiParentCard from "@/components/UiParentCard.vue";
import { ChevronRightIcon } from "vue-tabler-icons";

const store = useElderlyRegister();
const { t } = useI18n();
const route = useRoute();

const unregisterId = (route.query.unregisterId as string) || "";

const actions: ITableActions = {
  isDelete: true,
  isEdit: true
};

const fields = [
  { key: "person", label: "fio" },
  { key: "elderlyReason", label: "elderlyReason" },
  { key: "action", label: "actions" }
];

const isModal = ref(false);

const addRow = async (submit: SubmitEventPromise) => {
  const { valid } = await submit;

  if (valid) {
    if (!store.getOutTabRow.personId) {
      notify({
        text: t("userNotAccepted"),
        type: "warn"
      });
      return;
    }
    store.addOutTableRow({
      err(text: string) {
        notify({
          text: t(text),
          type: "warn"
        });
      }
    });
  }
};
</script>

<template>
  <div>
    <FormTabRow
      v-if="!unregisterId"
      :fields="fields"
      :items="store.getData.outTables"
      :actions="actions"
      :edit-index="store.getEditIndex2"
      @update:edit-index="
        () => {
          store.editedIndex2 = -1;
          store.clearTabRow(2);
        }
      "
      @edit-tab-row="(item) => store.edit(item, 'out')"
      @delete-tab-row="(index) => store.deleteTable(index, 'out')"
    >
      <v-form @submit.prevent="addRow">
        <v-row class="align-center">
          <v-col cols="12">
            <v-dialog v-model="isModal" persistent>
              <template #activator="{ props }">
                <v-btn color="primary" v-bind="props" v-if="!unregisterId">
                  {{ $t("selectElderlyManage") }}
                </v-btn>
              </template>
              <ElderlyManage @set-is-modal="isModal = false" />
            </v-dialog>
          </v-col>
        </v-row>

        <v-row v-if="store.getOutTabRow && store.getOutTabRow.person && store.getOutTabRow.person.fullName">
          <v-col cols="6" lg="2" md="4">
            <img
              :class="{
                isDeath: store.getOutTabRow?.person?.isDeath
              }"
              style="width: 70%"
              :src="store.getManagePhoto"
              alt=""
            />
          </v-col>
          <v-col cols="12" lg="6">
            <v-card variant="outlined" class="py-2">
              <v-list-item value="wifi" color="primary">
                <div class="d-flex align-center">
                  <ChevronRightIcon size="22" stroke-width="1.5" class="mr-2" />
                  <div class="ml-3">
                    {{ t("fullName") }}
                  </div>
                  <div class="ml-auto" style="font-weight: bold">
                    {{ store.getOutTabRow.person.fullName }}
                  </div>
                </div>
              </v-list-item>

              <v-list-item value="wifi" color="primary">
                <div class="d-flex align-center">
                  <ChevronRightIcon size="22" stroke-width="1.5" class="mr-2" />
                  <div class="ml-3">
                    {{ t("birthOn") }}
                  </div>
                  <div class="ml-auto" style="font-weight: bold">
                    {{ store.getOutTabRow.person.birthOn }}
                  </div>
                </div>
              </v-list-item>
            </v-card>
          </v-col>
        </v-row>
        <v-row class="align-center">
          <v-col cols="12" lg="3" md="6" class="py-0">
            <form-select
              :list="store.getOutElderlyReasonList"
              v-model="store.getOutTabRow.elderlyReasonId"
              :label="$t('elderlyReason')"
              @update:modelValue="store.outElderlyCategorySelected"
              required
              :noSearch="true"
            >
            </form-select>
          </v-col>
          <v-col cols="12" lg="1" md="6" class="text-right">
            <v-btn variant="flat" :color="store.getEditIndex2 == -1 ? 'info' : 'success'" type="submit">
              {{ $t(store.getEditIndex2 == -1 ? "AddRow" : "Save") }}
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
      <template #person="{ item }">
        <td class="py-2" style="white-space: nowrap">
          {{ item.person.fullName }}
          <b v-if="item.person && item.person.birthOn"> ({{ new Date().getFullYear() - item.person.birthOn.split(".")[2] }}) </b>
        </td>
      </template>
    </FormTabRow>

    <div v-if="unregisterId && store.getData.outTables[0]">
      <UiParentCard class="mt-4">
        <v-row>
          <v-col cols="6" lg="2" md="4">
            <img
              :class="{
                isDeath: store.getData.outTables[0]?.person?.isDeath
              }"
              style="width: 70%"
              :src="store.getUnregisterOutPersonImg"
              alt=""
            />
          </v-col>
          <v-col cols="12" lg="6">
            <v-card variant="outlined" class="py-2">
              <v-list-item value="wifi" color="primary">
                <div class="d-flex align-center">
                  <ChevronRightIcon size="22" stroke-width="1.5" class="mr-2" />
                  <div class="ml-3">
                    {{ t("fullName") }}
                  </div>
                  <div class="ml-auto" style="font-weight: bold">
                    {{ store.getData.outTables[0]?.person.fullName }}
                  </div>
                </div>
              </v-list-item>

              <v-list-item value="wifi" color="primary">
                <div class="d-flex align-center">
                  <ChevronRightIcon size="22" stroke-width="1.5" class="mr-2" />
                  <div class="ml-3">
                    {{ t("birthOn") }}
                  </div>
                  <div class="ml-auto" style="font-weight: bold">
                    {{ store.getData.outTables[0]?.person.birthOn }}
                  </div>
                </div>
              </v-list-item>
            </v-card>
          </v-col>
        </v-row>
        <v-row class="align-center">
          <v-col cols="12" lg="3" md="6" class="py-0">
            <form-select
              :list="store.getOutElderlyReasonList"
              v-model="store.getData.outTables[0].elderlyReasonId"
              :label="$t('elderlyReason')"
              @update:modelValue="store.outElderlyCategorySelected"
              required
              :noSearch="true"
            >
            </form-select>
          </v-col>
        </v-row>
      </UiParentCard>
    </div>
  </div>
</template>
