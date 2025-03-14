"use client";
import CourseCard from "@/components/courses/course-card";
import TabsMenu from "@/components/shared/tabs-menu";
import { courseList, getAvailableCourses } from "@/db/queries/courses";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getSignedUrlFromFileKey } from "@/lib/s3";
export type CourseListWithImage = courseList & {
    imageUrl: string | null;
};

export default function Courses() {
    const [isLoading, setIsLoading] = useState(true);
    const [courses, setCourses] = useState<{
        enrolled: CourseListWithImage[];
        unenrolled: CourseListWithImage[];
    }>({
        enrolled: [] as CourseListWithImage[],
        unenrolled: [] as CourseListWithImage[],
    });
    const { data: session } = useSession();
    const participantId = session?.user.id;
    useEffect(() => {
        if (!participantId || status === "loading") return;
        const fetchCourses = async () => {
            try {
                const availableCourses = await getAvailableCourses();
                const enrolledCourses = await Promise.all(
                    availableCourses.enrolled.map(async (course) => {
                        const imageUrl =
                            course.fileKey !== null
                                ? await getSignedUrlFromFileKey(course.fileKey)
                                : null;
                        return { ...course, imageUrl };
                    })
                );
                const unenrolledCourses = await Promise.all(
                    availableCourses.unenrolled.map(async (course) => {
                        const imageUrl =
                            course.fileKey !== null
                                ? await getSignedUrlFromFileKey(course.fileKey)
                                : null;
                        return { ...course, imageUrl };
                    })
                );
                setCourses({
                    enrolled: enrolledCourses,
                    unenrolled: unenrolledCourses,
                });
            } catch (error) {
                console.error("Error fetching courses", error);
                setCourses({
                    enrolled: [] as CourseListWithImage[],
                    unenrolled: [] as CourseListWithImage[],
                });
            } finally {
                setIsLoading(false);
            }
        };
        fetchCourses();
    }, [participantId]);
    return (
        <div className="">
            <TabsMenu
                leftLabel="My Courses"
                rightLabel="All Courses"
                leftChildren={
                    <>
                        {isLoading ? (
                            <div className="flex justify-center items-center py-10">
                                <p>Loading Course Details...</p>
                            </div>
                        ) : courses.enrolled.length === 0 ? (
                            <div className="flex flex-col justify-center items-center py-10">
                                <p className="text-center text-xl font-semibold mb-4">
                                    No courses enrolled in yet.
                                </p>
                                <p className="text-center text-xl mb-4">
                                    Browse all courses to get started.
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {courses.enrolled.map((course) => (
                                    <CourseCard
                                        course={course}
                                        key={course.id}
                                        variant="client"
                                        enrolled={true}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                }
                rightChildren={
                    <>
                        {isLoading ? (
                            <div className="flex justify-center items-center py-10">
                                <p>Loading Course Materials...</p>
                            </div>
                        ) : courses.unenrolled.length === 0 ? (
                            <div className="flex flex-col justify-center items-center py-10">
                                <p className="text-center text-xl font-semibold mb-4">
                                    No courses available.
                                </p>
                                <p className="text-center text-xl mb-4">
                                    Please refresh the page or check back at a
                                    later date.
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {courses.unenrolled.map((course) => (
                                    <CourseCard
                                        course={course}
                                        key={course.id}
                                        variant="client"
                                        enrolled={false}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                }
            />
        </div>
    );
}
