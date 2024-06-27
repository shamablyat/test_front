<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useElderlyVerification } from "../../store/useElderlyVerification";
import vue, { defineAsyncComponent, watch } from "vue";
import { ref } from "vue";
import ElderlyVerificationService from "@/services/document/elderlyVerification.service";
import { ICustomVerificationFileConfig, IVerificationResultDto, VerificationResultTabs } from "../../types";
import { useErrorToast } from "@/utils/helpers/useErrorToast";
import { ITableActions } from "@/models/basic";
import { notify } from "@kyvg/vue3-notification";
import { SubmitEventPromise } from "vuetify";
import { useRoute } from "vue-router";
import i18n from "@/app/config/i18n";
import { VForm } from "vuetify/components";
import { PrinterIcon } from "vue-tabler-icons";
import { useGlobal } from "@/composables/useGlobal";
import { DocumentFileService } from "@/services/others/documentfile.service";
interface IProps {
  isView: boolean;
}

defineProps<IProps>();

const emits = defineEmits<{
  (e: "setStep"): void;
}>();

/* TYPES */
interface IComponent {
  title: string;
  component: vue.Component;
  value: VerificationResultTabs;
}

/* CONSTANTS */
const actions: ITableActions = {
  isEdit: true,
  isDelete: true
};

/* STORE */
const store = useElderlyVerification();
const { data } = storeToRefs(store);
const { forceFileDownload } = useGlobal();

/* Imports */
const { setError } = useErrorToast();
const components: IComponent[] = [
  {
    title: "ElderlyService",
    component: defineAsyncComponent(() => import("./widgets/Services.vue")),
    value: "services"
  },
  {
    title: "SurveyResult",
    component: defineAsyncComponent(() => import("../../components/SrResult.vue")),
    value: "tables"
  }
];

const route = useRoute();
/* VARIABLES */
const form = ref<Partial<typeof VForm>>();
const activeComponent = ref<VerificationResultTabs>("services");
const editIndex = ref<number>(-1);
const loading = ref<boolean>(false);
const saveLoading = ref<boolean>(false);
const isChanged = ref<boolean>(false);
const verificationResult = ref<IVerificationResultDto | null>(null);
const cachedVerificationResult = ref<IVerificationResultDto | null>(null);
const printLoading = ref(false);

/* FUNCTIONS */
const get = () => {
  loading.value = true;
  ElderlyVerificationService.GetIncludes({
    id: data.value.id,
    includeVerificationResult: true
  })
    .then((res) => {
      verificationResult.value = res.data.verificationResult;
      cachedVerificationResult.value = JSON.parse(JSON.stringify(res.data.verificationResult));
    })
    .catch((e) => {
      setError(e);
    })
    .finally(() => {
      loading.value = false;
    });
};

const addRow = (tabRow: any, type: VerificationResultTabs) => {
  if (verificationResult.value) {
    if (editIndex.value > -1) {
      Object.assign(verificationResult.value[type][editIndex.value], JSON.parse(JSON.stringify(tabRow)));
    } else {
      verificationResult.value[type].push(JSON.parse(JSON.stringify(tabRow)));
    }

    editIndex.value = -1;
  }
};
const editRow = (tabRow: any, type: VerificationResultTabs) => {
  if (verificationResult.value) {
    editIndex.value = verificationResult.value[type].indexOf(tabRow);
  }
};
const deleteRow = (index: number, type: VerificationResultTabs) => {
  if (verificationResult.value) {
    verificationResult.value[type].splice(index, 1);
  }
};

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

get();

/* SAVE */
const saveData = async (submit: SubmitEventPromise) => {
  const { valid, errors } = await submit;
  if (errors && errors.length > 0) {
    document
      // @ts-ignore
      .getElementById(errors[0].id)
      ?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "center"
      });
  }
  if (valid) {
    if (verificationResult.value?.services.length === 0) {
      notify({
        // @ts-ignore
        text: i18n.global.t("mustAddTable"),
        type: "warn"
      });
      return;
    }
    if (verificationResult.value?.services.some((el) => !el.executeOrganizationName || !el.executeOrganizationName)) {
      notify({
        // @ts-ignore
        text: i18n.global.t("addOrganizationAndDeadlineOnDayToTable"),
        type: "warn"
      });
      return;
    }
    saveLoading.value = true;
    const promise = new Promise((resolve, reject) => {
      ElderlyVerificationService.UpdateElderlyVerificationWithResult({
        id: data.value.id,
        verificationResult: verificationResult.value
      })
        .then(() => {
          isChanged.value = false;
          notify({
            // @ts-ignore
            text: i18n.global.t("SaveSuccess"),
            type: "success"
          });
          if ((route.params.id as string) != "0") {
            store.setElderlyVerificationTableHasValue(data.value.id);
          }
          resolve("success");
          emits("setStep");
        })
        .catch((err) => {
          setError(err);
          reject(err);
        })
        .finally(() => {
          saveLoading.value = false;
        });
    });

    return promise;
  }
};

defineExpose({
  saveData,
  form: form,
  isChanged: isChanged
});

watch(
  () => verificationResult.value,
  () => {
    isChanged.value = false;
    if (JSON.stringify(verificationResult.value) !== JSON.stringify(cachedVerificationResult.value)) {
      isChanged.value = true;
    }
  },
  { deep: true }
);
</script>

<template>
  <div>
    <v-row>
      <v-col>
        <h3 class="mb-3" v-if="verificationResult">{{ $t("collectedBall") }} : {{ verificationResult?.totalBall || 0 }}</h3>
      </v-col>
      <v-col class="text-right" v-if="data.canViewFile">
        <v-menu>
          <template #activator="{ props }">
            <v-btn v-bind="props" :loading="printLoading" color="info" class="mx-3" :icon="PrinterIcon" />
          </template>
          <v-card class="mt-4 py-2">
            <template v-for="file in data.files">
              <v-list-item
                v-if="file.columnName === 'CONCLUSION' || file.columnName === 'YATD'"
                :title="file.fileShortName"
                @click="printReport(file)"
              ></v-list-item>
            </template>
          </v-card>
        </v-menu>
      </v-col>
    </v-row>
    <v-form @submit.prevent="saveData">
      <v-tabs v-model="activeComponent" align-tabs="center" color="violet">
        <v-tab v-for="component in components" :value="component.value"> {{ $t(component.title) }} </v-tab>
      </v-tabs>
      <div class="w-100 d-flex align-center justify-center mt-4" v-if="loading">
        <v-progress-circular indeterminate />
      </div>

      <h3 class="text-center mt-3" v-if="!loading && !verificationResult">{{ $t("NotFound") }}</h3>

      <v-window v-model="activeComponent" v-if="verificationResult && !loading">
        <v-window-item v-for="item in components" :value="item.value">
          <component
            :is="item.component"
            :data="verificationResult"
            :type="item.value"
            @addRow="addRow"
            @editRow="editRow"
            @deleteRow="deleteRow"
            v-model:editIndex="editIndex"
            :actions="actions"
            :isView="isView"
          />
        </v-window-item>
      </v-window>
      <v-row class="mt-4" v-if="!isView && verificationResult && verificationResult.canEdit">
        <v-col class="text-right">
          <v-btn color="success" :loading="saveLoading" variant="flat" type="submit">
            {{ $t("Save") }}
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>
