<script setup lang="ts">
import { SubmitEventPromise } from "vuetify";
import { SERIES_LIST } from "@/utils/constants";
import { IPerson, ISelectList } from "@/models/basic";
import { reactive } from "vue";
import { ISetPassportData } from "./types";
import { watch } from "vue";
import { computed } from "vue";
import { useGlobal } from "@/composables/useGlobal";

interface IProps {
  documentTypeList?: ISelectList[];
  person?: IPerson;
  searchLading: boolean;
  clear?: boolean | number;
  isDocumentType?: boolean;
}

const { disabledAfterToday } = useGlobal()
const props = withDefaults(defineProps<IProps>(), {
  isDocumentType: true
});
const emits = defineEmits<{
  (e: "setPerson", value: ISetPassportData): void;
}>();

const getDocumentTypeList = computed(() => {
  let newDocuments = props.documentTypeList || [];
  if (props.isDocumentType && props.documentTypeList) {
    const item = newDocuments.find((el: ISelectList) => el.value === 4);
    if (item) {
      const index = newDocuments.indexOf(item);
      newDocuments.splice(index, 1);
    }
  }
  return newDocuments;
});

const filterPerson = reactive<ISetPassportData>({
  documentTypeId: null,
  seria: "",
  number: null,
  dateOfBirth: "",
  pinfl: ""
});

const clearData = () => {
  filterPerson.documentTypeId = null;
  filterPerson.dateOfBirth = "";
  filterPerson.number = "";
  filterPerson.seria = "";
};

const searchPerson = async (values: SubmitEventPromise) => {
  const { valid } = await values;
  if (valid) {
    emits("setPerson", filterPerson);
  }
};
const sortedSeriaList = computed(() => {
  return SERIES_LIST.sort(function (a, b) {
    return a.id - b.id || a.text.localeCompare(b.text);
  });
});

watch(
  () => [props.clear, props.isDocumentType],
  (value) => {
    if (value[0]) {
      clearData();
    }

    if (!value[1]) {
      delete filterPerson["documentTypeId"];
    }
  },
  { immediate: true }
);
</script>

<template>
  <v-form @submit.prevent="searchPerson">
    <v-row class="align-center">
      <v-col cols="12" lg="3" md="6" sm="6" class="py-0" v-if="isDocumentType">
        <form-select :list="getDocumentTypeList" v-model="filterPerson.documentTypeId"
          :label="$t('passportParams.documentType')" required :disabled="searchLading" :noSearch="true"
          style="z-index: 2500" />
      </v-col>
      <v-col cols="12" lg="2" md="6" sm="6" class="py-0" v-if="filterPerson.documentTypeId == 1">
        <form-select :list="sortedSeriaList" v-model="filterPerson.seria" :label="$t('passportParams.docSeries')"
          :disabled="searchLading" required />
      </v-col>
      <v-col cols="12" lg="2" md="6" sm="6" class="py-0" v-else>
        <form-input v-model="filterPerson.seria" :label="$t('passportParams.docSeries')" :disabled="searchLading"
          required mask="AA" />
      </v-col>
      <v-col cols="12" lg="2" md="6" sm="6" class="py-0">
        <form-input v-model="filterPerson.number" :label="$t('passportParams.documentNumber')" placeholder="#######"
          :mask="filterPerson.documentTypeId == 1 || filterPerson.documentTypeId == 3 ? '########' : '#######'" required
          :canAddZero="true" :disabled="searchLading" />
      </v-col>
      <v-col cols="12" lg="2" md="6" sm="6" class="py-0">
        <form-picker class="w-100" v-model:model-value="filterPerson.dateOfBirth" :label="$t('passportParams.birthOn')"
          required :disabled="searchLading" :disabled-date="disabledAfterToday" />
      </v-col>
      <v-col cols="12" lg="2" md="6" sm="6" class="py-0" v-if="filterPerson.documentTypeId == 3">
        <form-input class="w-100" v-model:model-value="filterPerson.pinfl" mask="##############"
          :label="$t('passportParams.pinfl')" required :disabled="searchLading" />
      </v-col>
      <v-col cols="12" lg="2" md="6" sm="6" class="py-0">
        <v-btn color="success" size="large" type="submit" prepend-icon="mdi-account-search" :loading="searchLading"
          @click="searchPerson" variant="flat">
          {{ $t("passportParams.Search") }}
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>
