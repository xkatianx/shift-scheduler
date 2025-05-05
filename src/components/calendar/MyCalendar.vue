<template>
  <div class="big-calendar">
    <YearMonth v-model:year="selectedYear" v-model:month="selectedMonth" />
    <div class="calendar-grid">
      <div
        class="weekday-header"
        v-for="day in ['一', '二', '三', '四', '五', '六', '日']"
        :key="day"
      >
        {{ day }}
      </div>
      <div
        v-for="(date, index) in calendarDates"
        :key="index"
        class="calendar-cell"
        :class="{
          'current-month': isCurrentMonth(date),
        }"
      >
        <div class="date-number">{{ date.getDate() }}</div>
        <div class="date-content">
          {{ getContent(date) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import YearMonth from './YearMonth.vue';

const selectedYear = defineModel<number>('year', { required: true });
const selectedMonth = defineModel<number>('month', { required: true });
const props = defineProps<{
  dateContent?: string[] | undefined;
}>();

const calendarDates = computed(() => {
  const firstDay = new Date(selectedYear.value, selectedMonth.value, 1);
  const lastDay = new Date(selectedYear.value, selectedMonth.value + 1, 0);

  const firstDayOfWeek = (firstDay.getDay() + 6) % 7;
  const daysFromPrevMonth = firstDayOfWeek;
  const totalDays = lastDay.getDate();

  const dates: Date[] = [];

  const prevMonthDays = new Date(selectedYear.value, selectedMonth.value, 0).getDate();
  for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
    dates.push(new Date(selectedYear.value, selectedMonth.value - 1, prevMonthDays - i));
  }

  for (let i = 1; i <= totalDays; i++) {
    dates.push(new Date(selectedYear.value, selectedMonth.value, i));
  }

  const daysFromNextMonth = (42 - (daysFromPrevMonth + totalDays)) % 7;
  for (let i = 1; i <= daysFromNextMonth; i++) {
    dates.push(new Date(selectedYear.value, selectedMonth.value + 1, i));
  }

  return dates;
});

function isCurrentMonth(date: Date) {
  return date.getMonth() === selectedMonth.value;
}

function getContent(date: Date) {
  if (!isCurrentMonth(date)) return '';
  return props.dateContent?.[date.getDate() - 1] ?? '';
}
</script>

<style scoped>
.big-calendar {
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

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

select {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 16px;
}

button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #4caf50;
  color: white;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #45a049;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
}

.weekday-header {
  padding: 10px;
  text-align: center;
  background-color: #f8f8f8;
  font-weight: bold;
}

.calendar-cell {
  min-height: 72px;
  min-width: 72px;
  padding: 5px;
  background-color: white;
  border: 1px solid #ddd;
  position: relative;
}

.calendar-cell:not(.current-month) {
  background-color: #f9f9f9;
  color: #999;
}

.calendar-cell.today {
  background-color: #e6f7ff;
}

.date-number {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
}

.date-content {
  font-size: 22px;
  word-break: break-word;
}

.date-input {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}

.date-input input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}
</style>
