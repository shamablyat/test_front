<script setup lang="ts">
import { IFields } from "@/models/basic";
import { useSentElderlyRegister } from "../store/useSentElderlyRegister";
import FormTabRow from "@/components/form/FormTabRow.vue";

interface IProps {
  fields: IFields[];
}
defineProps<IProps>();
const store = useSentElderlyRegister();
</script>

<template>
    <FormTabRow
      v-if="store.data && store.data.outTables"
      :fields="fields"
      :items="store.data.outTables"
      @delete-tab-row="(val: any) => store.deleteRow(val, 'outTables')"
      :actions="{
        isDelete: true
      }"
    >
      <template #person="{ item }">
        <td class="py-2" style="white-space: nowrap">
          {{ item.person?.fullName }}

          <b v-if="item.person && item.person.birthOn"> ({{ new Date().getFullYear() - item.person.birthOn.split(".")[2] }}) </b>
        </td>
      </template>
      <template #pensionType="{ item }">
        <td class="py-2" style="white-space: nowrap">
          {{ item.person.pension.pensionType }}
        </td>
      </template>
    </FormTabRow>
</template>

<style lang="scss" scoped></style>
