<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{
  id: string
  type: string
  placeholder: string
  label: string
  required?: boolean
  modelValue: string
}>()

const emit = defineEmits(['update:modelValue'])

const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <label :for="id" class="text-200 normal mg-bottom-20px">
    <span class="color-neutral-600">{{ label }}</span>
  </label>
  <input class="input input-h3-size w-input"
         :maxlength="256"
         :name="id"
         :data-name="id"
         :placeholder="placeholder"
         :type="type"
         :id="id"
         :required="required"
         :value="modelValue"
         @input="updateValue">
</template>

<style scoped>
</style>
