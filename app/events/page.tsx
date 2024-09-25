"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import Card from "../components/card";
import GetFavs from "../components/getFavs";
import EventFormData from "../interface/eventFormData";

const EventPage = () => {
  const [result, setResult] = useState<EventFormData[]>([]);
  const [favs, setFavs] = useState<EventFormData[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch(
          "https://ec2-34-229-185-121.compute-1.amazonaws.com/api/items",
          {
            method: "GET",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data: EventFormData[] = await response.json();
        console.log(data);
        setResult(data);
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching events:", err);
      }
    }

    async function fetchFavs() {
      try {
        const result = await GetFavs();
        setFavs(result);
      } catch (err: any) {
        console.error("Error fetching favorites:", err);
      }
    }

    fetchEvents();
    fetchFavs();
  }, []);

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.cardContainer}>
      {result.map((item: EventFormData, index: number) => (
        <div className={styles.category} key={index}>
          <Card
            event={item}
            favs={favs}
            events={result}
            setEvents={setResult}
            parentComponent="events"
            index={index}
          />
        </div>
      ))}
    </div>
  );
};

export default EventPage;
