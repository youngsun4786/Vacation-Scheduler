import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { DatePickerWithRange } from "./SearchTool/Date/DatePicker";
import { Button } from "@/components/ui/button";
import { AlertCircle, FileWarning, Terminal, Loader2 } from "lucide-react";

import { useSearchValues } from "@/hooks/useSearchValues";
import { useState } from "react";

const formSchema = z.object({
  transportation: z.string(),
  hotel: z.string(),
  location: z.string(),
  budget: z.string(),
  traveller: z.string(),
  date: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

const SearchSection = () => {
  const { date, gptSuggestion, setGptSuggestion } = useSearchValues();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      transportation: "",
      hotel: "",
      location: "",
      budget: "",
      traveller: "",
      startDate: date?.from,
      endDate: date?.to,
    },
  });

  const sendData = async (data: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/gpt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        const suggestion = await response.json();
        setGptSuggestion(suggestion.GPTSuggestion);
        setLoading(false);
        return { ok: true, data: suggestion };
      } else {
        console.log(JSON.stringify(data));
      }
    } catch (error) {
      console.log(error);
      return { ok: false, error: error };
    }
    return { ok: false, error: "Something went wrong" };
  };

  function onSubmit(data: z.infer<typeof formSchema>) {
    data.startDate = date?.from;
    data.endDate = date?.to;

    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });

    sendData(data);
  }
  return (
    <div className="p-5 h-max w-auto rounded-md border shadow-md">
      <Toaster />
      <Dialog>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="h-max w-full">
            <FormField
              control={form.control}
              name="transportation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transportation</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Transportation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="publicTransit">
                            Public Transit
                          </SelectItem>
                          <SelectItem value="rent">Rent</SelectItem>
                          <SelectItem value="personalVehical">
                            Personal Vechical
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Transportation you would like to use
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hotel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hotel</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Hotel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="oneStar">One Star</SelectItem>
                          <SelectItem value="twoStar">Two Star</SelectItem>
                          <SelectItem value="threeStar">Three Star</SelectItem>
                          <SelectItem value="fourStar">Four Star</SelectItem>
                          <SelectItem value="fiveStar">Five Star</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Transportation would you like to use
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="ex. Montreal, Canada" {...field} />
                  </FormControl>
                  <FormDescription>
                    Location you would like to travel
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget</FormLabel>
                  <FormControl>
                    <Input placeholder="ex. 2000$" {...field} />
                  </FormControl>
                  <FormDescription>Budget for your trip</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="traveller"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Traveller</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Number of travellers" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="one">1</SelectItem>
                          <SelectItem value="two">2</SelectItem>
                          <SelectItem value="three">3</SelectItem>
                          <SelectItem value="four">4</SelectItem>
                          <SelectItem value="five">5</SelectItem>
                          <SelectItem value="six">6</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>How many travelers?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={() => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <DatePickerWithRange className="mt-2.5" />
                  </FormControl>
                  <FormDescription>When are you travelling?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogTrigger>
              <Button type="submit" className="mt-10 ml-56">
                Submit
              </Button>
            </DialogTrigger>
          </form>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Trip Recommendation</DialogTitle>
            </DialogHeader>
            <DialogDescription className="h-96 w-full">
              <ScrollArea className="h-full w-full whitespace-pre-line">
                {loading ? (
                  <div>
                    <Alert className="mt-28 ml-44 max-w-lg">
                      <Loader2 className="flex animate-spin justify-center items-center h-5 w-5 -ml-1"></Loader2>
                      <AlertTitle>Heads up!</AlertTitle>
                      <AlertDescription>
                        We are currently cooking your schedule for the trip!{" "}
                        <br />
                        Please be patient!
                      </AlertDescription>
                    </Alert>
                  </div>
                ) : (
                  gptSuggestion
                )}
              </ScrollArea>
            </DialogDescription>
          </DialogContent>
        </Form>
      </Dialog>
    </div>
  );
};

export default SearchSection;
