<script setup lang="ts">
import { useErrorToast } from "@/utils/helpers/useErrorToast";
import { useWorkerReport } from "../store/useWorkerReport";
import { IFields } from "@/models/basic";
import { SubmitEventPromise } from "vuetify";
import { notify } from "@kyvg/vue3-notification";
import i18n  from "@/app/config/i18n";
import { onBeforeUnmount } from "vue";
import { useGlobal } from "@/composables/useGlobal";
import FileUpload from "@/components/form/FileUpload.vue";
import ElderlyCareWorkerReportService from "@/services/document/elderlyCareWorkerReport.service";
import LogList from "@/components/LogList.vue";
import { ref } from "vue";
import UiParentCard from "@/components/UiParentCard.vue";
import axios from "axios";
import { XIcon } from "vue-tabler-icons";

const { setError } = useErrorToast();

const store = useWorkerReport();
const { forceFileDownload } = useGlobal();

const detectIsView = (): boolean => {
  if (store.getIsView) return true;
  return false;
};

const emits = defineEmits<{
  (e: "setIsModal"): void;
  (e: "refresh"): void;
}>();

const fields: IFields[] = [
  {
    key: "done",
    label: "done"
  },
  {
    key: "details",
    label: "details"
  },
  {
    key: "elderlyService",
    label: "ElderlyService"
  },
  {
    key: "beginAt",
    label: "startTime"
  },
  {
    key: "endAt",
    label: "endTime"
  }
];

const saveData = async (submit: SubmitEventPromise) => {
  const { valid } = await submit;
  if (valid) {
    store.saveReportByDay({
      cb: () => {
        emits("setIsModal");
        notify({
          // @ts-ignore
          text: i18n.global.t("SaveSuccess"),
          type: "success"
        });

        emits("refresh");
      },
      err: (e) => {
        setError(e);
      }
    });
  }
};

const setMaxValue = (value: string) => {
  if (parseInt(value) > 300) {
    store.getReportByDay.travelTimeInMinutes = `300`;
  }
};

const progress = ref<number | undefined>(0);

const updateFile = (formData: FormData) => {
  ElderlyCareWorkerReportService.UploadFile(formData, {
    onUploadProgress: (e) => {
      if (e.progress) {
        progress.value = e.progress * 100;
      }
    }
  }).then((res) => {
    store.reportByDay = {
      ...store.reportByDay,
      files: [
        {
          id: res.data[0].fileId,
          fileName: res.data[0].fileName
        }
      ]
    };
  });
};
function Download(file: any) {
  ElderlyCareWorkerReportService.DownloadFile(file.id, {
    onDownloadProgress(progressEvent) {
      if (progressEvent.progress) {
        progress.value = progressEvent.progress * 100;
      }
    }
  })
    .then((res) => {
      forceFileDownload(res, file.fileName, file.fileExtension);
    })
    .catch((e) => {
      setError(e);
    });
}

const deleteFile = () => {
  if (store.reportByDay && store.reportByDay.files) {
    store.reportByDay.files = [];
  }
};

onBeforeUnmount(() => {
  store.refreshReportByDay();
});
</script>

<template>
  <v-card height="100%" class="py-4">
    <v-card-title>
      <v-row>
        <v-col class="h3 font-weight-bold px-5"> </v-col>
        <v-col class="text-right">
          <XIcon size="32" class="cursor-pointer" @click="emits('setIsModal')"></XIcon>
        </v-col>
      </v-row>
    </v-card-title>

    <v-card-text>
      <UiParentCard class="text-center" v-if="store.loading">
        <v-progress-circular indeterminate />
      </UiParentCard>
      <v-form @submit.prevent="saveData" v-if="!store.loading">
        <v-row class="align-center" v-if="store.getReportByDay">
          <v-col cols="12" md="3" sm="12" class="py-0">
            <form-picker clearable :label="$t('docOn')" v-model="store.getReportByDay.dateOn" disabled />
          </v-col>
          <v-col cols="12" md="3" sm="12" class="py-0">
            <form-input
              mask="###"
              :label="$t('travelTimeInMinutes')"
              v-model="store.getReportByDay.travelTimeInMinutes"
              @update:model-value="setMaxValue"
              :disabled="detectIsView()"
            />
          </v-col>
          <v-col cols="12" md="3" sm="12" class="py-0 mt-6">
            <FileUpload
              :files="store.getReportByDay.files"
              accept="image/*"
              formDataKey="files"
              :title="$t('acceptFile')"
              @update-file="updateFile"
              @download-file="Download"
              @delete-file="deleteFile"
              :progress="progress"
              :view="detectIsView()"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-label class="mb-2 font-weight-medium">
              {{ $t("details") }}
            </v-label>
            <v-textarea v-if="store.getReportByDay" rows="4" v-model="store.getReportByDay.details" :disabled="detectIsView()" />
          </v-col>
        </v-row>

        <!-- TABLE -->
        <v-row class="mt-4" v-if="store.getReportByDay">
          <v-col>
            <v-table fixed-header>
              <thead>
                <tr>
                  <th class="border" v-for="field in fields">
                    {{ $t(field.label) }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in store.getReportByDay.tables">
                  <td v-for="field in fields" class="py-3 border">
                    <span v-if="field.key !== 'done' && field.key !== 'details'">
                      {{ item[field.key] }}
                    </span>
                    <form-checkbox v-model="item.done" v-else-if="field.key === 'done'" :disabled="detectIsView()" />
                    <div v-else-if="field.key === 'details' && !detectIsView()" style="min-width: 256px">
                      <v-textarea :rows="2" v-model="item.details" hide-details />
                    </div>
                    <span v-else-if="field.key === 'details' && detectIsView()">{{ item.details }}</span>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-col>
        </v-row>

        <LogList v-if="store.getReportByDay && store.getReportByDay?.logList?.length > 0" :logs="store.getReportByDay?.logList" />
        <v-col cols="12" class="py-0 mt-6" v-if="detectIsView() && store.getReportByDay?.files?.length">
          <iframe :src="`${axios.defaults.baseURL}/ElderlyCareWorkerReport/DownloadFile/${store.getReportByDay.files[0]?.id}`" width="100%"></iframe>
        </v-col>

        <v-card-actions class="px-2">
          <v-row class="mt-2 px-0">
            <v-btn color="error" variant="flat" @click="emits('setIsModal')">
              {{ $t("Back") }}
            </v-btn>
            <v-spacer />
            <v-btn color="success" :loading="store.getSaveLoading" variant="flat" type="submit">
              {{ $t("Save") }}
            </v-btn>
          </v-row>
        </v-card-actions>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<style scoped>
img[alt] {
  color: transparent;
}
img:after {
  font-weight: 900;
  font-family: "Font Awesome 5 Pro";
  content: "\f071"" Broken Image of  " attr(alt);
  display: block;
  font-size: 16px;
  font-style: normal;
  color: rgb(100, 100, 100);
  text-align: center;
}
</style>
