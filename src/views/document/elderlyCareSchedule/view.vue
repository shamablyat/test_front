<script setup lang="ts">
import UiParentCard from "@/components/UiParentCard.vue";
import ElderlyCareScheduleService from "@/services/document/elderySchedule.service";
import { useErrorToast } from "@/utils/helpers/useErrorToast";
import { ref } from "vue";
import { useRoute } from "vue-router";
import { notify } from "@kyvg/vue3-notification";
import i18n  from "@/app/config/i18n";
import LogList from "@/components/LogList.vue";
import FormCanButtons from "@/components/FormCanButtons.vue";
import Calendar from "./components/Calendar.vue";
import { useElderlySchedule } from "./store/useCareSchedule";
import { ChevronRightIcon } from "vue-tabler-icons";

const { setError } = useErrorToast();

const store = useElderlySchedule();

const route = useRoute();
const id = route.params.id as string;
const assistantPhoto = ref<string>("");
const managementPhoto = ref<string>("");
const permission = "ElderlyCareSchedule";
const rating = ref<any>({
  docId: 0,
  rate: 0,
  commentText: ""
});
const ratingLoading = ref(false);

store.setData({
  id,
  cb: () => { },
  err: (err) => {
    setError(err);
  }
});

store.setElderlyServiceList();

const AddRating = (dialog: () => {}) => {
  ratingLoading.value = true;
  rating.value.docId = store.data.id;
  ElderlyCareScheduleService.AddFeedback(rating.value)
    .then(() => {
      notify({
        //@ts-ignore
        text: i18n.global.t("Success"),
        type: "success"
      });
      dialog();
      rating.value = {
        docId: 0,
        rate: 0,
        commentText: ""
      };
    })
    .catch((e) => {
      setError(e);
    })
    .finally(() => {
      ratingLoading.value = false;
    });
};
</script>

<template>
  <div>
    <UiParentCard v-if="store.getLoading" class="text-center">
      <v-progress-circular indeterminate></v-progress-circular>
    </UiParentCard>

    <div v-if="store.getData && !store.getLoading">
      <UiParentCard>
        <v-row>
          <v-col cols="12" lg="6" v-if="store.getData && store.getData?.elderlyManage?.elderlyFullName">
            <v-card elevation="0" class="border">
              <v-row class="pt-2 px-3">
                <v-col cols="3">
                  <v-avatar size="100">
                    <v-img :src="managementPhoto"> </v-img>
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
          <v-col cols="12" lg="6" v-if="store.getData">
            <v-card variant="outlined" class="py-2">
              <v-row class="pt-2 px-3">
                <v-col cols="3">
                  <v-avatar size="100">
                    <v-img :src="assistantPhoto"> </v-img>
                  </v-avatar>
                </v-col>
                <v-col cols="9" class="d-flex align-center" style="font-weight: bold">
                  {{ store.getData.assistantPerson?.fullName }}
                </v-col>
              </v-row>
              <v-list-item value="bluetooth" active-color="primary">
                <div class="d-flex align-center">
                  <ChevronRightIcon size="22" stroke-width="1.5" class="mr-2" />
                  <div class="ml-3">
                    {{ $t("genderName") }}
                  </div>
                  <div class="ml-auto" style="font-weight: bold">
                    {{ store.getData.assistantPerson?.genderName }}
                  </div>
                </div>
              </v-list-item>
              <v-list-item value="wifi" active-color="primary">
                <div class="d-flex align-center">
                  <ChevronRightIcon size="22" stroke-width="1.5" class="mr-2" />
                  <div class="ml-3">
                    {{ $t("assistantPhoneNumber") }}
                  </div>
                  <div class="ml-auto" style="font-weight: bold">
                    {{ store.getData?.assistantPhoneNumber }}
                  </div>
                </div>
              </v-list-item>
            </v-card>
            <div class="text-right">
              <v-dialog width="500">
                <template v-slot:activator="{ props }">
                  <v-btn class="mt-3" v-bind="props" :text="$t('rating')" color="info" variant="flat"> </v-btn>
                </template>

                <template v-slot:default="{ isActive }">
                  <v-card :title="$t('rating')">
                    <v-card-text>
                      <v-row>
                        <v-col cols="12">
                          <v-rating half-increments hover :length="5" :size="51" v-model="rating.rate"
                            active-color="primary" />
                        </v-col>
                        <v-col>
                          <v-textarea :label="$t('comment')" v-model="rating.commentText" variant="solo"></v-textarea>
                        </v-col>
                      </v-row>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>

                      <v-btn :text="$t('close')" @click="isActive.value = false" color="error" variant="flat"></v-btn>
                      <v-btn :text="$t('Save')" @click="AddRating(() => (isActive.value = false))" color="success"
                        variant="flat"></v-btn>
                    </v-card-actions>
                  </v-card>
                </template>
              </v-dialog>
            </div>
          </v-col>
        </v-row>
      </UiParentCard>

      <Calendar isView />

      <LogList v-if="store.getData && store.getData.logList && store.getData.logList.length > 0"
        :logs="store.getData.logList" />

      <FormCanButtons :service="ElderlyCareScheduleService" :permission="permission" :data="store.getData" />
    </div>
  </div>
</template>
