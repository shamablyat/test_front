<script setup lang="ts">
import { INotHasDoc, ISetPassportData } from "@/components/setPassportData/types";
import { useElderlySchedule } from "../store/useCareSchedule";
import { useErrorToast } from "@/utils/helpers/useErrorToast";
import { AxiosError } from "axios";
import SetPassportData  from "@/components/setPassportData/SetPassportData.vue";
import { ref } from "vue";
import { notify } from "@kyvg/vue3-notification";
import i18n  from "@/app/config/i18n";
import { UserInfo } from "@/components/UserInfo";
import { useManualStore } from "@/app/config/store/Manual";
import { XIcon } from "vue-tabler-icons";

const store = useElderlySchedule();
const manualStore = useManualStore()
manualStore.setDocumentTypeList()

const isModal = ref<boolean>(false);

const { setError } = useErrorToast();
const setPerson = (values: ISetPassportData) => {
  store.searchPerson({
    filter: values,
    err: (err: AxiosError) => {
      setError(err);
    }
  });
};

const addPerson = (values: INotHasDoc) => {
  store.assistantPerson = JSON.parse(JSON.stringify(values))
}

const saveData = () => {
  if (store.getAssistantPerson && !store.getAssistantPerson.fullName) {
    notify({
      // @ts-ignore
      text: i18n.global.t("notAcceptedAssistantPerson"),
      type: "warn"
    });
    return;
  }

  isModal.value = false;
  store.setDataAssistantPerson(store.getAssistantPerson);
  store.setIsSelectedPerson(true);
  store.clearAssisTantPerson();
};
</script>

<template>
  <div>
    <v-btn color="primary" @click="isModal = true">
      {{ $t("addAssistant") }}
    </v-btn>
    <v-dialog v-model="isModal" width="1200" persistent>
      <v-card class="px-5 pt-5">
        <v-card-title>
          <v-row>
            <v-col class="h3">
              {{ $t("addAssistant") }}
            </v-col>
            <v-col class="text-right cursor-pointer">
              <XIcon size="30" @click="isModal = false" />
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text>
          <SetPassportData
            :document-type-list="manualStore.getDocumentTypeList"
            :person="store.getData.assistantPerson"
            :search-lading="store.getSearchLoading"
            @set-person="setPerson"
            @add-person="addPerson"
            :clear="isModal == false"
          />
          <UserInfo v-if="store.getAssistantPerson && store.getAssistantPerson.fullName" :person="store.getAssistantPerson" :image="store.getAssistantPhoto" />
        </v-card-text>
        <v-card-actions class="mt-3">
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            variant="flat"
            :text="$t('close')"
            @click="
              () => {
                store.clearAssisTantPerson();
                isModal = false;
              }
            "
          >
          </v-btn>
          <v-btn color="success" variant="flat" :text="$t('AddRow')" @click="saveData" />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
