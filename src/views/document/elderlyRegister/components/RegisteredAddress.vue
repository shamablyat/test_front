<script setup lang="ts">
import { useElderlyRegister } from "../store/useElderlyRegister";

const store = useElderlyRegister();
</script>

<template>
  <v-row v-if="store.getIntabRow.person">
    <v-col cols="12" class="py-0">
      <v-alert class="mb-3 text-center" color="info" variant="tonal">
        <span style="font-size: 18px">
          {{ $t("livingAddress") }}
        </span>
      </v-alert>
    </v-col>
    <v-col cols="12" lg="3" md="6" class="py-0">
      <form-select
        :list="store.getRegionsList"
        v-model="store.getIntabRow.livingRegionId"
        required
        :label="$t('region')"
        @update:modelValue="store.getDistrict(store.getIntabRow.livingRegionId, 'actual')"
        :disabled="!!store.getIntabRow.livingRegionId"
      />
    </v-col>
    <v-col cols="12" lg="3" md="6" class="py-0">
      <form-select
        :list="store.districtActualList"
        v-model="store.getIntabRow.livingDistrictId"
        required
        :label="$t('district')"
        @update:modelValue="store.getMfyList(store.getIntabRow.livingRegionId, store.getIntabRow.livingDistrictId, 'actual')"
        :disabled="!!store.getIntabRow.livingDistrictId"
      />
    </v-col>
    <v-col cols="12" lg="3" md="6" class="py-0">
      <form-select :list="store.mfyActualList" v-model="store.getIntabRow.livingMfyId" required :label="$t('livingMfy')"> </form-select>
    </v-col>
    <v-col cols="12" lg="6" md="6" class="py-0">
      <form-input v-model="store.getIntabRow.livingAddress" required :label="$t('livingAddress')" />
    </v-col>
    <v-col cols="12" lg="3" md="6" class="py-0">
      <form-input v-model="store.getIntabRow.phoneNumber" :label="$t('phoneNumber')" mask="+998 (##) ### ## ##" />
    </v-col>
  </v-row>
</template>
