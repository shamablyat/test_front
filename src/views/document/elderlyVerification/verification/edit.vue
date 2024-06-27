<script setup lang="ts">
import { shallowRef, defineAsyncComponent, onBeforeUnmount, computed, ref, nextTick } from "vue";
import { IMenu } from "./types";
import { useRoute, useRouter } from "vue-router";
import { useElderlyVerification } from "./store/useElderlyVerification";
import { useErrorToast } from "@/utils/helpers/useErrorToast";
import { storeToRefs } from "pinia";
import Loader from "./components/Loader.vue";
import { IModalProps, ISelectList } from "@/models/basic";
import ElderlyReasonService from "@/services/info/elderlyreason.service";
import { notify } from "@kyvg/vue3-notification";
import FormCanButtons from "@/components/FormCanButtons.vue";
import ElderlyVerificationService from "@/services/document/elderlyVerification.service";
import i18n from "@/app/config/i18n";
import { AxiosResponse } from "axios";
import { useAppUrl } from "@/composables/useAppUrl";

const menuList = ref<IMenu[]>([
  {
    id: 1,
    label: "MainInfo",
    key: "mainInfo",
    icon: "mdi-home",
    color: "orange",
    component: defineAsyncComponent(() => import("./widgets/MainForm.vue")),
    disabled: false
  },
  {
    id: 2,
    label: "Comissions",
    icon: "mdi-account-multiple",
    color: "orange",
    component: defineAsyncComponent(() => import("./widgets/ComissionsForm.vue")),
    disabled: true,
    key: "comissions"
  },
  {
    id: 3,
    label: "Family",
    icon: "mdi-account-group-outline",
    color: "orange",
    component: defineAsyncComponent(() => import("./widgets/FamilyForm.vue")),
    disabled: true,
    key: "family"
  },
  {
    id: 4,
    label: "Health",
    icon: "mdi-bottle-tonic-plus",
    color: "orange",
    component: defineAsyncComponent(() => import("./widgets/HealthForm.vue")),
    disabled: true,
    key: "health"
  },
  {
    id: 5,
    label: "livingConditionSurvey",
    icon: "mdi-home-alert-outline",
    color: "orange",
    component: defineAsyncComponent(() => import("@/features/Questions/QuestionIndex.vue")),
    key: "livingCondition",
    disabled: true
  },
  {
    id: 6,
    label: "bartelSurvey",
    icon: "mdi-checkbox-marked-outline",
    color: "orange",
    component: defineAsyncComponent(() => import("@/features/Questions/QuestionIndex.vue")),
    key: "bartelSurvey",
    disabled: true
  },
  {
    id: 7,
    label: "lautonSurvey",
    icon: "mdi-chart-line",
    color: "orange",
    component: defineAsyncComponent(() => import("@/features/Questions/QuestionIndex.vue")),
    key: "lautenSurvey",
    disabled: true
  },
  {
    id: 8,
    label: "verificationConclusion",
    icon: "mdi-file-check",
    color: "orange",
    component: defineAsyncComponent(() => import("./widgets/Conclusion/index.vue")),
    disabled: true,
    key: "verificationConclusion"
  },
  {
    id: 9,
    label: "verificationResult",
    icon: "mdi-file-check",
    color: "orange",
    component: defineAsyncComponent(() => import("./widgets/VerificationResult/index.vue")),
    disabled: true,
    key: "verificationResult"
  }
]);

const route = useRoute();
const permission = "ElderlyVerification";
const router = useRouter();
const store = useElderlyVerification();
const { setError } = useErrorToast();
const { dataLoading, data } = storeToRefs(store);
const { EIMZO_URL } = useAppUrl();

const isView = computed(() => route.path.includes("view"));
const isSure = ref<boolean>(false);
const saveLoading = ref<boolean>(false);
const myComponent = ref<any>();

const menuFindIndex = menuList.value.findIndex((e) => e.id == Number(route.query.tab));
const tabOnMounted = menuList.value[menuFindIndex > -1 ? menuFindIndex : 0];
const activeMenu = shallowRef<IMenu>(tabOnMounted);
const selectedMenu = ref<IMenu | null>(null);

const familyMenu = computed(() => menuList.value.find((el) => el.key === "family"));
const conclusionMenu = computed(() => menuList.value.find((el) => el.key === "verificationConclusion"));

const filteredMenu = computed(() => {
  if (store.getElderlyVerificationTableHasValue) {
    Object.entries(store.getElderlyVerificationTableHasValue).forEach((el) => {
      menuList.value.forEach((menu, index) => {
        if (menu.key === "mainInfo" && +(route.params.id as string) > 0) {
          menu.color = "green";
        }

        if (menu.key === el[0]) {
          if (el[1]) {
            menu.color = "green";
            menu.disabled = false;

            if (index + 1 === menuList.value.length) return;

            menuList.value[index + 1].disabled = false;

            const disabledIds = menuList.value.filter((el) => el.id > 3 && el.id < 8);

            if (!data.value.elderlyCategoryId) {
              disabledIds.forEach((m) => {
                m.disabled = true;
              });
            }
          }
        }
      });
    });
  }

  return menuList.value;
});

const onClickLeftMenu = async (menu: IMenu) => {
  /* 1. If clicked to active menu return none action */
  if (activeMenu.value.id === menu.id) {
    return;
  }

  await nextTick();

  if (myComponent.value) {
    /* 2. If value is changed and page is not view show modal  */
    if (myComponent.value.isChanged && !isView) {
      isSure.value = true;
      selectedMenu.value = menu;
    } else {
      activeMenu.value = menu;
      router.replace({ ...route, query: { ...route.query, tab: String(activeMenu.value.id) } });
    }
  }
};

const sheSaidYes = async () => {
  if (selectedMenu.value) {
    if (myComponent.value) {
      const { valid, errors } = await myComponent.value.form.validate();
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
        saveLoading.value = true;
        /* 1. Get saveDate function and activate validate function in active component  */
        const cb: Promise<any> = myComponent.value.saveData(myComponent.value.form.validate());
        cb.then(() => {
          if (selectedMenu.value) {
            activeMenu.value = selectedMenu.value;
          }

          /* 2. Change active Menu to next component  */

          router.replace({ ...route, query: { ...route.query, tab: String(activeMenu.value.id) } });
          saveLoading.value = false;
        }).catch(() => {
          isSure.value = false;
          saveLoading.value = false;
        });
      }
    }
    isSure.value = false;
  }
};

const sheSaidNo = async () => {
  if (selectedMenu.value) {
    /* 1. If clicked "No" in modal we must change page and not save data  */
    activeMenu.value = selectedMenu.value;
    router.replace({ ...route, query: { ...route.query, tab: String(activeMenu.value.id) } });
    isSure.value = false;
  }
};

/* Validate before changing step and on saving data */
const checkStep = async () => {
  await nextTick();
  if (isSure.value) return;

  /* 1. Get current Menu  */
  const currentMenu = menuList.value.find((el) => el.id === activeMenu.value.id);

  if (currentMenu) {
    // && !data.value.elderlyCategoryId
    if (currentMenu.key === familyMenu.value?.key) {
      if (!data.value.elderlyCategoryId) {
        notify({
          // @ts-ignore
          text: i18n.global.t("categoryDidNotMatch"),
          type: "warn"
        });

        try {
          if (conclusionMenu.value) {
            activeMenu.value = conclusionMenu.value;
            router.replace({ ...route, query: { ...route.query, tab: String(conclusionMenu.value.id) } });
          }
        } catch (e) {
          console.error(e);
        }
      } else {
        setStep(currentMenu);
      }
      // store.setElderlyCategory(() => {
      // });
    } else {
      const currentStep = menuList.value.indexOf(currentMenu);
      const nextMenu = menuList.value.find((el) => el.id === menuList.value[currentStep + 1]?.id);
      if (nextMenu?.disabled) {
        return;
      }

      if (currentMenu.key == conclusionMenu.value?.key) {
        return;
      }
      setStep(currentMenu);
    }
  }
};

const setStep = (currentMenu: IMenu) => {
  if (currentMenu) {
    const currentStep = menuList.value.indexOf(currentMenu);
    if (currentStep !== menuList.value.length - 1) {
      const nextMenu = menuList.value.find((el) => el.id === menuList.value[currentStep + 1]?.id);
      if (nextMenu) {
        activeMenu.value = nextMenu;
        router.replace({ ...route, query: { ...route.query, tab: String(activeMenu.value.id) } });
      }
    } else {
      router.replace({ name: "ViewVerification", query: { ...route.query, tab: String(activeMenu.value.id) } });
    }
  }
};

const setActiveTab = (tabId: number | string) => {
  if (menuList.value) {
    const curr = menuList.value.find((el) => el.id === +tabId);
    if (curr) {
      activeMenu.value = curr;
      router.replace({ ...route, query: { ...route.query, tab: String(activeMenu.value.id) } });
    }
  }
};

const statusLoading = ref(false);
const isModal = ref(false);
const categoryLoading = ref<boolean>(false);
interface ICustomModalProps extends IModalProps {
  item: any;
}

const isModalProps = ref<ICustomModalProps>({
  cb: "",
  id: null,
  title: "",
  item: {}
});

const reasonList = ref<ISelectList[]>([]);
const setReasonList = () => {
  categoryLoading.value = true;
  ElderlyReasonService.GetAsSelectList(1)
    .then((res) => {
      reasonList.value = res.data;
    })
    .finally(() => {
      categoryLoading.value = false;
    });
};

setReasonList();

const openModal = ({ title, id, cb }: { title: string; id: number; cb: string }) => {
  isModalProps.value.title = title;
  isModalProps.value.id = id;
  isModalProps.value.cb = cb;
  isModalProps.value.item = data.value;
  isModal.value = true;
  categoryLoading.value = true;
  setReasonList();
};

const sentRequest = () => {
  if (isModalProps.value.id) {
    statusLoading.value = true;
    // @ts-ignore
    ElderlyVerificationService[isModalProps.value.cb]({
      id: isModalProps.value.id
    })
      .then(
        (
          res: AxiosResponse<{
            id: number | string;
            requestId: string;
            secretKey: string;
          }>
        ) => {
          isModal.value = false;
          notify({
            // @ts-ignore
            text: i18n.global.t("SaveSuccess"),
            type: "success"
          });

          if (isModalProps.value.cb === "Accept") {
            const { requestId, secretKey } = res.data;
            const redirect = window.location.href;
            window.location.replace(`${EIMZO_URL.value}?requestId=${requestId}&secretKey=${secretKey}&redirect=${redirect}`);
          } else {
            router.push({
              name: "ViewElderlyRegister",
              params: {
                id: res.data.id
              }
            });
          }

          // router.back();
        }
      )
      .catch((e: any) => {
        setError(e);
        isModal.value = false;
      })
      .finally(() => {
        statusLoading.value = false;
      });
  }
};

const refreshData = (cBack?: (e: any) => void, waitStopLoading?: boolean) => {
  store.flushData();
  dataLoading.value = true;
  store.setData({
    id: route.params.id as string,
    applicationId: route.query.applicationId as string,
    manageId: route.query.manageId as string,
    cb: (data) => {
      if (+(route.params.id as string)) {
        store.setElderlyVerificationTableHasValue(data.id, (res) => {
          checkStep();
          // activeMenuOnDisabled();
          if (res.verificationConclusion) {
            router.replace({ name: "ViewVerification", query: { ...route.query, tab: String(activeMenu.value.id) } });
          }
        });
      }
      if (cBack) {
        cBack(data);
      }
    },
    err: (err) => {
      setError(err);
    },
    final() {
      if (waitStopLoading) {
        return;
      }

      dataLoading.value = false;
    }
  });
};

refreshData();

onBeforeUnmount(() => {
  store.$reset();
});
</script>

<template>
  <div>
    <Loader v-if="dataLoading" />
    <v-row v-else>
      <v-col lg="2" cols="12">
        <v-card elevation="0" class="left-menu-list">
          <v-list density="compact">
            <v-list-item
              v-for="menu in filteredMenu"
              :active="menu.id == activeMenu.id"
              :disabled="menu.disabled"
              @click="onClickLeftMenu(menu)"
              color="info"
              class="left-menu mt-2"
              :style="{ borderColor: menu.color }"
            >
              <template v-slot:prepend>
                <v-icon :icon="menu.icon"></v-icon>
              </template>

              <v-list-item-title>{{ $t(menu.label) }} </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- forms -->
      <v-col lg="10" cols="12">
        <v-card elevation="0">
          <v-card-text v-if="data">
            <div class="mb-5">
              <h1 class="pt-2 pb-2 mb-4">{{ $t(activeMenu.label) }}</h1>
              <h3>
                {{ $t("serviceRecipientFullName") }}: {{ data.applicantPerson?.fullName || "-" }}
                {{ `${data.applicantPerson?.birthOn ? `(${data.applicantPerson?.birthOn})` : ""}` }}
              </h3>
              <h3 class="text-success" v-if="store.getElderlyVerificationTableHasValue?.family && activeMenu.id >= 3">
                {{ $t("elderlyCategory") }} : {{ store.data.elderlyCategory || "-" }}
              </h3>
            </div>

            <component
              :id="
                activeMenu.label == 'bartelSurvey'
                  ? data.bartelSurveyId || 0
                  : activeMenu.label == 'lautonSurvey'
                  ? data.lautonSurveyId || 0
                  : activeMenu.label == 'livingConditionSurvey'
                  ? data.livingConditionSurveyId || 0
                  : 0
              "
              :elderly-verification-id="data.id"
              :eldQuestionnaireType="activeMenu.label"
              ref="myComponent"
              :is="activeMenu.component"
              :isView="isView"
              @setStep="checkStep"
              @createSurvey="refreshData"
              @refreshData="refreshData"
              @changeRoute="refreshData"
              @setActiveTab="setActiveTab"
            />
          </v-card-text>

          <v-card-actions class="w-100" v-if="isView">
            <FormCanButtons class="w-100" :permission="permission" :service="ElderlyVerificationService" :data="data">
              <template #Accept>
                <!-- without eimzo -->

                <div class="d-flex">
                  <div
                    style="margin-right: 5px; cursor: pointer"
                    @click="
                      openModal({
                        title: 'AcceptAfterSign',
                        id: data.id,
                        cb: 'AcceptAfterSign'
                      })
                    "
                    v-if="data.canAccept"
                  >
                    <v-btn color="success" :text="$t('AcceptAfterSign')" variant="flat" class="px-3" />
                  </div>
                  <!-- with eimzo -->
                  <div
                    style="margin-right: 5px; cursor: pointer"
                    @click="
                      openModal({
                        title: 'Accept',
                        id: data.id,
                        cb: 'Accept'
                      })
                    "
                    v-if="data.canAccept"
                  >
                    <v-btn color="success" :text="$t('Accept')" variant="flat" class="px-3">
                      <template #prepend>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14px"
                          height="14px"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="feather feather-key"
                        >
                          <path
                            d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"
                          ></path>
                        </svg>
                      </template>
                    </v-btn>
                  </div>
                </div>
              </template>
            </FormCanButtons>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="isSure" width="500" location="top">
      <v-card class="px-5 py-5">
        <v-card-title>
          <h3 class="text-center" style="white-space: pre-wrap">
            {{ $t("changePageConfirmation") }}
          </h3>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="6">
              <v-btn :text="$t('no')" :loading="saveLoading" class="w-100" color="error" variant="flat" @click="sheSaidNo" />
            </v-col>
            <v-col cols="6">
              <v-btn @click="sheSaidYes" :loading="saveLoading" class="w-100" :text="$t('yes')" variant="flat" color="success" />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- CAN -->
    <v-dialog v-model="isModal" width="300">
      <v-card class="mx-2 my-2">
        <v-card-title>
          <h3>
            {{ $t(`${isModalProps.title}`) }}
          </h3>
        </v-card-title>
        <v-card-text class="py-0">
          <v-list-item value="wifi" active-color="primary" class="px-0">
            <div class="d-flex align-center">
              <div>
                {{ $t("ID") }}
              </div>
              <div class="ml-auto" style="font-weight: bold">
                {{ isModalProps.id || "-" }}
              </div>
            </div>
          </v-list-item>
          <v-list-item value="wifi" active-color="primary" class="px-0">
            <div class="d-flex align-center">
              <div>
                {{ $t("elderlyCategory") }}
              </div>
              <div class="ml-auto text-right" style="font-weight: bold">
                <v-progress-circular v-if="categoryLoading" indeterminate />
                <span style="max-width: 70%; margin-left: auto" v-else>
                  {{ store.data.elderlyCategory || "-" }}
                </span>
              </div>
            </div>
          </v-list-item>
        </v-card-text>

        <v-card-actions>
          <v-row>
            <v-col>
              <v-btn :loading="statusLoading" color="error" variant="flat" block @click="isModal = false">
                {{ $t("no") }}
              </v-btn>
            </v-col>
            <v-col>
              <v-btn :loading="statusLoading" color="success" variant="flat" block @click="sentRequest()" :disabled="categoryLoading">
                {{ $t("yes") }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<style></style>
<style lang="scss" scoped>
.left-menu {
  border-right: 4px solid transparent;
}
.left-menu-list {
  position: sticky;
  top: 100px;
  max-height: 70vh;
  overflow-y: scroll;
  padding-right: 5px;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgb(var(--v-theme-violet));
  }
}
</style>
