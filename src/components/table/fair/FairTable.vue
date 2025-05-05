<template>
  <div class="q-pa-md">
    <q-table
      :rows="rows"
      :columns="columns"
      row-key="id"
      hide-bottom
      :pagination="{ rowsPerPage: -1 }"
    >
      <template v-slot:header-cell-level="props">
        <q-th :props="props">
          <div class="row items-center">
            {{ props.col.label }}
            <q-icon name="help" size="xs" class="q-ml-sm">
              <q-tooltip style="font-size: 14px"> 最高頻率與最低頻率差異次數的上限 </q-tooltip>
            </q-icon>
          </div>
        </q-th>
      </template>

      <template v-slot:body-cell-level="props">
        <q-td :props="props">
          <q-select
            v-model="props.row.level"
            :options="levelOptions"
            outlined
            dense
            emit-value
            map-options
          />
        </q-td>
      </template>

      <template v-slot:body-cell-name="props">
        <q-td :props="props">
          <q-input
            v-model="props.row.name"
            dense
            outlined
            @update:model-value="updateRow(props.row)"
          />
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
import type { Fair } from 'src/utils/z3/param';

const props = defineProps<{
  year: number;
  month: number;
}>();

interface Row {
  id: number;
  level: number;
  name: string;
  dates: number[];
}

const rows = ref<Row[]>([]);
let nextId = 1;

const levelOptions = [
  {
    label: '1',
    value: 1,
  },
  {
    label: '2',
    value: 2,
  },
  {
    label: '3',
    value: 3,
  },
  {
    label: '∞',
    value: 0,
  },
];

const columns: QTableColumn<Row>[] = [
  {
    name: 'level',
    label: '等級',
    field: 'level',
    align: 'center' as const,
    style: 'width: 100px;',
  },
  {
    name: 'name',
    label: '備註',
    field: 'name',
    align: 'left' as const,
    style: 'width: 100px;',
  },
  {
    name: 'dates',
    label: '日期',
    field: 'dates',
    align: 'left' as const,
    style: 'width: 400px;',
  },
];

function addRow() {
  rows.value.push({
    id: nextId++,
    level: 0,
    name: '',
    dates: [],
  });
}

function getAllDates(day?: number) {
  const calendarDates = [];
  const currentDate = new Date(props.year, props.month, 1);
  while (currentDate.getMonth() === props.month) {
    if (day == null || currentDate.getDay() === day) {
      calendarDates.push(new Date(currentDate));
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return calendarDates;
}

function addDefault() {
  rows.value.push({
    id: nextId++,
    level: 1,
    name: '全部',
    dates: getAllDates().map((date) => date.getDate()),
  });

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  for (let i = 0; i < 7; i++) {
    rows.value.push({
      id: nextId++,
      level: i === 0 ? 1 : 2,
      name: '周' + weekDays[i],
      dates: getAllDates(i).map((date) => date.getDate()),
    });
  }
}

function updateRow(row: Row) {
  const index = rows.value.findIndex((r) => r.id === row.id);
  if (index !== -1) {
    rows.value[index] = { ...row };
  }
}

function reset() {
  rows.value = [];
  nextId = 1;
  addDefault();
}

function exportFair() {
  return rows.value
    .filter((row) => row.level !== 0)
    .map<Fair>((row) => ({
      diff: row.level,
      dates: row.dates.map((date) => date - 1),
    }));
}

defineExpose({
  exportFair,
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
