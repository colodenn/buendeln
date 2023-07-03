"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"

const FormSchema = z.object({
    company: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    industry: z.string({
        required_error: "Please select a language.",
    })
})

const languages = [
    { label: "Healthcare", value: "en" },
    { label: "Automotive", value: "fr" },
    { label: "Trade", value: "de" },
    { label: "Service Provider", value: "es" },
    { label: "Chemie", value: "pt" },
    { label: "Electricity", value: "ru" },
    { label: "Insurance", value: "ja" },
    { label: "Food", value: "ko" },
    { label: "Engineering", value: "zh" },
] as const


export default function InputPage() {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log("test")
        toast({
            title: "You submitted the following values:",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
        })
    }
    return (
        <>
            <Input id="picture" type="file" className=" border-2 border-dashed bg-white bg-opacity-50 p-24 cursor-pointer" />
            <Separator className="my-12" />


            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className=" ">
                    <div className="flex w-full items-center justify-between">
                        <div className="w-full">

                            <FormField
                                control={form.control}
                                name="company"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Company Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Company Name" className="w-72" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            This is your public display name.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="w-full">

                            <FormField
                                control={form.control}
                                name="industry"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col ">
                                        <FormLabel>Industry</FormLabel>
                                        <Popover >
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        className={cn(
                                                            "w-72 justify-between bg-white",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value
                                                            ? languages.find(
                                                                (language) => language.value === field.value
                                                            )?.label
                                                            : "Select Industry"}
                                                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[200px] p-0">
                                                <Command>
                                                    <CommandInput
                                                        placeholder="Search industrie..."
                                                        className="h-9"
                                                    />
                                                    <CommandEmpty>No industry found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {languages.map((language) => (
                                                            <CommandItem
                                                                value={language.value}
                                                                key={language.value}
                                                                onSelect={(value) => {
                                                                    form.setValue("language", value)
                                                                }}
                                                            >
                                                                {language.label}
                                                                <CheckIcon
                                                                    className={cn(
                                                                        "ml-auto h-4 w-4",
                                                                        language.value === field.value
                                                                            ? "opacity-100"
                                                                            : "opacity-0"
                                                                    )}
                                                                />
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                        <FormDescription>
                                            This is the industy you will be assigned to.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <div className="w-full mt-12">
                        <Button className="w-full" type="submit">Submit</Button><br />
                        <Separator className="my-4 " />
                        <Link className="text-center flex justify-center  text-lg text-muted-foreground" href="#">skip</Link>

                    </div>
                </form>
            </Form>
        </>
    )
}

