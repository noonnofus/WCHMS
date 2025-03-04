import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EditIcon from "../icons/edit-icon";
import { CourseMaterialsWithFile } from "@/db/schema/courseMaterials";
import DeleteIcon from "../icons/delete-icon";

export default function MaterialCard({
    material,
    handleEditButtonClick,
    handleDeleteButtonClick,
}: {
    material: CourseMaterialsWithFile;
    handleEditButtonClick?: () => void;
    handleDeleteButtonClick?: () => void;
}) {
    //TODO: allow files to be downloaded
    return (
        <div className="flex flex-col items-center">
            <Card className="relative z-0">
                <CardHeader className="py-0 pt-6">
                    <CardTitle className="text-center px-6 sm:px-4 md:px-4">
                        {material.title}
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-left w-full flex flex-col gap-4">
                    {material.description && <p>{material.description}</p>}
                    {material.uploadId && material.file && (
                        <Button
                            asChild
                            className="bg-primary-green hover:bg-[#045B47] rounded-full text-white w-full font-semibold text-base min-h-[45px]"
                        >
                            <a
                                href={material.file.fileName}
                                download={material.file.fileName}
                            >
                                Download File (.
                                {material.file?.fileName.split(".").pop()})
                            </a>
                        </Button>
                    )}
                </CardContent>
                <div className="absolute right-[3%] top-[8%] flex gap-2">
                    {handleEditButtonClick && (
                        <button onClick={handleEditButtonClick}>
                            <EditIcon />
                        </button>
                    )}
                    {handleDeleteButtonClick && (
                        <button onClick={handleDeleteButtonClick}>
                            <DeleteIcon />
                        </button>
                    )}
                </div>
            </Card>
        </div>
    );
}
