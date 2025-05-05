<template>
  <div class="main">
    <div v-if="answerAmount > 0" class="row items-center">
      <q-btn
        icon="arrow_back"
        @click="prev"
        :loading
        :disable="answerId === 0"
        color="brown"
        outline
      />
      <p>班表 {{ answerId }}</p>
      <q-btn
        icon="arrow_forward"
        @click="next"
        :loading
        :disable="noMoreAnswers && answerId === answerAmount - 1"
        color="brown"
        outline
      />
    </div>
    <q-btn label="排班" @click="emit('solve-first')" :loading color="brown" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  answerAmount: number;
  noMoreAnswers: boolean;
  loading: boolean;
}>();

const answerId = defineModel<number>({ required: true });

function prev() {
  if (answerId.value > 0) {
    answerId.value--;
  }
}

function next() {
  if (answerId.value < props.answerAmount - 1) {
    answerId.value++;
  } else {
    emit('solve-next');
  }
}

const emit = defineEmits<{
  (e: 'solve-next'): void;
  (e: 'solve-first'): void;
}>();
</script>

<style scoped lang="scss">
.main {
  position: relative;

  & > div {
    width: 60%;
    margin: auto;
    display: flex;
    align-items: center;

    p {
      flex-grow: 2;
      text-align: center;
      margin: 0;
      font-size: 1rem;
    }
  }

  & > .q-btn {
    position: absolute;
    top: 0;
    right: 0;
  }
}
</style>
