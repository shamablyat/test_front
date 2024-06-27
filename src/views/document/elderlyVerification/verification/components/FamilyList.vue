<script setup lang="ts">
import { ref } from "vue";
import { IFamily, IMember } from "../types";
import { SubmitEventPromise } from "vuetify";
import { IPerson, ISelectList } from "@/models/basic";
import PersonService from "@/services/others/person.service";
import FamilyMember from "./FamilyMember.vue";
import { IPassportIncludes } from "@/components/setPassportData/types";
import { useElderlyVerification } from "../store/useElderlyVerification";
import { storeToRefs } from "pinia";
import { useErrorToast } from "@/utils/helpers/useErrorToast";
import { notify } from "@kyvg/vue3-notification";
import i18n from "@/app/config/i18n";

interface IProps {
  data: IFamily;
  kinshipDegreeList: ISelectList[];
  kinshipDegreeListLoading: boolean;
  includes: IPassportIncludes;
}

interface ICustomPerson extends IPerson {
  kinshipDegreeId: number | null;
  kinshipDegree: string | null;
}

const props = defineProps<IProps>();
const emits = defineEmits(["addMember", "checkMembers"]);
const persons = ref<IPerson[]>([]);

const loading = ref<boolean>(false);
const isMembersModal = ref<boolean>(false);
const pinfl = ref<string>("");
const verificationStore = useElderlyVerification();
const { setError } = useErrorToast();
const { data } = storeToRefs(verificationStore);
const members = ref<IMember[]>([]);

const searchByPinfl = async (submit: SubmitEventPromise) => {
  const { valid } = await submit;

  if (valid) {
    loading.value = true;

    const filter = {
      ...props.includes,
      documentTypeId: data.value.applicantPerson?.documentTypeId,
      seria: data.value.applicantPerson?.docSeria,
      number: data.value.applicantPerson?.docNumber,
      dateOfBirth: data.value.applicantPerson?.birthOn,
      pinfl: data.value.applicantPerson?.pinfl,
      notIncludeDeath: true,
      notInlcudeDivorced: true,
      includeNotCompleteFamilyMembers: true
    };
    members.value = [];
    PersonService.GetPersonFamily(filter)
      .then((res) => {
        persons.value = res.data;
        pinfl.value = "";
        isMembersModal.value = true;
        res.data.forEach((el: ICustomPerson) => {
          const member: IMember = {
            personBirthOn: el.birthOn || "",
            personDocNumber: el.docNumber || null,
            personDocSeria: el.docSeria || "",
            personDocumentTypeId: el.documentTypeId || null,
            personFullName: el.fullName || "",
            personPinfl: el.pinfl || "",
            disabilityGroup: el.disabilityGroup || null,
            pensionAmount: el.pension?.amount || null,
            pensionTypeId: el.pension?.pensionTypeId || null,
            personGender: el.genderName || "",
            personGenderId: el.genderId || null,
            elderlyFamilyMemberPlace: "",
            id: 0,
            kinshipDegreeId: el.kinshipDegreeId || null,
            isCareRegularly: true,
            elderlyFamilyMemberPlaceId: null,
            kinshipDegree: res.data.kinshipDegree || "",
            returnOn: "",
            phoneNumber: "",
            isLivingTogether: false,
            notLivingTogether: "",
            notComplete: el.notComplete || null
          };

          members.value.push(JSON.parse(JSON.stringify(member)));
        });

        emits("checkMembers", res.data.length);
      })
      .catch((e) => {
        setError(e);
        emits("checkMembers", 0);
      })
      .finally(() => {
        loading.value = false;
      });
  }
};

const saveData = () => {
  if (members.value.some((el) => !el.kinshipDegreeId || (!el.isLivingTogether && !el.notLivingTogether.length))) {
    notify({
      // @ts-ignore
      text: i18n.global.t("hasRequiredAreas"),
      type: "warn"
    });
    return;
  }

  emits("addMember", members.value);
  isMembersModal.value = false;
};
</script>

<template>
  <div>
    <v-dialog v-model:model-value="isMembersModal" persistent location="top" height="100%">
      <template #activator>
        <v-form @submit.prevent="searchByPinfl">
          <v-row class="align-center">
            <v-col cols="12" lg="3" md="6">
              <v-btn type="submit" color="violet" :loading="loading">
                {{ $t("Search") }}
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </template>

      <v-card elevation="0" height="100%">
        <v-card-title> {{ $t("members") }} </v-card-title>
        <v-card-text>
          <v-expansion-panels color="success" variant="accordion">
            <v-expansion-panel class="mt-4" v-for="(member, index) in members">
              <v-expansion-panel-title> {{ member?.personFullName }} </v-expansion-panel-title>
              <v-expansion-panel-text>
                <FamilyMember
                  :includes="includes"
                  :person="persons[index]"
                  v-model:member="members[index]"
                  :kinship-degree-list="kinshipDegreeList"
                  :kinship-degree-list-loading="kinshipDegreeListLoading"
                />
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn color="error" variant="flat" @click="isMembersModal = false">{{ $t("Close") }}</v-btn>
          <v-btn color="info" variant="flat" @click="saveData">{{ $t("AddRow") }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
