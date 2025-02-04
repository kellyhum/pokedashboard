"use client";
import { Button } from "@/components/ui/button";
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
import { Search, Trash2 } from "lucide-react";

import { useEffect, useState } from "react";

import Nav from "@/components/Nav";

import "../types";
import { CardInterface } from "../types";

export default function Home() {
    const [cardImg, setCardImg] = useState(""); // sample card img
    const [queriedCards, setQueriedCards] = useState<CardInterface[]>([]);
    const [userCards, setUserCards] = useState<CardInterface[]>([]);
    const [wishlistCards, setWishlistCards] = useState<CardInterface[]>([]);

    // getcards when its run
    useEffect(() => {
        getCards();
    }, []);

    const getCards = async () => {
        try {
            let response = await fetch("http://127.0.0.1:8000/getCard");

            if (response.ok) {
                let data = await response.json();
                setUserCards(data.collection);
                setWishlistCards(data.wishlist);
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

    const addCardToDB = async (card: CardInterface, listName: string) => {
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
                    whichList: listName,
                }),
            });

            if (response.ok) {
                let data = response.json();
                console.log(data);

                getCards(); // display updated
            }
        } catch (error) {}
    };

    const removeCardFromDB = async (card: CardInterface) => {
        try {
            let response = await fetch("http://127.0.0.1:8000/remove", {
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
                console.log("deleted");

                getCards(); // display updated
            }
        } catch (error) {
            if (typeof error === "string") {
                console.log(error);
            }
        }
    };

    // for test latios card!!
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
            <Nav />

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
                                                                    card,
                                                                    "collection"
                                                                )
                                                            }
                                                        >
                                                            Add to Collection
                                                        </Button>
                                                        <Button
                                                            onClick={() =>
                                                                addCardToDB(
                                                                    card,
                                                                    "wishlist"
                                                                )
                                                            }
                                                            variant="outline"
                                                            className="mt-2"
                                                        >
                                                            Add to Wishlist
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
                        <div className="grid grid-cols-3">
                            {userCards.length > 0 ? (
                                userCards.map((card) => (
                                    <div className="max-w-25 group">
                                        <img
                                            src={card.name} // FIX THIS!!!!!
                                            alt={card.id}
                                            className="mb-2 w-40"
                                        />

                                        <Button
                                            onClick={() => {
                                                removeCardFromDB(card);
                                            }}
                                            className="absolute top-0 opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2></Trash2>
                                        </Button>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center">
                                    Add cards to see them appear here
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </section>

                <Separator orientation="vertical" />

                <div className="flex flex-col flex-auto">
                    <div className="flex flex-col">
                        <section className="flex-auto">
                            <h3>Wishlist</h3>

                            <ScrollArea className="h-[200px] border p-4 rounded-md">
                                {wishlistCards.length > 0 ? (
                                    wishlistCards.map((card) => (
                                        <div className="max-w-25 group">
                                            <img
                                                src={card.name} // FIX THIS!!
                                                alt={card.id}
                                                className="mb-2 w-40"
                                            />

                                            <Button
                                                onClick={() => {
                                                    removeCardFromDB(card); // FIX THIS!! removing from wrong schema
                                                }}
                                                className="absolute top-0 opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2></Trash2>
                                            </Button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center">
                                        Add cards to see them appear here
                                    </div>
                                )}
                            </ScrollArea>
                        </section>

                        <Separator />

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
                </div>
            </div>
        </main>
    );
}
