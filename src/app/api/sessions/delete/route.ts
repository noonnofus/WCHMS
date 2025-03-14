import db from "@/db";
import { eq } from "drizzle-orm";
import { Sessions } from "@/db/schema/session";
import { getServerSession } from "next-auth";
import { authConfig } from "@/auth";
import { validateAdminOrStaff } from "@/lib/validation";

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authConfig);

        //Only admins and staff can delete course sessions
        if (!validateAdminOrStaff(session)) {
            return new Response(
                JSON.stringify({
                    error: "Unauthorized: insufficient permissions",
                }),
                { status: 401 }
            );
        }
        const body = await req.json();

        if (!body.sessionId) {
            return new Response(
                JSON.stringify({ error: "Session ID is required" }),
                { status: 400 }
            );
        }

        const courseSession = await db
            .select()
            .from(Sessions)
            .where(eq(Sessions.id, body.sessionId))
            .then((res) => res[0]);

        if (!courseSession) {
            return new Response(
                JSON.stringify({ error: "Session not found" }),
                { status: 404 }
            );
        }

        await db.delete(Sessions).where(eq(Sessions.id, body.sessionId));

        return new Response(
            JSON.stringify({ message: "Session successfully deleted" }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting session:", error);
        return new Response(
            JSON.stringify({ error: "Internal Server Error" }),
            { status: 500 }
        );
    }
}
