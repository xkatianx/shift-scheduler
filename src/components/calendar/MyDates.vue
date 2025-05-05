<template>
  <q-input v-model="datesDisplay" dense outlined readonly class="non-selectable">
    <template v-slot:append>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <q-date
            v-model="dates"
            multiple
            mask="YYYY-MM-DD"
            :default-year-month="`${yyyy}/${mm}`"
            :navigation-min-year-month="`${yyyy}/${mm}`"
            :navigation-max-year-month="`${yyyy}/${mm}`"
          />
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

const props = defineProps<{
  year: number;
  month: number;
}>();

const yyyy = computed(() => props.year.toString());
const mm = computed(() => (props.month + 1).toString().padStart(2, '0'));

const dates = ref<string[]>([]);
const pureDates = defineModel<number[]>('dates', { default: [] });
const datesDisplay = ref<string>('');

watch(
  pureDates,
  () => {
    datesDisplay.value = pureDates.value.join(' ');
  },
  { immediate: true },
);

watch(
  [() => props.year, () => props.month, datesDisplay],
  () => {
    dates.value = pureDates.value
      .map((date) => new Date(Date.UTC(props.year, props.month, date)))
      .filter((date) => date.getMonth() === props.month)
      .map((date) => date.toISOString().split('T')[0]!);
  },
  { immediate: true },
);

watch(
  dates,
  () => {
    pureDates.value = dates.value.sort().map((day) => new Date(day).getDate());
  },
  { immediate: true },
);
</script>
