"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    fetchCourseImage,
    getUploadId,
    createCourseJoinRequest,
    checkCourseJoinRequestExists,
    deleteCourseJoinRequest,
} from "@/db/queries/courses";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";

interface CourseDetailsProps {
    name: string;
    description: string;
    variant: "client" | "admin";
    enrolled?: boolean;
    editAction?: () => void;
}

export default function CourseDetailsCard(props: CourseDetailsProps) {
    const id = useParams().id;
    const courseId = Array.isArray(id) ? id[0] : id || "";
    const [imageUrl, setImageUrl] = useState<string>("/course-image.png");
    const { data: session } = useSession();
    const participantId = session?.user.id;
    const [isEnrolling, setIsEnrolling] = useState(false);
    const [error, setError] = useState("");
    const [requestExists, setRequestExists] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);

    const fetchData = async () => {
        try {
            const uploadId = await getUploadId(parseInt(courseId, 10));
            if (uploadId) {
                const fetchedImage = await fetchCourseImage(uploadId);
                setImageUrl(fetchedImage || "/course-image.png");
            }

            if (participantId) {
                const exists = await checkCourseJoinRequestExists(
                    parseInt(id as string),
                    parseInt(participantId)
                );
                setRequestExists(exists);
            }
        } catch (error) {
            console.error(
                "Error fetching course image or request status",
                error
            );
            setImageUrl("/course-image.png");
        }
    };

    useEffect(() => {
        fetchData();
    }, [courseId, id, participantId]);

    const handleEnrollClick = async () => {
        if (!participantId) return;
        setIsEnrolling(true);

        try {
            if (requestExists) {
                setError("Enrollment request already exists.");
                setIsEnrolling(false);
                return;
            }

            await createCourseJoinRequest(
                parseInt(courseId),
                parseInt(participantId)
            );
            console.log("Join request successfully sent");
            await fetchData();
        } catch (error) {
            console.error("Error enrolling in course:", error);
            setError("Something went wrong. Please try again later.");
        } finally {
            setIsEnrolling(false);
        }
    };

    const handleRemoveClick = async () => {
        if (!participantId) return;
        setIsRemoving(true);
        setError("");
        try {
            await deleteCourseJoinRequest(
                parseInt(courseId),
                parseInt(participantId)
            );
            console.log("Join request successfully deleted");
            setRequestExists(false);
        } catch (error) {
            console.error("Error removing request:", error);
            setError("Something went wrong. Please try again later.");
        } finally {
            setIsRemoving(false);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <Card className="flex flex-col gap-4">
                <CardHeader>
                    <CardTitle>{props.name}</CardTitle>
                </CardHeader>
                <Image
                    src={imageUrl}
                    width={200}
                    height={200}
                    alt={`${props.name} course image`}
                    className="rounded-lg"
                />
                {props.variant === "client" && props.enrolled ? (
                    <Button className="bg-primary-green text-white rounded-full w-full font-semibold text-base hover:bg-[#045B47]">
                        Join Session
                    </Button>
                ) : requestExists ? (
                    <Button
                        variant="outline"
                        className="w-full font-semibold text-base rounded-full px-4 py-2 h-9 border-destructive-hover text-destructive-text hover:bg-destructive-hover hover:text-destructive-text"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveClick();
                        }}
                        disabled={isRemoving}
                    >
                        {isRemoving
                            ? "Removing..."
                            : "Remove Request to Join Course"}
                    </Button>
                ) : (
                    <Button
                        className="bg-primary-green hover:bg-[#045B47] text-white rounded-full w-full font-semibold text-base"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEnrollClick();
                        }}
                        disabled={isEnrolling}
                    >
                        {isEnrolling ? "Enrolling..." : "Enroll"}
                    </Button>
                )}

                {props.variant == "admin" && (
                    <>
                        <div className="flex flex-col gap-2 md:gap-4 w-full">
                            <Button className="bg-primary-green text-white rounded-full w-full font-semibold text-base hover:bg-[#045B47]">
                                Launch Zoom
                            </Button>
                            <Button
                                onClick={props.editAction}
                                variant="outline"
                                className="border-primary-green text-primary-green rounded-full w-full font-semibold text-base hover:bg-primary-green hover:text-white"
                            >
                                Edit Course Details
                            </Button>
                        </div>
                    </>
                )}
                <CardContent>
                    <p>{props.description}</p>
                </CardContent>
            </Card>
        </div>
    );
}
