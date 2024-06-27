<script setup lang="ts">
import i18n from "@/app/config/i18n";
import { useManualStore } from "@/app/config/store/Manual";
import TranslateItems from "@/components/TranslateItems.vue";
import UiParentCard from "@/components/UiParentCard.vue";
import IndividualProgramService from "@/services/info/IndividualProgram.service";
import ManualService from "@/services/others/manual.service";
import { useErrorToast } from "@/utils/helpers/useErrorToast";
import { useNotification } from "@kyvg/vue3-notification";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { SubmitEventPromise } from "vuetify";

const data = ref<any>();
const loading = ref<boolean>(false);
const route = useRoute();
const manualStore = useManualStore();
const individualProgramTypeList = ref([]);

function IndividualProgramTypeList() {
  ManualService.GetIndividualProgramTypeSelectList().then((res) => {
    individualProgramTypeList.value = res.data;
  });
}

const router = useRouter();
const notify = useNotification();
const { setError } = useErrorToast();

const saveLoading = ref<boolean>(false);

const get = () => {
  const id = route.params.id as string;
  loading.value = true;
  IndividualProgramService.Get(id).then((res) => {
    data.value = res.data;
    loading.value = false;
  });
};

const save = async (submit: SubmitEventPromise) => {
  const { valid, errors } = await submit;
  if (errors && errors.length > 0) {
    document
      // @ts-ignore
      .getElementById(errors[0].id)
      ?.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center"
      });
  }

  if (valid) {
    saveLoading.value = true;

    IndividualProgramService.Update(data.value)
      .then(() => {
        notify.notify({
          // @ts-ignore
          text: i18n.global.t("SaveSuccess"),
          type: "success"
        });
        saveLoading.value = false;
        router.push({ name: "IndividualProgram" });
      })
      .catch((err) => {
        setError(err);
        saveLoading.value = false;
      });
  }
};
IndividualProgramTypeList();
get();

manualStore.setStateSelectList();
</script>

<template>
  <div>
    <UiParentCard class="text-center" v-if="loading">
      <v-progress-circular indeterminate></v-progress-circular>
    </UiParentCard>
    <template v-if="data && !loading">
      <v-form @submit.prevent="save">
        <UiParentCard>
          <v-row>
            <v-col cols="12" lg="3" md="6" class="py-0">
              <form-input :label="$t('orderCode')" required v-model="data.orderCode"></form-input>
            </v-col>
            <v-col cols="12" lg="3" md="6" class="py-0">
              <form-select
                :list="individualProgramTypeList"
                v-model="data.individualProgramTypeId"
                required
                :label="$t('individualProgramType')"
              ></form-select>
            </v-col>
            <v-col cols="12" lg="3" md="6" class="py-0">
              <TranslateItems
                v-model:translates="data.translates"
                column-name="short_name"
                :label="$t('shortName')"
                v-model:value="data.shortName"
                required
              />
            </v-col>
            <v-col cols="12" lg="3" md="6" class="py-0">
              <TranslateItems v-model:value="data.fullName" column-name="full_name" v-model:translates="data.translates" :label="$t('fullName')" />
            </v-col>

            <v-col cols="12" lg="3" md="6" class="py-0" v-if="+(route.params.id as string) != 0">
              <form-select :list="manualStore.stateSelectList" v-model="data.stateId" required :label="$t('state')"></form-select>
            </v-col>
          </v-row>
        </UiParentCard>
        <v-row class="mt-4 px-3">
          <v-btn color="error" @click="router.back()" variant="flat" :text="$t('Back')" />
          <v-spacer />
          <v-btn color="success" :loading="saveLoading" variant="flat" type="submit" :text="$t('Save')" />
        </v-row>
        <!-- <v-row class="mt-4">
          <v-col>
            <v-btn color="error" @click="router.back()" variant="flat">{{ $t("Back") }}</v-btn>
          </v-col>
          <v-col class="text-right">
            <v-btn color="success" :loading="saveLoading" variant="flat" type="submit">{{ $t("Save") }}</v-btn>
          </v-col>
        </v-row> -->
      </v-form>
    </template>
  </div>
</template>
@/services/info/IndividualProgram.service
