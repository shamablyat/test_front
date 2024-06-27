<script setup lang="ts">
import UiParentCard from "@/components/UiParentCard.vue";
import DataDocument from "./components/DataDocument.vue";
import { defineAsyncComponent, onBeforeUnmount, ref } from "vue";
import { useElderlyRegister } from "./store/useElderlyRegister";
import { useRoute, useRouter } from "vue-router";
import { notify } from "@kyvg/vue3-notification";
import { useI18n } from "vue-i18n";
import { SubmitEventPromise } from "vuetify";
import { useErrorToast } from "@/utils/helpers/useErrorToast";
import i18n from "@/app/config/i18n";
import { ArrowBarToDownIcon, ArrowBarUpIcon, RefreshIcon } from "vue-tabler-icons";

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const { setError } = useErrorToast();

const store = useElderlyRegister();
store.setRegions();
store.setElderlyReason();
store.setTemporaryResidenceTypeList();

const verificationId = (route.query.verificationId as string) || "";
const unregisterId = (route.query.unregisterId as string) || "";

const saveLoading = ref<boolean>(false);
const showPage = ref<boolean>(false);

const tabs = [
  {
    title: "OutTables",
    component: defineAsyncComponent(() => import("./components/OutTabRow.vue")),
    icon: ArrowBarUpIcon,
    value: 2
  }
];

if (!unregisterId) {
  tabs.unshift({
    title: "InTables",
    component: defineAsyncComponent(() => import("./components/InTabRow.vue")),
    icon: ArrowBarToDownIcon,
    value: 1
  });
}

store.setData({
  id: route.params.id as string,
  verificationId: verificationId,
  unregisterId: unregisterId,
  cb: (data) => {
    if (+route.params.id == 0) {
      showPage.value = true;
    } else {
      if (+route.params.id > 0) {
        if (data.canEdit) {
          showPage.value = true;
        } else {
          showPage.value = false;
        }
      }
    }
  },
  err: (err) => {
    setError(err);
  }
});

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

  if (valid) {
    if (!store.getData.isByVerification) {
      if (store.getData.files.length == 0) {
        notify({
          text: t("FileNotCorrect"),
          type: "warn"
        });
        return false;
      }

      if (store.getData.inTables.length == 0 && store.getData.outTables.length == 0) {
        notify({
          text: t("TableNotCorrect"),
          type: "warn"
        });
        return false;
      }

      if (store.editedIndex1 > -1 || store.editedIndex2 > -1) {
        notify({
          text: t("requiredSaveChanges"),
          type: "warn"
        });
        return;
      }
    }

    saveLoading.value = true;
    store.saveData({
      cb: () => {
        saveLoading.value = false;
        notify({
          // @ts-ignore
          text: i18n.global.t("SaveSuccess"),
          type: "success"
        });
        router.push({ name: "ElderlyRegister" });
      },
      err: (err) => {
        saveLoading.value = false;
        setError(err);
      }
    });
  }
};

onBeforeUnmount(() => {
  store.$reset();
});
</script>

<template>
  <div>
    <UiParentCard v-if="store.getDataLoadingStatus" class="text-center">
      <v-progress-circular indeterminate></v-progress-circular>
    </UiParentCard>

    <v-form @submit.prevent="saveData" v-if="showPage">
      <DataDocument />

      <!-- TABS -->
      <v-tabs :model-value="store.getActiveTab" @update:model-value="store.setActiveTab">
        <v-tab v-for="tab in tabs" :value="tab.value" color="success"> {{ $t(tab.title) }} </v-tab>
      </v-tabs>
      <v-window :model-value="store.getActiveTab">
        <v-window-item v-for="tab in tabs" :value="tab.value">
          <component :is="tab.component"  />
        </v-window-item>
      </v-window>

      <v-row class="mt-4 px-3">
        <v-btn color="error" variant="flat" @click="router.back()" :text="$t('Back')" />
        <v-spacer />
        <v-btn
          color="grey200"
          :loading="store.getRefreshLoading"
          class="mr-2"
          variant="flat"
          @click="store.refreshPassportData"
          :text="$t('refresh')"
          :prepend-icon="RefreshIcon"
        />
        <v-btn color="success" :loading="saveLoading" variant="flat" type="submit" :text="$t('Save')" />
      </v-row>
    </v-form>
  </div>
</template>
