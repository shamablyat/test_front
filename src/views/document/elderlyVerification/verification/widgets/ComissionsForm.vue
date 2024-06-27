<script setup lang="ts">
import ElderlyVerificationService from "@/services/document/elderlyVerification.service";
import { useErrorToast } from "@/utils/helpers/useErrorToast";
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { SubmitEventPromise } from "vuetify";
import { IComissions } from "../types";
import { useElderlyVerification } from "../store/useElderlyVerification";
import FormTabRow from "@/components/form/FormTabRow.vue";
import { ITableActions } from "@/models/basic";
import { useAdmManualStore } from "@/app/config/store/AdmManual";
import { storeToRefs } from "pinia";
import Loader from "../components/Loader.vue";
import AdmManualService from "@/services/others/admmanual.service";
import { notify } from "@kyvg/vue3-notification";
import { useI18n } from "vue-i18n";
import { UserInfo } from "@/components/UserInfo";
import PersonService from "@/services/others/person.service";
import SetPassportData from "@/components/setPassportData/SetPassportData.vue";
import UiParentCard from "@/components/UiParentCard.vue";
import { useManualStore } from "@/app/config/store/Manual";
import { INotHasDoc, IPassportIncludes } from "@/components/setPassportData/types";
import { usePhoneFormatter } from "@/utils/helpers/phoneFormatter";
import { useRoute } from "vue-router";
import i18n from "@/app/config/i18n";
import { VForm } from "vuetify/components";
import { useCheckPhoneNumber } from "@/composables/CheckPhoneNumber";

interface IProps {
  isView: boolean;
  userClickedSure: boolean;
}

const actions: ITableActions = {
  isDelete: true,
  isEdit: true
};

const emits = defineEmits<{
  (e: "setStep"): void;
  (e: "setActiveTab", value: number | string): void;
}>();

const comissionDef: IComissions = {
  id: 0,
  mfyAttachedMemberTableId: null,
  mfyAttachedMemberTypeId: 0,
  person: null,
  mfyAttachedMemberType: "",
  phoneNumber: "",
  phoneNumberAlt: "",
  canEdit: true
};

const includes: IPassportIncludes = {
  includePhoto: true
};

const fields = [
  { key: "fullName", label: "fullName", sort: true },
  { key: "mfyAttachedMemberType", label: "mfyAttachedMemberType", sort: true },
  { key: "phoneNumber", label: "phoneNumber", sort: true },
  { key: "phoneNumberAlt", label: "phoneNumberAlt", sort: true }
];

defineProps<IProps>();

const { t } = useI18n();
const { setError } = useErrorToast();
const store = useElderlyVerification();
const route = useRoute();
const { data } = storeToRefs(store);
const AdmManualStore = useAdmManualStore();
const manualStore = useManualStore();
const { MfyAttachedMemberTypeList, MfyAttachedMemberTypeListLoading } = storeToRefs(AdmManualStore);
store.setPensionTypeList();
const MfyAttachedMemberList = ref([]);
const MfyAttachedMemberListLoading = ref(false);
AdmManualStore.fetchMfyAttachedMemberTypeList();
manualStore.setDocumentTypeList();
const { set, get, formatPhoneNumber } = usePhoneFormatter();
const { phoneNumberRules } = useCheckPhoneNumber();

const isClear = ref(false);
const loading = ref(false);
const saveLoading = ref(false);
const isChanged = ref(false);
const editIndex = ref(-1);
const comission = ref<IComissions>({ ...comissionDef });
const comissions = ref<IComissions[]>([]);
const cachedCommission = ref<IComissions[]>([]);
const comissionLoading = ref<boolean>(false);
const personImage = ref<string>("");
const form = ref<Partial<typeof VForm>>();

const canEdit = computed(() => (comissions.value && comissions.value.some((el) => el.canEdit)) || true);
/* TABLE */
const addComission = async (submit: SubmitEventPromise) => {
  const { valid } = await submit;
  if (comission.value.phoneNumber) {
    comission.value.phoneNumber = set(comission.value.phoneNumber);
  }
  if (comission.value.phoneNumberAlt) {
    comission.value.phoneNumberAlt = set(comission.value.phoneNumberAlt);
  }
  if (valid) {
    if (editIndex.value > -1) {
      Object.assign(comissions.value?.[editIndex.value], JSON.parse(JSON.stringify(comission.value)));
    } else {
      if (
        comissions.value.some(
          (el) => el.mfyAttachedMemberTypeId === comission.value.mfyAttachedMemberTypeId || el.person?.pinfl === comission.value.person?.pinfl
        )
      ) {
        notify({
          // @ts-ignore
          text: i18n.global.t("duplicatedMfyAttachedMemberType"),
          type: "warn"
        });
        return;
      }
      comissions.value?.push(comission.value);
    }

    clearComission();
    editIndex.value = -1;
  }
};

const ClearData = () => {
  return (isClear.value = !isClear.value);
};
const clearComission = () => {
  ClearData();
  comission.value = JSON.parse(JSON.stringify(comissionDef));
};

const deleteComission = (index: number) => {
  comissions.value.splice(index, 1);
};

const setEditIndex = (value: number) => {
  editIndex.value = value;
  clearComission();
};

const editComission = (value: IComissions) => {
  editIndex.value = comissions.value.indexOf(value);
  comission.value = JSON.parse(JSON.stringify(value));
  comission.value.phoneNumber = get(value.phoneNumber);

  if (value.person?.id) {
    PersonService.GetPhotoFromGSP(value.person.id).then((res) => {
      personImage.value = `data:image/png;base64,${res.data.base64String}`;
    });
  }
};

const addPerson = (value: INotHasDoc) => {
  comission.value.person = {
    id: 0,
    ...value
  };
};

const searchPerson = (value: any) => {
  comissionLoading.value = true;
  const filter = {
    ...value,
    ...includes
  };
  PersonService.GetByPassportData(filter)
    .then((res) => {
      personImage.value = `data:image/png;base64,${res.data.photo}`;
      res.data.photo = null;
      comission.value.person = res.data;
    })
    .catch((err) => {
      setError(err);
    })
    .finally(() => {
      comissionLoading.value = false;
    });
};

/* UPDATE MODULE */
const setField = (value: any, key: string) => {
  if (value && value.value) {
    // @ts-ignore
    comission.value[key] = value.text;
    // @ts-ignore
    comission.value[key + "Id"] = value.value;
  }
};

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
    const promise = new Promise((resolve, reject) => {
      // const exists = MfyAttachedMemberTypeList.value.every((el) => comissions.value.some((c) => c.mfyAttachedMemberTypeId === el.value));

      // if (!exists) {
      //   notify({
      //     // @ts-ignore
      //     text: i18n.global.t("notSelectedAllComissions"),
      //     type: "warn"
      //   });

      //   return;
      // }
      saveLoading.value = true;

      ElderlyVerificationService.UpdateElderlyVerificationWithComissions({
        id: data.value.id,
        comissions: comissions.value
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
          emits("setStep");
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
loading.value = true;
ElderlyVerificationService.GetIncludes({
  id: route.params.id as string,
  includeComissions: true
})
  .then((res) => {
    if (Array.isArray(res.data.comissions)) {
      comissions.value = res.data.comissions;
      cachedCommission.value = JSON.parse(JSON.stringify(res.data.comissions));
      fetchMfyAttachedMemberList({
        docOn: data.value.docOn,
        regionId: data.value.regionId!,
        districtId: data.value.districtId!,
        mfyId: data.value.mfyId!
      });
    }
  })
  .finally(() => {
    loading.value = false;
  });

const fetchMfyAttachedMemberList = (bodyData: { docOn: string; regionId: number; mfyId: number; districtId: number }) => {
  MfyAttachedMemberListLoading.value = true;
  AdmManualService.GetMfyAttachedMember(bodyData)
    .then((res) => {
      if (res.data) {
        if (Array.isArray(res.data.tables)) {
          MfyAttachedMemberList.value = res.data.tables;
          if (data.value.id == 0) {
            comissions.value = res.data.tables.map((e: IComissions) => ({ ...e, id: 0 }));
          }
        }
      }
    })
    .finally(() => {
      MfyAttachedMemberListLoading.value = false;
    });
};

defineExpose({
  saveData,
  form: form,
  isChanged: isChanged
});

watch(
  () => comissions.value,
  () => {
    isChanged.value = false;
    if (JSON.stringify(comissions.value) !== JSON.stringify(cachedCommission.value)) {
      isChanged.value = true;
    }
  },
  { deep: true }
);

onBeforeUnmount(() => {
  // if (MfyAttachedMemberTypeList.value) {
  //   const exists = MfyAttachedMemberTypeList.value.every((el) => comissions.value.some((c) => c.mfyAttachedMemberTypeId === el.value));
  //   if (!exists && !props.isView) {
  //     notify({
  //       // @ts-ignore
  //       text: i18n.global.t("notSelectedAllComissions"),
  //       type: "warn"
  //     });
  //     emits("setActiveTab", 2);
  //   }
  //   return;
  // }
});
</script>

<template>
  <Loader v-if="loading" />

  <v-form v-else @submit.prevent="saveData" ref="form">
    <FormTabRow
      class="mt-2"
      :items="comissions"
      v-model:edit-index="editIndex"
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
      :actions="actions"
      @update:edit-index="setEditIndex"
      @delete-tab-row="deleteComission"
      @edit-tab-row="editComission"
    >
      <v-form @submit.prevent="addComission" v-if="!isView">
        <UiParentCard>
          <SetPassportData
            v-if="!isView"
            :clear="isClear"
            :document-type-list="manualStore.getDocumentTypeList"
            :search-lading="comissionLoading"
            @set-person="searchPerson"
            @add-person="addPerson"
          />

          <UserInfo v-if="comission.person" class="mb-2 mt-5" :person="comission.person" :image="personImage" :includes="includes" />
        </UiParentCard>
        <UiParentCard class="my-4">
          <v-row class="mb-3">
            <v-col cols="12" sm="3" class="py-0">
              <form-select
                :list="MfyAttachedMemberTypeList"
                :loading="MfyAttachedMemberTypeListLoading"
                required
                v-model="comission.mfyAttachedMemberTypeId"
                returnObject
                @update:model-value="(val:any)=> setField(val, 'mfyAttachedMemberType')"
                :label="$t('mfyAttachedMemberType')"
              >
              </form-select>
            </v-col>
            <v-col cols="12" sm="3" class="py-0">
              <form-input v-model="comission.phoneNumber" mask="+998 ## ### ## ##" :rules="phoneNumberRules" required :label="$t('phoneNumber')" />
            </v-col>
            <v-col cols="12" sm="3" class="py-0">
              <form-input v-model="comission.phoneNumberAlt" mask="+998 ## ### ## ##" :rules="phoneNumberRules" :label="$t('phoneNumberAlt')" />
            </v-col>

            <v-col cols="3" class="py-0">
              <v-btn class="mt-6" :disabled="!comission.person" type="submit" :color="editIndex > -1 ? 'success' : 'info'">
                {{ editIndex > -1 ? $t("Save") : $t("AddRow") }}
              </v-btn>
            </v-col>
          </v-row>
        </UiParentCard>
      </v-form>

      <template #fullName="{ item }">
        <td>
          {{ item?.person?.fullName }}
        </td>
      </template>
      <template #phoneNumber="{ item }">
        <td>{{ formatPhoneNumber(item?.phoneNumber) }}</td>
      </template>
      <template #phoneNumberAlt="{ item }">
        <td>{{ formatPhoneNumber(item.phoneNumberAlt) }}</td>
      </template>
    </FormTabRow>

    <v-row class="mt-4" v-if="canEdit && !isView">
      <v-col class="text-right">
        <v-btn color="success" :loading="saveLoading" variant="flat" type="submit">
          {{ $t("Save") }}
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>
