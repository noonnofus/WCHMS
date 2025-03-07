import { courseMaterials } from "@/db/schema/courseMaterials";
import { eq } from "drizzle-orm";
import db from "@/db";
import { getServerSession } from "next-auth";
import { authConfig } from "@/auth";
import { validateAdminOrStaff } from "@/lib/validation";

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authConfig);

        // Only admins and staff can delete course materials
        if (!validateAdminOrStaff(session)) {
            return new Response(
                JSON.stringify({
                    error: "Unauthorized: insufficient permissions",
                }),
                { status: 401 }
            );
        }
        const body = await req.json();

        // Validate that courseMaterialId is provided
        if (!body.courseMaterialId) {
            return new Response(
                JSON.stringify({ error: "Missing courseMaterialId" }),
                {
                    status: 400,
                }
            );
        }

        // Validate if course material exists
        const courseMaterial = await db
            .select()
            .from(courseMaterials)
            .where(eq(courseMaterials.id, body.courseMaterialId));
        if (!courseMaterial || courseMaterial.length === 0) {
            return new Response(
                JSON.stringify({ error: "Course material not found" }),
                {
                    status: 404,
                }
            );
        }

        // Delete the course material
        await db
            .delete(courseMaterials)
            .where(eq(courseMaterials.id, body.courseMaterialId));

        return new Response(
            JSON.stringify({ message: "Course material deleted successfully" }),
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
