"use client";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import TabsMenu from "@/components/shared/tabs-menu";
import CourseDetailsCard from "@/components/courses/course-details-card";
import MaterialCard from "@/components/shared/material-card";
import { useEffect, useState } from "react";
import { getCourseById } from "@/db/queries/courses";
import { CourseFull } from "@/db/schema/course";
import ParticipantList from "@/components/courses/participant-list";

export default function Home() {
    const { id } = useParams();
    const { data: session } = useSession();
    const participantId = session?.user.id;
    console.log(participantId);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState<
        CourseFull | undefined
    >(undefined);
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const course = await getCourseById(
                    parseInt(id as string),
                    true,
                    true
                );
                console.log(course?.participants);
                if (course) {
                    setSelectedCourse(course);
                }
            } catch (error) {
                console.error("Error fetching courses", error);
                setSelectedCourse(undefined);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCourses();
    }, [id]);
    if (!selectedCourse) {
        return <div>No course found</div>;
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!selectedCourse) {
        return <div>No course found</div>;
    }

    if (!participantId) return;

    const isParticipant = session.user.role === "Participant";

    if (!isParticipant) {
        return <div>Please register to view courses</div>;
    }

    const isEnrolled = selectedCourse.participants?.some(
        (participant) => participant.id === parseInt(participantId)
    );

    return (
        <div>
            <TabsMenu
                leftLabel="Course Home"
                rightLabel="Course Materials"
                leftChildren={
                    <>
                        {isLoading ? (
                            <div className="flex justify-center items-center py-10">
                                <p>Loading Course Details...</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                <CourseDetailsCard // TODO: Pass Zoom link
                                    name={selectedCourse.title}
                                    description={
                                        selectedCourse?.description || ""
                                    }
                                    variant="client"
                                    enrolled={isEnrolled}
                                />
                                {isParticipant && isEnrolled && (
                                    <ParticipantList
                                        participants={
                                            selectedCourse.participants || []
                                        }
                                    />
                                )}
                            </div>
                        )}
                    </>
                }
                rightChildren={
                    <>
                        {isParticipant && isEnrolled ? (
                            isLoading ? (
                                <div className="flex justify-center items-center py-10">
                                    <p>Loading Course Materials...</p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    {selectedCourse.materials?.length > 0 ? (
                                        selectedCourse.materials.map(
                                            (material) => (
                                                <MaterialCard
                                                    key={`${material.title}-${material.createdAt}`}
                                                    material={material}
                                                />
                                            )
                                        )
                                    ) : (
                                        <div className="flex flex-col gap-4 text-center py-10">
                                            <p className="text-center text-xl md:text-2xl font-semibold">
                                                No course materials available.
                                            </p>
                                            <p className="text-xl">
                                                Try AI self-study for more
                                                resources!
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )
                        ) : (
                            <div>
                                You must be enrolled to view course materials
                            </div>
                        )}
                    </>
                }
            />
        </div>
    );
}
