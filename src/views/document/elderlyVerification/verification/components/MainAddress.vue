<script setup lang="ts">
import { ref } from "vue";
import { useManualStore } from "@/app/config/store/Manual";
import { ISelectList } from "@/models/basic";
import { storeToRefs } from "pinia";
import AdmManualService from "@/services/others/admmanual.service";

type IProps = {
  regionId: number | null;
  districtId: number | null;
  mfyId: number | null;
};
const props = defineProps<IProps>();
const emits = defineEmits(["update:regionId", "update:districtId", "update:mfyId"]);

const ManualStore = useManualStore();
const { regions } = storeToRefs(ManualStore);
const districtList = ref<ISelectList[]>([]);
const mfyList = ref<ISelectList[]>([]);
ManualStore.setRegions();

if (props.regionId) {
  getDistrict(props.regionId);
}

if (props.districtId) {
  getMfyList(props.districtId);
}

function ChangeRegion(e: number | null) {
  emits("update:regionId", e);
  emits("update:districtId", null);
  districtList.value = [];
  District(e);
}

function District(regionId: number | string | null) {
  mfyList.value = [];
  emits("update:mfyId", null);

  getDistrict(regionId);
}

function getDistrict(regionId: number | string | null) {
  if (regionId) {
    AdmManualService.DistrictSelectList(regionId).then((res: any) => {
      districtList.value = res.data;
    });
  }
}

function getMfyList(districtId: number | string | null) {
  if (props.regionId && districtId) {
    AdmManualService.MfySelectList(props.regionId, districtId).then((res: any) => {
      mfyList.value = res.data;
    });
  }
}
</script>

<template>
  <v-row>
    <v-col class="py-1">
      <form-select
        :list="regions"
        :model-value="regionId"
        :label="$t('region')"
        :placeholder="$t('region')"
        required
        disabled
        @update:modelValue="(e: number | null) => {
              ChangeRegion(e);
            } "
      >
      </form-select>
    </v-col>
    <v-col class="py-1">
      <form-select
        :list="districtList"
        :model-value="districtId"
        :label="$t('district')"
        :placeholder="$t('district')"
        required
        disabled
        @update:modelValue="(e: number | null) => {
              emits('update:districtId', e);
              getMfyList(e)
            }"
      >
      </form-select>
    </v-col>
    <v-col class="py-1">
      <form-select
        :list="mfyList"
        :model-value="mfyId"
        :label="$t('mfy')"
        required
        disabled
        @update:model-value="(e: number | null) => emits('update:mfyId', e)"
      >
      </form-select>
    </v-col>
  </v-row>
</template>

<style lang="scss" scoped></style>
