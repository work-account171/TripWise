import { Flight } from "@/lib/db/models";
import { startOfDay } from "date-fns";
// const validSearchParams = [
//   "lastAvailableFlightDate",
//   "firstAvailableFlightDate",
// ];

// Define valid search parameters
const validSearchParams = ["lastAvailableFlightDate", "firstAvailableFlightDate"];

export async function GET(req) {
  const searchParams = Object.fromEntries(new URL(req.url).searchParams);
  const data = {};

  // Check if any valid search parameters are provided
  for (const [key, value] of Object.entries(searchParams)) {
    if (!validSearchParams.includes(key)) {
      return new Response(
        JSON.stringify({ error: "Invalid search parameter" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (key === "lastAvailableFlightDate") {
      const date = (
        await Flight.find({})
          .sort({ departureDateTime: -1 })
          .limit(1)
          .select("departureDateTime")
      )[0]?.departureDateTime;

      if (date) {
        data[key] = new Date(date).toString();
      } else {
        data[key] = null; // Or handle the case where no flights are found
      }
    }

    if (key === "firstAvailableFlightDate") {
      const date = (
        await Flight.find({
          expireAt: { $gte: startOfDay(new Date()) },
        })
          .sort({ departureDateTime: 1 })
          .limit(1)
          .select("departureDateTime")
      )[0]?.departureDateTime;

      if (date) {
        data[key] = new Date(date).toString();
      } else {
        data[key] = null; // Or handle the case where no flights are found
      }
    }
  }

  // If no valid parameters were processed, return an error
  if (Object.keys(data).length === 0) {
    return new Response(
      JSON.stringify({ error: "No valid search parameters provided" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}