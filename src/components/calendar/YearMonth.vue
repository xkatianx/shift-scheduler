<template>
  <div class="calendar-controls">
    <div class="year-month-selector">
      <q-btn icon="chevron_left" flat @click="prevMonth" />
      <q-select v-model="selectedYear" :options="years" dense outlined class="year-select" />
      <q-select
        v-model="selectedMonth"
        :options="monthOptions"
        dense
        outlined
        emit-value
        map-options
        class="month-select"
      />
      <q-btn icon="chevron_right" flat @click="nextMonth" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const months = [
  '一月',
  '二月',
  '三月',
  '四月',
  '五月',
  '六月',
  '七月',
  '八月',
  '九月',
  '十月',
  '十一月',
  '十二月',
];

const selectedYear = defineModel<number>('year', { required: true });
const selectedMonth = defineModel<number>('month', { required: true });

const years = computed(() => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);
});

const monthOptions = computed(() => {
  return months.map((label, value) => ({ label, value }));
});

function prevMonth() {
  if (selectedMonth.value === 0) {
    selectedMonth.value = 11;
    selectedYear.value--;
  } else {
    selectedMonth.value--;
  }
}

function nextMonth() {
  if (selectedMonth.value === 11) {
    selectedMonth.value = 0;
    selectedYear.value++;
  } else {
    selectedMonth.value++;
  }
}
</script>

<style scoped>
.calendar-controls {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.year-month-selector {
  display: flex;
  gap: 10px;
  align-items: center;
}

.year-select,
.month-select {
  width: 120px;
}
</style>
