<script setup lang="ts">
import { ChevronRightIcon } from 'vue-tabler-icons';
import { GetSurvey } from '../types';

interface IProps {
  data: GetSurvey;
}
defineProps<IProps>();
</script>

<template>
  <div>
    <v-row>
      <v-col>
        <v-card elevation="0" class="border">
          <v-list-item>
            <div class="d-flex align-center">
              <ChevronRightIcon size="22" stroke-width="1.5" class="mr-2" />
              <div class="ml-3">
                {{ $t("docNumber") }}
              </div>
              <div class="ml-auto" style="font-weight: bold">
                {{ data.docNumber }}
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
                {{ data.docOn }}
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
                {{ data.eldQuestionnaire }}
              </div>
            </div>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
