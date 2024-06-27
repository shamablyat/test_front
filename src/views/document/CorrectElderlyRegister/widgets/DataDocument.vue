<script setup lang="ts">
import UiParentCard from "@/components/UiParentCard.vue";
import { useSentElderlyRegister } from "../store/useSentElderlyRegister";
import { useGlobal } from "@/composables/useGlobal";
import ElderlyRegisterService from "@/services/document/elderlyregister.service";
import FileUpload from "@/components/form/FileUpload.vue";
import { notify } from "@kyvg/vue3-notification";
import { useI18n } from "vue-i18n";
import { ref } from "vue";

const { forceFileDownload, disableAfterTodayDays } = useGlobal();

const store = useSentElderlyRegister();
const { t } = useI18n();
const progress = ref<any>(0);

const downLoadFile = (file: any) => {
  if (file) {
    ElderlyRegisterService.DownloadFile(file.id, {
      onUploadProgress: (e) => {
        if (e.progress) {
          progress.value = e.progress * 100;
        }
      }
    }).then((res) => {
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

const uploadFile = (formData: FormData) => {
  ElderlyRegisterService.UploadFile(formData, {
    onUploadProgress: (e) => {
      if (e.progress) {
        progress.value = e.progress * 100;
      }
    }
  }).then((res) => {
    store.data.files = [
      {
        id: res.data[0].fileId,
        fileName: res.data[0].fileName
      }
    ];
  });
};

const trimText = () => {
  store.getData.decisionDocNumber = store.getData.decisionDocNumber.trim();
};
</script>

<template>
  <UiParentCard>
    <v-row class="align-center">
      <v-col cols="12" lg="3" class="py-0">
        <form-input v-model="store.getData.docNumber" required :label="$t('docNumber')" />
      </v-col>
      <v-col cols="12" lg="3" class="py-0">
        <form-picker clearable v-model="store.getData.docOn" required :label="$t('docOn')" :disabledDate="disableAfterTodayDays" />
      </v-col>

      <v-col cols="12" lg="3" class="py-0">
        <form-select
          :list="store.regionsList"
          required
          v-model="store.getData.regionId"
          :label="$t('region')"
          @update:modelValue="store.getDistrict(store.getData.regionId, '')"
          disabled
        />
      </v-col>
      <v-col cols="12" lg="3" class="py-0">
        <form-select
          :list="store.districtList"
          required
          v-model="store.getData.districtId"
          :label="$t('district')"
          @update:modelValue="store.getMfyList(store.getData.regionId, store.getData.districtId, 'other')"
          disabled
        />
      </v-col>
    </v-row>
    <v-row class="align-center">
      <v-col cols="12" lg="3" class="py-0">
        <form-input required v-model="store.getData.decisionDocNumber" :label="$t('decisionDocNumber')" @input="trimText" />
      </v-col>
      <v-col cols="12" lg="3" class="py-0">
        <form-picker
          clearable
          class="w-100"
          v-model="store.getData.decisionDocOn"
          :label="$t('decisionDocOn')"
          :disabledDate="disableAfterTodayDays"
          placeholder="##.##.####"
          required
        />
      </v-col>

      <v-col cols="12" lg="3" class="py-0" v-if="!store.getData.isByVerification">
        <FileUpload
          accept=".pdf"
          form-data-key="files"
          :files="store.getData.files"
          :title="$t('UploadFile')"
          size="large"
          required
          @delete-file="deleteFile"
          :progress="progress"
          @download-file="downLoadFile"
          @update-file="uploadFile"
        />
      </v-col>
      <slot></slot>
    </v-row>
  </UiParentCard>
</template>
