"use client";

import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { User, Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
    const [cardImg, setCardImg] = useState("");

    const getCardImg = async () => {
        try {
            let response = await fetch("http://127.0.0.1:8000/");
            let data = await response.json();
            setCardImg(data.imgURL);
        } catch (error) {}
    };

    useEffect(() => {
        getCardImg();
    }, []);

    return (
        <main className="h-screen w-100">
            <div className="flex items-center justify-between py-3 px-10">
                <TooltipProvider delayDuration={300}>
                    <Tooltip>
                        <TooltipTrigger>
                            <h1 className="font-bold text-xl mb-0">
                                the{" "}
                                <span className="text-[#8b85cb]">pokemon</span>{" "}
                                dashboard
                            </h1>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            <p>
                                the dashboard for tracking your Pokemon
                                collection
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <div className="flex gap-3">
                    <Button>
                        <User /> Login
                    </Button>

                    <Button variant="outline">
                        <Search /> Guest Mode
                    </Button>
                </div>
            </div>

            <Separator />

            <div className="bg-[#f7f6ff] h-dvh flex flex-1">
                <section className="flex-auto">
                    <h3>Your Cards</h3>

                    <div className="flex justify-between mb-5">
                        <Select defaultValue="all">
                            <SelectTrigger className="w-[150px] bg-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All cards</SelectItem>
                                <SelectItem value="eevee">Eevees</SelectItem>
                            </SelectContent>
                        </Select>

                        <div className="flex gap-2">
                            <Input
                                className="w-[180px] bg-white"
                                type="text"
                                placeholder="Search..."
                            />

                            <Button>
                                <Search /> Search
                            </Button>
                        </div>
                    </div>

                    <div>
                        {cardImg && (
                            <img src={cardImg} className="w-40 h-auto" />
                        )}
                    </div>
                </section>

                <Separator orientation="vertical" />

                <div className="flex flex-col flex-auto">
                    <section className="flex-auto">
                        <h3>Wishlist</h3>
                    </section>

                    <Separator />

                    <section className="flex-auto">
                        <h3>Recommended</h3>
                    </section>

                    <Separator />

                    <section className="flex-auto">
                        <h3>Portfolio Value</h3>
                    </section>
                </div>
            </div>
        </main>
    );
}
