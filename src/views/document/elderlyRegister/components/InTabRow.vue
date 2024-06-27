<script setup lang="ts">
import ElderlyRegisterService from "@/services/document/elderlyregister.service";
import { useElderlyRegister } from "../store/useElderlyRegister";
import RegisteredAddress from "./RegisteredAddress.vue";
import TemporaryAddress from "./TemporaryAddress.vue";
import { useGlobal } from "@/composables/useGlobal";
import { useI18n } from "vue-i18n";
import { SubmitEventPromise } from "vuetify";
import { notify } from "@kyvg/vue3-notification";
import { INotHasDoc, IPassportIncludes, ISetPassportData } from "@/components/setPassportData/types";
import { AxiosError } from "axios";
import { useErrorToast } from "@/utils/helpers/useErrorToast";
import SetPassportData from "@/components/setPassportData/SetPassportData.vue";
import FormTabRow from "@/components/form/FormTabRow.vue";
import { IFields, ITableActions } from "@/models/basic";
import { useManualStore } from "@/app/config/store/Manual";
import FileUpload from "@/components/form/FileUpload.vue";
import { UserInfo } from "@/components/UserInfo";

const { forceFileDownload } = useGlobal();
const { setError } = useErrorToast();
const store = useElderlyRegister();
const manualStore = useManualStore();
manualStore.setDocumentTypeList()

const actions: ITableActions = {
  isDelete: true,
  isEdit: true
};

const { t } = useI18n();
const downloadFile = (file: any) => {
  ElderlyRegisterService.DownloadInTableFile(file.id).then((res) => {
    forceFileDownload(res, file.fileName);
  });
};

const deleteFile = (type: string) => {
  notify({
    text: t("DeleteSuccessfully"),
    type: "success"
  });
  store.removeFile(type);
};

const updateFile = (file: any) => {
  store.previewFiles(file, "in");
};

const AddRow = async (submit: SubmitEventPromise) => {
  const { valid } = await submit;
  if (valid) {
    if (store.getIntabRow.files.length === 0) {
      notify({
        text: t("inTablesFileNotCorrect"),
        type: "warn"
      });
      return;
    }
    if (store.getIntabRow?.person?.isDeath) {
      notify({
        text: t("personIsDied"),
        type: "warn"
      });
      return;
    }
    store.addInTableRow(() => {
      notify({
        text: t("alreadyExistPerson"),
        type: "warn"
      });
    });
  }
};

const fields: IFields[] = [
  // { key: 'mfy', label: 'mfy' },
  { key: "person", label: "fio", tdClass: "py-2" },
  { key: "elderlyCategory", label: "elderlyCategory", tdClass: "py-2" },
  { key: "elderlyReason", label: "elderlyReason", tdClass: "py-2" },
  {
    key: "categoryMismatchReason",
    label: "isCategoryMismatch",
    tdClass: "py-2"
  },
  {
    key: "pensionType",
    label: "pensionType",
    tdClass: "py-2 nowrap",
    thClass: "nowrap"
  },
  { key: "disabilityGroup", label: "disabilityGroup", tdClass: "py-2" },
  { key: "address", label: "address", tdClass: "py-2" },
  {
    key: "phoneNumber",
    label: "phoneNumber",
    tdClass: "py-2 nowrap"
  },
  { key: "action", label: "actions", tdClass: "py-2" }
];

const includes: IPassportIncludes = {
  includePension: true,
  includeAddress: true,
  includeDisabilityGroup: true,
  includePhoto: true
};

const setPerson = (values: ISetPassportData) => {
  const filter = {
    ...values,
    ...includes
  };
  store.searchPerson({
    filter: filter,
    err: (err: AxiosError) => {
      setError(err);
    }
  });
};

const addPerson = (values: INotHasDoc) => {
  store.inTabrow.person = values;
  store.setElderlyCategoryList(false);
};
</script>

<template>
  <FormTabRow
    :actions="actions"
    :items="store.getData.inTables"
    :fields="fields"
    :edit-index="store.getEditIndex1"
    @update:edit-index="
      () => {
        store.editedIndex1 = -1;
        store.clearTabRow(1);
      }
    "
    @edit-tab-row="(item) => store.edit(item, 'in')"
    @delete-tab-row="(index) => store.deleteTable(index, 'in')"
  >
    <SetPassportData
      :document-type-list="manualStore.documentTypeList"
      :person="store.getData.person"
      :search-lading="store.getSearchLoading"
      :clear="store.getActiveTab"
      @set-person="setPerson"
      @add-person="addPerson"
    />

    <v-form @submit.prevent="AddRow" class="mt-4">
      <template v-if="store.getIntabRow && store.getIntabRow.person">
        <UserInfo :person="store.getIntabRow.person" :includes="includes" :image="store.getPhoto" />

        <!-- Registered ADDRESS -->
        <RegisteredAddress />

        <v-row style="margin-top: 20px" v-if="store.getIntabRow?.person && store.getIntabRow?.person.fullName">
          <v-col cols="12" lg="3">
            <!-- CHECKBOX FOR SHOW  TEMPORARY ADDRESS-->
            <form-checkbox density="comfortable" v-model="store.getIntabRow.isTemporary" :label="$t('IsTemporary')"> </form-checkbox>
          </v-col>
          <v-col cols="12" lg="3">
            <form-checkbox density="comfortable" v-model="store.getIntabRow.isInSxv" disabled :label="$t('isInSxv')"> </form-checkbox>
          </v-col>
        </v-row>
        <!-- TEMPORARY ADDRESS -->
        <TemporaryAddress v-if="store.getIntabRow.isTemporary" />

        <v-row>
          <v-col cols="12" lg="3" md="6" class="py-0">
            <form-select
              :list="store.getElderlyCategoryList"
              required
              v-model="store.getIntabRow.elderlyCategoryId"
              :label="$t('elderlyCategory')"
              :placeholder="$t('elderlyCategory')"
              @update:modelValue="store.elderlyCategorySelected"
              no-filter
            >
            </form-select>
          </v-col>

          <v-col cols="12" lg="2" md="6" class="py-0" v-if="store.getIsReasonRequired && !store.getIntabRow.isCategoryMismatch">
            <form-select
              :list="store.getInElderlyReasonList"
              v-model="store.getIntabRow.elderlyReasonId"
              :label="$t('elderlyReason')"
              @update:modelValue="store.elderlyCategorySelected"
              :required="store.getIsReasonRequired && !store.getIntabRow.isCategoryMismatch"
              :disabled="!store.getIntabRow.elderlyCategoryId"
              :noSearch="true"
            >
            </form-select>
          </v-col>

          <v-col cols="12" lg="3" md="6">
            <form-checkbox
              v-model="store.getIntabRow.isCategoryMismatch"
              :label="$t('isCategoryMismatch')"
              hideDetails
              @update:modelValue="store.resetElderlyReason"
            >
            </form-checkbox>
          </v-col>

          <v-col cols="12" lg="2" md="6" class="py-0" v-if="store.getIntabRow.isCategoryMismatch">
            <form-input v-model="store.getIntabRow.categoryMismatchReason" :label="$t('isCategoryMismatch')" required> </form-input>
          </v-col>
          <v-col cols="12" lg="3" md="12" v-if="!store.getData.isByVerification">
            <FileUpload
              accept=".pdf"
              form-data-key="files"
              :files="store.getIntabRow.files"
              :title="$t('Asosxujjatlar')"
              size="large"
              required
              @delete-file="deleteFile('in')"
              @download-file="downloadFile"
              @update-file="updateFile"
            />
          </v-col>
          <v-col cols="12" lg="1" class="text-right">
            <v-btn variant="flat" :color="store.getEditIndex1 == -1 ? 'info' : 'success'" type="submit">
              {{ $t(store.getEditIndex1 == -1 ? "AddRow" : "Save") }}
            </v-btn>
          </v-col>
        </v-row>
      </template>
    </v-form>

    <template #person="{ item }">
      <td class="py-2" style="white-space: nowrap">
        {{ item.person.fullName }}
        <b v-if="item.person && item.person.birthOn"> ({{ new Date().getFullYear() - item.person.birthOn.split(".")[2] }}) </b>
      </td>
    </template>
  </FormTabRow>
</template>
