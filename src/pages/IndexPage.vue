<template>
  <q-page class="row items-start justify-evenly">
    <div>
      <MyCalendar
        :date-content="dateContent"
        v-model:year="selectedYear"
        v-model:month="selectedMonth"
      />
      <SolveButtons
        v-model="answerId"
        :answer-amount="answers.length"
        :no-more-answers="noMoreAnswers"
        :loading="loading"
        @solve-first="solve"
        @solve-next="solveNext"
      />
    </div>
    <div class="q-pa-md">
      <q-tabs v-model="tab">
        <q-tab name="member" label="成員" />
        <q-tab name="fair" label="公平區間" />
      </q-tabs>

      <q-tab-panels v-model="tab" animated keep-alive>
        <q-tab-panel name="member">
          <MemberTable ref="memberTable" :year="selectedYear" :month="selectedMonth" />
        </q-tab-panel>
        <q-tab-panel name="fair">
          <FairTable ref="fairTable" :year="selectedYear" :month="selectedMonth" />
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

import { useQuasar } from 'quasar';
import MyCalendar from 'src/components/calendar/MyCalendar.vue';
import FairTable from 'src/components/table/fair/FairTable.vue';
import MemberTable from 'src/components/table/member/MemberTable.vue';
import SolveButtons from 'src/components/tools/SolveButtons.vue';
import { Z3Solver } from 'src/utils/z3/solver';

const $q = useQuasar();

const selectedYear = ref(new Date().getFullYear());
const selectedMonth = ref(new Date().getMonth());

const loading = ref(false);
const tab = ref('member');

const solver = ref<Z3Solver>();

function getDays(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

const memberTable = ref<InstanceType<typeof MemberTable>>();
const fairTable = ref<InstanceType<typeof FairTable>>();
const names = ref<string[]>([]);

const answers = ref<number[][]>([]);
const answerId = ref(0);
const noMoreAnswers = ref(false);

async function solve() {
  loading.value = true;
  const ban = memberTable.value?.exportBan();
  const fair = fairTable.value?.exportFair();
  if (ban == null || fair == null) {
    loading.value = false;
    return;
  }

  names.value = ban.map(({ name }) => name);
  solver.value = new Z3Solver(getDays(selectedYear.value, selectedMonth.value), ban, fair);
  await solver.value.solve();
  await solveNext();
}

async function solveNext() {
  loading.value = true;
  const res = await solver.value?.findSolutions();
  if (res == null) {
    noMoreAnswers.value = true;
    $q.notify({
      message: '沒有更多排法了',
      color: 'negative',
      icon: 'warning',
      position: 'top',
    });
  } else {
    answers.value.push(res);
    answerId.value = answers.value.length - 1;
  }
  loading.value = false;
}

const dateContent = computed(() => {
  return answers.value[answerId.value]?.map((date) => names.value[date] ?? '') ?? [];
});
</script>
