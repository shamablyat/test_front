<script setup lang="ts">
import { useManualStore } from "@/app/config/store/Manual";
import { ISelectList } from "@/models/basic";
import EldApplicationService from "@/services/document/eldApplication.service";
import AdmManualService from "@/services/others/admmanual.service";
import InsManualService from "@/services/others/insManual.service";
import { useErrorToast } from "@/utils/helpers/useErrorToast";
import { reactive, ref } from "vue";
import { XIcon } from "vue-tabler-icons";
import { SubmitEventPromise } from "vuetify";

interface IProps {
  item: any;
}

const emits = defineEmits<{
  (e: "update:model-value", value: boolean): void;
  (e: "success"): void;
}>();

const manualStore = useManualStore();
manualStore.setRegions()
const { setError } = useErrorToast();

const props = defineProps<IProps>();

const districtList = ref<ISelectList[]>([]);
const mfyList = ref<ISelectList[]>([]);

const socialPersonList = ref<any[]>([]);

const filter = reactive({
  regionId: props.item.serviceRecepientRegionId || null,
  districtId: props.item.serviceRecepientDistrictId || null,
  mfyId: props.item.serviceRecepientMfyId || null,
  socialEmployeeId: null
});

const setDistrict = (regionId: number | string) => {
  mfyList.value = [];
  filter.mfyId = null;
  filter.districtId = null;
  districtList.value = [];
  socialPersonList.value = [];
  filter.socialEmployeeId = null;

  AdmManualService.DistrictSelectList(regionId).then((res) => {
    districtList.value = res.data;
  });
};

const setMfy = () => {
  mfyList.value = [];
  filter.mfyId = null;
  socialPersonList.value = [];
  filter.socialEmployeeId = null;

  if (filter.regionId && filter.districtId) {
    AdmManualService.MfySelectList(filter.regionId, filter.districtId).then((res) => {
      mfyList.value = res.data;
    });
  }
};

const getSocialPerson = () => {
  socialPersonList.value = [];
  filter.socialEmployeeId = null;
  InsManualService.GetAreaSocialEmployeePersonList(filter).then((res) => {
    socialPersonList.value = res.data;
    if (res.data.length == 1) {
      filter.socialEmployeeId = res.data[0]?.id;
    }
  });
};

const saveLoading = ref(false);

const setSocialEmployee = async (submit: SubmitEventPromise) => {
  const { valid } = await submit;

  if (valid) {
    saveLoading.value = true;
    // const key = props.item.socialEmployeeId ? "person" : "socialEmployeeId";
    const api = props.item.socialEmployeeId ? "SetSocialEmployee" : "Receive";
    EldApplicationService[api]({
      id: props.item.id,
      ["socialEmployeeId"]: filter.socialEmployeeId
    })
      .then(() => {
        emits("update:model-value", false);
        emits("success");
      })
      .catch((e) => {
        setError(e);
      })
      .finally(() => {
        saveLoading.value = false;
      });
  }
};

if (props.item.serviceRecepientRegionId) {
  // setDistrict(props.item.regionId);
  AdmManualService.DistrictSelectList(props.item.serviceRecepientRegionId).then((res) => {
    districtList.value = res.data;
  });
  if (props.item.districtId) {
    AdmManualService.MfySelectList(props.item.serviceRecepientRegionId, props.item.serviceRecepientDistrictId).then((res) => {
      mfyList.value = res.data;
    });
    if (props.item.serviceRecepientMfyId) {
      getSocialPerson();
    }
  }
}
</script>

<template>
  <div>
    <v-card class="px-5 py-5">
      <v-card-title class="mb-4">
        <v-row>
          <v-col>
            <h2>{{ $t("socialEmployeeInfo") }}</h2>
          </v-col>
          <v-col class="text-right">
            <XIcon class="cursor-pointer" @click="emits('update:model-value', false)" />
          </v-col>
        </v-row>
      </v-card-title>

      <v-form @submit.prevent="setSocialEmployee">
        <v-card-text>
          <v-row>
            <v-col cols="12" lg="3" md="6" class="py-1">
              <form-select
                :disabled="filter.regionId && !item.socialEmployeeId"
                :list="manualStore.getRegions"
                v-model="filter.regionId"
                :label="$t('region')"
                @update:model-value="setDistrict"
                required
              />
            </v-col>
            <v-col cols="12" lg="3" md="6" class="py-1">
              <form-select
                :disabled="filter.districtId && !item.socialEmployeeId"
                :list="districtList"
                v-model="filter.districtId"
                :label="$t('district')"
                @update:model-value="setMfy"
                required
              />
            </v-col>
            <v-col cols="12" lg="3" md="6" class="py-1">
              <form-select
                :disabled="filter.mfyId && !item.socialEmployeeId"
                :list="mfyList"
                v-model="filter.mfyId"
                :label="$t('mfy')"
                @update:model-value="getSocialPerson"
                required
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" lg="3" md="6" class="py-1 mt-3">
              <form-select
                :list="socialPersonList"
                v-model="filter.socialEmployeeId"
                :label="$t('socialEmployee')"
                itemTitle="fullName"
                itemValue="id"
                required
                :disabled="filter.socialEmployeeId && socialPersonList.length == 1"
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-btn :text="$t('Back')" color="error" variant="flat" @click="emits('update:model-value', false)" />
          <v-spacer />
          <v-btn :text="$t('Receive')" variant="flat" color="success" type="submit" :loading="saveLoading" />
        </v-card-actions>
      </v-form>
    </v-card>
  </div>
</template>

<style lang="scss" scoped></style>
