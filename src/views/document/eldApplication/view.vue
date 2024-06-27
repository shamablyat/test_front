<script setup lang="ts">
import UiParentCard from "@/components/UiParentCard.vue";
import { ISelectList } from "@/models/basic";
import AdmManualService from "@/services/others/admmanual.service";
import { useErrorToast } from "@/utils/helpers/useErrorToast";
import { ref } from "vue";
import { useRoute } from "vue-router";
import { MoodCryIcon } from "vue-tabler-icons";
import { UserInfo } from "@/components/UserInfo";
import PersonService from "@/services/others/person.service";
import { BASE64STRING } from "@/utils/constants";
import EldApplicationService from "@/services/document/eldApplication.service";
import { useGlobal } from "@/composables/useGlobal";

const route = useRoute();
const { setError } = useErrorToast();
const {getStepColor} = useGlobal()

const data = ref<any | null>(null);
const loading = ref(false);
const id = route.params.id as string;
const organizationsList = ref<ISelectList[]>([]);

const get = () => {
  loading.value = true;
  EldApplicationService.Get(id)
    .then((res) => {
      if (res.data) {
        data.value = res.data;

        setPhoto();
      }
    })
    .catch((e) => {
      setError(e);
    })
    .finally(() => {
      loading.value = false;
    });
};

const setOrganizations = () => {
  AdmManualService.OrganizationSelectList().then((res) => {
    organizationsList.value = res.data;
  });
};

const setPhoto = () => {
  if (data.value && data.value.application) {
    if (data.value.application.applicantPersonId && data.value.application.applicantPerson) {
      PersonService.GetPhotoFromGSP(data.value.application.applicantPersonId).then((res) => {
        if (data.value && data.value.application && data.value.application.applicantPerson) {
          data.value.application.applicantPerson.photo = BASE64STRING + res.data.base64String;
        }
      });
    }
    if (data.value.application.serviceRecipientId && data.value.application.serviceRecipient) {
      PersonService.GetPhotoFromGSP(data.value.application.serviceRecipientId).then((res) => {
        if (data.value && data.value.application && data.value.application.serviceRecipient) {
          data.value.application.serviceRecipient.photo = BASE64STRING + res.data.base64String;
        }
      });
    }
  }
};

get();
setOrganizations();
</script>

<template>
  <div>
    <UiParentCard v-if="loading" class="text-center">
      <v-progress-circular indeterminate></v-progress-circular>
    </UiParentCard>
    <UiParentCard v-if="data">
      <v-row>
        <v-col cols="12" lg="4" class="py-0 d-flex">
          <v-label class="mb-2 mr-2 font-weight-bold">{{ $t("region") }}: </v-label>
          <span>{{ data.application?.address?.livingRegion || "-" }}</span>
        </v-col>
        <v-col cols="12" lg="4" class="py-0 d-flex">
          <v-label class="mb-2 mr-2 font-weight-bold"> {{ $t("district") }}: </v-label>
          <span>{{ data.application?.address?.livingRegion || "-" }}</span>
        </v-col>
        <v-col cols="12" lg="4" class="py-0 d-flex">
          <v-label class="mb-2 mr-2 font-weight-bold"> {{ $t("forSelf") }}: </v-label>
          <span>{{ data.forSelf ? $t("yes") : $t("no") }}</span>
        </v-col>
      </v-row>
    </UiParentCard>

    <div class="mt-4" v-if="data && data.application">
      <h2>{{ $t("application") }}</h2>

      <UiParentCard class="mt-4">
        <v-row>
          <v-col cols="12" lg="6" class="py-0 d-flex">
            <v-label class="mb-2 mr-2 font-weight-bold">{{ $t("livingRegion") }}: </v-label>
            <span>{{ data.application?.address?.livingRegion || '-' }}</span>
          </v-col>
          <v-col cols="12" lg="6" class="py-0 d-flex">
            <v-label class="mb-2 mr-2 font-weight-bold">{{ $t("livingDistrict") }}: </v-label>
            <span>{{ data.application?.address?.livingDistrict || '-' }}</span>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" lg="6" class="py-0 d-flex">
            <v-label class="mb-2 mr-2 font-weight-bold">{{ $t("temporaryRegion") }}: </v-label>
            <span>{{ data.application?.address?.temporaryRegion || '-' }}</span>
          </v-col>
          <v-col cols="12" lg="6" class="py-0 d-flex">
            <v-label class="mb-2 mr-2 font-weight-bold">{{ $t("temporaryDistrict") }}: </v-label>
            <span>{{ data.application?.address?.temporaryDistrict || '-' }}</span>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" lg="6" class="py-0 d-flex">
            <v-label class="mb-2 mr-2 font-weight-bold">{{ $t("docOn") }}: </v-label>
            <span>{{ data.application.docOn }}</span>
          </v-col>
          <v-col cols="12" lg="6" class="py-0 d-flex">
            <v-label class="mb-2 mr-2 font-weight-bold">{{ $t("docNumber") }}: </v-label>
            <span>{{ data.application.docNumber }}</span>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" lg="6" class="py-0 d-flex">
            <v-label class="mb-2 mr-2 font-weight-bold">{{ $t("applicationCreationType") }}: </v-label>
            <span>{{ data.application.applicationCreationType }}</span>
          </v-col>
          <v-col cols="12" lg="6" class="py-0 d-flex">
            <v-label class="mb-2 mr-2 font-weight-bold">{{ $t("currentApplicationTypeStep") }}: </v-label>
            <!-- <span>{{ data.application.currentApplicationTypeStep }}</span> -->
            <v-chip :color="getStepColor(data.application)">
              {{ data.application.currentApplicationTypeStep }}
            </v-chip>
          </v-col>
        </v-row>
      </UiParentCard>

      <v-expansion-panels class="mt-4">
        <!-- applicationPerson -->
        <v-expansion-panel v-if="data.application">
          <v-expansion-panel-title>
            {{ $t("applicationPerson") }}
          </v-expansion-panel-title>
          <v-expansion-panel-text class="py-5">
            <v-row class="mb-4">
              <v-col cols="12" lg="6" class="py-0 d-flex align-center mb-2">
                <v-label class="mr-2 font-weight-bold">{{ $t("applicantPhoneNumber") }}: </v-label>
                <span>{{ data.application.applicantPhoneNumber || "+998 93 3921403" }}</span>
              </v-col>
              <v-col cols="12" lg="6" class="py-0 d-flex align-center mb-2">
                <v-label class="mr-2 font-weight-bold">{{ $t("applicantPhoneNumberAlt") }}: </v-label>
                <span>{{ data.application.applicantPhoneNumberAlt || "-" }}</span>
              </v-col>
              <v-col cols="12" lg="12" class="py-0 d-flex align-center">
                <v-label class="mr-2 font-weight-bold"> {{ $t("applicationType") }}: </v-label>
                <span>{{ data.application.applicationType }}</span>
              </v-col>
            </v-row>

            <UserInfo
              v-if="data.application.applicantPerson"
              :person="data.application.applicantPerson"
              :image="data.application.applicantPerson.photo"
            />
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!-- SERVICE RECIPIENT -->
        <v-expansion-panel class="mt-4" v-if="data.application && data.application.serviceRecipient">
          <v-expansion-panel-title>
            {{ $t("serviceRecipient") }}
          </v-expansion-panel-title>
          <v-expansion-panel-text class="py-5">
            <v-row class="mb-4">
              <v-col cols="12" lg="6" class="py-0 d-flex align-center mb-2">
                <v-label class="mr-2 font-weight-bold">{{ $t("serviceRecipientPhoneNumber") }}: </v-label>
                <span>{{ data.application.serviceRecipientPhoneNumber || "+998 93 3921403" }}</span>
              </v-col>
              <v-col cols="12" lg="6" class="py-0 d-flex align-center mb-2">
                <v-label class="mr-2 font-weight-bold">{{ $t("serviceRecipientPhoneNumberAlt") }}: </v-label>
                <span>{{ data.application.serviceRecipientPhoneNumberAlt || "-" }}</span>
              </v-col>
            </v-row>
            <UserInfo
              v-if="data.application.serviceRecipient"
              :person="data.application.serviceRecipient"
              :image="data.application.serviceRecipient.photo"
            >
              <template #rightCollarItem>
                <v-list-item value="wifi" active-color="primary">
                  <div class="d-flex align-center">
                    <div class="ml-3">
                      {{ $t("livingAddress") }}
                    </div>
                    <div class="ml-auto" style="font-weight: bold">
                      {{ data.application.address?.livingAddress }}
                    </div>
                  </div>
                </v-list-item>
                <v-list-item value="wifi" active-color="primary">
                  <div class="d-flex align-center">
                    <div class="ml-3">
                      {{ $t("temporaryAddress") }}
                    </div>
                    <div class="ml-auto" style="font-weight: bold">
                      {{ data.application.address?.temporaryAddress || "-" }}
                    </div>
                  </div>
                </v-list-item>
              </template>
            </UserInfo>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>

    <UiParentCard class="text-center" v-if="!data && !loading">
      <MoodCryIcon size="80" class="mb-4" />
      <h2>{{ $t("NotFound") }}</h2>
    </UiParentCard>
  </div>
</template>
