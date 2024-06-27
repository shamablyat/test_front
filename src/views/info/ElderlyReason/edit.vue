<script setup lang="ts">
import i18n from "@/app/config/i18n";
import { useManualStore } from "@/app/config/store/Manual";
import TranslateItems from "@/components/TranslateItems.vue";
import UiParentCard from "@/components/UiParentCard.vue";
import { ISelectList } from "@/models/basic";
import ElderlyReasonService from "@/services/info/elderlyreason.service";
import { useErrorToast } from "@/utils/helpers/useErrorToast";
import { useNotification } from "@kyvg/vue3-notification";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { SubmitEventPromise } from "vuetify";

const data = ref<any>();
const loading = ref<boolean>(false);
const saveLoading = ref<boolean>(false);
const decisionTypeList = ref<ISelectList[]>([
    //@ts-ignore
    { value: 1, text : i18n.global.t("desitionType1")  },
    { value: 2, text: i18n.global.t("desitionType2") }
])
const route = useRoute();
const manualStore = useManualStore();

const router = useRouter();
const notify = useNotification();
const { setError } = useErrorToast();



const get = () => {
    const id = route.params.id as string;
    loading.value = true;
    ElderlyReasonService.Get(id).then((res) => {
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

        ElderlyReasonService.Update(data.value)
            .then(() => {
                notify.notify({
                    // @ts-ignore
                    text: i18n.global.t("SaveSuccess"),
                    type: "success"
                });
                saveLoading.value = false;
                router.push({ name: "ElderlyReason" });
            })
            .catch((err) => {
                setError(err);
                saveLoading.value = false;
            });
    }
};
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
                            <form-input :label="$t('code')" required v-model="data.code"></form-input>
                        </v-col>
                        <v-col cols="12" lg="3" md="6" class="py-0">
                            <TranslateItems v-model:translates="data.translates" column-name="short_name"
                                :label="$t('shortName')" v-model:value="data.shortName" required />
                        </v-col>
                        <v-col cols="12" lg="3" md="6" class="py-0">
                            <TranslateItems required v-model:value="data.fullName" column-name="full_name"
                                v-model:translates="data.translates" :label="$t('fullName')" />
                        </v-col>
                        <v-col cols="12" lg="3" md="6" class="py-0">
                            <form-select :list="decisionTypeList" v-model="data.decisionTypeId" required
                                :label="$t('decisionType') "></form-select>
                        </v-col>
                        <v-col cols="12" lg="3" md="6" class="py-0" v-if="+(route.params.id as string) != 0">
                            <form-select :list="manualStore.stateSelectList" v-model="data.stateId" required
                                :label="$t('state')"></form-select>
                        </v-col>
                    </v-row>
                </UiParentCard>
                <v-row class="mt-4 px-3">
                    <v-btn color="error" @click="router.back()" variant="flat" :text="$t('Back')" />
                    <v-spacer />
                    <v-btn color="success" :loading="saveLoading" variant="flat" type="submit" :text="$t('Save')" />
                </v-row>
            </v-form>
        </template>
    </div>
</template>
