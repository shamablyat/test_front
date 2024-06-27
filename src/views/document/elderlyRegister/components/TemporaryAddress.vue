<script setup lang="ts">
import { useElderlyRegister } from "../store/useElderlyRegister";

const store = useElderlyRegister();
</script>

<template>
  <v-row v-if="store.getIntabRow.isTemporary">
    <v-col cols="12">
      <v-alert class="mb-3 text-center" color="info" variant="tonal">
        <span style="font-size: 18px">
          {{ $t("temporaryAddress") }}
        </span>
      </v-alert>
    </v-col>
    <v-col cols="12" lg="3" md="6" class="py-0">
      <form-select
        :list="store.getRegionsList"
        required
        v-model="store.getIntabRow.temporaryRegionId"
        :label="$t('region')"
        @update:modelValue="store.changeTemporaryRegion"
      >
      </form-select>
    </v-col>
    <v-col cols="12" lg="3" md="6"  class="py-0">
      <form-select
        :list="store.getDistrictPersonList"
        required
        v-model="store.getIntabRow.temporaryDistrictId"
        :label="$t('district')"
        @update:modelValue="store.changeTemporaryDistrict"
      >
      </form-select>
    </v-col>
    <v-col cols="12" lg="3" md="6" class="py-0">
      <form-select :list="store.getMfyPersonList" required v-model="store.getIntabRow.temporaryMfyId" :label="$t('livingMfy')"> </form-select>
    </v-col>
    <v-col cols="12" lg="3" md="6" class="py-0">
      <form-input required v-model="store.getIntabRow.temporaryAddress" :label="$t('temporaryAddress')"> </form-input>
    </v-col>
    <v-col cols="12" lg="3" md="6" class="py-0">
      <form-select
        :list="store.getTemporaryResidenceTypeList"
        required
        v-model="store.getIntabRow.temporaryResidenceTypeId"
        :label="$t('temproraryResidenceType')"
        :placeholder="$t('temproraryResidenceType')"
      >
      </form-select>
    </v-col>
  </v-row>
</template>
