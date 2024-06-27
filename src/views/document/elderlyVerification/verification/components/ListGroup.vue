<script setup lang="ts">
import { computed, ref } from "vue";
import { CheckboxIcon, SquareIcon } from "vue-tabler-icons";

interface IProps {
  list: any[];
  itemChildren?: string;
  itemTitle?: string;
  itemValue?: string;
  loading?: boolean;
  service: any;
  apiName?: string;
}

const props = withDefaults(defineProps<IProps>(), {
  itemChildren: "children",
  itemTitle: "text",
  itemValue: "value",
  apiName: "Icd10SelectList"
});

const items = computed(() => props.list);

const emits = defineEmits<{
  (e: "update:model-value", value: any): void;
}>();


const loading = ref(false);
const onShowGroup = (item: any) => {
  if (item.isGroup) {
    item.selected = true;
    if (loading.value === true) {
      return;
    }

    loading.value = true;
    props.service[props.apiName](item.code)
      .then((res: any) => {
        item[props.itemChildren] = [];
        item[props.itemChildren] = [].concat(res.data);
      })
      .finally(() => {
        loading.value = false;
      });
  } else {
    emits("update:model-value", item);
  }
};
</script>

<template>
  <v-list-group v-model="item.selected" v-for="item in items">
    <template v-slot:activator="{ props }">
      <v-list-item v-bind="props" @click="onShowGroup(item)">
        <template #title> {{ item[itemTitle] }} </template>
        <template #prepend="{ isActive }" v-if="item.isGroup">
          <SquareIcon @click="onShowGroup(item)" class="mr-5" v-if="!isActive && !item.selected" />
          <CheckboxIcon :color="item.selected ? 'rgb(var(--v-theme-success))' : ''" class="mr-5" v-else-if="isActive || item.selected" />
        </template>
        <template #append="">
          <div></div>
        </template>
      </v-list-item>
    </template>

    <template v-if="item.isGroup">
      <ListGroup
        :service="service"
        :api-name="apiName"
        :item-children="itemChildren"
        :item-value="itemValue"
        :item-title="itemTitle"
        @update:model-value="onShowGroup"
        :list="item[itemChildren]"
      />
    </template>
  </v-list-group>
</template>
