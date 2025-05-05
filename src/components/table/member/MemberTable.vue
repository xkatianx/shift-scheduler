<template>
  <div class="q-pa-md">
    <q-table
      :rows="rows"
      :columns="columns"
      row-key="id"
      hide-bottom
      :pagination="{ rowsPerPage: -1 }"
    >
      <template v-slot:body-cell-apply="props">
        <q-td :props="props">
          <q-checkbox v-model="props.row.apply" />
        </q-td>
      </template>

      <template v-slot:body-cell-name="props">
        <q-td :props="props">
          <q-input v-model="props.row.name" dense outlined />
        </q-td>
      </template>

      <template v-slot:body-cell-dates="props">
        <q-td :props="props">
          <MyDates v-model:dates="props.row.dates" :year :month />
        </q-td>
      </template>
    </q-table>

    <div class="q-mt-md">
      <q-btn color="primary" icon="add" label="Add Row" @click="addRow" />
      <q-btn color="negative" icon="refresh" label="Reset" class="q-ml-md" @click="reset" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

import type { QTableColumn } from 'quasar';
import MyDates from 'src/components/calendar/MyDates.vue';
import type { Ban } from 'src/utils/z3/param';

defineProps<{
  year: number;
  month: number;
}>();

interface Row {
  id: number;
  apply: boolean;
  name: string;
  dates: number[];
}

const rows = ref<Row[]>([]);
let nextId = 1;

const columns: QTableColumn<Row>[] = [
  {
    name: 'apply',
    label: '啟用',
    field: 'apply',
    align: 'center' as const,
    style: 'width: 100px;',
  },
  {
    name: 'name',
    label: '暱稱',
    field: 'name',
    align: 'left' as const,
    style: 'width: 100px;',
  },
  {
    name: 'dates',
    label: '休假日',
    field: 'dates',
    align: 'left' as const,
    style: 'width: 400px;',
  },
];

function addRow() {
  rows.value.push({
    id: nextId++,
    apply: true,
    name: '',
    dates: [],
  });
}

function reset() {
  rows.value = [];
  nextId = 1;
  addRow();
}

function exportBan() {
  return rows.value
    .filter((row) => row.apply)
    .map<Ban>((row) => ({
      name: row.name,
      dates: row.dates.map((date) => date - 1),
    }));
}

defineExpose({
  exportBan,
});

onMounted(() => {
  reset();
});
</script>

<style scoped lang="scss">
.q-table {
  width: 100%;
}
</style>
