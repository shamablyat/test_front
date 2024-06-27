<script setup lang="ts">
import { UserInfo } from "@/components/UserInfo";
import PersonService from "@/services/others/person.service";
import { BASE64STRING } from "@/utils/constants";
import { ref } from "vue";
import { EyeIcon, XIcon } from "vue-tabler-icons";

interface IProps {
  item: any;
}
const props = defineProps<IProps>();

const isModal = ref(false);
const personPhoto = ref<string>("");

const getPersonPhoto = () => {
  PersonService.GetPhotoFromGSP(props.item.personId).then((res) => {
    personPhoto.value = BASE64STRING + res.data.base64String;
  });
};
</script>

<template>
  <v-dialog v-model="isModal">
    <template #activator="{ props }">
      <div v-bind="props" @click="getPersonPhoto" style="margin-right: 5px">
        <v-tooltip activator="parent" location="top">
          {{ $t("View") }}
        </v-tooltip>
        <EyeIcon size="20" style="cursor: pointer" /></div
    ></template>

    <v-card :append-icon="XIcon">
      <template #append> <XIcon @click="isModal = false" class="cursor-pointer" /> </template>
      <template #title>
        <h2>{{ props.item.elderlyFullName }}</h2>
      </template>

      <template #text>
        <UserInfo :person="item.person" :image="personPhoto">
          <template #rightCollar>
            <v-list-item value="wifi" active-color="primary">
              <div class="d-flex align-center">
                <div class="ml-3">
                  {{ $t("elderlyCategory") }}
                </div>
                <div class="ml-auto" style="font-weight: bold">{{ item.elderlyCategory }}</div>
              </div>
            </v-list-item>
            <v-list-item value="wifi" active-color="primary">
              <div class="d-flex align-center">
                <div class="ml-3">
                  {{ $t("elderlyReason") }}
                </div>
                <div class="ml-auto" style="font-weight: bold">{{ item.elderlyReason || "-" }}</div>
              </div>
            </v-list-item>
            <v-list-item value="wifi" active-color="primary">
              <div class="d-flex align-center">
                <div class="ml-3">
                  {{ $t("deregisterDate") }}
                </div>
                <div class="ml-auto" style="font-weight: bold">{{ item.endOn || "-" }}</div>
              </div>
            </v-list-item>
          </template>
          <template #leftCollar>
            <v-list-item value="wifi" active-color="primary">
              <div class="d-flex align-center">
                <div class="ml-3">
                  {{ $t("registerDate") }}
                </div>
                <div class="ml-auto" style="font-weight: bold">{{ item.startOn || "-" }}</div>
              </div>
            </v-list-item>
          </template>
        </UserInfo>
      </template>
    </v-card>
  </v-dialog>
</template>
