<script setup lang="ts">
import { IPerson } from "@/models/basic";
import { IApplication } from "../types";

interface IProps {
  person: IPerson;
  application: IApplication;
}

defineProps<IProps>();
</script>

<template>
  <v-row v-if="person">
    <v-col cols="12">
      <form-input :label="$t('eldPresonfullName')" v-model="person.fullName" disabled />
    </v-col>
    <v-col sm="4" cols="12">
      <form-input :label="$t('birthOn')" v-model="person.birthOn" disabled />
    </v-col>
    <v-col sm="4" cols="12">
      <form-input :label="$t('genderName')" v-model="person.genderName" disabled />
    </v-col>
    <v-col sm="4" cols="12">
      <form-input :label="$t('nationalityName')" v-model="person.nationalityName" disabled />
    </v-col>
    <v-col sm="4" cols="12">
      <form-input :label="$t('passportSeria')" v-model="person.docSeria" disabled />
    </v-col>
    <v-col sm="4" cols="12">
      <form-input :label="$t('passportNum')" v-model="person.docNumber" disabled />
    </v-col>
    <v-col sm="4" cols="12">
      <form-input :label="$t('docIssueOrganization')" v-model="person.docIssueOrganization" disabled />
    </v-col>
    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-title>
          {{ $t("livingAddress") }}
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-row>
            <v-col cols="12" lg="3" md="6">
              <form-input :label="$t('region')" v-model="application.address.livingRegion" disabled />
            </v-col>
            <v-col cols="12" lg="3" md="6">
              <form-input :label="$t('district')" v-model="application.address.livingDistrict" disabled />
            </v-col>
            <v-col cols="12" lg="3" md="6">
              <form-input :label="$t('mfy')" v-model="application.address.livingMfy" disabled />
            </v-col>
            <v-col cols="12" lg="6" md="6">
              <form-input :label="$t('livingAddress')" v-model="application.address.livingAddress" disabled />
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel class="mt-3">
        <v-expansion-panel-title>
          {{ $t("temporaryAddress") }}
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-row>
            <v-col cols="12" lg="3" md="6">
              <form-input :label="$t('region')" v-model="application.address.temporaryRegion" disabled />
            </v-col>
            <v-col cols="12" lg="3" md="6">
              <form-input :label="$t('district')" v-model="application.address.temporaryDistrict" disabled />
            </v-col>
            <v-col cols="12" lg="3" md="6">
              <form-input :label="$t('mfy')" v-model="application.address.temporaryMfy" disabled />
            </v-col>
            <v-col cols="12" lg="6" md="6">
              <form-input :label="$t('temporaryAddress')" v-model="application.address.temporaryAddress" disabled />
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-row>
</template>
