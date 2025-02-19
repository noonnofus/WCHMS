"use client";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import EditIcon from "../icons/edit-icon";

interface CourseCardProps {
    id: number;
    name: string;
    image?: string;
    imageAlt?: string;
}

interface ClientVariantProps extends CourseCardProps {
    variant: "client";
    enrolled: boolean;
}

interface AdminVariantProps extends CourseCardProps {
    description: string | null;
    handleEditButtonClick: (courseId: number) => void;
    variant: "admin";
}

export default function CourseCard(
    props: ClientVariantProps | AdminVariantProps
) {
    const courseLink =
        props.variant === "admin"
            ? `/admin/courses/${props.id}`
            : `/courses/${props.id}`;
    return (
        <div className="flex flex-col items-center justify-center relative">
            <Card className="w-full relative">
                <Link
                    href={courseLink}
                    className="flex flex-col gap-2 items-center w-full h-full p-4"
                >
                    <CardHeader>
                        <CardTitle
                            className={twMerge(
                                props.variant === "admin"
                                    ? "px-6 sm:px-4 md:px-4"
                                    : ""
                            )}
                        >
                            {props.name}
                        </CardTitle>
                    </CardHeader>
                    {props.image && (
                        <Image
                            src={props.image}
                            width={200}
                            height={200}
                            alt={props.imageAlt || `${props.name} Course Image`}
                        />
                    )}
                    {props.variant == "client" &&
                        (props.enrolled ? (
                            <Button
                                asChild
                                className="bg-primary-green hover:bg-[#045B47] text-white rounded-full w-full font-semibold text-base"
                            >
                                <Link href={`/courses/${props.id}`}>
                                    View Course
                                </Link>
                            </Button>
                        ) : (
                            <>
                                <Button
                                    asChild
                                    className="hover:bg-primary-green border-primary-green text-primary-green hover:text-white rounded-full w-full font-semibold text-base"
                                    variant="outline"
                                >
                                    <Link href={`/courses/${props.id}`}>
                                        Details
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    className="mt-2 bg-primary-green hover:bg-[#045B47] text-white rounded-full w-full font-semibold text-base"
                                >
                                    <Link href="#">Enroll</Link>
                                </Button>
                            </>
                        ))}
                    {props.variant == "admin" && (
                        <CardContent>
                            <p>{props.description}</p>
                        </CardContent>
                    )}
                </Link>

                {props.variant == "admin" && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            props.handleEditButtonClick(props.id);
                        }}
                        className="absolute right-5 top-4"
                    >
                        <EditIcon />
                    </button>
                )}

                {props.variant == "admin" && (
                    <Link
                        href={`/admin/courses/${props.id}`}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="50"
                            height="48"
                            viewBox="0 0 50 48"
                            fill="none"
                        >
                            <path
                                d="M19.1364 10L33.4546 24L19.1364 38"
                                stroke="black"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </Link>
                )}
            </Card>
        </div>
    );
}
