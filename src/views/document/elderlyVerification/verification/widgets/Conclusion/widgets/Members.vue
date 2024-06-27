<script setup lang="ts">
import { useElderlyVerification } from "../../../store/useElderlyVerification";
import { IVerificationConclusionMembers } from "../../../types";

interface IProps {
  members: IVerificationConclusionMembers[];
  isView?: boolean;
}

const store = useElderlyVerification();

defineProps<IProps>();
</script>

<template>
  <v-row>
    <v-col cols="12" lg="6" sm="12" v-for="item in members">
      <v-card elevation="4">
        <v-card-text>
          <v-row class="mb-3">
            <v-col class="py-0 font-weight-bold">
              <h3>{{ $t("person") }} :</h3>
            </v-col>
            <v-col class="text-left font-weight-bold py-0" v-if="item.elderlyVerificationComission?.person?.fullName">
              <h3>{{ item.elderlyVerificationComission.person.fullName || "-" }}</h3>
            </v-col>
          </v-row>
          <v-row class="mb-3">
            <v-col class="py-0 font-weight-bold">
              <h3>{{ $t("mfyAttachedMemberType") }}:</h3>
            </v-col>
            <v-col class="text-left font-weight-bold py-0">
              <h3>{{ item.elderlyVerificationComission.mfyAttachedMemberType }}</h3>
            </v-col>
          </v-row>
          <v-row class="mt-6">
            <v-col cols="12" lg="6" class="py-0">
              <v-label>
                {{ $t("phoneNumber") }}: <span class="font-weight-bold ml-2">{{ item.elderlyVerificationComission.phoneNumber }}</span>
              </v-label>
            </v-col>
            <v-col cols="12" lg="6" class="py-0">
              <v-label>
                {{ $t("phoneNumberAlt") }} :
                <span class="font-weight-bold ml-2">
                  {{ item.elderlyVerificationComission.phoneNumberAlt || "-" }}
                </span>
              </v-label>
            </v-col>
            <v-col cols="12" lg="6" class="py-0">
              <v-label>
                {{ $t("isAgree") }} :
                <form-checkbox v-model="item.isAgree" :disabled="!store.data.canAgree || isView"> </form-checkbox>
              </v-label>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style lang="scss" scoped></style>
