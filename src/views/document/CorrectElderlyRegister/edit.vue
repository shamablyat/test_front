<script setup lang="ts">
import UiParentCard from "@/components/UiParentCard.vue";
import DataDocument from "./widgets/DataDocument.vue";
import { computed, onBeforeUnmount, ref } from "vue";
import { useSentElderlyRegister } from "./store/useSentElderlyRegister";
import { useRoute, useRouter } from "vue-router";
import { notify } from "@kyvg/vue3-notification";
import { useI18n } from "vue-i18n";
import { SubmitEventPromise } from "vuetify";
import { useErrorToast } from "@/utils/helpers/useErrorToast";
import i18n  from "@/app/config/i18n";
import ElderlyRegisterService from "@/services/document/elderlyregister.service";
import { IFields } from "@/models/basic";
import { ITabs, InOutTypes } from "./types";
import { defineAsyncComponent } from "vue";
import { ElderlyManage } from "@/features/ElderlyManage";
import { XIcon } from "vue-tabler-icons";

const tabs: ITabs[] = [
  {
    component: defineAsyncComponent(() => import("./widgets/InTables.vue")),
    title: "InTables",
    value: "inTables"
  },
  {
    component: defineAsyncComponent(() => import("./widgets/OutTables.vue")),
    title: "OutTables",
    value: "outTables"
  }
];

const fields: IFields[] = [
  { key: "person", label: "fio", tdClass: "py-2" },
  {
    key: "pensionType",
    label: "pensionType",
    tdClass: "py-2 nowrap",
    thClass: "nowrap"
  },
  { key: "disabilityGroup", label: "disabilityGroup", tdClass: "py-2" },
  { key: "action", label: "actions", tdClass: "py-2" }
];

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const { setError } = useErrorToast();

const store = useSentElderlyRegister();
store.setRegions();

const saveLoading = ref<boolean>(false);
const isModal = ref(false);

const parentFilter = computed(() => {
  let filter: any = {};
  // store.data.correctionElderlyManageInIds.length === 0 && store.data.CorrectionElderlyManageOutIds.length === 0 ? {} : {}
  if (store.data) {
    if(store.activeTab === 'inTables'){
      filter = {
        ...filter,
        isOnlyOut: false
      }
    }
    if(store.activeTab === 'outTables'){
      filter = {
        ...filter,
        isOnlyOut: true
      }
    }
    if (store.data.correctionElderlyManageInIds.length !== 0 || store.data.CorrectionElderlyManageOutIds.length !== 0) {
      filter = {
        ...filter,
        regionId: store.data.regionId,
        region: store.data.region,
        districtId: store.data.districtId,
        district: store.data.district
      };
    }
  }

  return filter;
});

store.setData({
  id: route.params.id as string,
  cb: () => {},
  err: (err) => {
    setError(err);
  }
});

const setManage = (item: any, type: InOutTypes) => {
  if (store.data) {
    if (store.data.correctionElderlyManageInIds.length === 0 && store.data.CorrectionElderlyManageOutIds.length === 0) {
      store.data.region = item.region;
      store.data.regionId = item.regionId;
      store.data.district = item.district;
      store.data.districtId = item.districtId;
      store.getDistrict(item.regionId, "");
    }

    store.elderlyManageId = item.id;

    store[type].person = {
      ...item.person,
      pension: {
        pensionType: item?.pensionType || "",
        pensionTypeId: item?.pensionTypeId || null
      },
      disabilityGroup: item?.disabilityGroup || null
    };

    store.addRow(() => {
      notify({
        text: t("alreadyExistPerson"),
        type: "warn"
      });
    }, type);
  }
};

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
    }

    saveLoading.value = true;
    ElderlyRegisterService.CreateCorrection(store.data)
      .then(() => {
        notify({
          // @ts-ignore
          text: i18n.global.t("SaveSuccess"),
          type: "success"
        });
        router.push({ name: "SentElderlyRegister" });
      })
      .catch((e) => {
        setError(e);
      })
      .finally(() => {
        saveLoading.value = false;
      });
  }
};

onBeforeUnmount(() => {
  store.$reset();
});
</script>

<template>
  <div>
    <UiParentCard v-if="store.loading" class="text-center">
      <v-progress-circular indeterminate></v-progress-circular>
    </UiParentCard>

    <v-form @submit.prevent="saveData" v-if="!store.loading && store.getData">
      <DataDocument>
        <v-col cols="12" lg="3" md="6">
          <v-dialog v-model="isModal" :close-on-content-click="false">
            <template #activator="{ props }">
              <v-btn :text="$t('selectElderlyManage')" color="violet" v-bind="props" :loading="store.searchLoading"
            /></template>
            <v-card elevation="0" class="px-5 py-5">
              <v-card-title>
                <v-row>
                  <v-col class="h3 py-0">
                    {{ $t("selectElderlyManage") }}
                  </v-col>
                  <v-col class="text-right cursor-pointer py-0">
                    <XIcon size="30" @click="isModal = false" />
                  </v-col>
                </v-row>
              </v-card-title>
              <v-card-text>
                <ElderlyManage set-manage :parent-filter="parentFilter">
                  <template #outAction="{ item }">
                    <div
                      class="mx-1 cursor-pointer"
                      @click="
                        () => {
                          setManage(item, store.activeTab);
                          isModal = false;
                        }
                      "
                    >
                      <PlusIcon size="20" />
                      <v-tooltip activator="parent" location="top">
                        {{ $t("AddRow") }}
                      </v-tooltip>
                    </div>
                  </template>
                </ElderlyManage>
              </v-card-text>
              <v-card-actions class="mt-3 py-0">
                <v-spacer></v-spacer>
                <v-btn color="error" variant="flat" :text="$t('close')" @click="isModal = false"> </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
      </DataDocument>

      <v-tabs v-model:model-value="store.activeTab">
        <v-tab v-for="tab in tabs" :value="tab.value" color="success"> {{ $t(tab.title) }} </v-tab>
      </v-tabs>
      <v-window :model-value="store.getActiveTab">
        <v-window-item v-for="tab in tabs" :value="tab.value">
          <component :is="tab.component" :fields="fields" />
        </v-window-item>
      </v-window>

      <v-row class="mt-4 px-3">
        <v-btn color="error" variant="flat" @click="router.back()" :text="$t('Back')" />
        <v-spacer />
        <v-btn color="success" :loading="saveLoading" variant="flat" type="submit" :text="$t('Save')" />
      </v-row>
    </v-form>
  </div>
</template>
