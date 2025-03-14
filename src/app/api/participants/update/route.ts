import db from "@/db";
import { eq } from "drizzle-orm";
import { participants } from "@/db/schema/participants";
import { getServerSession } from "next-auth";
import { authConfig } from "@/auth";
import { validateAdminOrStaff } from "@/lib/validation";

export async function PUT(req: Request) {
    try {
        const {
            participantId,
            firstName,
            lastName,
            email,
            gender,
            dateOfBirth,
        } = await req.json();

        if (
            !participantId ||
            !firstName ||
            !lastName ||
            !email ||
            !gender ||
            !dateOfBirth
        ) {
            return new Response(
                JSON.stringify({ message: "Missing required fields" }),
                { status: 400 }
            );
        }

        const session = await getServerSession(authConfig);

        //Only admins/staff can update users or users themselves
        if (
            !validateAdminOrStaff(session) &&
            session?.user.id !== participantId.toString()
        ) {
            return new Response(
                JSON.stringify({
                    error: "Unauthorized: insufficient permissions",
                }),
                { status: 401 }
            );
        }

        const formattedDate = new Date(dateOfBirth);
        if (isNaN(formattedDate.getTime())) {
            return new Response(
                JSON.stringify({ message: "Invalid date format" }),
                { status: 400 }
            );
        }

        const participant = await db
            .select()
            .from(participants)
            .where(eq(participants.id, participantId));

        if (!participant || participant.length === 0) {
            return new Response(
                JSON.stringify({ error: "Participant not found" }),
                { status: 404 }
            );
        }

        await db
            .update(participants)
            .set({
                firstName,
                lastName,
                email,
                gender,
                dateOfBirth: formattedDate,
            })
            .where(eq(participants.id, participantId));

        return new Response(
            JSON.stringify({ message: "Participant updated successfully" }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error processing the request:", error);

        return new Response(
            JSON.stringify({ error: "Internal Server Error" }),
            { status: 500 }
        );
    }
}
