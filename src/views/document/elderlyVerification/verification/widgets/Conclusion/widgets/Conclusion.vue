<script setup lang="ts">
import { ref, toRefs } from "vue";
import { IVerificationConclusion } from "../../../types";
import { useElderlyVerification } from "../../../store/useElderlyVerification";
import { storeToRefs } from "pinia";
import SrService from "./SrService.vue";
import Members from "./Members.vue";
import FileAttach from "@/components/FileAttach.vue";
import { IFileConfig } from "@/models/basic";
import axios from "axios";

interface IProps {
  isView: boolean;
  verificationConclusion: IVerificationConclusion;
  fileConfig: IFileConfig[];
}

const props = defineProps<IProps>();

const { verificationConclusion } = toRefs(props);

const emits = defineEmits<{
  (e: "update:verificationConclusion"): void;
}>();

/* STORE */
const store = useElderlyVerification();
const { data } = storeToRefs(store);

/* VAARIABLES */
const loading = ref<boolean>(false);

store.fetchIndividualProgramTypeList();

const setFile = (value: any[]) => {
  if (verificationConclusion.value) {
    verificationConclusion.value.files = value;
  }
};
const iframeLoaded = ref(false);
const panel = ref(0)

const deleteFile = (columnName: string) => {
  if (verificationConclusion.value) {
    const item = verificationConclusion.value.files.find((el: any) => el.columnName === columnName);

    if (item) {
      const index = verificationConclusion.value.files.indexOf(item);
      verificationConclusion.value.files.splice(index, 1);
    }
  }
};
</script>

<template>
  <div>
    <div class="pb-5" v-if="verificationConclusion">
      <h3 class="mb-3">{{ $t("collectedBall") }} : {{ verificationConclusion?.totalBall || 0 }}</h3>
      <SrService class="mb-4" :sr-service="verificationConclusion?.services" :loading="loading" />

      <v-expansion-panels class="mb-5" v-model:model-value="panel">
        <v-expansion-panel>
          <v-expansion-panel-title> {{ $t("members") }} </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-row v-if="fileConfig && data.canAgree" class="ml-auto mt-3">
              <FileAttach
                v-if="verificationConclusion && fileConfig"
                :files="verificationConclusion?.files"
                :column-name="'AGREE'"
                :table-id="verificationConclusion.tableId"
                :config="fileConfig.find((el: any) => el.columnName == 'AGREE') || fileConfig[0]"
                @set-file="setFile"
                @delete-file="deleteFile"
              >
                {{ $t("verificationConclusionFile") }}
              </FileAttach>
            </v-row>
            <Members v-if="verificationConclusion?.members" :members="verificationConclusion.members" :isView="isView" />
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
      <iframe
        v-if="verificationConclusion.files.find((el) => el.columnName == 'Agree')"
        width="100%"
        class="h-screen"
        frameborder="0"
        @load="iframeLoaded = true"
        :src="`${axios.defaults.baseURL}/DocumentFile/DownloadFile/${verificationConclusion.files.find((el) => el.columnName == 'Agree').id}/${
          verificationConclusion.tableId
        }/${data.statusId != 35 ? verificationConclusion.id : 0}`"
      ></iframe>
    </div>
  </div>
</template>
