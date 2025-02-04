import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";

export default function Nav() {
    return (
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
                            the dashboard for tracking your Pokemon collection
                        </p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <div className="flex gap-5 items-center">
                <div className="flex items-center gap-3">
                    <span className="rounded-full w-3 h-3 bg-green-400"></span>

                    <div>Guest Mode (currently active)</div>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button>
                            <User /> Login / Sign up
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white">
                        <DialogHeader>
                            <DialogTitle>Login or sign up</DialogTitle>
                        </DialogHeader>

                        <Tabs defaultValue="login" className="w-[400px]">
                            <TabsList>
                                <TabsTrigger value="login">Login</TabsTrigger>
                                <TabsTrigger value="signup">
                                    Sign up
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="login">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    type="text"
                                    placeholder="Enter your username"
                                    className="mb-3"
                                    id="usernameLogin"
                                />

                                <Label htmlFor="password">Password</Label>

                                <Input
                                    type="text"
                                    placeholder="Enter your password"
                                    id="passwordLogin"
                                />
                            </TabsContent>

                            <TabsContent value="signup">
                                <Label htmlFor="username">Set Username</Label>
                                <Input
                                    type="text"
                                    placeholder="Enter a username"
                                    className="mb-3"
                                    id="usernameSignup"
                                />

                                <Label htmlFor="password">Set Password</Label>

                                <Input
                                    type="text"
                                    placeholder="Enter a password"
                                    id="passwordSignup"
                                />
                            </TabsContent>
                        </Tabs>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="submit">Login</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
