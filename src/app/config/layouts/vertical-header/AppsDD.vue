<script setup lang="ts">
import { AppsIcon } from "vue-tabler-icons";
import { useAuth } from "../../store/auth";
const colors = ["primary", "info", "warning", "error", "success"];
const auth = useAuth();

const goApp = (app: any) => {
  if (app.appUrl) {
    window.open(app.appUrl, "_blank");
  }
};
</script>

<template>
  <v-menu :close-on-content-click="false" location="bottom" v-if="auth.user_info">
    <template v-slot:activator="{ props }">
      <v-btn icon variant="text" color="primary" v-bind="props">
        <v-avatar size="36" color="info">
          <AppsIcon />
        </v-avatar>
        <v-tooltip activator="parent" location="top">
          {{ $t("Apps") }}
        </v-tooltip>
      </v-btn>
    </template>
    <v-sheet rounded="md" width="400" elevation="10" class="pa-3" v-if="auth.user_info && auth.user_info.apps">
      <v-row>
        <v-col cols="4" v-for="(app, appIndex) in auth.user_info.apps" :key="appIndex" style="display: flex; justify-content: center">
          <div style="display: grid">
            <v-btn icon variant="text" :color="colors[appIndex]" class="mr-auto ml-auto" @click="goApp(app)">
              <v-avatar size="36" :color="colors[appIndex % 5]">
                <AppsIcon />
              </v-avatar>
            </v-btn>
            <span style="font-size: 12px" class="text-center" :title="app.appName">
              {{ app.appName.length > 13 ? app.appName.slice(0, 13) + "..." : app.appName.slice(0, 13) }}
            </span>
          </div>
        </v-col>
      </v-row>
    </v-sheet>
  </v-menu>
</template>
