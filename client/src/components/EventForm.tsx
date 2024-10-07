import clsx from "clsx";
import { nanoid } from "nanoid";
import { useController, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { CATEGORIES, PRIORITIES } from "../constants";
import { getRandomPicrure } from "../helpers";
import { Event } from "../interfaces";
import { Button } from "./Button";
import { Input } from "./Input";
import { Select } from "./Select";
import { Textarea } from "./Textarea";
import { useEffect } from "react";
import { useAppwrite } from "../hooks/appWrite"; // Import Appwrite config

interface EventFormProps {
  className?: string;
  event?: Event;
}

type Inputs = Omit<Event, "id" | "datetime"> & { date: string; time: string };

export function EventForm({ className, event }: EventFormProps) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { databases } = useAppwrite(); // Destructure Appwrite Databases
  const databaseId = import.meta.env.VITE_APP_APPWRITE_DATABASE;
  const collectionId = import.meta.env.VITE_APP_APPWRITE_COLLECTION;

  const {
    register,
    handleSubmit,
    resetField,
    control,
    formState: { errors },
    setValue,
  } = useForm<Inputs>({
    defaultValues: {
      title: event?.title ?? "",
      description: event?.description ?? "",
      date: event?.date ?? "",
      time: event?.time ?? "", // HH:mm
      location: event?.location ?? "",
      category: event?.category ?? CATEGORIES[0],
      picture: event?.picture ?? "",
      priority: event?.priority ?? PRIORITIES[0],
    },
  });

  const categoryController = useController({
    name: "category",
    control,
  });
  const priorityController = useController({
    name: "priority",
    control,
  });

  // Fetch the event data based on the ID
  useEffect(() => {
    const fetchEventData = async () => {
      if (id) {
        try {
          const response = await databases.getDocument(
            databaseId,
            collectionId,
            id
          );
          // Populate the form with the fetched data
          setValue("title", response.title);
          setValue("description", response.description);
          setValue("date", response.date);
          setValue("time", response.time);
          setValue("location", response.location);
          setValue("category", response.category);
          setValue("picture", response.picture);
          setValue("priority", response.priority);
        } catch (error) {
          console.error("Error fetching event data:", error);
        }
      }
    };

    fetchEventData();
  }, [id, databases, databaseId, collectionId, setValue]);

  const onSubmit = async (data: Inputs) => {
    // Use the ID from the URL or generate a new one
    const eventId = id || nanoid(); // Use URL ID or generate a new one if creating

    // Prepare event data without the "id" attribute
    const eventData = {
      title: data.title,
      description: data.description,
      date: data.date,
      time: data.time,
      location: data.location,
      category: data.category,
      picture: data.picture || getRandomPicrure(nanoid()), // Generate a new picture if not provided
      priority: data.priority,
      // Do not include 'id' here
    };

    try {
      if (id) {
        // Update existing event using its document ID
        console.log("Updating event with ID:", eventId);
        await databases.updateDocument(
          databaseId,
          collectionId,
          eventId,
          eventData // New event data
        );
        console.log("Event updated successfully");
      } else {
        // Create a new event if no ID is found
        console.log("Creating new event");
        await databases.createDocument(
          databaseId,
          collectionId,
          eventId, // Use the ID as the document ID
          eventData // New event data
        );
        console.log("Event created successfully");
      }
      navigate(`/`); // Redirect back to home or event list after the operation
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  return (
    <form
      className={clsx(
        "bg-white px-4 py-10 shadow-md md:px-6 xl:px-10",
        className
      )}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className="mb-10 grid grid-cols-1 gap-5 md:grid-flow-col md:grid-cols-2 md:grid-rows-5 md:gap-x-6 xl:mb-15 xl:grid-cols-3 xl:grid-rows-3 xl:gap-x-10">
        <Input
          className="text-black"
          label="Title"
          {...register("title", { required: true })}
          onClear={() => resetField("title", { defaultValue: "" })}
          error={errors.title ? "Title is required" : ""}
        />

        <Textarea
          className="row-span-2 text-black"
          label="Description"
          {...register("description")}
          onClear={() => resetField("description", { defaultValue: "" })}
        />

        <Input
          className="text-black"
          label="Date"
          type="date" // Use type 'date' for the date picker
          {...register("date", {
            required: true,
            onChange: (e) => {
              const selectedDate = e.target.value; // Get the selected date as a string
              setValue("date", selectedDate); // Set the value in the form state
            },
          })}
          // onClear={() => resetField("date", { defaultValue: "" })}
          error={errors.date ? "Date is required" : ""}
        />

        <Input
          id="time"
          className="text-black"
          label="Time"
          type="time" 
          {...register("time", {
            required: true,
            onChange: (e) => {
              const selectedTime = e.target.value; 
              setValue("time", selectedTime); 
            },
          })}
          // onClear={() => resetField("date", { defaultValue: "" })}
          error={errors.time ? "Time is required" : ""}
        />

        {/* <Input
          className="text-black"
          label="Time"
          {...register("time", { required: true })}
          onClear={() => resetField("time", { defaultValue: "" })}
          error={errors.time ? "Time is required" : ""}
        /> */}

        <Input
          label="Location"
          {...register("location", { required: true })}
          onClear={() => resetField("location", { defaultValue: "" })}
          error={errors.location ? "Location is required" : ""}
        />

        <Select
          className="text-black"
          label="Category"
          options={CATEGORIES}
          value={categoryController.field.value}
          onChange={categoryController.field.onChange}
        />

        <Select
          className="text-black"
          label="Priority"
          options={PRIORITIES}
          value={priorityController.field.value}
          onChange={priorityController.field.onChange}
        />
      </div>

      <Button
        className="w-full md:ml-auto md:w-auto md:min-w-[190px]"
        style={{ backgroundColor: "purple", color: "white" }}
        type="submit"
      >
        {event ? "Save" : "Add event"}
      </Button>
    </form>
  );
}
