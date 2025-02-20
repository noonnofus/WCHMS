"use client";
import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import { DatePicker } from "../ui/date-picker";
import { type Participant } from "@/db/schema/participants";
import CloseIcon from "../icons/close-icon";

const genders = ["Male", "Female", "Other"];

export default function EditParticipant({
    closePopup,
    participantData,
    onParticipantUpdated,
}: {
    closePopup: () => void;
    participantData: Participant;
    onParticipantUpdated: () => void;
}) {
    const [firstName, setFirstName] = useState(participantData.firstName);
    const [lastName, setLastName] = useState(participantData.lastName);
    const [email, setEmail] = useState(participantData.email);
    const [selectedGender, setSelectedGender] = useState<string | null>(
        participantData.gender
    );
    const [dateOfBirth, setDateOfBirth] = useState<Date | null>(
        participantData.dateOfBirth
    );
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setFirstName(participantData.firstName);
        setLastName(participantData.lastName);
        setEmail(participantData.email);
        setSelectedGender(participantData.gender);
        setDateOfBirth(participantData.dateOfBirth);
    }, [participantData]);

    const handleGenderSelect = (gender: string) => {
        setSelectedGender(gender);
    };

    const handleCancel = (e: React.FormEvent) => {
        e.preventDefault();
        closePopup();
    };

    const handleEditParticipantSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`/api/participants/update`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    participantId: participantData.id,
                    firstName,
                    lastName,
                    email,
                    gender: selectedGender,
                    dateOfBirth,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update participant");
            }

            onParticipantUpdated();
            console.log("Participant updated successfully");
            closePopup();
        } catch (error) {
            console.error("Error updating participant:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 overflow-y-auto overflow-x-hidden py-8 px-6 rounded-lg bg-white items-center justify-center">
            <div className="relative w-full flex flex-row items-center justify-center">
                <div className="w-1/3 md:hidden border-b-2 border-black"></div>
                <button onClick={handleCancel}>
                    <CloseIcon className="absolute -top-3 right-0" />
                </button>
            </div>
            <h1 className="font-semibold text-3xl md:text-4xl text-center mt-4">
                Edit Participant
            </h1>
            <form
                className="flex flex-col gap-4 md:gap-6 w-full h-full md:text-2xl"
                method="POST"
                onSubmit={handleEditParticipantSubmit}
            >
                <div className="flex flex-row gap-2 w-full">
                    <div className="flex flex-col flex-1 gap-2">
                        <label htmlFor="firstName">First Name</label>

                        <Input
                            id="firstName"
                            type="text"
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col flex-1 gap-2">
                        <label htmlFor="lastName">Last Name</label>

                        <Input
                            id="lastName"
                            type="text"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex flex-row gap-2 w-full">
                    <div className="flex flex-col flex-1 gap-2">
                        <label htmlFor="email">Email</label>

                        <Input
                            id="email"
                            type="email"
                            placeholder="Email"
                            value={email ?? ""}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col flex-1 gap-2">
                        <label htmlFor="courseCategory">Gender</label>

                        <Select
                            value={selectedGender ?? ""}
                            onValueChange={handleGenderSelect}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Gender" />
                            </SelectTrigger>
                            <SelectContent>
                                {genders.map((gender, index) => (
                                    <SelectItem
                                        key={index}
                                        value={gender}
                                        className="capitalize"
                                    >
                                        {gender}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="flex flex-col flex-1 gap-2">
                    <label htmlFor="dateOfBirth">Date of Birth</label>

                    <DatePicker
                        selected={dateOfBirth}
                        onChange={(date) => setDateOfBirth(date ?? null)}
                    />
                </div>
                <div className="w-full flex flex-row gap-2 mt-4">
                    <Button
                        type="submit"
                        className="w-full h-full rounded-full bg-primary-green hover:bg-[#045B47] font-semibold md:text-xl py-2 md:py-4"
                    >
                        {loading ? "Updating..." : "Update"}
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full h-full rounded-full bg-transparent border-primary-green text-primary-green hover:bg-primary-green hover:text-white font-semibold md:text-xl py-2 md:py-4"
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
}
