<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { DeleteDocDTO } from "./types";
import { DeleteDocService } from "@/services/document/DeleteDoc.service";
import { SubmitEventPromise } from "vuetify";
import { useErrorToast } from "@/utils/helpers/useErrorToast";
import { notify } from "@kyvg/vue3-notification";
import i18n  from "@/app/config/i18n";
import UiParentCard from "@/components/UiParentCard.vue";
import { useManualStore } from "@/app/config/store/Manual";
import { useGlobal } from "@/composables/useGlobal";

const route = useRoute();
const router = useRouter();
const manualStore = useManualStore();

const { setError } = useErrorToast();
const { disableAfterTodayDays } = useGlobal();
const routeName = "DeleteDoc";
const id = route.params.id as string;

const data = ref<DeleteDocDTO | null>(null);
const loading = ref<boolean>(false);
const saveLoading = ref<boolean>(false);

const setData = () => {
  DeleteDocService.Get(id)
    .then((res) => {
      if (res.status === 200 && res.data) {
        data.value = res.data;
      }
    })
    .catch((e) => {
      setError(e);
    })
    .finally(() => {
      loading.value = false;
    });
};

const saveData = async (submit: SubmitEventPromise) => {
  const { errors, valid } = await submit;

  if (errors && errors.length) {
    document.getElementById(String(errors[0].id))?.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center"
    });
  }

  if (valid) {
    saveLoading.value = true;
    DeleteDocService.Update(data.value)
      .then(() => {
        notify({
          // @ts-ignore
          text: i18n.global.t("SaveSuccess"),
          type: "success"
        });
        router.push({ name: routeName });
      })
      .catch((e) => {
        setError(e);
      })
      .finally(() => {
        saveLoading.value = false;
      });
  }
};

manualStore.fetchDocDeleteTypeSelectList();
setData();
</script>

<template>
  <div>
    <UiParentCard v-if="loading" class="text-center">
      <v-progress-circular indeterminate></v-progress-circular>
    </UiParentCard>
    <v-form @submit.prevent="saveData" v-if="data && !loading">
      <UiParentCard>
        <v-row>
          <v-col cols="12" lg="3" md="6" class="py-1">
            <form-input v-model="data.docId" :label="$t('docId')" required></form-input>
          </v-col>
          <v-col cols="12" lg="3" md="6" class="py-1"
            ><form-input v-model="data.docNumber" :canAddZero="true" required :label="$t('docNumber')"></form-input
          ></v-col>
          <v-col cols="12" lg="3" md="6" class="py-1">
            <form-picker v-model="data.docOn" :label="$t('docOn')" required :disabled-date="disableAfterTodayDays"></form-picker>
          </v-col>
          <v-col cols="12" lg="3" md="6" class="py-1">
            <form-select
              v-model="data.docDeleteTypeId"
              :label="$t('docDeleteType')"
              required
              :list="manualStore.DeleteDocTypeSelectList"
            ></form-select>
          </v-col>
          <v-col cols="12" class="py-1">
            <v-label class="mb-2">{{ $t("details") }}</v-label>
            <v-textarea v-model="data.details" :placeholder="$t('details')" />
          </v-col>
        </v-row>
      </UiParentCard>
      <v-row class="mt-4 px-3">
        <v-btn color="error" @click="router.back()" variant="flat" :text="$t('Back')" />
        <v-spacer />
        <v-btn color="success" :loading="saveLoading" variant="flat" type="submit" :text="$t('Save')" />
      </v-row>
    </v-form>
  </div>
</template>
