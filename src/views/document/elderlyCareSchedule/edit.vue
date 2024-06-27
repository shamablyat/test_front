<script setup lang="ts">
import UiParentCard from "@/components/UiParentCard.vue";
import { useErrorToast } from "@/utils/helpers/useErrorToast";
import { useRoute, useRouter } from "vue-router";
import { useElderlySchedule } from "./store/useCareSchedule";
import ElderlyManage from "./components/ElderlyManage.vue";
import { SubmitEventPromise } from "vuetify";
import Calendar from "./components/Calendar.vue";
import { notify } from "@kyvg/vue3-notification";
import i18n from "@/app/config/i18n";
import Assistant from "./components/Assistant.vue";
import { onBeforeUnmount, ref, watch } from "vue";
import { useGlobal } from "@/composables/useGlobal";
import { useCheckPhoneNumber } from "@/composables/CheckPhoneNumber";
import { ChevronRightIcon } from "vue-tabler-icons";
import { useI18n } from "vue-i18n";
// import ElderlyCareSchedule from "@/services/document/elderySchedule.service";
import FileAttach from "@/components/FileAttach.vue";
import FileConfigService from "@/services/others/fileconfig.service";
import { IFileConfig } from "@/models/basic";

const { setError } = useErrorToast();
const { disableAfterTodayDays } = useGlobal();
const { t } = useI18n();
const { phoneNumberRules } = useCheckPhoneNumber();

const store = useElderlySchedule();
const router = useRouter();
const route = useRoute();

store.setElderlyCategoryList();
store.setElderlyReasonList();
store.setPensionTypeList();
store.setAttachAssistantReasonList();

// const progress = ref<any>(0);
const showPage = ref<boolean>(false);
const isModal = ref(false);
const fileConfig = ref<IFileConfig[]>([]);

const getFileConfig = () => {
  if (store.getData) {
    FileConfigService.FileConfig({ tableId: store.getData.tableId, docOn: store.getData.docOn, code: "" }).then((res) => {
      fileConfig.value = res.data;
    });
  }
};
const setData = (id: number | string) => {
  const isClone = route.query.clone as string;
  store.setData({
    id,
    isClone,
    cb: (data) => {
      store.setElderlyServiceList();
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

      getFileConfig();
    },
    err: (err) => {
      showPage.value = false;
      setError(err);
    }
  });
};

const back = () => {
  router.back();
};

const updateAttachAssistant = (value: boolean) => {
  if (!value && store.data) {
    store.data.notAttachAssistantReasonId = null;
    store.data.tables = []
    store.tables = {}
    store.data.assistantPerson = null
  }
};

const saveData = async (submit: SubmitEventPromise) => {
  const { valid, errors } = await submit;
  if (errors && errors.length > 0) {
    const position = document
      // @ts-ignore
      .getElementById(errors[0].id)
      ?.getBoundingClientRect();
    window.scrollTo({
      top: position?.top,
      behavior: "smooth"
    });
  }
  if (valid) {
    if (store.getData.assistantPerson && !store.getData.assistantPerson.pinfl && store.getData.attachAssitant) {
      notify({
        // @ts-ignore
        text: i18n.global.t("notAcceptedAssistantPerson"),
        type: "warn"
      });
      return;
    }
    if (!store.getData.elderlyManageId) {
      notify({
        text: i18n.global.t("notAcceptedManageId"),
        type: "warn"
      });
      return;
    }

    if (!store.getData.attachAssitant && store.getData.notAttachAssistantReasonId) {
      if (store.getData.files.length == 0) {
        notify({
          text: t("FileNotCorrect"),
          type: "warn"
        });
        return false;
      }
    }

    if (Object.keys(store.getTables).length === 0 && store.getData.attachAssitant) {
      notify({
        text: i18n.global.t("personNotAcceptedToCalendar"),
        type: "warn"
      });
      return;
    }

    store.saveData({
      cb: () => {
        notify({
          // @ts-ignore
          text: i18n.global.t("SaveSuccess"),
          type: "success"
        });
        router.push({ name: "ElderlyCareSchedule" });
      },
      err: (err) => {
        setError(err);
      }
    });
  }
};

// const uploadFile = (formData: FormData) => {
//   ElderlyCareSchedule.UploadFile(formData, {
//     onUploadProgress: (e) => {
//       if (e.progress) {
//         progress.value = e.progress * 100;
//       }
//     }
//   }).then((res) => {
//     store.data.files = [
//       {
//         id: res.data[0].fileId,
//         fileName: res.data[0].fileName
//       }
//     ];
//   });
// };

const setMaxValue = (value: string) => {
  if (parseInt(value) > 300) {
    store.data.travelTimeInMinutes = `300`;
  }
};

const setFile = (value: any[]) => {
  if (store.getData) {
    store.getData.files = value;
  }
};

const deleteFile = (columnName: string) => {
  if (store.getData) {
    const item = store.getData.files.find((el: any) => el.columnName === columnName);

    if (item) {
      const index = store.getData.files.indexOf(item);
      store.getData.files.splice(index, 1);
    }
  }
};

watch(
  () => route.params.id,
  (value) => {
    if (value) {
      store.$reset();
      setData(value as string);
    }
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  store.$reset();
});
</script>

<template>
  <div>
    <UiParentCard v-if="store.getLoading" class="text-center">
      <v-progress-circular indeterminate></v-progress-circular>
    </UiParentCard>
    <v-form @submit.prevent="saveData" v-if="store.getData">
      <UiParentCard>
        <v-row class="mt-3 align-end">
          <v-col cols="12" lg="3" md="4" class="py-0">
            <form-picker clearable :label="$t('docOn')" :disabledDate="disableAfterTodayDays" v-model="store.getData.docOn" />
          </v-col>
          <v-col cols="12" lg="3" md="4" class="py-0">
            <form-input :label="$t('docNumber')" v-model="store.getData.docNumber" />
          </v-col>
          <v-col cols="12" lg="3" md="4" class="py-0">
            <form-checkbox :label="$t('addAssistant')" v-model="store.getData.attachAssitant" @update:model-value="updateAttachAssistant" />
          </v-col>
          <v-col cols="12" lg="3" md="4" class="py-0">
            <form-input
              v-if="store.getData.attachAssitant"
              mask="###"
              :label="$t('travelTimeInMinutes')"
              v-model="store.getData.travelTimeInMinutes"
              @update:model-value="setMaxValue"
            />
          </v-col>
        </v-row>
      </UiParentCard>
      <UiParentCard class="mt-4">
        <v-row class="align-center">
          <v-col cols="12" lg="4">
            <v-dialog v-model="isModal" persistent>
              <template #activator="{ props }">
                <v-btn color="primary" v-bind="props">
                  {{ $t("selectElderlyManage") }}
                </v-btn>
              </template>
              <ElderlyManage @set-is-modal="isModal = false" />
            </v-dialog>
          </v-col>
          <v-col>
            <Assistant class="text-right" v-if="store.getData.attachAssitant" />
            <form-select
              v-else
              :list="store.getAttachAssistantReasonList"
              v-model="store.getData.notAttachAssistantReasonId"
              required
              :label="$t('notAttachReason')"
            ></form-select>
          </v-col>
        </v-row>

        <v-row v-if="!store.getData.attachAssitant && store.getData.notAttachAssistantReasonId">
          <v-col cols="12" lg="3" md="4" class="py-0">
            <!-- <FileUpload
              accept=".pdf, image/*"
              form-data-key="files"
              :files="store.getData.files"
              :title="$t('UploadFile')"
              size="large"
              required
              @delete-file="deleteFile"
              :progress="progress"
              @update-file="uploadFile"
            /> -->
            <FileAttach
              :files="store.getData.files"
              :column-name="'DOC_ELDERLY_CARE_SCHEDULE'"
              :table-id="store.getData.tableId"
              :config="fileConfig.find((el: any) => el.columnName == 'DOC_ELDERLY_CARE_SCHEDULE') || fileConfig[0]"
              @set-file="setFile"
              @delete-file="deleteFile"
            >
              {{ $t("UploadFile") }}
            </FileAttach>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" lg="6" v-if="store.getData && store.getData?.elderlyManage.elderlyFullName">
            <v-card elevation="0" class="border">
              <v-row class="pt-2 px-3">
                <v-col cols="3">
                  <v-avatar size="100">
                    <v-img :src="store.getManagePhoto"> </v-img>
                  </v-avatar>
                </v-col>
                <v-col cols="9" class="d-flex align-center" style="font-weight: bold">
                  {{ store.getData?.elderlyManage?.elderlyFullName }}
                </v-col>
              </v-row>
              <v-list-item value="wifi" active-color="primary">
                <v-row>
                  <v-col>
                    <div class="d-flex align-center">
                      <ChevronRightIcon size="22" stroke-width="1.5" class="mr-2" />
                      <div class="ml-3">
                        {{ $t("birthOn") }}
                      </div>
                    </div>
                  </v-col>
                  <v-col class="text-right font-weight-bold">
                    <div class="ml-auto">
                      {{ store.getData?.elderlyManage?.elderlyGender }}
                    </div>
                  </v-col>
                </v-row>
              </v-list-item>
              <v-list-item value="wifi" active-color="primary">
                <v-row>
                  <v-col>
                    <div class="d-flex align-center">
                      <ChevronRightIcon size="22" stroke-width="1.5" class="mr-2" />
                      <div class="ml-3">
                        {{ $t("birthOn") }}
                      </div>
                    </div>
                  </v-col>
                  <v-col class="text-right font-weight-bold">
                    <div class="ml-auto">
                      {{ store.getData?.elderlyManage?.elderlyBirhtOn }}
                    </div>
                  </v-col>
                </v-row>
              </v-list-item>
              <v-list-item value="wifi" active-color="primary">
                <v-row>
                  <v-col>
                    <div class="d-flex align-center">
                      <ChevronRightIcon size="22" stroke-width="1.5" class="mr-2" />
                      <div class="ml-3">
                        {{ $t("pensionType") }}
                      </div>
                    </div>
                  </v-col>
                  <v-col class="text-right font-weight-bold">
                    <div class="ml-auto">
                      {{ store.getData?.elderlyManage?.elderlyPensionType }}
                    </div>
                  </v-col>
                </v-row>
              </v-list-item>
              <v-list-item value="wifi" active-color="primary">
                <v-row>
                  <v-col>
                    <div class="d-flex align-center">
                      <ChevronRightIcon size="22" stroke-width="1.5" class="mr-2" />
                      <div class="ml-3">
                        {{ $t("elderlyCategory") }}
                      </div>
                    </div>
                  </v-col>
                  <v-col class="text-right font-weight-bold">
                    <div class="ml-auto">
                      {{ store.getData?.elderlyManage?.elderlyCategory }}
                    </div>
                  </v-col>
                </v-row>
              </v-list-item>

              <v-list-item value="wifi" active-color="primary">
                <v-row>
                  <v-col>
                    <div class="d-flex align-center">
                      <ChevronRightIcon size="22" stroke-width="1.5" class="mr-2" />
                      <div class="ml-3">
                        {{ $t("livingRegion") }}
                      </div>
                    </div>
                  </v-col>
                  <v-col class="text-right font-weight-bold">
                    <div class="ml-auto">
                      {{ store.getData?.elderlyManage?.elderlyRegion }}
                    </div>
                  </v-col>
                </v-row>
              </v-list-item>

              <v-list-item value="wifi" active-color="primary">
                <v-row>
                  <v-col>
                    <div class="d-flex align-center">
                      <ChevronRightIcon size="22" stroke-width="1.5" class="mr-2" />
                      <div class="ml-3">
                        {{ $t("livingDistrict") }}
                      </div>
                    </div>
                  </v-col>
                  <v-col class="text-right font-weight-bold">
                    <div class="ml-auto">
                      {{ store.getData?.elderlyManage?.elderlyDistrict }}
                    </div>
                  </v-col>
                </v-row>
              </v-list-item>
              <v-list-item value="wifi" active-color="primary">
                <v-row>
                  <v-col>
                    <div class="d-flex align-center">
                      <ChevronRightIcon size="22" stroke-width="1.5" class="mr-2" />
                      <div class="ml-3">
                        {{ $t("livingMfy") }}
                      </div>
                    </div>
                  </v-col>
                  <v-col class="text-right font-weight-bold">
                    <div class="ml-auto">
                      {{ store.getData?.elderlyManage?.elderlyMfy }}
                    </div>
                  </v-col>
                </v-row>
              </v-list-item>
            </v-card>
          </v-col>
          <v-col
            cols="12"
            lg="6"
            v-if="
              store.getData &&
              store.getData?.assistantPerson &&
              store.getData.assistantPerson.fullName &&
              store.getIsSelectedPerson &&
              store.getData.attachAssitant
            "
          >
            <v-card variant="outlined" class="py-2">
              <v-row class="pt-2 px-3">
                <v-col cols="3">
                  <v-avatar
                    size="100 "
                    :class="{
                      isDeath: store.getData.assistantPerson.isDeath
                    }"
                  >
                    <v-img :src="store.getAssistantPhoto"> </v-img>
                  </v-avatar>
                </v-col>
                <v-col cols="9" class="d-flex align-center" style="font-weight: bold">
                  {{ store.getData.assistantPerson.fullName }}
                </v-col>
              </v-row>
              <v-list-item value="bluetooth" active-color="primary">
                <v-row>
                  <v-col>
                    <div class="d-flex align-center">
                      <ChevronRightIcon size="22" stroke-width="1.5" class="mr-2" />
                      <div class="ml-3">
                        {{ $t("genderName") }}
                      </div>
                    </div>
                  </v-col>
                  <v-col class="text-right" style="font-weight: bold">
                    {{ store.getData.assistantPerson.genderName }}
                  </v-col>
                </v-row>
              </v-list-item>
              <v-list-item value="wifi" active-color="primary">
                <v-row class="d-flex align-center">
                  <v-col>
                    <div class="d-flex">
                      <ChevronRightIcon size="22" stroke-width="1.5" class="mr-2" />
                      <div class="ml-3">
                        {{ $t("assistantPhoneNumber") }}
                        <span style="color: red">*</span>
                      </div>
                    </div>
                  </v-col>
                  <v-col cols="4" class="text-right">
                    <form-input
                      mask="+998 (##) ###-##-##"
                      :placeholder="$t('assistantPhoneNumber')"
                      required
                      :rules="phoneNumberRules"
                      v-model="store.getData.assistantPhoneNumber"
                    />
                  </v-col>
                </v-row>
              </v-list-item>
            </v-card>
          </v-col>
        </v-row>
      </UiParentCard>
      <UiParentCard class="mt-4" v-if="store.getData.elderlyVerificationId">
        <v-row class="align-center">
          <v-col cols="12" md="6" class="py-0">
            <span class="mr-2 font-weight-bold h4"
              >{{ $t("maxDurationHours") }}:
              {{ store.getData.maxDurationHours }}
            </span>
          </v-col>
        </v-row>
      </UiParentCard>
      <Calendar v-if="store.getData && store.getData?.assistantPerson && store.getData.attachAssitant" />

      <v-row class="mt-2">
        <v-col>
          <v-btn color="error" variant="flat" @click="back">
            {{ $t("Back") }}
          </v-btn>
        </v-col>
        <v-col class="text-right">
          <v-btn color="success" :loading="store.getSaveLoading" variant="flat" type="submit">
            {{ $t("Save") }}
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>
