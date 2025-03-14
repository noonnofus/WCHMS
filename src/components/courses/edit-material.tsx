"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Input } from "../ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { CourseMaterialsWithFile } from "@/db/schema/courseMaterials";
import { CourseFull } from "@/db/schema/course";
import CourseMaterialUpload from "../ui/course-material-upload";

const activities = ["Simple Arithmetic", "Reading Aloud", "Physical Exercise"];
const difficulties = ["Basic", "Intermediate"];

export default function EditMaterial({
    handleClosePopup,
    material,
    setSelectedCourse,
}: {
    handleClosePopup: () => void;
    material: CourseMaterialsWithFile;
    setSelectedCourse: Dispatch<SetStateAction<CourseFull | undefined>>;
}) {
    const [title, setTitle] = useState<string>(material.title);
    const [selectedActivity, setSelectedActivity] = useState<string>(
        material.type
    );
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>(
        material.difficulty
    );
    const [description, setDescription] = useState<string>(
        material.description || ""
    );
    const [url, setUrl] = useState<string>(material.url || "");
    const [file, setFile] = useState<File | null>(null);

    const handleActivitySelect = (activity: string) => {
        setSelectedActivity(activity);
    };

    const handleDifficultySelect = (difficulty: string) => {
        setSelectedDifficulty(difficulty);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const data = {
            id: material.id,
            title,
            exerciseType: selectedActivity,
            difficulty: selectedDifficulty,
            description,
            uploadId: material.uploadId,
            courseId: material.courseId,
            fileKey: material?.file?.fileKey,
            file,
        };
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value instanceof File) {
                formData.append(key, value);
            } else if (value !== null && value !== undefined) {
                formData.append(key, value.toString());
            }
        });
        const response = await fetch(`/api/courses/materials/update/`, {
            method: "PUT",
            body: formData,
        });

        if (response.ok) {
            const responseData = await response.json();
            console.log("Material updated successfully");
            const updatedMaterial: CourseMaterialsWithFile = responseData.data;
            setSelectedCourse((prevSelectedCourse: CourseFull | undefined) => {
                if (prevSelectedCourse) {
                    return {
                        ...prevSelectedCourse,
                        materials: prevSelectedCourse.materials
                            ? prevSelectedCourse.materials.map((material) =>
                                  material.id === updatedMaterial.id
                                      ? { ...material, ...updatedMaterial }
                                      : material
                              )
                            : [],
                    } as CourseFull;
                } else {
                    return undefined;
                }
            });
            handleClosePopup();
        } else {
            console.error("Failed to update material");
        }
    };

    return (
        <div className="flex flex-col gap-12 w-full h-full py-8 px-6 rounded-lg bg-white items-center justify-center">
            <h1 className="font-semibold text-3xl md:text-4xl text-center">
                Edit Course Material
            </h1>
            <form
                className="flex flex-col gap-4 md:gap-6 w-full h-full md:text-2xl"
                onSubmit={handleSubmit}
            >
                <div className="flex flex-col flex-1 gap-2">
                    <label htmlFor="title">Title</label>
                    <Input
                        id="title"
                        type="text"
                        placeholder="ex. Week 1: In-class math activity"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="flex flex-col md:flex-row gap-2 items-center w-full">
                    <div className="flex flex-col flex-1 w-full">
                        <label htmlFor="exerciseType">Exercise Type</label>
                        <Select onValueChange={handleActivitySelect}>
                            <SelectTrigger>
                                <SelectValue placeholder={selectedActivity} />
                            </SelectTrigger>
                            <SelectContent>
                                {activities.map((activity) => (
                                    <SelectItem key={activity} value={activity}>
                                        {activity}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col flex-1 w-full">
                        <label htmlFor="exerciseDifficulty">
                            Exercise Difficulty
                        </label>
                        <Select onValueChange={handleDifficultySelect}>
                            <SelectTrigger>
                                <SelectValue placeholder={selectedDifficulty} />
                            </SelectTrigger>
                            <SelectContent>
                                {difficulties.map((difficulty) => (
                                    <SelectItem
                                        key={difficulty}
                                        value={difficulty}
                                    >
                                        {difficulty}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="flex flex-col flex-1 gap-2">
                    {material && (
                        <CourseMaterialUpload
                            fileUrl={material.url}
                            onFileSelect={setFile}
                            courseMaterial={material}
                        />
                    )}
                </div>
                {selectedActivity === "Physical Exercise" && (
                    <div className="flex flex-col flex-1 gap-2">
                        <label htmlFor="url">Video URL</label>
                        <Input
                            id="url"
                            value={url}
                            type="url"
                            placeholder="ex. https://www.example.com"
                            onChange={(e) => setUrl(e.target.value)}
                        />
                    </div>
                )}
                <div className="flex flex-col flex-1 gap-2">
                    <label htmlFor="ExerciseInstructions">
                        Exercise Instructions
                    </label>
                    <Textarea
                        id="ExerciseInstructions"
                        placeholder="Exercise Instructions (Optional)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div className="w-full flex flex-row gap-2 mt-4">
                    <Button className="w-full h-full rounded-full bg-primary-green hover:bg-[#045B47] font-semibold md:text-xl py-2 md:py-4">
                        Save
                    </Button>
                    <Button
                        onClick={handleClosePopup}
                        variant="outline"
                        className="w-full h-full rounded-full bg-transparent border-primary-green text-primary-green hover:bg-primary-green hover:text-white font-semibold md:text-xl py-2 md:py-4"
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
}
