"use client";

import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { User, Search } from "lucide-react";
import { useEffect, useState } from "react";
import "../types";
import { CardInterface } from "../types";

export default function Home() {
    const [cardImg, setCardImg] = useState("");
    const [queriedCards, setQueriedCards] = useState<CardInterface[]>([]);
    const [userCards, setUserCards] = useState<CardInterface[]>([]);

    useEffect(() => {
        getCards();
    }, []);

    const getCards = async () => {
        try {
            let response = await fetch("http://127.0.0.1:8000/getCard");

            if (response.ok) {
                let data = await response.json();
                setUserCards(data.cards);
            }
        } catch (error) {}
    };

    const searchDB = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            let response = await fetch("http://127.0.0.1:8000/search", {
                method: "POST",
                headers: {
                    Accept: "application/json", // receiving items in json format
                    "Content-Type": "application/json", // sending items in json format
                },
                body: JSON.stringify({
                    query: event.currentTarget.value,
                }),
            });

            if (response.ok) {
                let data = await response.json();
                console.log(data.cards);
                setQueriedCards(data.cards);
            } else {
                throw new Error();
            }
        } catch (error) {
            setQueriedCards([]);
        }
    };

    const addCardToDB = async (card: CardInterface) => {
        try {
            console.log(card);
            let response = await fetch("http://127.0.0.1:8000/add", {
                method: "POST",
                headers: {
                    Accept: "application/json", // receiving items in json format
                    "Content-Type": "application/json", // sending items in json format
                },
                body: JSON.stringify({
                    cardValue: card,
                }),
            });

            if (response.ok) {
                let data = response.json();
                console.log(data);
            }
        } catch (error) {}
    };

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
                                <span className="text-[#8B85CB]">poké</span>dash
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

                <div className="flex gap-5 items-center">
                    <div className="flex items-center gap-3">
                        <span className="rounded-full w-3 h-3 bg-green-400"></span>

                        <div>Guest Mode (currently active)</div>
                    </div>

                    <Button>
                        <User /> Login
                    </Button>
                </div>
            </div>

            <Separator />

            <div className="bg-[#fff] h-dvh flex flex-1">
                <section className="flex-auto">
                    <h3>Your Cards</h3>

                    <div className="flex justify-between mb-5">
                        <Select defaultValue="all">
                            <SelectTrigger className="w-[150px] bg-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All cards</SelectItem>
                            </SelectContent>
                        </Select>

                        <Dialog>
                            <DialogTrigger asChild>
                                <Button>
                                    <Search /> Add cards
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-white">
                                <DialogHeader>
                                    <DialogTitle>Add New Card</DialogTitle>
                                    <DialogDescription>
                                        Search for Pokémon cards to add to your
                                        collection.
                                        <br></br>
                                        Note: may take a while because of the
                                        sheer amount of cards
                                    </DialogDescription>
                                </DialogHeader>

                                <div>
                                    <div className="flex gap-2 mb-4">
                                        <Input
                                            placeholder="Search cards..."
                                            onChange={searchDB}
                                        />
                                    </div>

                                    <ScrollArea className="h-[250px] border p-4 rounded-md">
                                        <div className="grid grid-cols-2 place-items-center gap-1">
                                            {queriedCards.length > 0 ? (
                                                queriedCards.map((card) => (
                                                    <div
                                                        key={card.id}
                                                        className="mb-5"
                                                    >
                                                        <img
                                                            src={card.image}
                                                            alt={card.id}
                                                            className="mb-2"
                                                        />
                                                        <Button
                                                            onClick={() =>
                                                                addCardToDB(
                                                                    card
                                                                )
                                                            }
                                                        >
                                                            Add to Collection
                                                        </Button>
                                                    </div>
                                                ))
                                            ) : (
                                                <div>No cards searched</div>
                                            )}
                                        </div>
                                    </ScrollArea>
                                </div>

                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button type="submit">Done</Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <ScrollArea className="h-[350px] border p-4 rounded-md">
                        {userCards.length > 0 ? (
                            userCards.map((card) => (
                                <img
                                    src={card.name} // FIX THIS!!!!! also delete the test cases from db
                                    alt={card.id}
                                    className="mb-2 h-30 w-20"
                                />
                            ))
                        ) : (
                            <div className="text-center">
                                Add cards to see them appear here
                            </div>
                        )}
                    </ScrollArea>
                </section>

                <Separator orientation="vertical" />

                <div className="flex flex-col flex-auto">
                    <div className="flex">
                        <section className="flex-auto">
                            <h3>Wishlist</h3>

                            <ScrollArea className="h-[200px] border p-4 rounded-md">
                                {cardImg ? (
                                    <img
                                        src={cardImg}
                                        className="w-40 h-auto"
                                    />
                                ) : (
                                    <div className="text-center">
                                        Add cards to see them appear here
                                    </div>
                                )}
                            </ScrollArea>
                        </section>

                        <Separator orientation="vertical" />

                        <section className="flex-auto">
                            <h3>Recommended</h3>
                            <ScrollArea className="h-[200px] border p-4 rounded-md">
                                {userCards.length > 0 ? (
                                    <img
                                        src={cardImg}
                                        className="w-40 h-auto"
                                    />
                                ) : (
                                    <div className="text-center">
                                        No cards recommended!
                                        <br></br>
                                        Add cards to your collection to start
                                    </div>
                                )}
                            </ScrollArea>
                        </section>
                    </div>

                    <Separator />

                    <section className="">
                        <h3>Portfolio Value</h3>
                    </section>
                </div>
            </div>
        </main>
    );
}
