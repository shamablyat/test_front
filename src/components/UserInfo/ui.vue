<script setup lang="ts">
import type { IPerson } from "@/models/basic";
import { IPassportIncludes } from "../setPassportData/types";

interface IProps {
  person?: IPerson | undefined | null;
  birthOn?: boolean;
  nationalityName?: boolean;
  genderName?: boolean;
  pinfl?: boolean;
  livingAddress?: boolean;
  disabilityGroup?: boolean;
  docIssueOn?: boolean;
  docExpireOn?: boolean;
  includes?: IPassportIncludes;
  image?: string;
}
withDefaults(defineProps<IProps>(), {
  birthOn: true,
  nationalityName: true,
  genderName: true,
  docIssueOn: true,
  docExpireOn: true
});
</script>

<template>
  <div v-if="person">
    <v-row>
      <v-col cols="6" lg="2" md="4" v-if="image">
        <img
          :class="{
            isDeath: person.isDeath
          }"
          style="width: 70%"
          :src="image"
          alt=""
        />
      </v-col>
      <!-- LEFT COLLAR -->
      <v-col cols="12" :lg="image ? 5 : 6" density="comfortable">
        <v-card variant="outlined" class="py-2">
          <v-list-item value="wifi" active-color="primary" v-if="birthOn">
            <div class="d-flex align-center">
              <div class="ml-3">
                {{ $t("passportData.fullName") }}
              </div>
              <div class="ml-auto" style="font-weight: bold">
                <slot name="fullName" :item="person">
                  {{ person.fullName || "-" }}
                </slot>
              </div>
            </div>
          </v-list-item>
          <v-list-item value="wifi" active-color="primary" v-if="birthOn">
            <div class="d-flex align-center">
              <div class="ml-3">
                {{ $t("passportData.birthOn") }}
              </div>
              <div class="ml-auto" style="font-weight: bold">
                <slot name="birthOn" :item="person">
                  {{ person.birthOn || "-" }}
                </slot>
              </div>
            </div>
          </v-list-item>
          <v-list-item value="bluetooth" active-color="primary" v-if="nationalityName">
            <div class="d-flex align-center">
              <div class="ml-3">
                {{ $t("passportData.nationalityName") }}
              </div>
              <div class="ml-auto" style="font-weight: bold">
                <slot name="nationalityName" :item="person">
                  {{ person.nationalityName || "-" }}
                </slot>
              </div>
            </div>
          </v-list-item>
          <v-list-item value="bluetooth" active-color="primary" v-if="genderName">
            <div class="d-flex align-center">
              <div class="ml-3">
                {{ $t("passportData.genderName") }}
              </div>
              <div class="ml-auto" style="font-weight: bold">
                <slot name="genderName" :item="person">
                  {{ person.genderName || "-" }}
                </slot>
              </div>
            </div>
          </v-list-item>
          <v-list-item value="bluetooth" active-color="primary" v-if="pinfl">
            <div class="d-flex align-center">
              <div class="ml-3">
                {{ $t("passportData.pinfl") }}
              </div>
              <div class="ml-auto" style="font-weight: bold">
                <slot name="pinfl" :item="person">
                  {{ person.pinfl || "-" }}
                </slot>
              </div>
            </div>
          </v-list-item>
          <v-list-item value="bluetooth" active-color="primary" v-if="includes && includes.includeAddress">
            <div class="d-flex align-center">
              <div class="ml-3">
                {{ $t("passportData.address") }}
              </div>
              <div class="ml-auto" style="font-weight: bold">
                <slot name="livingAddress" :item="person">
                  {{ person.livingAddress?.address || "-" }}
                </slot>
              </div>
            </div>
          </v-list-item>
          <v-list-item value="bluetooth" active-color="primary" v-if="includes && includes.includeDisabilityGroup">
            <div class="d-flex align-center">
              <div class="ml-3">
                {{ $t("passportData.disabilityGroup") }}
              </div>
              <div class="ml-auto" style="font-weight: bold">
                <slot name="disabilityGroup" :item="person">
                  {{ person.disabilityGroup || "-" }}
                </slot>
              </div>
            </div>
          </v-list-item>
          <v-list-item value="wifi" active-color="primary" v-if="includes && includes.includePositionInfo">
            <div class="d-flex align-center">
              <div class="ml-3">
                {{ $t("passportData.placeAndPositionWork") }}
              </div>
              <div class="ml-auto" style="font-weight: bold">
                <slot name="positionInfo" :item="person">
                  {{ person?.positionInfo?.position || person?.positionInfo?.organization ? $t("passportData.has") : $t("passportData.no") }}
                </slot>
              </div>
            </div>
          </v-list-item>

          <v-list-item value="wifi" active-color="primary" v-if="includes && includes.includeKadastrInfo">
            <div class="d-flex align-center">
              <div class="ml-3">
                {{ $t("passportData.cadastralInformation") }}
              </div>
              <div class="ml-auto" style="font-weight: bold">
                <slot name="isKadastr" :item="person">
                  {{ person?.isKadastr ? $t("passportData.has") : "-" }}
                </slot>
              </div>
            </div>
          </v-list-item>
          <v-list-item value="wifi" active-color="primary" v-if="includes && includes.includeMariageInfo">
            <div class="d-flex align-center">
              <div class="ml-3">
                {{ $t("passportData.maritialStatus") }}
              </div>
              <div class="ml-auto" style="font-weight: bold">
                <slot name="isMarried" :item="person">
                  {{ person?.isMarried ? $t("passportData.married") : "-" }}
                </slot>
              </div>
            </div>
          </v-list-item>
          <v-list-item value="wifi" active-color="primary" v-if="includes && includes.includeMariageInfo">
            <div class="d-flex align-center">
              <div class="ml-3">
                {{ $t("passportData.hasSalary") }}
              </div>
              <div class="ml-auto" style="font-weight: bold">
                <slot name="hasSalary" :item="person">
                  {{ person?.hasSalary ? $t("passportData.has") : "-" }}
                </slot>
              </div>
            </div>
          </v-list-item>
          <v-list-item value="wifi" active-color="primary" v-if="includes && includes.includeMariageInfo">
            <div class="d-flex align-center">
              <div class="ml-3">
                {{ $t("passportData.isDeath") }}
              </div>
              <div class="ml-auto" style="font-weight: bold">
                <slot name="isDeath" :item="person">
                  {{ person?.isDeath ? $t("passportData.yes") : $t("passportData.no") }}
                </slot>
              </div>
            </div>
          </v-list-item>
          <slot name="leftCollar"></slot>
        </v-card>
      </v-col>
      <!-- RIGHT COLLAR -->
      <v-col cols="12" :lg="image ? 5 : 6" density="comfortable">
        <v-card variant="outlined" class="py-2">
          <v-list-item value="bluetooth2" active-color="primary" v-if="includes && includes.includeWomenNotebookInfo">
            <div class="d-flex align-center">
              <div class="ml-3">
                {{ $t("passportData.womenNotebook") }}
              </div>
              <div class="ml-auto" style="font-weight: bold">
                <slot name="isWomanNotebook" :item="person">
                  {{ person?.isWomanNotebook ? $t("passportData.yes") : "-" }}
                </slot>
              </div>
            </div>
          </v-list-item>
          <v-list-item value="bluetooth2" active-color="primary" v-if="includes && includes.includeDebtInfo">
            <div class="d-flex align-center">
              <div class="ml-3">
                {{ $t("passportData.hasDebt") }}
              </div>
              <div class="ml-auto" style="font-weight: bold">
                <slot name="hasDebt" :item="person">
                  {{ person?.hasDebt ? $t("passportData.yes") : "-" }}
                </slot>
              </div>
            </div>
          </v-list-item>
          <v-list-item value="bluetooth2" active-color="primary" v-if="includes && includes.includeNeurologicInfo">
            <div class="d-flex align-center">
              <div class="ml-3">
                {{ $t("passportData.disabilityExtenal") }}
              </div>
              <div class="ml-auto" style="font-weight: bold">
                <slot name="disabilityExtenal" :item="person">
                  {{ person.disabilityExtenal?.name || "-" }}
                </slot>
              </div>
            </div>
          </v-list-item>
          <!-- <v-list-item value="bluetooth2" active-color="primary">
            <div class="d-flex align-center">
              <div class="ml-3">
                {{ $t("psychoNeurologicalDispensary") }}
              </div>
              <div class="ml-auto" style="font-weight: bold">
                {{ "-" }}
              </div>
            </div>
          </v-list-item> -->

          <v-list-item value="wifi" active-color="primary" v-if="includes && includes.includeDiplomaInfo">
            <div class="d-flex align-center">
              <div class="ml-3">
                {{ $t("passportData.hasDiploma") }}
              </div>
              <div class="ml-auto" style="font-weight: bold">
                <slot name="hasDiploma" :item="person">
                  {{ person?.hasDiploma ? $t("passportData.has") : "-" }}
                </slot>
              </div>
            </div>
          </v-list-item>
          <v-list-item value="wifi" active-color="primary" v-if="includes && includes.includeDiplomaInfo">
            <div class="d-flex align-center">
              <div class="ml-3">
                {{ $t("passportData.isDivorce") }}
              </div>
              <div class="ml-auto" style="font-weight: bold">
                <slot name="isDivorce" :item="person">
                  {{ person?.isDivorce ? $t("passportData.yes") : "-" }}
                </slot>
              </div>
            </div>
          </v-list-item>
          <v-list-item value="wifi" active-color="primary" v-if="includes && includes.includeDiplomaInfo">
            <div class="d-flex align-center">
              <div class="ml-3">
                {{ $t("passportData.isAliment") }}
              </div>
              <div class="ml-auto" style="font-weight: bold">
                <slot name="isAliment" :item="person">
                  {{ person?.isAliment ? $t("passportData.yes") : "-" }}
                </slot>
              </div>
            </div>
          </v-list-item>
          <v-list-item value="bluetooth2" active-color="primary" v-if="docIssueOn">
            <div class="d-flex align-center">
              <div class="ml-3">
                {{ $t("passportData.docIssueOn") }}
              </div>
              <div class="ml-auto" style="font-weight: bold">
                <slot name="docIssueOn" :item="person">
                  {{ person.docIssueOn }}
                </slot>
              </div>
            </div>
          </v-list-item>
          <v-list-item value="bluetooth3" active-color="primary" v-if="docExpireOn">
            <div class="d-flex align-center">
              <div class="ml-3">
                {{ $t("passportData.docExpireOn") }}
              </div>
              <div class="ml-auto" style="font-weight: bold">
                <slot name="docExpireOn" :item="person">
                  {{ person.docExpireOn }}
                </slot>
              </div>
            </div>
          </v-list-item>
          <v-list-item value="bluetooth3" active-color="primary" v-if="includes && includes.includePension">
            <div class="d-flex align-center">
              <div class="ml-3">
                {{ $t("passportData.pensionType") }}
              </div>
              <div class="ml-auto" style="font-weight: bold">
                <slot name="pensionType" :item="person">
                  {{ person.pension?.pensionType || "-" }}
                </slot>
              </div>
            </div>
          </v-list-item>
          <v-list-item value="bluetooth3" active-color="primary" v-if="includes && includes.includePension">
            <div class="d-flex align-center">
              <div class="ml-3">
                {{ $t("passportData.pensionAmount") }}
              </div>
              <div class="ml-auto" style="font-weight: bold">
                <slot name="pensionAmount" :item="person">
                  {{ person.pension?.amount ? new Intl.NumberFormat("uz-Uz").format(person.pension.amount) : 0 || "-" }}
                </slot>
              </div>
            </div>
          </v-list-item>
          <slot name="rightCollar"></slot>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
