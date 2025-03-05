"use client";

import { useEffect } from "react";
import { useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import ArithemeticCard from "@/components/homework/arithemetic-card";
import ReadingCard from "@/components/homework/reading-card";
import PhysicalCard from "@/components/homework/physical-card";
import { redirect } from 'next/navigation'

interface Recommendation {
    topic: string;
}

interface MathQuestions {
    question: string;
    answer: string;
}

// video URL for physical activity to test it.
const url = "https://www.youtube.com/watch?v=0xfDmrcI7OI";

export default function ActivityPage() {
    const [correctCount, setCorrectCount] = useState(0);
    const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null);
    const [mathQuestions, setMathQuestions] = useState<MathQuestions[] | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [loading, setLoading] = useState(false);

    const pathname = usePathname();
    const searchParams = useSearchParams();

    const activity = pathname.split("/").pop();
    const difficulty = searchParams.get("difficulty");

    if (!activity || !difficulty) {
        redirect('/homework');
    }

    const generateMockQuestions = () => {
        return Array.from({ length: 15 }, () => {
            const num1 = Math.floor(Math.random() * 50) + 1;
            const num2 = Math.floor(Math.random() * 50) + 1;
            return {
                question: `${num1} + ${num2}`,
                answer: (num1 + num2).toString(),
            };
        });
    };

    const getMathQuestions = async () => {
        if (activity === "arithemetic") {
            const res = await fetch("/api/homework/arithmetics", {
                method: 'POST',
                body: JSON.stringify({
                    level: difficulty,
                }),
                headers: new Headers({
                    'Content-Type': 'application/json; charset=UTF-8'
                })
            })
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }

            let result;

            try {
                const data = await res.json();
                return await JSON.parse(data.result);
            } catch (e) {
                console.error(e);
                result = null;
            }
        } else {
            return;
        }
    }

    const handleNext = () => {
        if (mathQuestions && currentQuestion < mathQuestions.length - 1) {
            setCurrentQuestion((prev) => prev + 1);
        }
    };

    useEffect(() => {
        const fetchQuestions = async () => {
            setLoading(true);
            const data = await getMathQuestions();
            if (data) {
                setMathQuestions(data.questions);
            }
            setLoading(false);
        };

        fetchQuestions();
    }, [activity, difficulty]);

    useEffect(() => {
        const generateTopic = async () => {
            if (activity === "reading") {
                const res = await fetch(`/api/homework/reading?level=${encodeURIComponent(difficulty)}`, {
                    method: 'GET',
                    headers: new Headers({
                        'Content-Type': 'application/json; charset=UTF-8'
                    })
                })
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }

                const data = await res.json();

                const topics = JSON.parse(data.result).topics.map((t: string) => t);

                setRecommendations(topics);
            } else {
                return;
            }
        }

        generateTopic()
    }, [activity, difficulty])

    const activityComponents: Record<string, React.ReactNode> = {
        arithemetic: (
            <ArithemeticCard
                question={mathQuestions ? mathQuestions[currentQuestion].question : null}
                answer={mathQuestions ? mathQuestions[currentQuestion].answer : null}
                currentIndex={currentQuestion}
                totalQuestions={mathQuestions ? mathQuestions.length : 15}
                correctCount={correctCount}
                setCorrectCount={setCorrectCount}
                onNext={handleNext}
            />
        ),
        reading: <ReadingCard difficulty={difficulty} topicRecommendations={recommendations} />,
        physical: <PhysicalCard videoUrl={url} />,
    };

    return activityComponents[activity] || <p className="text-center">Invalid activity</p>;
}