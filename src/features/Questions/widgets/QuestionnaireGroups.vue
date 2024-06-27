<script setup lang="ts">
import { computed, onMounted } from "vue";
import { GetAnswers, GetGroup, ISurveyConstrains, ISurveyTablesEqual, IUseQuestionnaireAlgorithm } from "../types";
import UiParentCard from "@/components/UiParentCard.vue";
import { useGlobal } from "@/composables/useGlobal";
import { GetQuestions } from "../types";
import { useAuth } from "@/app/config/store/auth";

interface IProps {
  isView?: boolean;
  data: GetGroup[];
  algorithms: IUseQuestionnaireAlgorithm[];
  endAt?: string | null;
}

interface QuestionAnswerTemplateCount {
  [key: number | string]: {
    questionAnswerTemplate: string;
    count: number;
  };
}

const { makeGuid } = useGlobal();
const { user_info } = useAuth();

const props = defineProps<IProps>();
const groups = computed(() => props.data);
const algorithms = computed(() => props.algorithms);

const getVisibleQuestion = computed(() => (q: GetQuestions[]) => q.filter((e: GetQuestions) => e.isVisible));

const answeredQuestionCount = computed(() => {
  let count = 0;
  let all = 0;
  let allCount = 0;
  let collectedBall = 0;
  let percentage = 0;
  let questionAnswerTemplateCount: QuestionAnswerTemplateCount = {};

  if (groups.value) {
    groups.value.forEach((group, groupIndex) => {
      group.eldSurveyQuestions
        .filter((e) => e.isVisible)
        .forEach((question) => {
          if (question.eldSurveyAnswers.length > 0) {
            all++;
          }

          question.eldSurveyAnswers.forEach((el) => {
            if (el.isChecked) {
              collectedBall += el.ball;
            }
          });

          if (question.eldSurveyAnswers.some((el) => el.isChecked == true)) {
            count++;
          }

          if (question.answerTypeId === 3) {
            if (question.eldSurveyAnswers.some((el) => String(el.textAnswer).length > 0)) {
              count++;
            }
            if (question.eldSurveyAnswers.some((el) => el.textAnswer && el.textAnswer.length === 0)) {
              count = count <= 0 ? 0 : count--;
            }
          }

          question.eldSurveyAnswers.forEach((answer) => {
            const key = answer.eldQuestionAnswerTemplateTableId;
            if (answer.eldQuestionAnswerTemplateTableId) {
              if (answer.eldQuestionAnswerTemplateTableId in questionAnswerTemplateCount) {
                if (key && key in questionAnswerTemplateCount) {
                  if (answer.isChecked) {
                    questionAnswerTemplateCount[key].count++;
                  }
                }
                allCount += 1;
              } else {
                if (answer.isChecked && key && answer.answerText) {
                  questionAnswerTemplateCount = {
                    ...questionAnswerTemplateCount,
                    [key]: {
                      questionAnswerTemplate: answer.answerText,
                      count: 1
                    }
                  };

                  allCount += 1;
                }
              }
            }
          });
        });

      const questions = groups.value[groupIndex].eldSurveyQuestions;
      if (questions) {
        updateVisibleOfQuestion(questions);
        questions.forEach((question) => {
          constraintAnswer(question);
        });
      }
    });

    percentage = (count / all) * 100;
  }

  return {
    count: count,
    all: all,
    percentage: percentage,
    questionAnswerTemplateCount: questionAnswerTemplateCount,
    collectedBall,
    allCount
  };
});

const getQuestions = computed(() => {
  let list: GetGroup[] = [];
  if (groups.value) {
    list = groups.value;
    list.forEach((group) => {
      group.eldSurveyQuestions.forEach((question) => {
        if (question.answerTypeId == 3 && question.eldSurveyAnswers.length === 0) {
          question.eldSurveyAnswers.push({
            textAnswer: "",
            id: 0,
            eldQuestionnaireAnswerId2: makeGuid(),
            isDisabled: false,
            ball: 0
          });
        }
      });
    });
  }

  return list;
});

const changeRadioButton = (question: GetQuestions, answer: GetAnswers) => {
  question.eldSurveyAnswers.forEach((el) => {
    el.isChecked = false;
  });
  answer.isChecked = true;
};

const resetAnswer = (question: GetQuestions) => {
  question.eldSurveyAnswers.forEach((a) => {
    a.isChecked = false;
  });
};

const updateVisibleOfQuestion = (questions: GetQuestions[]) => {
  if (questions) {
    questions.forEach((question) => {
      /* FIRST STEP FIND ALGORITHM FOR QUESTION */
      const matchingAlgorithms = algorithms.value.filter(
        (algorithm) => algorithm.eldQuestionnaireQuestionId2Str === question.eldQuestionnaireQuestionId2
      );

      matchingAlgorithms.forEach((algorithm) => {
        if (algorithm.isAny) {
          /* CHECK TO DONE SOME CONDITION  */
          const isVisible = algorithm.tables.some((t) =>
            questions.some(
              (q) =>
                q.eldQuestionnaireQuestionId2 === t.eldQuestionnaireQuestionId2Str &&
                q.eldSurveyAnswers.some((a) => a.eldQuestionnaireAnswerId2 === t.eldQuestionnaireAnswerId2Str && a.isChecked === t.isEqual)
            )
          );

          /* UPDATE QUESTION VALUE  */
          question.isVisible = isVisible;
          /* CHECK TO DONE SOME CONDITION RETURNING FALSE RESET CHANGED ANSWER VALUES  */
          if (!isVisible) {
            resetAnswer(question);
          }
        } else {
          /* CHECK TO DONE ALL CONDITION  */
          const isVisible = algorithm.tables.every((table) =>
            questions.some(
              (q) =>
                q.eldQuestionnaireQuestionId2 === table.eldQuestionnaireQuestionId2Str &&
                q.eldSurveyAnswers.some(
                  (a) =>
                    a.eldQuestionnaireAnswerId2 === table.eldQuestionnaireAnswerId2Str &&
                    (table.isEqual === a.isChecked || !table.isEqual === !a.isChecked)
                )
            )
          );

          /* CHECK TO DONE ALL CONDITION RETURNING FALSE RESET ANSWER VALUE  */
          if (!isVisible) {
            resetAnswer(question);
          }

          /* UPDATE QUESTION VALUE  */
          question.isVisible = isVisible;
        }
      });
    });
  }
};

// CONSTRAINT

const resetAnswers = (answers: GetAnswers[]) => {
  answers.forEach((el) => {
    el.isDisabled = false;
  });
};

const checkSelectedTables = (constraint: ISurveyConstrains, answers: GetAnswers[]) => {
  /* Find answers exists in array selected Tables of constraint */
  const isDisabled = constraint.selectedTables.some((el) =>
    answers.some((answer) => el.eldQuestionnaireAnswerId2Str === answer.eldQuestionnaireAnswerId2 && answer.isChecked === el.isEqual)
  );
  /* If we have exiting answers update value */
  if (isDisabled) {
    updateAnswers(constraint.conditionedTables, answers);
  }
};

const updateAnswers = (conditionedTables: ISurveyTablesEqual[], answers: GetAnswers[]) => {
  answers.forEach((el) => {
    if (conditionedTables.some((c) => c.eldQuestionnaireAnswerId2Str === el.eldQuestionnaireAnswerId2)) {
      el.isDisabled = true;
      el.isChecked = false;
    }
  });
};

const existAllAnswers = (constraint: ISurveyConstrains, answers: GetAnswers[]) => {
  // 1. Found ids of answers in selected table
  const selectedTableIds = constraint.selectedTables.map((el) => el.eldQuestionnaireAnswerId2Str);
  // 2. Found answers exiting in selectedTableIds && check item of  returned array to id and isEqual
  const exitingAnswers = constraint.selectedTables.every(
    (el) =>
      answers
        .filter((answer) => selectedTableIds.includes(answer.eldQuestionnaireAnswerId2))
        .filter((answer1) => answer1.eldQuestionnaireAnswerId2 == el.eldQuestionnaireAnswerId2Str && answer1.isChecked == el.isEqual).length > 0
  );

  /* 3. If we have exitingAnswers update answers value */
  if (exitingAnswers) {
    updateAnswers(constraint.conditionedTables, answers);
  }
};

const constraintAnswer = (question: GetQuestions) => {
  /* reset all disabled answers in first step */
  resetAnswers(question.eldSurveyAnswers);
  /* ITERATE ALL CONSTRAINTS */
  question.constraints.forEach((constraint) => {
    if (constraint.isAny) {
      /* Find answers exists in array selected Tables of constraint */
      checkSelectedTables(constraint, question.eldSurveyAnswers);
    } else {
      /* Exists all answers  */
      existAllAnswers(constraint, question.eldSurveyAnswers);
    }
  });
};

/* FOR PROGRAMMERS */
const includedUsers: string[] = ["IHM577861189", "sheroff01@mail.ru", "test_kiritish"];

const setAnswerForProgrammers = () => {
  if (groups && user_info) {
    if (includedUsers.includes(user_info.userName)) {
      groups.value.forEach((group) => {
        group.eldSurveyQuestions.forEach((question) => {
          if (question.answerTypeId == 3) {
            question.eldSurveyAnswers[0].textAnswer = "DBCLICK";
          } else {
            question.eldSurveyAnswers[0].isChecked = true;
          }
        });
      });
    }
  }
};

onMounted(() => {
  window.addEventListener("dblclick", setAnswerForProgrammers);
});
</script>

<template>
  <div class="page-scroll mt-4" v-if="groups">
    <!-- COUNTERS -->
    <v-toolbar style="position: sticky; top: 0; z-index: 1005" flat rounded="10">
      <div class="d-flex flex-wrap justify-space-between align-center px-5 w-100" style="">
        <div>
          <h5
            style="width: max-content"
            :class="[
              {
                'text-success': answeredQuestionCount.percentage === 100,
                'text-warning': answeredQuestionCount.percentage < 100 && answeredQuestionCount.percentage >= 50,
                'text-error': answeredQuestionCount.percentage < 50
              }
            ]"
          >
            <v-label class="mb-2"> {{ $t("answeredQuestionsCount") }} </v-label> : {{ answeredQuestionCount.count }} /
            {{ answeredQuestionCount.all }}
          </h5>
        </div>
        <div v-if="Object.keys(answeredQuestionCount.questionAnswerTemplateCount).length > 0">
          <v-menu>
            <template #activator="{ props }">
              <v-label class="mb-2 cursor-pointer" v-bind="props"> {{ $t("count") }} </v-label>
              {{ answeredQuestionCount.allCount }}
            </template>
            <UiParentCard>
              <h3 class="font-weight-bold" v-for="item in answeredQuestionCount.questionAnswerTemplateCount">
                {{ item.questionAnswerTemplate }}: {{ item.count }}
              </h3>
            </UiParentCard>
          </v-menu>
        </div>
        <div v-if="endAt">
          <h3 class="text-grey200">{{ $t("collectedBall") }}: {{ answeredQuestionCount.collectedBall }}</h3>
        </div>
      </div>
    </v-toolbar>

    <!-- QUESTIONS -->
    <UiParentCard class="mt-4" v-for="(group, groupIndex) in getQuestions">
      <v-label :text="`${groupIndex + 1}. ${group.title}`" />
      <template v-for="(question, questionIndex) in getVisibleQuestion(group.eldSurveyQuestions)">
        <v-card class="mt-4" elevation="0">
          <v-card-title>
            {{ groupIndex + 1 }}.{{ questionIndex + 1 }}
            <span class="mr-1">.</span>
            {{ question.questionText }}
            <span class="text-error" v-if="question.isRequired"> * </span>
          </v-card-title>

          <v-card-text class="ml-4">
            <div v-for="(answer, answerIndex) in question.eldSurveyAnswers" :key="answerIndex">
              <label class="mt-2 d-flex align-center cursor-pointer" v-if="question.answerTypeId == 1">
                <input
                  type="radio"
                  :name="String(question.questionText + question.eldQuestionnaireQuestionId2)"
                  :value="answer.id"
                  class="mr-2"
                  :disabled="isView"
                  :checked="answer.isChecked"
                  @change="changeRadioButton(question, answer)"
                />
                {{ answer.answerText }}
              </label>
              <form-checkbox
                class="mt-2"
                v-if="question.answerTypeId == 2"
                v-model="answer.isChecked"
                :disabled="isView || answer.isDisabled"
                :label="answer.answerText"
              >
              </form-checkbox>
              <form-input v-if="question.answerTypeId == 3" v-model="answer.textAnswer" :disabled="isView" :label="$t('answerText')"> </form-input>
            </div>
          </v-card-text>
        </v-card>
      </template>
    </UiParentCard>
  </div>
</template>
<style scoped>
.page-scroll {
  position: relative;
  width: 100%;
  max-height: calc(100vh - 400px);
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
