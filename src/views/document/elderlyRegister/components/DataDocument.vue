<script setup lang="ts">
import UiParentCard from "@/components/UiParentCard.vue";
import { useElderlyRegister } from "../store/useElderlyRegister";
import { useGlobal } from "@/composables/useGlobal";
import ElderlyRegisterService from "@/services/document/elderlyregister.service";
import FileUpload from "@/components/form/FileUpload.vue";
import { notify } from "@kyvg/vue3-notification";
import { useI18n } from "vue-i18n";

const { forceFileDownload, disableAfterTodayDays } = useGlobal();

const store = useElderlyRegister();
const { t } = useI18n();

const downLoadFile = (file: any) => {
  if (file) {
    ElderlyRegisterService.DownloadFile(file.id).then((res) => {
      forceFileDownload(res, file.fileName);
    });
  }
};

const deleteFile = () => {
  notify({
    text: t("DeleteSuccessfully"),
    type: "success"
  });
  store.removeFile();
};

</script>

<template>
  <UiParentCard>
    <v-row class="align-center">
      <v-col cols="12" lg="3" class="py-0">
        <form-input v-model="store.getData.docNumber" required :label="$t('docNumber')" disabled />
      </v-col>
      <v-col cols="12" lg="3" class="py-0">
        <form-picker clearable v-model="store.getData.docOn" required :label="$t('docOn')" :disabledDate="disableAfterTodayDays" disabled />
      </v-col>

      <v-col cols="12" lg="3" class="py-0">
        <form-select
          :list="store.getRegionsList"
          required
          v-model="store.getData.regionId"
          :label="$t('region')"
          @update:modelValue="store.getDistrict(store.getData.regionId, '')"
          disabled
        />
      </v-col>
      <v-col cols="12" lg="3" class="py-0">
        <form-select
          :list="store.getDistrictList"
          required
          v-model="store.getData.districtId"
          :label="$t('district')"
          @update:modelValue="store.getMfyList(store.getData.regionId, store.getData.districtId, 'other')"
          disabled
        />
      </v-col>
    </v-row>
    <v-row class="align-center">
      <v-col cols="12" lg="3" class="py-0" v-if="!store.getData.isByVerification">
        <FileUpload
          accept=".pdf"
          form-data-key="files"
          :files="store.getData.files"
          :title="$t('UploadFile')"
          size="large"
          required
          :disabled="store.getEditIndex1 !== -1 || store.getEditIndex2 !== -1"
          @delete-file="deleteFile"
          @download-file="downLoadFile"
          @update-file="(file:any) => store.previewFiles(file)"
        />
      </v-col>
      <slot></slot>
    </v-row>
  </UiParentCard>
</template>
