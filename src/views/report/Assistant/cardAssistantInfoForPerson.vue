<script setup lang="ts">
import UiParentCard from "@/components/UiParentCard.vue";
import { GoogleMap, Marker } from "vue3-google-map";
import ReportService from "@/services/report/regReport.service";
import ElderlyCareSchedule from "@/services/document/elderySchedule.service";
import ElderlyCareWorkerReportService from "@/services/document/elderlyCareWorkerReport.service";
import PersonService from "@/services/others/person.service";
import { useRoute } from "vue-router";
import { useFormatter } from "@/utils/helpers/formatter";
import { useErrorToast } from "@/utils/helpers/useErrorToast";
import { reactive, ref } from "vue";
import { RefreshIcon } from "vue-tabler-icons";
import { WEEK_DAYS } from "@/utils/constants";

const route = useRoute();

interface IFilter {
  startOn: string;
  endOn: string;
  byRegion: boolean;
  byDistrict: boolean;
  regionIds: number[];
  districtIds: number[];
  isCategoryMismatch: boolean;
  elderlyCategoryId: number | null;
}

interface IColumns {
  [key: number]: string;
}

const { setError } = useErrorToast();
const { handleDate } = useFormatter();

const center = { lat: 41, lng: 69 };

const data = ref<any[]>([]);
const personData = ref<any>({});
const personPhoto = ref<string>("");
const personImages = ref<any[]>([]);
const columns = ref<IColumns>({});
const columnTotals = ref<{ [key: number]: string }>({});
const totalCounts = ref<number>(0);
const loading = ref<boolean>(false);

const day = ("0" + new Date().getDate()).substr(-2);
const month = ("0" + (new Date().getMonth() + 1)).substr(-2);
const year = new Date().getFullYear() - 1;
const startOn = `${day}.${month}.${year}`;

const filter: IFilter = reactive({
  startOn: startOn,
  endOn: handleDate(new Date().toDateString()),
  byRegion: true,
  byDistrict: false,
  regionIds: [],
  districtIds: [],
  isCategoryMismatch: false,
  elderlyCategoryId: 3,
});

function convertBlobToBase64(blob: Blob) {
  const reader = new FileReader();

  reader.onload = () => {
    const base64String = reader.result;
    personImages.value.push(base64String);
  };

  reader.readAsDataURL(blob);
}

const refresh = () => {
  const innerFilter = JSON.parse(JSON.stringify(filter));
  data.value = [];
  columns.value = [];
  loading.value = true;
  ReportService.GetRegisteredElderlyWithAssistant(innerFilter)
    .then((res) => {
      data.value = res.data.rows;
      columns.value = {
        [res.data.elderlyCategoryId]: res.data.column,
      };
      columnTotals.value = res.data.columnTotals;
      totalCounts.value = res.data.totalCount;
    })
    .catch((err) => {
      setError(err);
    })
    .finally(() => {
      loading.value = false;
    });

  ElderlyCareSchedule.GetElderly(+route.params.id)
    .then((res: any) => {
      personData.value = res.data;
      center.lat = res.data.latitude;
      center.lng = res.data.longitude;

      res.data.files.forEach((element: any) => {
        ElderlyCareWorkerReportService.DownloadFile(element.id).then(
          (imgRes: any) => {
            convertBlobToBase64(imgRes.data);
          }
        );
      });
    })
    .catch((err) => {
      loading.value = false;
      setError(err);
    });

  PersonService.GetPhotoFromGSP(+route.params.id).then((res) => {
    personPhoto.value = `data:image/jpeg;base64,${res.data.base64String}`;
  });
};

refresh();
</script>

<template>
  <UiParentCard>
    <v-row>
      <v-col cols="4">
        <div class="d-flex">
          <p class="w-50" style="font-weight: 700">{{ $t("fio") }} :</p>
          <p class="w-50">{{ personData.person?.fullName }}</p>
        </div>
        <div class="d-flex">
          <p class="w-50" style="font-weight: 700">{{ $t("birhtOn") }} :</p>
          <p class="w-50">{{ personData.person?.birthOn }}</p>
        </div>
        <div class="d-flex">
          <p class="w-50" style="font-weight: 700">{{ $t("citizenship") }} :</p>
          <p class="w-50">{{ personData.person?.citizenshipName }}</p>
        </div>
        <div class="d-flex">
          <p class="w-50" style="font-weight: 700">
            {{ $t("passportInfo") }} :
          </p>
          <p class="w-50">
            {{
              personData.person?.docSeria + " " + personData.person?.docNumber
            }}
          </p>
        </div>
        <div class="d-flex">
          <p class="w-50" style="font-weight: 700">{{ $t("pinfl") }} :</p>
          <p class="w-50">{{ personData.person?.pinfl }}</p>
        </div>
        <div class="d-flex">
          <p class="w-50" style="font-weight: 700">{{ $t("livePlace") }} :</p>
          <p class="w-50">{{ personData.person?.docIssueOrganization }}</p>
        </div>
        <div class="d-flex">
          <p class="w-50" style="font-weight: 700">{{ $t("phoneNumber") }} :</p>
          <p class="w-50">
            {{ personData.phoneNumber ? personData.phoneNumber : "-" }}
          </p>
        </div>
        <div class="d-flex">
          <p class="w-50" style="font-weight: 700">
            {{ $t("additionPhoneNumber") }} :
          </p>
          <p class="w-50">-</p>
        </div>
        <div class="d-flex">
          <p class="w-50" style="font-weight: 700">{{ $t("genderName") }} :</p>
          <p class="w-50">{{ personData.person?.genderName }}</p>
        </div>
        <div class="d-flex">
          <p class="w-50" style="font-weight: 700">
            {{ $t("elderlyCategory") }} :
          </p>
          <p class="w-50">{{ personData.elderlyCategory }}</p>
        </div>
        <div class="d-flex">
          <p class="w-50" style="font-weight: 700">
            {{ $t("TIEK xulosasi") }} :
          </p>
          <p class="w-50">
            {{
              personData.disabilityExtenal
                ? personData.disabilityExtenal.name
                  ? personData.disabilityExtenal.name
                  : "-"
                : "-"
            }}
          </p>
        </div>
      </v-col>

      <v-col cols="2">
        <img :src="personPhoto" style="width: 70%" alt="" />
      </v-col>

      <v-col cols="6">
        <h3 class="mb-5" style="font-weight: 700; color: rgb(0, 140, 255)">
          {{ $t("Biriktirib berilgan xizmat turlari") }}
        </h3>
        <h4
          style="font-weight: 700; color: rgb(0, 140, 255)"
          v-for="(service, index) in personData.services"
          :key="index"
        >
          {{ service }}
        </h4>

        <h3 class="mt-5" style="color: red">
          {{
            $t("Jami xizmat ko'rsatgan assistentlar soni : ") +
            personData.serviceAssistentCount
          }}
        </h3>

        <h3 style="color: red">
          {{
            $t("Oxirgi xizmat ko'rsatayotgan assistent : ") +
            personData.lastServiceAssistent
          }}
        </h3>
      </v-col>
    </v-row>
    <v-row align="center">
      <v-col>
        <h2 style="font-weight: 400">
          {{
            $t(
              "Biriktirilganlik ma'lumoti va bajarilayotgan xizmatlar hisoboti"
            )
          }}
        </h2>
      </v-col>
      <v-col class="d-flex justify-end">
        <v-btn
          @click="refresh"
          :loading="loading"
          color="success"
          class="mx-3"
          :text="$t('refresh')"
          :prepend-icon="RefreshIcon"
        />
      </v-col>
    </v-row>
    <v-table fixed-header density="compact" class="my-8">
      <thead>
        <tr>
          <th
            v-for="(weekDay, index) in WEEK_DAYS"
            :key="index"
            class="font-weight-bold text-center h6 border"
            style="width: calc(100% / 7)"
          >
            {{ $t(`${weekDay.text}`) }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td
            style="font-weight: 700"
            v-for="(_, index) in WEEK_DAYS"
            :key="index"
            class="border"
          >
            <template
              v-for="data in personData.tables"
              :key="dataIndex"
            >
              <template v-if="data.weekDayOn == index + 1">
                <div>
                  {{ data.beginAt + " / " + data.endAt }}
                </div>
                <div>{{ personData.lastServiceAssistent }}</div>
                <div>{{ data.elderlyService }}</div>
              </template>
            </template>
          </td>
        </tr>
      </tbody>
    </v-table>

    <v-row>
      <v-col cols="6" class="p-3" style="display: grid; justify-items: center">
        <h2 class="my-2" style="color: rgb(0, 140, 255)">
          {{ $t("locationInfo") }}
        </h2>
        <GoogleMap
          api-key="AIzaSyDoX7U1etxawoz-Z3wNCOv7LxcweRiHC-E"
          style="width: 90%; height: 400px"
          :center="center"
          :zoom="15"
        >
          <Marker :options="{ position: center }" />
        </GoogleMap>
      </v-col>
      <v-col cols="6" class="p-3">
        <h2 class="my-2 text-center" style="color: rgb(0, 140, 255)">
          {{ $t("livePlacePersonImages") }}
        </h2>
        <div style="width: 100%" class="d-flex align-center flex-wrap">
          <img
            v-for="(imagesrc, index) in personImages"
            :key="index"
            :src="imagesrc"
            alt=""
            width="200"
            height="200"
            class="mr-4 mb-4"
          />
        </div>
      </v-col>
    </v-row>
  </UiParentCard>
</template>
