<script setup lang="ts">
import { ChevronRightIcon } from "vue-tabler-icons";
import { useSurvey } from "../store/useSurvey";
const store = useSurvey();
</script>

<template>
  <v-card elevation="0" class="border" v-if="store.getData">
    <v-list-item>
      <div class="d-flex align-center">
        <ChevronRightIcon size="22" stroke-width="1.5" class="mr-2" />
        <div class="ml-3">
          {{ $t("docNumber") }}
        </div>
        <div class="ml-auto" style="font-weight: bold">
          {{ store.getData.docNumber }}
        </div>
      </div>
    </v-list-item>
    <v-list-item>
      <div class="d-flex align-center">
        <ChevronRightIcon size="22" stroke-width="1.5" class="mr-2" />
        <div class="ml-3">
          {{ $t("docOn") }}
        </div>
        <div class="ml-auto" style="font-weight: bold">
          {{ store.getData.docOn }}
        </div>
      </div>
    </v-list-item>
    <v-list-item>
      <div class="d-flex align-center">
        <ChevronRightIcon size="22" stroke-width="1.5" class="mr-2" />
        <div class="ml-3">
          {{ $t("Questionnaire") }}
        </div>
        <div class="ml-auto" style="font-weight: bold">
          {{ store.getData.eldQuestionnaire }}
        </div>
      </div>
    </v-list-item>
    <v-list-item>
      <div class="d-flex align-center">
        <ChevronRightIcon size="22" stroke-width="1.5" class="mr-2" />
        <div class="ml-3">
          {{ $t("startDate") }}
        </div>
        <div class="ml-auto" style="font-weight: bold">
          {{ store.getData.startAt || "-" }}
        </div>
      </div>
    </v-list-item>
    <v-list-item>
      <div class="d-flex align-center">
        <ChevronRightIcon size="22" stroke-width="1.5" class="mr-2" />
        <div class="ml-3">
          {{ $t("endDate") }}
        </div>
        <div class="ml-auto" style="font-weight: bold">
          {{ store.getData.endAt || "-" }}
        </div>
      </div>
    </v-list-item>
  </v-card>
</template>
