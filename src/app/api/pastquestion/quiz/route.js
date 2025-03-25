import { NextResponse } from "next/server";
import CSC280 from "./csc280.json";
import GES101 from "./ges101.json";

const quizData = { csc280: CSC280, ges101: GES101 };

function shuffleArray(array) {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const subject = searchParams.get("subject");
  const numberOfQuestions = parseInt(searchParams.get("numberOfQuestions"), 10);

  console.log(subject, numberOfQuestions);

  if (!quizData[subject]) {
    return NextResponse.json({ error: "Subject not found" }, { status: 500 });
  }

  const shuffledQuizData = shuffleArray(quizData[subject].questions);
  const selectedQuestions = shuffledQuizData.slice(0, numberOfQuestions);

  return NextResponse.json({ questions: selectedQuestions }, { status: 200 });
}

export async function POST(request) {
  const {
    subject,
    totalQuestions,
    answers: userAnswers,
  } = await request.json();

  if (!quizData[subject]) {
    return NextResponse.json({ error: "Subject not found" }, { status: 404 });
  }

  const results = Object.keys(userAnswers)
    .map((qid, index) => {
      const question = quizData[subject].questions.find(
        (data) => data.id == qid
      );

      if (!question) return null;

      return {
        question_no: index + 1,
        question: question.question,
        userAnswer: userAnswers[qid],
        correctAnswer: question.correct_answer,
        isCorrect: userAnswers[qid] == question.correct_answer,
      };
    })
    .filter((result) => result !== null);

  const score = results.reduce(
    (total, result) => total + (result.isCorrect ? 1 : 0),
    0
  );

  return NextResponse.json(
    {
      results,
      score,
      answeredQuestions: Object.keys(userAnswers).length,
      totalQuestions,
    },
    { status: 200 }
  );
}
