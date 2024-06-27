<script setup lang="ts">
import { DoorExitIcon } from "vue-tabler-icons";
import AuthService from "@/services/auth.service";
import { useAuth } from "../../store/auth";
const authStore = useAuth();

function Logout() {
  let auth = new AuthService();
  auth.logout().then(() => {
    localStorage.clear();
    authStore.LogOut();
  });
}
</script>

<template>
  <v-menu :close-on-content-click="false">
    <template v-slot:activator="{ props }">
      <v-row class="align-center">
        <v-col>
          <v-btn class="custom-hover-primary" variant="text" v-bind="props" icon>
            <v-avatar size="35">
              <img src="@/assets/images/profile.jpg" width="35" alt="Julia" />
            </v-avatar>

            <v-tooltip activator="parent" location="top">
              {{ $t("changeProfile") }}
            </v-tooltip>
          </v-btn>
        </v-col>
      </v-row>
    </template>
    <v-sheet rounded="md" class="sheet" max-width="450" elevation="10" style="margin-top: 10px">
      <div class="px-8 pt-6" v-if="authStore.user_info">
        <h6 class="text-h5 font-weight-medium">{{ $t("title") }}</h6>
        <div class="d-flex align-center mt-4 pb-6">
          <div class="ml-3">
            <h6 class="text-h6 mb-n1">
              {{ authStore.user_info?.fullName }}
            </h6>
            <h6 class="text-subtitle-1 mt-2 text-grey200 font-weight-regular textSecondary">
              {{ authStore.user_info.currentOrganizationName }}
            </h6>
            <div class="d-flex flex-column mt-2" v-if="authStore.user_info.region">
              <h6 class="text-subtitle-1 font-weight-regular textSecondary">
                <span class="text-grey200"> {{ $t("region") }} </span>:
                {{ authStore.user_info.region.regionName || "-" }}
              </h6>
              <h6 class="text-subtitle-1 font-weight-regular textSecondary">
                <span class="text-grey200"> {{ $t("district") }} </span>:
                {{ authStore.user_info.region.districtName || "-" }}
              </h6>
            </div>
          </div>
        </div>
        <v-divider></v-divider>
      </div>
      <v-col md="5" sm="12" class="pt-4 pb-3 px-4 text-center ml-auto">
        <v-btn color="primary" variant="flat" block @click="Logout">
          <DoorExitIcon size="20" style="margin-right: 20px" />
          {{ $t("Logout") }}
        </v-btn>
      </v-col>
    </v-sheet>
  </v-menu>
</template>
<style lang="scss" scoped>
.sheet {
  width: 28.125rem !important;
  @media screen and (max-width: 600px) {
    width: 100% !important;
  }
}
</style>
