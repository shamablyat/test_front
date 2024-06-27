<script setup lang="ts">
import ElderlyVerificationService from "@/services/document/elderlyVerification.service";
import { useErrorToast } from "@/utils/helpers/useErrorToast";
import { computed, ref, watch } from "vue";
import { SubmitEventPromise } from "vuetify";
import { IFamily, IMember } from "../types";
import { useElderlyVerification } from "../store/useElderlyVerification";
import FormTabRow from "@/components/form/FormTabRow.vue";
import { IFields, IPerson, ISelectList, ITableActions } from "@/models/basic";
import { useAdmManualStore } from "@/app/config/store/AdmManual";
import { storeToRefs } from "pinia";
import Loader from "../components/Loader.vue";
import { notify } from "@kyvg/vue3-notification";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { VForm } from "vuetify/components";
import SetPassportData from "@/components/setPassportData/SetPassportData.vue";
import { useManualStore } from "@/app/config/store/Manual";
import { INotHasDoc, IPassportIncludes, ISetPassportData } from "@/components/setPassportData/types";
import PersonService from "@/services/others/person.service";
import { UserInfo } from "@/components/UserInfo";
import { BASE64STRING } from "@/utils/constants";
import { AxiosResponse } from "axios";
import { useGlobal } from "@/composables/useGlobal";
import { usePhoneFormatter } from "@/utils/helpers/phoneFormatter";
import i18n from "@/app/config/i18n";
import FamilyList from "../components/FamilyList.vue";

interface IProps {
  isView: boolean;
}

defineProps<IProps>();
const emits = defineEmits(["setStep", "refreshData"]);

/* CONSTANTS */

const actions: ITableActions = {
  isDelete: true,
  isEdit: true
};

const memberDef: IMember = {
  id: 0,
  kinshipDegreeId: 0,
  isCareRegularly: true,
  disabilityGroup: null,
  elderlyFamilyMemberPlaceId: null,
  pensionAmount: null,
  pensionTypeId: null,
  elderlyFamilyMemberPlace: "",
  kinshipDegree: "",
  personBirthOn: "",
  personDocNumber: "",
  personDocSeria: "",
  personDocumentTypeId: null,
  personFullName: "",
  personGenderId: null,
  personPinfl: "",
  returnOn: "",
  personGender: "",
  phoneNumber: "",
  isLivingTogether: false,
  notLivingTogether: "",
  notComplete: null
};

const familyDef: IFamily = {
  id: 0,
  isCareRegularly: false,
  hasHeir: false,
  canEdit: false,
  heirCount: null,
  members: []
};

const fields: IFields[] = [
  { key: "personFullName", label: "fullName", sort: true },
  { key: "personBirthOn", label: "birthOn", sort: true },
  { key: "personPinfl", label: "pinfl", sort: true },
  { key: "disabilityGroup", label: "passportData.disabilityGroup", sort: true },
  { key: "pensionAmount", label: "passportData.pensionAmount", sort: true, isAmount: true },
  { key: "kinshipDegree", label: "kinshipDegree", sort: true },
  { key: "elderlyFamilyMemberPlace", label: "elderlyFamilyMemberPlace", sort: true },
  { key: "returnOn", label: "returnOn", sort: true },
  { key: "phoneNumber", label: "phoneNumber", sort: true },
  { key: "isLivingTogether", label: "isLivingTogether", sort: true },
  { key: "notLivingTogether", label: "notLivingTogether", sort: true }
];

const includes: IPassportIncludes = {
  includePhoto: true,
  includePension: true,
  includeDisabilityGroup: true
};

/* STORE && IMPORTS */
const { t } = useI18n();
const { setError } = useErrorToast();
const route = useRoute();
const store = useElderlyVerification();
const AdmManualStore = useAdmManualStore();
const manualStore = useManualStore();

const { KinshipDegreeList, KinshipDegreeListLoading } = storeToRefs(AdmManualStore);
const { data } = storeToRefs(store);
const { disabledBeforeDays } = useGlobal();
const { set } = usePhoneFormatter();

store.setPensionTypeList();
AdmManualStore.fetchKinshipDegreeList(1);
manualStore.fetchElderlyFamilyMemberPlaceSelectList();
manualStore.setDocumentTypeList();

/* VARIABLES */

const member = ref<IMember>({ ...memberDef });
const form = ref<Partial<typeof VForm>>();
const cachedFamily = ref<IFamily>({ ...familyDef });
const family = ref<IFamily>({ ...familyDef });
const editIndex = ref(-1);
const person = ref<IPerson | null>(null);

const checkFamily = ref<boolean>(false);
const membersCount = ref(0);
const personImage = ref("");

const isClear = ref(false);
const loading = ref(false);
const saveLoading = ref(false);
const searchLoading = ref(false);
const isChanged = ref(false);

const canEdit = computed(() => (family.value && family.value.canEdit) || true);
/* TABLE */
const addMembers = (members: IMember[]) => {
  if (family.value.members.some((el) => members.some((d) => el.personPinfl == d.personPinfl))) {
    notify({
      // @ts-ignore
      text: i18n.global.t("duplicatedPersons"),
      type: "warn"
    });
    return;
  }

  let filteredArray = members.filter((obj) => !obj.notComplete);
  family.value.members = filteredArray;
};
const addMember = async (submit: SubmitEventPromise) => {
  const { valid, errors } = await submit;
  if (errors && errors.length > 0) {
    // @ts-ignore
    document.getElementById(errors[0].id)?.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center"
    });
  }
  if (valid) {
    if (editIndex.value > -1) {
      Object.assign(family.value?.members[editIndex.value], JSON.parse(JSON.stringify(member.value)));
    } else {
      family.value?.members.push(member.value);
    }

    family.value.members.forEach((el) => {
      if (!el.isLivingTogether) {
        el.isLivingTogether = false;
      }
    });

    clearMember();
    editIndex.value = -1;
  }
};

const deleteMember = (index: number) => {
  if (family.value) {
    family.value.members.splice(index, 1);
  }
};

const editMember = (item: IMember) => {
  editIndex.value = family.value.members.indexOf(item);
  member.value = JSON.parse(JSON.stringify(item));
  const filter: ISetPassportData = {
    dateOfBirth: item.personBirthOn,
    documentTypeId: item.personDocumentTypeId,
    number: item.personDocNumber,
    // @ts-ignore
    seria: item.personDocSeria
  };
  searchPerson(filter);
};

const ClearData = () => {
  return (isClear.value = !isClear.value);
};

const clearMember = () => {
  ClearData();
  member.value = JSON.parse(JSON.stringify(memberDef));
  person.value = null;
};

const setEditIndex = (value: number) => {
  editIndex.value = value;
  clearMember();
};
const addPerson = (value: INotHasDoc) => {
  person.value = JSON.parse(JSON.stringify(value));
  member.value.personBirthOn = value.birthOn || "";
  member.value.personDocumentTypeId = value.documentTypeId || null;

  member.value.personFullName = value.lastName + " " + value.firstName + " " + value.middleName;
  member.value.personPinfl = "";

  member.value.disabilityGroup = null;
  member.value.pensionAmount = null;
  member.value.pensionTypeId = null;
  member.value.personGenderId = value.genderId || null;
};
/* PERSON */
const searchPerson = (value: ISetPassportData) => {
  // member.value.person = value;
  const filter = {
    ...value,
    ...includes
  };

  searchLoading.value = true;

  PersonService.GetByPassportData(filter)
    .then((res: AxiosResponse<IPerson>) => {
      personImage.value = BASE64STRING + res.data.photo;
      res.data.photo = "";
      person.value = JSON.parse(JSON.stringify(res.data));

      member.value.personBirthOn = res.data.birthOn || "";
      member.value.personDocNumber = res.data.docNumber || null;
      member.value.personDocSeria = res.data.docSeria || "";
      member.value.personDocumentTypeId = res.data.documentTypeId || null;

      member.value.personFullName = res.data.fullName || "";
      member.value.personPinfl = res.data.pinfl || "";

      member.value.disabilityGroup = res.data.disabilityGroup || null;
      member.value.pensionAmount = res.data.pension?.amount || null;
      member.value.pensionTypeId = res.data.pension?.pensionTypeId || null;
      member.value.personGender = res.data.genderName || "";
      member.value.personGenderId = res.data.genderId || null;
    })
    .catch((e) => {
      setError(e);
    })
    .finally(() => {
      searchLoading.value = false;
    });
};

/* UPDATE MODULES */

const setField = (value: any, key: string) => {
  if (value && value.value) {
    // @ts-ignore
    member.value[key] = value.text;
    // @ts-ignore
    member.value[key + "Id"] = value.value;
  } else {
    // @ts-ignore
    member.value[key] = "";
    // @ts-ignore
    member.value[key + "Id"] = null;
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
    if (!checkFamily.value) {
      document
        // @ts-ignore
        .getElementById("serchMember")
        ?.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "center"
        });
      notify({
        text: t("checkFamilyMembers"),
        type: "warn"
      });

      return;
    }
    if (family.value && family.value.members && family.value.members.length < membersCount.value) {
      document
        // @ts-ignore
        .getElementById("serchMember")
        ?.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "center"
        });
      notify({
        text: t("addFamilyMembers"),
        type: "warn"
      });

      return;
    }

    saveLoading.value = true;
    const promise = new Promise((resolve, reject) => {
      family.value.members.forEach((el) => {
        if (el.phoneNumber) {
          el.phoneNumber = set(el.phoneNumber);
        }
      });
      ElderlyVerificationService.UpdateElderlyVerificationWithFamily({
        id: data.value.id,
        family: family.value
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
          resolve("success");
          emits("refreshData", () => {}, true);
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
const get = () => {
  loading.value = true;
  ElderlyVerificationService.GetIncludes({
    id: route.params.id as string,
    includeFamily: true
  })
    .then((res) => {
      if (res.data.family) {
        family.value = res.data.family;
        cachedFamily.value = JSON.parse(JSON.stringify(res.data.family));
      }
    })
    .finally(() => {
      loading.value = false;
    });
};

const requiredRules = [
  (value: string | null) => {
    if (value) return true;
    // @ts-ignore
    return i18n.global.t("fieldNotEmpty");
  }
];

const elderlyFamilyMemberPlaceTitle = (item: ISelectList) => {
  return item.value + "  " + item.text;
};
const checkMembers = (item: any) => {
  membersCount.value = item;
  checkFamily.value = true;
};
get();

defineExpose({
  saveData,
  form: form,
  isChanged: isChanged
});

watch(
  () => family.value,
  () => {
    isChanged.value = false;
    if (JSON.stringify(family.value) !== JSON.stringify(cachedFamily.value)) {
      isChanged.value = true;
    }
  },
  { deep: true }
);
</script>

<template>
  <Loader v-if="loading" />

  <v-form v-else @submit.prevent="saveData" ref="form">
    <v-row class="mb-4">
      <!-- <v-col cols="12" lg="6" class="py-0">
        <v-row class="mb-3 mt-3">
          <v-col cols="12" class="py-0">
            <v-label>
              {{ $t("isAlone") }}
            </v-label>
          </v-col>
          <v-col cols="12" lg="3" class="py-0">
            <v-checkbox v-model="family.isAlone" :value="true" @update:model-value="changeIsAlone" :label="$t('yes')" />
          </v-col>
          <v-col cols="12" lg="3" class="py-0">
            <v-checkbox v-model="family.isAlone" :value="false" @update:model-value="changeIsAlone" :label="$t('no')" />
          </v-col>
        </v-row>
      </v-col> -->

      <v-col cols="12" lg="6" class="py-0">
        <v-row class="mb-3 mt-3">
          <v-col cols="12" class="py-0">
            <v-label>
              {{ $t("hasHeir") }}
            </v-label>
          </v-col>
          <v-col cols="12" lg="3" class="py-0">
            <v-checkbox v-model="family.hasHeir" :value="true" :label="$t('yes')" />
          </v-col>
          <v-col cols="12" lg="3" class="py-0">
            <v-checkbox v-model="family.hasHeir" :value="false" :label="$t('no')" />
          </v-col>
          <v-col cols="12" lg="6" class="py-0" v-if="family.hasHeir">
            <form-input v-model="family.heirCount" mask="##############" :placeholder="$t('heirCount')" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-divider />

    <div id="serchMember">
      <v-card elevation="0" class="border mt-4" v-if="!isView">
        <v-card-title>
          {{ $t("searchMembersByPinfl") }}
        </v-card-title>
        <v-card-text>
          <FamilyList
            @add-member="addMembers"
            :includes="includes"
            :data="family"
            :kinship-degree-list="KinshipDegreeList"
            :kinship-degree-list-loading="KinshipDegreeListLoading"
            @check-members="checkMembers($event)"
          />
        </v-card-text>
      </v-card>
    </div>

    <FormTabRow
      class="mt-2"
      :items="family.members"
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
      @delete-tab-row="deleteMember"
      @edit-tab-row="editMember"
    >
      <v-form @submit.prevent="addMember" v-if="!isView && checkFamily">
        <v-row>
          <v-col cols="12" lg="3" class="py-0">
            <form-select
              :list="KinshipDegreeList"
              required
              :loading="KinshipDegreeListLoading"
              v-model="member.kinshipDegreeId"
              returnObject
              @update:model-value="(val:any)=> setField(val, 'kinshipDegree')"
              :label="$t('kinshipDegree')"
            >
            </form-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <SetPassportData
              class="mt-8"
              v-if="!isView"
              :clear="isClear"
              :document-type-list="manualStore.getDocumentTypeList"
              @set-person="searchPerson"
              :search-lading="searchLoading"
              @add-person="addPerson"
            />

            <UserInfo :person="person" class="my-4" :includes="includes" :image="personImage" />
          </v-col>
        </v-row>
        <v-row class="align-center mb-3">
          <v-col cols="12" lg="3" class="py-0">
            <form-select
              :list="manualStore.elderlyFamilyMemberPlaceSelectList"
              v-model="member.elderlyFamilyMemberPlaceId"
              returnObject
              clearable
              @update:model-value="(val:any)=> setField(val, 'elderlyFamilyMemberPlace')"
              :label="$t('elderlyFamilyMemberPlace')"
              :item-title="elderlyFamilyMemberPlaceTitle"
            >
            </form-select>
          </v-col>
          <v-col cols="12" lg="3" class="py-0">
            <form-picker v-model="member.returnOn" :disabledDate="disabledBeforeDays" :label="$t('returnOn')" clearable> </form-picker>
          </v-col>
          <v-col cols="12" lg="3" class="py-0">
            <form-input v-model="member.phoneNumber" :label="$t('phoneNumber')" mask="+998 (##) ###-##-##"> </form-input>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" lg="6">
            <v-row>
              <v-col cols="12" class="py-0">
                <v-label>
                  {{ $t("isCareRegularly") }}
                </v-label>
              </v-col>
              <v-col cols="12" lg="3" class="py-0">
                <v-checkbox v-model="member.isCareRegularly" :value="true" :label="$t('yes')" />
              </v-col>
              <v-col cols="12" lg="3" class="py-0">
                <v-checkbox v-model="member.isCareRegularly" :value="false" :label="$t('no')" />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" lg="6">
            <v-row class="py-0">
              <v-col cols="12" class="py-0">
                <v-label>
                  {{ $t("isLivingTogether") }}
                </v-label>
              </v-col>
              <v-col cols="12" lg="3" class="py-0">
                <v-checkbox v-model="member.isLivingTogether" :value="true" :label="$t('yes')" />
              </v-col>
              <v-col cols="12" lg="3" class="py-0">
                <v-checkbox v-model="member.isLivingTogether" :value="false" :label="$t('no')" />
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-label class="mb-2 font-weight-medium wrap">
              {{ $t("notLivingTogether") }}
              <span v-if="!member.isLivingTogether" style="color: red">*</span>
            </v-label>
            <v-textarea :rules="!member.isLivingTogether ? requiredRules : []" validate-on="lazy submit" v-model="member.notLivingTogether">
            </v-textarea>
          </v-col>
        </v-row>

        <v-row class="mb-4">
          <v-col cols="12" lg="3" class="py-0">
            <v-btn :disabled="!person" type="submit" :color="editIndex > -1 ? 'success' : 'info'">
              {{ editIndex > -1 ? $t("Save") : $t("AddRow") }}
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
      <template #genderName="{ item }">
        <td>{{ item.person?.genderName }}</td>
      </template>
      <template #fullName="{ item }">
        <td>{{ item.person?.fullName }}</td>
      </template>
      <template #birthOn="{ item }">
        <td>{{ item.person?.birthOn }}</td>
      </template>
      <template #isLivingTogether="{ item }">
        <td>{{ item.isLivingTogether ? $t("yes") : $t("no") }}</td>
      </template>
    </FormTabRow>

    <v-row class="mt-4" v-if="!isView && canEdit">
      <v-col class="text-right">
        <v-btn color="success" :loading="saveLoading" variant="flat" type="submit">
          {{ $t("Save") }}
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>
