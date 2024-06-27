<script setup lang="ts">
import ElderlyVerificationService from "@/services/document/elderlyVerification.service";
import { useErrorToast } from "@/utils/helpers/useErrorToast";
import { computed, ref, watch } from "vue";
import { SubmitEventPromise } from "vuetify";
import { IHealth } from "../types";
import { useElderlyVerification } from "../store/useElderlyVerification";
import { ISelectList } from "@/models/basic";
import { useAdmManualStore } from "@/app/config/store/AdmManual";
import { storeToRefs } from "pinia";
import Loader from "../components/Loader.vue";
import { notify } from "@kyvg/vue3-notification";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { usePhoneFormatter } from "@/utils/helpers/phoneFormatter";
import { useGlobal } from "@/composables/useGlobal";
import { VForm } from "vuetify/components";
import AdmManualService from "@/services/others/admmanual.service";
import ListGroup from "../components/ListGroup.vue";
import { useCheckPhoneNumber } from "@/composables/CheckPhoneNumber";
import { useManualStore } from "@/app/config/store/Manual";

interface IProps {
  isView: boolean;
}

defineProps<IProps>();

const emits = defineEmits(["setStep", "setActiveTab"]);

/* CONSTANTS */

const healthDef: IHealth = {
  id: 0,
  polyclinic: "",
  polyclinicPhoneNumber: "",
  doctor: null,
  // doctorPhoneNumber: "",
  medicament: "",
  infectiousDiseaseIcd10: "",
  canBuyForSelf: false,
  isPsix: false,
  complaints: "",
  mainIcd10Id: null,
  infectiousDiseaseIcd10Id: null,
  patrianashNursePeriodTypeId: null,
  secondaryIcd10Id: null,
  patrianashNurseWeeklyCommute: "",
  inDepthMedicalExaminationOn: "",
  disabilityGroupRecheckOn: "",
  treatmentTypeId: null,
  preferentialMnnIds: [],
  alwaysConsumeMnnIds: [],
  mainIcd10: "",
  secondaryIcd10: "",
  dateOfLastDispensaryInspectionOn: "",
  polyclinicAddress: "",

  hasNotComplaints: true,
  hasPrivilegeMnn: false,
  canEdit: false,
  privilegeMnnsIds: []
};

/* STORE AND IMPORTS */
const { t } = useI18n();
const { setError } = useErrorToast();
const { disabledBeforeDays } = useGlobal();
const { phoneNumberRules } = useCheckPhoneNumber();

const route = useRoute();
const store = useElderlyVerification();
const AdmManualStore = useAdmManualStore();
const manualStore = useManualStore();
const { data } = storeToRefs(store);
const { set } = usePhoneFormatter();

store.setPensionTypeList();
AdmManualStore.fetchTreatmentTypeSelectList();
AdmManualStore.fetchMnnSelectList("?isPrivilege=true");
AdmManualStore.fetchMnnSelectListWithoutPrivilege();
manualStore.fetchPeriodTypeSelectList();

/* VARIABLES */

const form = ref<Partial<typeof VForm>>();
const loading = ref(false);
const saveLoading = ref(false);
const isChanged = ref(false);
const mainIcd10List = ref<any[]>([]);
const secondaryIcd10List = ref<any[]>([]);
const infectiousDiseaseIcd10List = ref<any[]>([]);
const mainIcd10IdModal = ref(false);
const secondaryIcd10IdModal = ref(false);
const infectiousDiseaseIcd10Modal = ref(false);

const cachedHealth = ref<IHealth>({ ...healthDef });
const health = ref<IHealth>({ ...healthDef });
const canEdit = computed(() => (health.value && health.value.canEdit) || true);

const requiredRules = [
  (value: string | null) => {
    if (value) return true;
    return t("fieldNotEmpty");
  }
];

/* SAVE */

const saveData = async (submit: SubmitEventPromise) => {
  const { valid, errors } = await submit;
  if (errors && errors.length > 0) {
    document.getElementById(String(errors[0].id))?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "center"
    });
  }

  if (valid) {
    saveLoading.value = true;
    if (health.value.polyclinicPhoneNumber) {
      health.value.polyclinicPhoneNumber = set(health.value.polyclinicPhoneNumber);
    }

    const promise = new Promise((resolve, reject) => {
      ElderlyVerificationService.UpdateElderlyVerificationWithHealth({
        id: data.value.id,
        health: health.value
      })
        .then(() => {
          isChanged.value = false;
          notify({
            text: t("SaveSuccess"),
            type: "success"
          });

          if ((route.params.id as string) != "0") {
            store.setElderlyVerificationTableHasValue(data.value.id);
          }

          // emits("setStep");
          emits("setActiveTab", 5);
          resolve("success");
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

/* GET */

const acceptData = () => {
  const GetVitekvtekInfoByVerificationId = new Promise((resolve, reject) => {
    ElderlyVerificationService.GetVitekvtekInfoByVerificationId(data.value.id)
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e);
      });
  });

  const GetPsychoNeurologicInfobyVerificationId = new Promise((resolve, reject) => {
    ElderlyVerificationService.GetPsychoNeurologicInfobyVerificationId(data.value.id)
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e);
      });
  });

  Promise.all([GetVitekvtekInfoByVerificationId, GetPsychoNeurologicInfobyVerificationId]).then((values: any[]) => {
    if (values) {
      if (values[0] as any) {
        health.value.disabilityGroupRecheckOn = values[0].disability_date_end;
      }
      if ((values[1] as boolean) !== null) {
        health.value.isPsix = values[1] as boolean;
      }
    }
  });
};

const get = () => {
  loading.value = true;
  ElderlyVerificationService.GetIncludes({
    id: data.value.id,
    includeHealth: true
  })
    .then((res) => {
      acceptData();
      if (res.data.health) {
        health.value = res.data.health;

        cachedHealth.value = JSON.parse(JSON.stringify(res.data.health));
      }
    })
    .finally(() => {
      loading.value = false;
    });
};

const updateHasNotComplaints = () => {
  if (!health.value.hasNotComplaints) {
    health.value.complaints = "";
  }
};
const updateHasIsPirivilegeMnn = () => {
  health.value.privilegeMnnsIds = [];
};

get();
defineExpose({
  saveData,
  form: form,
  isChanged: isChanged
});

const getIcd10 = () => {
  AdmManualService.Icd10SelectList().then((res) => {
    mainIcd10List.value = res.data;
    secondaryIcd10List.value = res.data;
    infectiousDiseaseIcd10List.value = res.data;
  });
};

const setIcd10 = (item: ISelectList, key: string) => {
  if (item) {
    // @ts-ignore
    health.value[key] = item.text;
    // @ts-ignore
    health.value[key + "Id"] = item.value;

    mainIcd10IdModal.value = false;
    secondaryIcd10IdModal.value = false;
    infectiousDiseaseIcd10Modal.value = false;
  }
};

getIcd10();

watch(
  () => health.value,
  () => {
    isChanged.value = false;
    if (JSON.stringify(health.value) !== JSON.stringify(cachedHealth.value)) {
      isChanged.value = true;
    }
  },
  { deep: true }
);
</script>

<template>
  <Loader v-if="loading" />

  <v-form v-else @submit.prevent="saveData" ref="form">
    <v-row class="mb-2">
      <v-col cols="12" lg="3" md="6" class="py-0">
        <form-input :disabled="isView" v-model="health.polyclinic" required :label="$t('polyclinic')" />
      </v-col>
      <v-col cols="12" lg="3" md="6" class="py-0">
        <form-input :disabled="isView" v-model="health.polyclinicAddress" required :label="$t('polyclinicAddress')" />
      </v-col>
      <v-col cols="12" lg="3" md="6" class="py-0">
        <form-input
          :disabled="isView"
          v-model="health.polyclinicPhoneNumber"
          :rules="phoneNumberRules"
          mask="+998 (##) ###-##-##"
          :label="$t('polyclinicPhoneNumber')"
        />
      </v-col>

      <v-col cols="12" lg="3" md="6" class="py-0">
        <form-checkbox :disabled="isView" v-model="health.canBuyForSelf" color="primary" :label="$t('canBuyForSelf')" />
      </v-col>
    </v-row>

    <v-divider />
    <!-- doctor -->
    <v-row class="mt-3" align="center">
      <v-col cols="12">
        <h2>{{ $t("doctor") }}</h2>
      </v-col>
    </v-row>
    <v-row class="mb-3">
      <v-col cols="12" lg="3" md="6" class="py-0">
        <form-input :disabled="isView" v-model="health.patrianashNurseWeeklyCommute" mask="###" :label="$t('patrianashNurseWeeklyCommute')" />
      </v-col>
      <v-col cols="12" lg="3" md="6" class="py-0">
        <form-select
          :list="manualStore.periodTypeSelectList"
          :required="!!String(health.patrianashNurseWeeklyCommute).length || !!health.patrianashNurseWeeklyCommute == null"
          :disabled="isView"
          clearable
          v-model="health.patrianashNursePeriodTypeId"
          :label="$t('patrianashNursePeriodType')"
        />
      </v-col>
    </v-row>

    <v-divider class="my-3" />

    <v-row class="mt-4" align="center">
      <v-col cols="12">
        <h2>{{ $t("healthStatuses") }}</h2>
      </v-col>
    </v-row>

    <v-row class="mb-5 align-center">
      <!-- TREE -->
      <v-col cols="12" lg="3" md="6" class="py-0">
        <v-menu location="left" v-model="mainIcd10IdModal" :close-on-content-click="false">
          <template #activator="{ props }">
            <form-input :label="$t('mainIcd10')" v-bind="props" v-model="health.mainIcd10" readonly> </form-input>
          </template>
          <v-card max-height="500" max-width="450">
            <v-list>
              <ListGroup :service="AdmManualService" :list="mainIcd10List" @update:model-value="(val: ISelectList) => setIcd10(val, 'mainIcd10')" />
            </v-list>
          </v-card>
        </v-menu>
      </v-col>
      <v-col cols="12" lg="3" md="6" class="py-0">
        <v-menu location="left" v-model="secondaryIcd10IdModal" :close-on-content-click="false">
          <template #activator="{ props }">
            <form-input :label="$t('secondaryIcd10')" v-bind="props" v-model="health.secondaryIcd10" readonly> </form-input>
          </template>
          <v-card max-height="500" max-width="450">
            <v-list>
              <ListGroup
                :service="AdmManualService"
                :list="secondaryIcd10List"
                @update:model-value="(val: ISelectList) => setIcd10(val, 'secondaryIcd10')"
              />
            </v-list>
          </v-card>
        </v-menu>
      </v-col>
      <!-- infectiousDiseaseIcd10List -->
      <v-col cols="12" lg="3" md="6" class="py-0">
        <v-menu location="left" v-model="infectiousDiseaseIcd10Modal" :close-on-content-click="false">
          <template #activator="{ props }">
            <form-input :label="$t('infectiousDiseaseIcd10')" v-bind="props" v-model="health.infectiousDiseaseIcd10" readonly> </form-input>
          </template>
          <v-card max-height="500" max-width="450">
            <v-list>
              <ListGroup
                :service="AdmManualService"
                :list="infectiousDiseaseIcd10List"
                @update:model-value="(val: ISelectList) => setIcd10(val, 'infectiousDiseaseIcd10')"
              />
            </v-list>
          </v-card>
        </v-menu>
      </v-col>

      <v-col cols="12" lg="3" md="6" class="py-0">
        <form-select :list="AdmManualStore.mnnSelectList" :label="$t('preferentialMnnIds')" multiple clearable v-model="health.preferentialMnnIds" />
      </v-col>
      <v-col cols="12" lg="3" md="6" class="py-0">
        <form-select
          :list="AdmManualStore.mnnSelectListWithoutPrivilege"
          :label="$t('alwaysConsumeMnnIds')"
          multiple
          clearable
          v-model="health.alwaysConsumeMnnIds"
        />
      </v-col>

      <v-col cols="12" lg="3">
        <v-row class="mb-3 mt-3">
          <v-col cols="12" class="py-0">
            <v-label>
              {{ $t("hasPrivilegeMnn") }}
            </v-label>
          </v-col>
          <v-col cols="12" lg="6" class="py-0">
            <v-checkbox v-model="health.hasPrivilegeMnn" :value="true" :label="$t('yes')" />
          </v-col>
          <v-col cols="12" lg="6" class="py-0">
            <v-checkbox v-model="health.hasPrivilegeMnn" :value="false" :label="$t('no')" @update:model-value="updateHasIsPirivilegeMnn" />
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12" lg="3" md="6" class="py-0" v-if="health.hasPrivilegeMnn">
        <form-select
          :list="AdmManualStore.mnnSelectList"
          :label="$t('privilegeMnn')"
          multiple
          :required="health.hasPrivilegeMnn"
          clearable
          v-model="health.privilegeMnnsIds"
        />
      </v-col>
    </v-row>
    <v-row class="align-end my-2">
      <!-- SELECTS -->

      <v-col cols="12" lg="3" md="6" class="py-0">
        <form-select :list="AdmManualStore.treatmentTypeSelectList" :label="$t('treatmentType')" required v-model="health.treatmentTypeId" />
      </v-col>

      <v-col cols="12" lg="3" md="6" class="py-0">
        <form-picker
          clearable
          :disabledDate="disabledBeforeDays"
          :disabled="isView"
          v-model="health.inDepthMedicalExaminationOn"
          required
          :label="$t('inDepthMedicalExaminationOn')"
        />
      </v-col>
      <v-col cols="12" lg="3" md="6" class="py-0 mb-6">
        <form-picker
          clearable
          :disabledDate="disabledBeforeDays"
          disabled
          v-model="health.disabilityGroupRecheckOn"
          :label="$t('disabilityGroupRecheckOn')"
        />
      </v-col>
      <v-col cols="12" lg="3" md="6" class="py-0 mb-6">
        <form-picker
          clearable
          :disabledDate="disabledBeforeDays"
          :disabled="isView"
          v-model="health.dateOfLastDispensaryInspectionOn"
          :label="$t('lastPolyclinicOn')"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" lg="6">
        <v-row class="mb-3 mt-3">
          <v-col cols="12" class="py-0">
            <v-label>
              {{ $t("isPsix") }}
            </v-label>
          </v-col>
          <v-col cols="12" lg="3" class="py-0">
            <v-checkbox disabled v-model="health.isPsix" :value="true" :label="$t('yes')" />
          </v-col>
          <v-col cols="12" lg="3" class="py-0">
            <v-checkbox disabled v-model="health.isPsix" :value="false" :label="$t('no')" />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" lg="6">
        <v-row class="mb-3 mt-3">
          <v-col cols="12" class="py-0">
            <v-label>
              {{ $t("isComplaints") }}
            </v-label>
          </v-col>
          <v-col cols="12" lg="3" class="py-0">
            <v-checkbox v-model="health.hasNotComplaints" :value="true" :label="$t('yes')" />
          </v-col>
          <v-col cols="12" lg="3" class="py-0">
            <v-checkbox v-model="health.hasNotComplaints" :value="false" :label="$t('no')" @update:model-value="updateHasNotComplaints" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row class="mt-3" v-if="health.hasNotComplaints">
      <v-col cols="12">
        <v-label class="mb-2 font-weight-medium wrap">
          {{ $t("healthConclusion") }}
          <span class="text-error"> * </span>
        </v-label>
        <v-textarea :rules="requiredRules" v-model="health.complaints"></v-textarea>
      </v-col>
    </v-row>

    <v-row class="mt-4" v-if="!isView && canEdit">
      <v-col class="text-right">
        <v-btn color="success" :loading="saveLoading" variant="flat" type="submit">
          {{ $t("Save") }}
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>
