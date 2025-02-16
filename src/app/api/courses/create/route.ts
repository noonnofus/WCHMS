import db from "@/db";
import { eq } from "drizzle-orm";
import { Courses } from "@/db/schema/course";
import { rooms } from "@/db/schema/room";
//TODO: secure route for admins only
export async function POST(req: Request) {
    try {
        const body = await req.json();
        if (
            !body.courseName ||
            !body.courseDescription ||
            !body.courseStartDate ||
            !body.courseEndDate
        ) {
            return new Response(
                JSON.stringify({ error: "Missing required fields" }),
                { status: 400 }
            );
        }

        if (
            body.courseName.length > 255 ||
            body.courseDescription.length > 255
        ) {
            return new Response(
                JSON.stringify({
                    error: "Course Name/Description character limit exceeded",
                }),
                { status: 400 }
            );
        }
        const startDate = new Date(body.courseStartDate);
        const endDate = new Date(body.courseEndDate);
        if (endDate <= startDate) {
            return new Response(
                JSON.stringify({
                    error: "End date must be after the start date",
                }),
                { status: 400 }
            );
        }
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return new Response(
                JSON.stringify({
                    error: "Invalid date format",
                }),
                { status: 400 }
            );
        }

        const roomId = parseInt(body.courseRoom);
        if (!roomId || roomId === -1) {
            return new Response(
                JSON.stringify({
                    error: "Missing Room Id",
                }),
                { status: 400 }
            );
        }

        //Validate Room Exists
        const room = await db.select().from(rooms).where(eq(rooms.id, roomId));
        if (!room) {
            return new Response(
                JSON.stringify({
                    error: "Invalid Room Id",
                }),
                { status: 400 }
            );
        }
        //TODO: Handle image upload

        const courseId = await db
            .insert(Courses)
            .values({
                title: body.courseName,
                description: body.courseDescription,
                start: startDate,
                end: endDate,
                lang: body.courseLanguage,
                status: body.courseStatus,
                kind: body.courseType,
                uploadId: body.uploadId,
                roomId,
            })
            .$returningId();

        //TODO: handle course participants
        return new Response(JSON.stringify({ courseId: courseId[0].id }), {
            status: 200,
        });
    } catch (error) {
        console.error("Error processing the request:", error);

        return new Response(
            JSON.stringify({ error: "Internal Server Error" }),
            { status: 500 }
        );
    }
}
