<script setup lang="ts">
import { ref, watch, computed } from "vue";
import type { FormInputTypes } from "@/models/vuetify/types";
import { VTextField } from "vuetify/components";
import { useI18n } from "vue-i18n";
interface CustomFormInputTypes extends FormInputTypes {
  clearIcon?: string;
  prependInnerIcon?: string;
  appendInnerIcon?: string;
}
const props = withDefaults(defineProps<CustomFormInputTypes>(), {
  type: "text",
  mask: "",
  variant: "outlined",
  color: "primary",
  validateOn: "lazy submit"
});

const customRules = ref<any>([]);
const { t } = useI18n();

const setRules = () => {
  if (props.required) {
    if (props.rules && props.rules.length > 0) {
      customRules.value = props.rules;
      return;
    }
    customRules.value = [
      (value: any) => {
        if (props.canAddZero && value === 0) return true;
        if (value) return true;
        // @ts-ignore
        return t("fieldNotEmpty");
      }
    ];
  } else {
    customRules.value = [];
  }
};

const emits = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "appendInner"): void;
}>();

const model = computed({
  get(): string {
    return props.canAddZero ? props.modelValue : props.modelValue == 0 ? null : props.modelValue;
  },
  set(newValue: string): void {
    if (props.upperCase) {
      emits("update:modelValue", newValue.toUpperCase());
    } else {
      emits("update:modelValue", newValue);
    }
  }
});

watch(
  () => [props.required, props.rules],
  () => {
    setRules();
  },
  { immediate: true }
);
</script>

<template>
  <div>
    <v-label v-if="label" class="mb-2 font-weight-medium wrap">
      {{ label }}
      <span v-if="required && !hideStar" style="color: red">*</span>
    </v-label>
    <v-text-field
      class="w-100"
      :flat="flat"
      :reverse="reverse"
      :type="type"
      :error="error"
      :active="active"
      :direction="direction"
      :style="style"
      :autofocus="autofocus"
      :disabled="disabled"
      :readonly="readonly"
      :messages="messages"
      :rounded="rounded"
      :density="density"
      :variant="variant"
      :clearIcon="clearIcon"
      :focused="focused"
      :errorMessages="errorMessages"
      :maxErrors="maxErrors"
      :rules="customRules"
      :centerAffix="centerAffix"
      :persistentHint="persistentHint"
      :clearable="!required || clearable"
      :dirty="dirty"
      :persistentClear="persistentClear"
      :singleLine="singleLine"
      :persistentPlaceholder="persistentPlaceholder"
      :persistentCounter="persistentCounter"
      :key="key"
      :id="id"
      :name="name"
      :color="color"
      :loading="loading"
      :prefix="prefix"
      :class="class"
      :bgColor="bgColor"
      :baseColor="baseColor"
      :suffix="suffix"
      :modelModifiers="modelModifiers"
      :placeholder="placeholder ? placeholder : label"
      v-mask="mask"
      v-model="model"
      @click:append-inner="emits('appendInner')"
      @keyup.enter="emits('appendInner')"
      :append-inner-icon="appendInnerIcon"
      :prepend-inner-icon="prependInnerIcon"
      :autocomplete="autocomplete"
      :hide-details="!required"
      :validate-on="validateOn"
    >
    </v-text-field>
  </div>
</template>
