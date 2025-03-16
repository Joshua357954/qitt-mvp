"use client"
import React from 'react';

// Dummy Data
const quizData = [
    {
        quizTitle: 'Quiz 1',
        scores: [
            { name: 'Player 1', points: 15 },
            { name: 'Player 2', points: 20 },
            { name: 'Player 3', points: 18 },
        ],
    },
    {
        quizTitle: 'Quiz 2',
        scores: [
            { name: 'Player 1', points: 25 },
            { name: 'Player 2', points: 18 },
            { name: 'Player 3', points: 22 },
        ],
    },
];

const ScoreBoard = ({ className, quizDatas }) => {
    return (
        <main className={`p-4 bg-gray-100 rounded-md ${className}`}>
            <h2 className="text-2xl font-bold mb-4">Score Board</h2>
            <div className="grid grid-cols-2 gap-4">
                {quizData.map((quiz, index) => (
                    <div
                        key={index}
                        className="bg-white p-4 rounded-md shadow-md flex flex-col items-center"
                    >
                        <h3 className="text-lg font-semibold mb-2">{quiz.quizTitle}</h3>
                        <div className="grid grid-cols-2 gap-2 w-full">
                            {quiz.scores.map((score, scoreIndex) => (
                                <div
                                    key={scoreIndex}
                                    className="bg-gray-200 p-2 rounded-md flex items-center justify-between"
                                >
                                    <span className="text-sm font-semibold">{score.name}</span>
                                    <span className="text-gray-600">{score.points} Points</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
};

export default ScoreBoard;
