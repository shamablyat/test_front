<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import UiParentCard from "@/components/UiParentCard.vue";
import ElderlyRegisterService from "@/services/document/elderlyregister.service";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useErrorToast } from "@/utils/helpers/useErrorToast";
import ElderlyRegister from "@/services/document/elderlyregister.service";
import { useGlobal } from "@/composables/useGlobal";
import ElderlyRegisterSentService from "@/services/document/elderlyregistersent.service";
import CardInterCeptor from "./components/CardInterCeptor.vue";
import LogList from "@/components/LogList.vue";
import FormCanButtons from "@/components/FormCanButtons.vue";

interface IProps {
  isSent: boolean;
}

const props = defineProps<IProps>();

const { setError } = useErrorToast();
const { forceFileDownload, getColor } = useGlobal();
const { t } = useI18n();
const route = useRoute();

const permission = "ElderlyRegister";

const loading = ref<boolean>(false);
const data: any = ref({});

const get = () => {
  const id = route.params.id as string;
  loading.value = true;
  if (props.isSent) {
    ElderlyRegisterSentService.Get(id)
      .then((res) => {
        data.value = res.data;
        // iframeSrc.value = res.data.files[0];
      })
      .catch((err) => {
        loading.value = false;
        setError(err);
      })
      .finally(() => {
        loading.value = false;
      });
  } else {
    ElderlyRegisterService.Get(id)
      .then((res) => {
        data.value = res.data;
        // iframeSrc.value = res.data.files[0];
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        loading.value = false;
      });
  }
};

function Download(file: any) {
  ElderlyRegister.DownloadInTableFile(file.files[0].id).then((res: any) => {
    forceFileDownload(res, file.files[0].fileName);
  });
}
get();
</script>

<template>
  <div>
    <UiParentCard v-if="loading" class="text-center">
      <v-progress-circular indeterminate></v-progress-circular>
    </UiParentCard>
    <div v-if="data && !loading">
      <v-row>
        <v-col cols="12">
          <UiParentCard title="">
            <v-row>
              <v-col cols="12" lg="6" class="py-0 d-flex">
                <v-label class="mb-2 mr-2 font-weight-medium">{{ t("docNumber") }}: </v-label>
                <span>{{ data.docNumber }}</span>
              </v-col>
              <v-col cols="12" lg="6" class="py-0 d-flex">
                <v-label class="mb-2 mr-2 font-weight-medium"> {{ t("docOn") }}: </v-label>
                <span>{{ data.docOn }}</span>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" lg="6" class="py-0 d-flex">
                <v-label class="mb-2 font-weight-medium">{{ t("decisionDocNumber") }}: </v-label>
                <span>{{ data.decisionDocNumber }}</span>
              </v-col>

              <v-col cols="12" lg="6" class="py-0 d-flex">
                <v-label class="mb-2 mr-2 font-weight-medium"> {{ t("decisionDocOn") }}: </v-label>
                <span>{{ data.decisionDocOn }}</span>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" lg="6" class="py-0 d-flex">
                <v-label class="mb-2 mr-2 font-weight-medium">{{ t("region") }}: </v-label>
                <span>{{ data.region }}</span>
              </v-col>

              <v-col cols="12" lg="6" class="py-0 d-flex">
                <v-label class="mb-2 mr-2 font-weight-medium"> {{ t("district") }}: </v-label>
                <span>{{ data.district }}</span>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" lg="6" class="py-0 d-flex">
                <v-label class="mb-2 mr-2 font-weight-medium">{{ t("inCount") }}: </v-label>
                <span>{{ data.inTables?.length }}</span>
              </v-col>

              <v-col cols="12" lg="6" class="py-0 d-flex">
                <v-label class="mb-2 mr-2 font-weight-medium"> {{ t("outCOunt") }}: </v-label>
                <span>{{ data.outTables?.length }}</span>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" lg="6" class="py-0 d-flex">
                <v-label class="mb-2 font-weight-medium">{{ t("status") }}: </v-label>
                <v-chip rounded="lg" :class="`font-weight-bold px-2  mx-2 bg-${getColor(data)}`" size="small">
                  {{ data.status }}
                </v-chip>
              </v-col>
            </v-row>
          </UiParentCard>
          <UiParentCard :title="t('InTables')" class="mt-3" v-if="data && data.inTables && data.inTables.length > 0">
            <div style="height: calc(100vh - 200px); overflow-y: scroll; overflow-x: hidden">
              <v-row>
                <v-col cols="12" lg="4" md="6" v-for="item in data.inTables">
                  <CardInterCeptor :item="item" @download="Download" />
                </v-col>
              </v-row>
            </div>
          </UiParentCard>
          <UiParentCard :title="t('OutTables')" class="mt-3" v-if="data && data.outTables ? data.outTables.length != 0 : false">
            <div style="height: calc(100vh - 200px); overflow-y: auto; overflow-x: hidden">
              <v-row>
                <v-col cols="12" lg="4" md="6" v-for="item in data.outTables">
                  <CardInterCeptor :item="item" @download="Download" />
                </v-col>
              </v-row>
            </div>
          </UiParentCard>

          <UiParentCard title="PDF" class="mt-3 text-center" v-if="data && data.files && data.files.length">
            <v-expansion-panels >
              <v-expansion-panel v-for="file in data.files">
                <v-expansion-panel-title>{{ file.fileName }}</v-expansion-panel-title>
                <v-expansion-panel-text>
                  <iframe
                    :src="`${axios.defaults.baseURL}/ElderlyRegister/DownloadFile/${file.id}`"
                    width="80%"
                    style="height: 800px"
                    name="application"
                    id="application"
                    frameborder="0"
                  ></iframe>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </UiParentCard>
        </v-col>
      </v-row>
      <LogList v-if="data && data.logList && data.logList.length > 0" :logs="data.logList" />
      <FormCanButtons :service="ElderlyRegisterService" :permission="permission" :data="data" />
    </div>
  </div>
</template>
