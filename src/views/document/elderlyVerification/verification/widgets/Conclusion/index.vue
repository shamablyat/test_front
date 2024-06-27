<script setup lang="ts">
import { storeToRefs } from "pinia";
import axios from "axios";
import { useElderlyVerification } from "../../store/useElderlyVerification";
import Loader from "../../components/Loader.vue";
import { defineAsyncComponent, ref } from "vue";
import { ICustomVerificationFileConfig, IIndividualProgram, IVerificationConclusion } from "../../types";
import ElderlyVerificationService from "@/services/document/elderlyVerification.service";
import FileConfigService from "@/services/others/fileconfig.service";
import { IFileConfig } from "@/models/basic";
import { useErrorToast } from "@/utils/helpers/useErrorToast";
import { useAuth } from "@/app/config/store/auth";
import { notify } from "@kyvg/vue3-notification";
import i18n from "@/app/config/i18n";
import { useGlobal } from "@/composables/useGlobal";
import { PrinterIcon } from "vue-tabler-icons";
import { DocumentFileService } from "@/services/others/documentfile.service";

interface IProps {
  isView: boolean;
}
type TypeActions = "Complete" | "SentToAgree" | "Agree";
interface IModalProps {
  data: any;
  action: TypeActions;
  title: string;
}

defineProps<IProps>();

const emits = defineEmits<{
  (e: "setStep"): void;
  (e: "refreshData"): void;
}>();

/* STORE */
const store = useElderlyVerification();
const { dataLoading, data } = storeToRefs(store);
const { setError } = useErrorToast();
const { can } = useAuth();
const { forceFileDownload } = useGlobal();

type TabTypes = "SrResult" | "Conclusion";
const activeComponent = ref<TabTypes>("Conclusion");

const components: any[] = [
  {
    title: "verificationConclusion",
    component: defineAsyncComponent(() => import("./widgets/Conclusion.vue")),
    value: "Conclusion"
  },
  {
    title: "SurveyResult",
    component: defineAsyncComponent(() => import("../../components/SrResult.vue")),
    value: "SrResult"
  }
];

const individualPrograms = ref<IIndividualProgram[]>([]);
const cachedIndividualPrograms = ref<IIndividualProgram[]>([]);
const verificationConclusion = ref<IVerificationConclusion | null>(null);
const fileConfig = ref<IFileConfig[]>([]);
const isModal = ref<boolean>(false);
const statusLoading = ref<boolean>(false);
const isModalProps = ref<IModalProps>({
  data: data.value.id || null,
  action: "Complete",
  title: "complete"
});

const loading = ref(false);

const getFileConfig = () => {
  if (verificationConclusion.value) {
    FileConfigService.FileConfig({ tableId: verificationConclusion.value?.tableId, docOn: store.getData.docOn, code: "" }).then((res) => {
      fileConfig.value = res.data;
    });
  }
};

const getConclusion = () => {
  loading.value = true;
  ElderlyVerificationService.GetIncludes({
    id: data.value.id,
    includeVerificationConclusion: true
  })
    .then((res) => {
      verificationConclusion.value = res.data.verificationConclusion;
      if (res.data.verificationConclusion) {
        getFileConfig();
      }
      if (res.data.individualPrograms) {
        individualPrograms.value = res.data.individualPrograms;
        cachedIndividualPrograms.value = JSON.parse(JSON.stringify(res.data.individualPrograms));
      }
    })
    .catch((e) => {
      setError(e);
    })
    .finally(() => {
      loading.value = false;
    });
};

const setIsModalProps = (data: any, action: TypeActions, title: string) => {
  isModal.value = true;
  isModalProps.value.data = data;
  isModalProps.value.action = action;
  isModalProps.value.title = title;
};

const confirmAction = () => {
  if (isModalProps.value.data?.verificationConclusion) {
    isModalProps.value.data?.verificationConclusion.members.forEach((element: any) => {
      if (!element.isAgree) {
        element.isAgree = false;
      }
    });

    if (!verificationConclusion.value?.files.some((el) => el.columnName === "AGREE")) {
      notify({
        // @ts-ignore
        text: i18n.global.t("acceptFile"),
        type: "warn"
      });
      return;
    }
  }

  statusLoading.value = true;
  ElderlyVerificationService[isModalProps.value.action](isModalProps.value.data)
    .then(() => {
      isModal.value = false;
      notify({
        // @ts-ignore
        text: i18n.global.t("SaveSuccess"),
        type: "success"
      });

      emits("refreshData");
      if (isModalProps.value.action === "Agree") {
        emits("setStep");
      }
    })
    .catch((e) => {
      setError(e);
    })
    .finally(() => {
      statusLoading.value = false;
    });
};

const printLoading = ref(false);
const printReport = (file: ICustomVerificationFileConfig) => {
  if (file && file.id) {
    printLoading.value = true;
    DocumentFileService.DownloadFile(file.id, file.tableId, file.documentId)
      .then((res) => {
        forceFileDownload(res, file.fileShortName, ".pdf");
        printLoading.value = false;
      })
      .catch((err) => {
        setError(err);
        printLoading.value = false;
      });
  }
};

getConclusion();
</script>

<template>
  <div>
    <Loader v-if="dataLoading" />
    <div v-else>
      <div class="d-flex justify-center align-content" v-if="can('ElderlyVerificationEdit') && !verificationConclusion && !isView">
        <v-btn
          :text="$t('Complete')"
          variant="flat"
          color="success"
          @click="
            () => {
              setIsModalProps(data.id, 'Complete', 'complete');
            }
          "
        />
      </div>
      <div v-else>
        <v-col class="text-right" v-if="data.canViewFile">
          <v-menu>
            <template #activator="{ props }">
              <v-btn v-bind="props" :loading="printLoading" color="info" class="mx-3" :icon="PrinterIcon" />
            </template>
            <v-card class="mt-4 py-2">
              <template v-for="file in data.files">
                <v-list-item v-if="file.columnName === 'CONCLUSION'" :title="file.fileShortName" @click="printReport(file)"></v-list-item>
              </template>
            </v-card>
          </v-menu>
        </v-col>
        <v-tabs v-model="activeComponent" align-tabs="center" color="violet">
          <v-tab v-for="component in components" :value="component.value"> {{ $t(component.title) }} </v-tab>
        </v-tabs>

        <v-window v-model="activeComponent">
          <v-window-item v-for="item in components" :value="item.value">
            <component
              :is="item.component"
              :type="item.value"
              :fileConfig="fileConfig"
              v-model:verificationConclusion="verificationConclusion"
              :data="verificationConclusion"
            />
          </v-window-item>
        </v-window>
        <UiParentCard
          title="PDF"
          class="mt-3 text-center"
          v-if="
            verificationConclusion &&
            verificationConclusion.files &&
            verificationConclusion.files.length &&
            verificationConclusion.files.find((el) => el.columnName == 'AGREE')
          "
        >
          <v-expansion-panels>
            <v-expansion-panel v-for="file in verificationConclusion.files">
              <v-expansion-panel-title>{{ file.fileFullName }}</v-expansion-panel-title>
              <v-expansion-panel-text>
                <iframe
                  :src="`${axios.defaults.baseURL}/DocumentFile/DownloadFile/${file.id}/${file.tableId}/${file.documentId}`"
                  width="80%"
                  style="height: 800px"
                  name="application"
                  id="application"
                  frameborder="0"
                ></iframe>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </UiParentCard>
        <v-row class="mt-3 px-3">
          <v-spacer />
          <v-btn
            :text="$t('SentToAgree')"
            variant="flat"
            color="info"
            class="mx-3"
            v-if="can('ElderlyVerificationSentToAgree') && data.canSentToAgree"
            @click="
              () => {
                setIsModalProps(
                  {
                    id: data.id
                  },
                  'SentToAgree',
                  'SentToAgree'
                );
              }
            "
          />
          <v-btn
            :text="$t('Agree')"
            variant="flat"
            color="violet"
            v-if="can('ElderlyVerificationAgree') && data.canAgree"
            @click="
              () => {
                setIsModalProps(
                  {
                    id: data.id,
                    verificationConclusion: verificationConclusion
                  },
                  'Agree',
                  'Agree'
                );
              }
            "
          />
        </v-row>
      </div>
    </div>

    <v-dialog v-model="isModal" width="300">
      <v-card>
        <v-card-title
          v-html="
            $t('sureTo', {
              action: $t(isModalProps.title)
            })
          "
          style="white-space: inherit"
          class="text-center"
        />
        <div class="px-5 px-5 d-flex flex-column gap-2 mb-3">
          <v-btn :text="$t('yes')" variant="flat" color="success" class="w-100" @click="confirmAction" :loading="statusLoading" />
          <v-btn :text="$t('no')" variant="flat" color="error" class="w-100" :loading="statusLoading" @click="isModal = false" />
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>
