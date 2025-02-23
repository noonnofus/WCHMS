"use client";
import AddCourse from "@/components/courses/add-course";
import AddMaterial from "@/components/courses/add-material";
import CourseDetailsCard from "@/components/courses/course-details-card";
import EditMaterial from "@/components/courses/edit-material";
import ParticipantList from "@/components/courses/participant-list";
import MaterialCard from "@/components/shared/material-card";
import TabsMenu from "@/components/shared/tabs-menu";
import { Button } from "@/components/ui/button";
import { getCourseById } from "@/db/queries/courses";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminCourses() {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState<any>({}); //TODO: update type, include materials and participant types
    const router = useRouter();
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const course = await getCourseById(parseInt(id as string));
                //TODO: update to be dynamic class materials and dynamic participants
                setSelectedCourse({
                    ...course[0],
                    materials: [
                        {
                            id: "4",
                            type: "Simple Arithmetic" as const,
                            difficulty: "Basic" as const,
                            title: "Week 4: Just a file",
                            content: null,
                            createdAt: new Date(1738859550),
                            file: "Week4.pdf",
                        },
                        {
                            id: "3",
                            type: "Physical Exercise" as const,
                            difficulty: "Basic" as const,
                            title: "Week 3",
                            content: "No review materials this week",
                            createdAt: new Date(1738859550),
                            file: null,
                        },
                        {
                            id: "2",
                            type: "Reading Aloud" as const,
                            difficulty: "Intermediate" as const,
                            title: "Week 2",
                            content:
                                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam id enim eget sem maximus accumsan. Pellentesque id varius mi, non sollicitudin orci. Donec eu condimentum justo. Donec vel sapien arcu. Quisque dapibus ligula non imperdiet malesuada.",
                            createdAt: new Date(1738859545),
                            file: "Week2.pdf",
                        },
                        {
                            id: "1",
                            type: "Reading Aloud" as const,
                            difficulty: "Intermediate" as const,
                            title: "Week 1: A really long title to see how it would look with multiple lines",
                            content: "Some description",
                            createdAt: new Date(1738859540),
                            file: "Week1.pdf",
                        },
                    ],
                    participants: [
                        {
                            id: "1",
                            firstName: "Annabelle",
                            lastName: "Chen",
                            city: "Vancouver",
                        },
                        {
                            id: "2",
                            firstName: "Kevin",
                            lastName: "So",
                            city: "Vancouver",
                        },
                        {
                            id: "3",
                            firstName: "Armaan",
                            lastName: "Brar",
                            city: "Surrey",
                        },
                        {
                            id: "4",
                            firstName: "Angus",
                            lastName: "Ng",
                            city: "Vancouver",
                        },
                    ],
                });
            } catch (error) {
                console.error("Error fetching courses", error);
                setSelectedCourse([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCourses();
    }, []);
    const [unaddedParticipants, setUnaddedParticipants] = useState<string[]>(
        []
    );
    const [showUnaddedOverlay, setShowUnaddedOverlay] = useState(false);

    useEffect(() => {
        const storedData = sessionStorage.getItem("unaddedParticipants");
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            if (Array.isArray(parsedData) && parsedData.length > 0) {
                setUnaddedParticipants(parsedData);
                setShowUnaddedOverlay(true);
                sessionStorage.setItem("unaddedParticipants", "");
            }
        }
    }, []);

    if (!selectedCourse) {
        return <div>No course found</div>;
    }

    const [showAddPopup, setShowAddPopup] = useState(false);
    const handleAddButtonClick = () => {
        setShowAddPopup(true);
    };
    const handleClosePopup = () => {
        setShowAddPopup(false);
    };
    const [showEditMaterialPopup, setShowEditMaterialPopup] = useState(false);
    const [editMaterialId, setMaterialId] = useState("");
    const handleEditButtonClick = (id: string) => {
        setMaterialId(id);
        setShowEditMaterialPopup(true);
    };
    const handleCloseEditPopup = () => {
        setMaterialId("");
        setShowEditMaterialPopup(false);
    };

    const [showEditCoursePopup, setShowEditCoursePopup] = useState(false);
    const handleEditCourseButtonClick = () => {
        setShowEditCoursePopup(true);
    };
    const handleCloseEditCoursePopup = () => {
        setShowEditCoursePopup(false);
    };

    return (
        <div className="w-full h-full">
            <TabsMenu
                tabsListClassName="z-[1]"
                leftLabel="Course Home"
                rightLabel="Course Materials"
                leftChildren={
                    <>
                        {isLoading ? (
                            <div className="flex justify-center items-center py-10">
                                <p>Loading Courses...</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                <CourseDetailsCard
                                    name={selectedCourse.title}
                                    description={selectedCourse?.description}
                                    variant="admin"
                                    editAction={handleEditCourseButtonClick}
                                />
                                <Button
                                    className="bg-primary-green text-white rounded-full w-full font-semibold text-base hover:bg-[#045B47]"
                                    onClick={() =>
                                        router.push(`/admin/session/${id}`)
                                    }
                                >
                                    All Sessions
                                </Button>
                                <ParticipantList
                                    participants={
                                        selectedCourse.participants || []
                                    }
                                />
                            </div>
                        )}
                        {showEditCoursePopup && (
                            <div className="fixed inset-0 flex items-center justify-center z-30 overflow-y-auto">
                                <div
                                    className="absolute inset-0 bg-black opacity-50"
                                    onClick={handleCloseEditCoursePopup}
                                />
                                <div className="relative z-20 flex flex-col items-center bg-white rounded-lg overflow-y-auto w-full mx-4 max-h-[90vh]">
                                    <AddCourse
                                        handleClosePopup={
                                            handleCloseEditCoursePopup
                                        }
                                        courseId={parseInt(id as string)}
                                    />
                                </div>
                            </div>
                        )}
                    </>
                }
                rightChildren={
                    <div className="w-full">
                        {isLoading ? (
                            <div className="flex justify-center items-center py-10">
                                <p>Loading Courses...</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {selectedCourse.materials?.length ? (
                                    selectedCourse.materials.map((material) => {
                                        return (
                                            <MaterialCard
                                                key={
                                                    material.title +
                                                    material.createdAt
                                                }
                                                material={material}
                                                handleEditButtonClick={() =>
                                                    handleEditButtonClick(
                                                        material.id
                                                    )
                                                }
                                            />
                                        );
                                    })
                                ) : (
                                    <p>No course materials available.</p>
                                )}
                                <button
                                    onClick={handleAddButtonClick}
                                    className="absolute bottom-24 right-2 md:bottom-24 md:right-6 flex h-[72px] w-[72px] bg-primary-green shadow-lg border-4 border-white rounded-full justify-center items-center z-[1]"
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
                                    <div className="fixed inset-0 flex items-center justify-center z-10">
                                        <div
                                            className="absolute inset-0 bg-black opacity-50 z-10"
                                            onClick={handleClosePopup}
                                        />
                                        <div className="relative z-20 flex flex-col items-center bg-white rounded-lg overflow-y-auto w-full mx-4 max-h-[90vh]">
                                            <AddMaterial
                                                handleClosePopup={
                                                    handleClosePopup
                                                }
                                            />
                                        </div>
                                    </div>
                                )}
                                {showEditMaterialPopup && (
                                    <div className="fixed inset-0 flex items-center justify-center z-10 overflow-y-auto">
                                        <div
                                            className="absolute inset-0 bg-black opacity-50 z-10"
                                            onClick={handleCloseEditPopup}
                                        />

                                        <div className="relative z-20 flex flex-col items-center bg-white rounded-lg overflow-y-auto w-full mx-4 max-h-[90vh]">
                                            <EditMaterial
                                                handleClosePopup={
                                                    handleCloseEditPopup
                                                }
                                                material={
                                                    selectedCourse?.materials.filter(
                                                        (material) =>
                                                            material.id ===
                                                            editMaterialId
                                                    )[0]
                                                }
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                }
            />
            {showUnaddedOverlay && (
                <div className="absolute z-[1] inset-0 bg-black/50 flex items-center justify-center">
                    <div className="w-full max-w-md bg-white rounded-lg shadow-2xl p-6 flex flex-col gap-6">
                        <h1 className="font-semibold text-2xl md:text-3xl text-center">
                            Participants Not Added
                        </h1>
                        <p>Invalid Participant Names:</p>
                        <ul className="list-disc list-inside text-gray-700 text-lg">
                            {unaddedParticipants.map((name, index) => (
                                <li key={index} className="py-1">
                                    {name}
                                </li>
                            ))}
                        </ul>
                        <div className="w-full flex justify-center">
                            <Button
                                onClick={() => setShowUnaddedOverlay(false)}
                                className="w-full h-full rounded-full bg-primary-green hover:bg-[#045B47] font-semibold text-xl py-3"
                            >
                                OK
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
