<script setup lang="ts">
import ElderlyVerificationService from "@/services/document/elderlyVerification.service";
import { useErrorToast } from "@/utils/helpers/useErrorToast";
import { onMounted, ref, watch } from "vue";
import { SubmitEventPromise } from "vuetify";
import { useElderlyVerification } from "../store/useElderlyVerification";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import UserInfoView from "../components/UserInfoView.vue";
import MainAddress from "../components/MainAddress.vue";
import Loader from "../components/Loader.vue";
import { notify } from "@kyvg/vue3-notification";
import { VForm } from "vuetify/components";
import { useCheckPhoneNumber } from "@/composables/CheckPhoneNumber";
import FormCanButtons from "@/components/FormCanButtons.vue";
import { GoogleMap, Marker } from "vue3-google-map";

interface IProps {
  isView: boolean;
}

defineProps<IProps>();
const emits = defineEmits<{
  (e: "setStep"): void;
}>();
const { setError } = useErrorToast();
const { phoneNumberRules } = useCheckPhoneNumber();
const router = useRouter();
const { t } = useI18n();
const permission = "ElderlyVerification";

const store = useElderlyVerification();
const center = { lat: 41, lng: 69 };
const { data, dataLoading, cachedData } = storeToRefs(store);

const saveLoading = ref<boolean>(false);
const isChanged = ref<boolean>(false);
const route = useRoute();

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

  if (!data.value.latitude && !data.value.longitude && +route.params.id == 0) {
    navigator.geolocation.getCurrentPosition((position) => {
      data.value.latitude = position.coords.latitude;
      data.value.longitude = position.coords.longitude;
    });
  }

  if (valid) {
    saveLoading.value = true;
    const promise = new Promise((resolve, reject) => {
      ElderlyVerificationService.Update(data.value)
        .then((res) => {
          isChanged.value = false;
          notify({
            text: t("SaveSuccess"),
            type: "success"
          });

          const id = res.data.id;

          if (id) {
            router.replace({
              name: "EditVerification",
              params: {
                id: id
              }
            });
          }

          store.setData({
            id: id || (route.params.id as string),
            cb: (data) => {
              if ((route.params.id as string) != "0") {
                store.setElderlyVerificationTableHasValue(data.id);
              }

              emits("setStep");
            },
            err: (err) => {
              setError(err);
            }
          });

          resolve("success");
          if (+route.params.id == 0) {
            return;
          }
          emits("setStep");
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

const form = ref<Partial<typeof VForm>>();
defineExpose({
  saveData,
  form: form,
  isChanged: isChanged
});

watch(
  () => data.value,
  () => {
    if (JSON.stringify(data.value) !== JSON.stringify(cachedData.value)) {
      isChanged.value = true;
    }
  },
  { deep: true }
);

onMounted(() => {
  if (!data.value.latitude && !data.value.longitude && +route.params.id == 0) {
    navigator.geolocation.getCurrentPosition((position) => {
      data.value.latitude = position.coords.latitude;
      data.value.longitude = position.coords.longitude;
    });
  }
});
</script>

<template>
  <Loader v-if="dataLoading" />

  <v-form v-else @submit.prevent="saveData" ref="form">
    <!-- address -->
    <h2 class="py-2 my-4">{{ $t("address") }}</h2>

    <v-row class="align-center">
      <v-col cols="12" lg="3" md="6">
        <form-input disabled :label="$t('docNumber')" required v-model="data.docNumber" />
      </v-col>
      <v-col cols="12" lg="3" md="6">
        <form-picker clearable disabled :label="$t('docOn')" required v-model="data.docOn" />
      </v-col>
      <v-col cols="12" v-if="data.latitude && data.longitude">
        <GoogleMap api-key="AIzaSyDoX7U1etxawoz-Z3wNCOv7LxcweRiHC-E" style="width: 100%; height: 400px" :center="center" :zoom="7">
          <Marker :options="{ position: { lat: data.latitude, lng: data.longitude } }" />
        </GoogleMap>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" lg="3" md="6" class="d-flex">
        <v-label class="mb-2 font-weight-bold"> {{ $t("passportData.pensionType") }}: </v-label>
        <span class="ml-1">{{ data.pensionType || "-" }}</span>
      </v-col>
      <v-col cols="12" lg="3" md="6" class="d-flex">
        <v-label class="mb-2 font-weight-bold">{{ $t("passportData.pensionAmount") }}: </v-label>
        <span class="ml-1">{{ new Intl.NumberFormat("uz-Uz").format(data.pensionAmount) }}</span>
      </v-col>
      <v-col cols="12" lg="3" md="6" class="d-flex">
        <v-label class="mb-2 font-weight-bold">{{ $t("passportData.disabilityGroup") }}: </v-label>
        <span class="ml-1">{{ data.disabilityGroup || "-" }}</span>
      </v-col>
      <v-col cols="12" lg="3" md="6" class="d-flex">
        <v-label class="mb-2 font-weight-bold">{{ $t("passportData.cadastralInformation") }}: </v-label>
        <span class="ml-1"> {{ data.isKadastr ? $t("passportData.has") : $t("passportData.no") }}</span>
      </v-col>
    </v-row>
    <MainAddress v-model:mfy-id="data.mfyId" v-model:district-id="data.districtId" v-model:region-id="data.regionId" />

    <v-row v-if="data.applicantPerson">
      <v-col sm="4" cols="12">
        <form-input :label="$t('temporaryAddress')" v-model="data.applicantAddress" />
      </v-col>
      <v-col sm="4" cols="12">
        <form-input
          mask="+998 (##) ###-##-##"
          :label="$t('phoneNumber')"
          :placeholder="$t('phoneNumber')"
          :rules="phoneNumberRules"
          v-model="data.applicantPhoneNumber"
        />
      </v-col>
    </v-row>
    <UserInfoView v-if="data.applicantPerson && data.application" :person="data.applicantPerson" :application="data.application" />

    <!-- save -->
    <v-row class="mt-4">
      <v-col class="text-right" v-if="!data.canReject && !isView">
        <FormCanButtons :service="ElderlyVerificationService" :permission="permission" :data="data" />
      </v-col>
      <v-col cols="2" class="text-right mt-1" v-if="!isView && data.canEdit">
        <v-btn color="success" :loading="saveLoading" variant="flat" type="submit">
          {{ +$route.params.id == 0 ? $t("begin") : $t("Save") }}
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<style lang="scss" scoped></style>
