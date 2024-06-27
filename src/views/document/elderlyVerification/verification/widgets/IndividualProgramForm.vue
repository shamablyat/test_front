<script setup lang="ts">
import ElderlyVerificationService from "@/services/document/elderlyVerification.service";
import { useErrorToast } from "@/utils/helpers/useErrorToast";
import { ref, watch } from "vue";
import { SubmitEventPromise } from "vuetify";
import { IIndividualProgram } from "../types";
import { useElderlyVerification } from "../store/useElderlyVerification";
import { storeToRefs } from "pinia";
import Loader from "../components/Loader.vue";
import { useI18n } from "vue-i18n";
import { notify } from "@kyvg/vue3-notification";
import ManualService from "@/services/others/manual.service";
import AdmManualService from "@/services/others/admmanual.service";
import { useRoute } from "vue-router";
import { IFields, ISelectList, ITableActions } from "@/models/basic";
import FormTabRow from "@/components/form/FormTabRow.vue";
import i18n from "@/app/config/i18n";
import { VForm } from "vuetify/components";
interface IProps {
  isView: boolean;
}

defineProps<IProps>();

const emits = defineEmits<{
  (e: "setStep"): void;
}>();

const IndividualProgramDef: IIndividualProgram = {
  id: 0,
  individualProgramId: 0,
  organizationId: 0,
  deadlineOnDay: 0,
  individualProgram: "0",
  organization: ""
};

const actions: ITableActions = {
  isDelete: true,
  isEdit: true
};

const fields: IFields[] = [
  { key: "individualProgram", label: "individualProgramType" },
  { key: "organization", label: "organization" },
  { key: "deadlineOnDay", label: "deadlineOnDay" }
];

const { t } = useI18n();
const { setError } = useErrorToast();
const store = useElderlyVerification();
const { data } = storeToRefs(store);
const route = useRoute();
const editIndex = ref<number>(-1);

const loading = ref(false);
const isClear = ref(false);
const saveLoading = ref(false);
const isChanged = ref(false);
const individualProgramTypeList = ref([]);
const organizationList = ref([]);
const form = ref<Partial<typeof VForm>>();

const fetchIndividualProgramTypeList = () => {
  ManualService.GetIndividualProgramTypeSelectList().then((res) => {
    individualProgramTypeList.value = res.data;
  });
};

const fetchOrganizationSelectList = () => {
  AdmManualService.OrganizationSelectList().then((res) => {
    organizationList.value = res.data;
  });
};

const IndividualPrograms = ref<IIndividualProgram[]>([]);
const cachedIndividualPrograms = ref<IIndividualProgram[]>([]);
const IndividualProgram = ref<IIndividualProgram>({ ...IndividualProgramDef });

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
    if (IndividualPrograms.value.length == 0) {
      notify({
        // @ts-ignore
        text: i18n.global.t("mustAddTable"),
        type: "warn"
      });
      return;
    }

    const promise = new Promise((resolve, reject) => {
      saveLoading.value = true;
      ElderlyVerificationService.UpdateElderlyVerificationWithIndividualProgram({
        id: data.value.id,
        individualPrograms: IndividualPrograms.value
      })
        .then(() => {
          notify({
            text: t("SaveSuccess"),
            type: "success"
          });
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

/* TABLE */

const addTabRow = async (submit: SubmitEventPromise) => {
  const { valid } = await submit;
  if (valid) {
    if (
      IndividualPrograms.value.some(
        (el) => el.individualProgramId == IndividualProgram.value.individualProgramId && el.organizationId == IndividualProgram.value.organizationId
      )
    ) {
      notify({
        text: i18n.global.t("duplicatedProgramAndOrganization"),
        type: "warn"
      });
      return;
    }
    if (editIndex.value > -1) {
      Object.assign(IndividualPrograms.value[editIndex.value], JSON.parse(JSON.stringify(IndividualProgram.value)));
    } else {
      IndividualPrograms.value.push(IndividualProgram.value);
    }

    clearTabRow();
    editIndex.value = -1;
  }
};

const ClearData = () => {
  return (isClear.value = !isClear.value);
};

const clearTabRow = () => {
  ClearData();
  IndividualProgram.value = JSON.parse(JSON.stringify(IndividualProgramDef));
};
const deletTabRow = (index: number) => {
  if (IndividualPrograms.value) {
    IndividualPrograms.value.splice(index, 1);
  }
};

const editTabRow = (item: IIndividualProgram) => {
  editIndex.value = IndividualPrograms.value.indexOf(item);
  IndividualProgram.value = JSON.parse(JSON.stringify(item));
};

const setFields = (value: ISelectList, key: string) => {
  if (value) {
    // @ts-ignore
    IndividualProgram.value[key] = value.text;
    // @ts-ignore
    IndividualProgram.value[key + "Id"] = value.value;
  }
};

loading.value = true;

ElderlyVerificationService.GetIncludes({
  id: route.params.id as string,
  includeIndividualProgram: true
})
  .then((res) => {
    if (res.data.individualPrograms) {
      IndividualPrograms.value = res.data.individualPrograms;
      cachedIndividualPrograms.value = JSON.parse(JSON.stringify(res.data.individualPrograms));
    }
    if ((route.params.id as string) != "0") {
      store.setElderlyVerificationTableHasValue(data.value.id);
    }
  })
  .finally(() => {
    loading.value = false;
  });

fetchIndividualProgramTypeList();
fetchOrganizationSelectList();

defineExpose({
  saveData,
  form: form,
  isChanged: isChanged
});

watch(
  () => IndividualPrograms.value,
  () => {
    isChanged.value = false;
    if (JSON.stringify(IndividualPrograms.value) !== JSON.stringify(cachedIndividualPrograms.value)) {
      isChanged.value = true;
    }
  },
  { deep: true }
);
</script>

<template>
  <loader v-if="loading" />
  <v-form @submit.prevent="saveData" v-else ref="form">
    <FormTabRow
      :fields="
        isView
          ? fields
          : [
              ...fields,
              {
                key: 'action',
                label: 'actions'
              }
            ]
      "
      :items="IndividualPrograms"
      @delete-tab-row="deletTabRow"
      @edit-tab-row="editTabRow"
      v-model:edit-index="editIndex"
      :actions="actions"
    >
      <v-form @submit.prevent="addTabRow" v-if="!isView">
        <v-row class="align-center mb-3">
          <v-col cols="12" lg="3" class="py-0">
            <form-select
              :list="individualProgramTypeList"
              v-model="IndividualProgram.individualProgramId"
              required
              density="compact"
              :label="$t('individualProgramType')"
              returnObject
              @update:model-value="(val: ISelectList) => setFields(val,'individualProgram')"
            ></form-select>
          </v-col>
          <v-col cols="12" lg="3" class="py-0">
            <form-select
              :list="organizationList"
              v-model="IndividualProgram.organizationId"
              required
              density="compact"
              :label="$t('organization')"
              returnObject
              @update:model-value="(val: ISelectList) => setFields(val,'organization')"
            ></form-select>
          </v-col>

          <v-col cols="12" lg="3" class="py-0">
            <form-input required :label="$t('deadlineOnDay')" mask="######" v-model="IndividualProgram.deadlineOnDay" />
          </v-col>
          <v-col cols="12" lg="3" class="py-2">
            <v-btn type="submit" :color="editIndex > -1 ? 'success' : 'info'">
              {{ editIndex > -1 ? $t("Save") : $t("AddRow") }}
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </FormTabRow>
    <v-row class="mt-4" v-if="!isView && data.canEdit">
      <v-col class="text-right">
        <v-btn color="success" :loading="saveLoading" variant="flat" type="submit">
          {{ $t("Save") }}
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<style lang="scss" scoped></style>
