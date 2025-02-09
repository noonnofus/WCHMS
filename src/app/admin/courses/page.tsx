"use client";
import AddCourse from "@/components/courses/add-course";
import { useState } from "react";

export default function Courses() {
    const [showAddPopup, setShowAddPopup] = useState(false);
    const handleAddButtonClick = () => {
        setShowAddPopup(true);
    };
    const handleClosePopup = () => {
        setShowAddPopup(false);
    };

    return (
        <div className="relative min-h-full w-full">
            {showAddPopup && (
                <div
                    className="absolute inset-0 bg-black opacity-50"
                    onClick={handleClosePopup}
                />
            )}
            <button
                className="flex h-[72px] w-[72px] bg-primary-green shadow-lg border-4 border-white rounded-full justify-center items-center"
                onClick={handleAddButtonClick}
            >
                <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M16 5.33334V26.6667M26.6667 16L5.33334 16"
                        stroke="white"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>
            {showAddPopup && (
                <div className="absolute inset-0 flex justify-center items-center z-10">
                    <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-lg p-6">
                        <AddCourse />
                    </div>
                </div>
            )}
        </div>
    );
}
