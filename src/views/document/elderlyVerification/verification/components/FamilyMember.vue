<script setup lang="ts">
import { IMember } from "../types";
import { IPerson, ISelectList } from "@/models/basic";
import { useManualStore } from "@/app/config/store/Manual";
import { useGlobal } from "@/composables/useGlobal";
import { IPassportIncludes } from "@/components/setPassportData/types";
import { BASE64STRING } from "@/utils/constants";
import { UserInfo } from "@/components/UserInfo";

interface IProps {
  kinshipDegreeList: ISelectList[];
  kinshipDegreeListLoading: boolean;
  member: IMember;
  person: IPerson;
  includes: IPassportIncludes;
}

const emits = defineEmits(["update:member"]);
const props = defineProps<IProps>();

const manualStore = useManualStore();
const { disabledBeforeDays } = useGlobal();

const elderlyFamilyMemberPlaceTitle = (item: ISelectList) => {
  return item.value + "  " + item.text;
};

const requiredRules = [
  (value: string | null) => {
    if (value) return true;
    // @ts-ignore
    return i18n.global.t("fieldNotEmpty");
  }
];

const setField = (value: any, key: string) => {
  if (value && value.value) {
    // @ts-ignore
    props.member[key] = value.text;
    // @ts-ignore
    props.member[key + "Id"] = value.value;
  } else {
    // @ts-ignore
    props.member[key] = "";
    // @ts-ignore
    props.member[key + "Id"] = null;
  }
};
</script>

<template>
  <div>
    <UserInfo :person="person" :includes="includes" :image="BASE64STRING + person.photo" />
    <v-row class="align-center">
      <v-col cols="12" lg="3" md="6">
        <form-select
          :list="kinshipDegreeList"
          required
          :loading="kinshipDegreeListLoading"
          :model-value="member.kinshipDegreeId"
          returnObject
          @update:model-value="(val:any)=> setField(val, 'kinshipDegree')"
          :label="$t('kinshipDegree')"
        >
        </form-select>
      </v-col>
      <v-col cols="12" lg="3" md="6">
        <form-select
          :list="manualStore.elderlyFamilyMemberPlaceSelectList"
          :model-value="member.elderlyFamilyMemberPlaceId"
          returnObject
          clearable
          @update:model-value="(val:any)=> setField(val, 'elderlyFamilyMemberPlace')"
          :label="$t('elderlyFamilyMemberPlace')"
          :item-title="elderlyFamilyMemberPlaceTitle"
        >
        </form-select>
      </v-col>
      <v-col cols="12" lg="3" md="6" class="py-0">
        <form-picker v-model="member.returnOn" :disabledDate="disabledBeforeDays" :label="$t('returnOn')" clearable> </form-picker>
      </v-col>
      <v-col cols="12" lg="3" md="6" class="py-0">
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
        <v-textarea :rules="!member.isLivingTogether ? requiredRules : []" validate-on="lazy submit" v-model="member.notLivingTogether"> </v-textarea>
      </v-col>
    </v-row>
  </div>
</template>
