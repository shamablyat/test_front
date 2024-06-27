<script setup lang="ts">
import { ref } from "vue";
import { IVerificationResultServices, VerificationResultTabs, IVerificationResultDto } from "../../../types";
import { IFields, ISelectList, ITableActions } from "@/models/basic";
import { SubmitEventPromise } from "vuetify";
import FormTabRow from "@/components/form/FormTabRow.vue";
import { useElderlyVerification } from "../../../store/useElderlyVerification";

interface IProps {
  data: IVerificationResultDto;
  type: VerificationResultTabs;
  editIndex: number;
  isView?: boolean;
  actions: ITableActions;
}

interface ISelectListService extends ISelectList {
  executeOrganizationName: string;
  executePeriod: number | null;
  isExecuteAsistent: boolean;
}

const props = defineProps<IProps>();

const emits = defineEmits<{
  (e: "addRow", value: IVerificationResultServices, type: string): void;
  (e: "editRow", value: IVerificationResultServices, type: string): void;
  (e: "deleteRow", value: number, type: string): void;
  (e: "update:editIndex", value: number): void;
}>();

/* CONSTANTS */
const tabRowDef: IVerificationResultServices = {
  executePeriod: null,
  elderlyServiceId: null,
  id: 0,
  elderlyService: "",
  executeOrganizationName: "",
  isExecuteAsistent: false
};

const fields: IFields[] = [
  {
    key: "elderlyService",
    label: "ElderlyService",
    tdClass: "border",
    thClass: "border font-weigh-bold  text-dark"
  },
  {
    key: "executeOrganizationName",
    label: "organization",
    tdClass: "border",
    thClass: "border font-weigh-bold  text-dark"
  },
  {
    key: "executePeriod",
    label: "deadlineOnDay",
    tdClass: "border",
    thClass: "border font-weigh-bold  text-dark"
  },
  {
    key: "isExecuteAsistent",
    label: "isExecuteAsistent",
    tdClass: "border",
    thClass: "border font-weigh-bold  text-dark"
  }
];

/* STORE */
const store = useElderlyVerification();
store.setElderlyServiceList();
// store.fetchOrganizationSelectList();

/* VARIABLES */
const tabRow = ref<IVerificationResultServices>({ ...tabRowDef });

/* FUNCTIONS */

const addRow = async (submit: SubmitEventPromise) => {
  const { valid } = await submit;
  if (valid) {
    emits("addRow", tabRow.value, props.type);
    clearTabRow();
  }
};

const editRow = (item: IVerificationResultServices) => {
  tabRow.value = JSON.parse(JSON.stringify(item));
  emits("editRow", item, props.type);
};

const deleteRow = (index: number) => {
  emits("deleteRow", index, props.type);
};

const setField = (value: ISelectListService, key: string) => {
  if (value) {
    // @ts-ignore
    tabRow.value[key] = value.text;
    // @ts-ignore
    tabRow.value[key + "Id"] = value.value;
  } else {
    // @ts-ignore
    tabRow.value[key] = "";
    // @ts-ignore
    tabRow.value[key + "Id"] = null;
  }

  if (key === "elderlyService") {
    tabRow.value.executeOrganizationName = value.executeOrganizationName;
    tabRow.value.executePeriod = value.executePeriod;
    if (!value.isExecuteAsistent) {
      tabRow.value.isExecuteAsistent = false;
    } else {
      tabRow.value.isExecuteAsistent = true;
    }
  }
};

const clearTabRow = () => {
  tabRow.value = tabRowDef;
  emits("update:editIndex", -1);
};
</script>

<template>
  <div>
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
      :actions="actions"
      :items="data.services"
      :edit-index="editIndex"
      @edit-tab-row="editRow"
      @delete-tab-row="deleteRow"
      @clear-tab-row="clearTabRow"
    >
      <v-form @submit.prevent="addRow" v-if="!isView">
        <v-row class="align-center mb-3">
          <v-col cols="12" lg="3" class="py-0">
            <form-select
              :label="$t('ElderlyService')"
              :list="store.elderlyServiceList"
              v-model="tabRow.elderlyServiceId"
              returnObject
              required
              @update:model-value="(val:ISelectListService) =>{

                 setField(val, 'elderlyService')
              }"
            >
            </form-select>
          </v-col>
          <v-col cols="12" lg="3" class="py-0">
            <form-input v-model="tabRow.executeOrganizationName" :label="$t('organization')" required />
            <!-- <form-select
              :label="$t('organization')"
              :list="store.organizationList"
              v-model="tabRow.organizationId"
              returnObject
              required
              @update:model-value="(val:ISelectList) => setField(val, 'organization')"
            >
            </form-select> -->
          </v-col>
          <v-col cols="12" lg="3" class="py-0">
            <form-input :label="$t('deadlineOnDay')" required v-model="tabRow.executePeriod" mask="################"> </form-input>
          </v-col>
        </v-row>
        <v-row class="align-center mb-3">
          <v-col cols="12" lg="3" class="py-0">
            <form-checkbox :label="$t('isExecuteAsistent')" v-model="tabRow.isExecuteAsistent"> </form-checkbox>
          </v-col>
          <v-col cols="12" lg="3" class="py-0">
            <v-btn type="submit" :text="editIndex > -1 ? $t('Save') : $t('AddRow')" variant="flat" :color="editIndex > -1 ? 'success' : 'info'" />
          </v-col>
        </v-row>
      </v-form>

      <template #isExecuteAsistent="{ item }">
        <td>
          {{ item.isExecuteAsistent ? $t("yes") : $t("no") }}
        </td>
      </template>
    </FormTabRow>
  </div>
</template>
