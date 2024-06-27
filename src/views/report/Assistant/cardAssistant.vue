<script setup lang="ts">
import UiParentCard from "@/components/UiParentCard.vue";
import { GoogleMap, Marker } from "vue3-google-map";
import ElderlyCareSchedule from "@/services/document/elderySchedule.service";
import FeedBackRatingService from "@/services/others/feedbackrating.service";
import { useRoute } from "vue-router";
import { useErrorToast } from "@/utils/helpers/useErrorToast";
import PersonService from "@/services/others/person.service";
import { ref } from "vue";
import {  RefreshIcon } from "vue-tabler-icons";
import ElderlyCareWorkerReportService from "@/services/document/elderlyCareWorkerReport.service";
import Graphic from "../Graphic.vue";

const route = useRoute();

const { setError } = useErrorToast();
const assistantPhoto = ref("");
const center = { lat: 41, lng: 69 };
const coordinates = ref<any[]>([]);
const rates = ref<any>({});
const comment = ref<any>({});
const person = ref<any>({});
const votes = ref<any>("");
const loading = ref<boolean>(false);
const data = ref<any>();

const refresh = () => {
  loading.value = true;
  //PersonList
  ElderlyCareSchedule.GetAsistent(+route.params.id)
    .then((res) => {
      person.value = res.data;
      loading.value = false;
    })
    .catch((err) => {
      loading.value = false;
      setError(err);
    });
  //ImagesList
  PersonService.GetPhotoFromGSP(+route.params.id).then((res) => {
    assistantPhoto.value = `data:image/jpeg;base64,${res.data.base64String}`;
  });
  //RatesList
  FeedBackRatingService.GetAssistantReting(+route.params.id)
    .then((res) => {
      rates.value = res.data;
      votes.value = 0;
      res.data.rows.forEach((item: any) => {
        votes.value += item.rate;
      });
    })
    .catch((err) => {
      setError(err);
    })
    .finally(() => {
      loading.value = false;
    });

  // CommentList
  FeedBackRatingService.GetList({
    ratedPersonId: route.params.id
  })
    .then((res) => {
      comment.value = res.data.rows;
    })
    .catch((err) => {
      setError(err);
    })
    .finally(() => {
      loading.value = false;
    });

  //CoordinatesList
  ElderlyCareWorkerReportService.GetElderlyCareWorkerReportCoordinates(+route.params.id)
    .then((res) => {
      coordinates.value = res.data;
    })
    .catch((err) => {
      setError(err);
    })
    .finally(() => {
      loading.value = false;
    });
};

const get = () => {
  loading.value = true;
  ElderlyCareWorkerReportService.GetAssistantReportWeeklyGet(+route.params.id)
    .then((res) => {
      data.value = res.data;
    })
    .finally(() => {
      loading.value = false;
    });
};

get();

refresh();
</script>

<template>
  <UiParentCard>
    <v-row>
      <v-col cols="12" lg="4">
        <p>
          <b>{{ $t("fio") }} :</b> {{ person.fullName }}
        </p>
        <p>
          <b> {{ $t("birhtOn") }} :</b> {{ person.birthOn }}
        </p>
        <p>
          <b> {{ $t("citizenship") }} :</b> {{ person.citizenshipName }}
        </p>
        <p>
          <b> {{ $t("livePlace") }} :</b> {{ person?.livingAddress?.address }}
        </p>
        <p>
          <b> {{ $t("phoneNumber") }} : {{ person.phoneNumber }} </b> -
        </p>
        <p>
          <b> {{ $t("additionPhoneNumber") }} : {{ person.additionPhoneNumber }} </b> -
        </p>
      </v-col>

      <v-col cols="6" lg="2" md="4">
        <img :src="assistantPhoto" style="width: 70%" alt="" />
      </v-col>
      <v-col cols="12" lg="4">
        <p style="font-weight: 900; font-size: 14px; color: rgb(0, 140, 255)">
          {{ $t("cardAssistant_t1") }} :
          <span class="mx-3" style="color: black">max 100</span>
        </p>
        <p style="font-weight: 900; font-size: 14px; color: rgb(0, 140, 255)">
          {{ $t("cardAssistant_t2") }} :<span class="mx-3" style="color: black">72</span>
        </p>
        <p style="font-weight: 900; font-size: 14px; color: rgb(0, 140, 255)">
          {{ $t("cardAssistant_t3") }} :<span class="mx-3" style="color: black">75</span>
        </p>
        <p style="font-weight: 900; font-size: 14px; color: rgb(0, 140, 255)">
          {{ $t("cardAssistant_t4") }}
          :<span class="mx-3" style="color: black">81</span>
        </p>
      </v-col>
      <v-col cols="12" lg="2" class="text-right">
        <v-btn @click="refresh" :loading="loading" color="grey200" class="mx-3" :text="$t('refresh')" :prepend-icon="RefreshIcon" />
        <!-- <v-btn
          @click="$router.go(-1)"
          color="error"
          :text="$t('Back')"
          :prepend-icon="ArrowLeftIcon"
        /> -->
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h3>
          {{ $t("cardAssistant_t5") }}
        </h3>
      </v-col>
      <v-col>
        <h3 style="color: red">
          {{ $t("cardAssistant_t6") }} :
          {{ data && data.length ? data[0]?.servicesCount : 0 }}
        </h3>
      </v-col>
    </v-row>
    <Graphic class="my-4" :data="data" />

    <v-row class="map">
      <v-col cols="12" lg="6" class="p-3" style="display: grid; justify-items: center">
        <h2 class="my-2" style="color: rgb(0, 140, 255)">
          {{ $t("locationInfo") }}
        </h2>
        <GoogleMap api-key="AIzaSyDoX7U1etxawoz-Z3wNCOv7LxcweRiHC-E" style="width: 90%; height: 400px" :center="center" :zoom="7">
          <Marker v-for="item in coordinates" :options="{ position: { lat: item.latitude, lng: item.longitude } }" />
        </GoogleMap>
      </v-col>
      <v-col cols="12" lg="6" class="p-3">
        <h2 class="my-2 text-center" style="color: rgb(0, 140, 255)">
          {{ $t("servicePersonAssistant") }}
        </h2>
        <div style="width: 100%" class="d-flex align-center" v-if="rates">
          <div style="width: 20%">
            <p v-if="rates.rate" class="my-3" style="font-size: 60px; font-weight: 800; text-align: center">
              {{ parseFloat(rates.rate).toFixed(1) }}
            </p>
            <v-rating class="mt-3" hover half-increments :length="5" :size="20" readonly :model-value="rates.rate" active-color="#01875F" />
            <p v-if="votes">{{ votes }} {{ $t("votes") }}</p>
          </div>
          <div style="width: 80%">
            <div class="d-flex align-center" v-for="(item, index) in rates.rows" :key="index">
              <p class="mx-1">{{ item.label }}</p>
              <v-progress-linear
                :style="index == 4 ? { marginLeft: '3px' } : ''"
                :model-value="item.percentage"
                style="border-radius: 12px"
                color="#01875F"
                height="7"
              ></v-progress-linear>
            </div>
          </div>
        </div>
        <div style="height: 300px; overflow-y: auto">
          <div class="my-3" v-for="(el, eldx) in comment" :key="eldx">
            <h3>{{ el.person }}</h3>
            <v-rating hover half-increments :length="5" :size="16" readonly :model-value="el.rate" active-color="#01875F"></v-rating>
            <span class="ml-3">{{ el.dateAt }}</span>
            <p>
              {{ el.commentText }}
            </p>
          </div>
        </div>
      </v-col>
    </v-row>
  </UiParentCard>
</template>
