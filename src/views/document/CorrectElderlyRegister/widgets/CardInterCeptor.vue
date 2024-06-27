<script setup lang="ts">
import PersonService from "@/services/others/person.service";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

interface IProps {
  item: any;
  canDownLoad?: boolean;
}
const props = defineProps<IProps>();
const emits = defineEmits<{
  (e: "Download", value: any): void;
}>();
const { t } = useI18n();
const Download = (el: any) => {
  emits("Download", el);
};
const domRef = ref<HTMLElement | null>(null);
const loading = ref<boolean>(false);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const intersecting = entry.isIntersecting;

      if (intersecting) {
        setPhoto();
        observer.disconnect();
      }
    });
  },
  { threshold: 0.1 }
);

const setPhoto = () => {
  loading.value = true;
  PersonService.GetPhotoFromGSP(props.item.personId)
    .then((res) => {
      props.item.imgSrc = "";
      props.item.imgSrc = `data:image/jpeg;base64,${res.data.base64String}`;
    })
    .finally(() => {
      loading.value = false;
    });
};
onMounted(() => {
  if ("IntersectionObserver" in window) {
    if (domRef.value) {
      observer.observe(domRef.value);
    }
  }
});
onBeforeUnmount(() => {
  if ("IntersectionObserver" in window && observer) {
    observer.disconnect();
  }
});
</script>

<template>
  <div ref="domRef" :id="item.id">
    <v-card variant="outlined" class="rounded-lg elevation-10">
      <v-card-title>
        <v-row>
          <v-col cols="3">
            <v-avatar v-if="!loading" :image="item.imgSrc" size="64" />
            <v-progress-circular
              indeterminate
              v-if="loading"
            ></v-progress-circular>
          </v-col>
          <v-col
            cols="9"
            class="d-flex align-center"
            style="white-space: pre-wrap"
          >
            {{ item.person.fullName }}
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="6" style="margin-bottom: -18px"
            >{{ t("elderlyCategory") }}:</v-col
          >
          <v-col cols="6" style="margin-bottom: -18px">{{
            item.elderlyCategory
          }}</v-col>
          <v-col cols="6" style="margin-bottom: -18px"
            >{{ t("elderlyReason") }}:</v-col
          >
          <v-col cols="6" style="margin-bottom: -18px">{{
            item.elderlyReason
          }}</v-col>
          <v-col cols="6" style="margin-bottom: -18px"
            >{{ t("isCategoryMismatch") }}:</v-col
          >
          <v-col cols="6" style="margin-bottom: -18px">{{
            item.categoryMismatchReason
          }}</v-col>
          <v-col cols="6" style="margin-bottom: -18px !important"
            >{{ t("Document") }}:</v-col
          >
          <v-col cols="6" style="margin-bottom: -18px">{{
            item.person.docSeria + " " + item.person.docNumber
          }}</v-col>
          <v-col cols="6" style="margin-bottom: -18px !important"
            >{{ t("pinfl") }}:</v-col
          >
          <v-col cols="6" style="margin-bottom: -18px">{{
            item.person.pinfl
          }}</v-col>
          <v-col cols="6" style="margin-bottom: -18px !important"
            >{{ t("birthOn") }}:</v-col
          >
          <v-col cols="6" style="margin-bottom: -18px">{{
            item.person.birthOn
          }}</v-col>
          <v-col cols="6" style="margin-bottom: -18px !important"
            >{{ t("genderName") }}:</v-col
          >
          <v-col cols="6" style="margin-bottom: -18px">{{
            item.person.genderName
          }}</v-col>

          <v-col cols="6" style="margin-bottom: -18px"
            >{{ t("phoneNumber") }}:</v-col
          >
          <v-col cols="6" style="margin-bottom: -18px">{{
            item.phoneNumber
          }}</v-col>
          <v-col cols="6" style="margin-bottom: -18px"
            >{{ t("region") }}:</v-col
          >
          <v-col cols="6" style="margin-bottom: -18px">{{
            item.livingRegion
          }}</v-col>
          <v-col cols="6" style="margin-bottom: -18px"
            >{{ t("district") }}:</v-col
          >
          <v-col cols="6" style="margin-bottom: -18px">{{
            item.livingDistrict
          }}</v-col>
          <v-col cols="6" style="margin-bottom: -18px"
            >{{ t("livingMfy") }}:</v-col
          >
          <v-col cols="6" style="margin-bottom: -18px">{{
            item.livingMfy
          }}</v-col>
          <v-col cols="6" style="margin-bottom: -18px"
            >{{ t("livingAddress") }}:</v-col
          >
          <v-col cols="6" style="margin-bottom: -18px">{{
            item.livingAddress
          }}</v-col>
          <v-col cols="6" style="margin-bottom: -18px"
            >{{ t("disabilityGroup") }}:</v-col
          >
          <v-col cols="6" style="margin-bottom: -18px">{{
            item.disabilityGroup || "-"
          }}</v-col>
          <v-col cols="6" style="margin-bottom: -18px" v-if="item.isTemporary"
            >{{ t("temporaryRegion") }}:</v-col
          >
          <v-col cols="6" v-if="item.isTemporary">{{
            item.temporaryRegion
          }}</v-col>
          <v-col cols="6" style="margin-bottom: -18px" v-if="item.isTemporary"
            >{{ t("temporaryDistrict") }}:</v-col
          >
          <v-col cols="6" v-if="item.isTemporary">{{
            item.temporaryDistrict
          }}</v-col>
          <v-col cols="6" style="margin-bottom: -18px" v-if="item.isTemporary"
            >{{ t("temporaryMfy") }}:</v-col
          >
          <v-col cols="6" v-if="item.isTemporary">{{
            item.temporaryMfy
          }}</v-col>

          <v-col cols="6" style="margin-bottom: -18px" v-if="item.isTemporary"
            >{{ t("temporaryAddress") }}:</v-col
          >
          <v-col cols="6" v-if="item.isTemporary">{{
            item.temporaryAddress
          }}</v-col>
          <v-col cols="6">{{ t("pensionType") }}:</v-col>
          <v-col cols="6">{{ item.pensionType || "-" }}</v-col>
          <v-col cols="6" v-if="canDownLoad">{{ t("Asosxujjatlar") }}:</v-col>
          <v-col cols="6" v-if="canDownLoad">
            <v-btn variant="plain" @click="Download(item)">
              {{ $t("Download") }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text></v-card
    >
  </div>
</template>

<style lang="scss" scoped></style>
