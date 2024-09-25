"use client";
import React, { useEffect, useState } from "react";
import styles from "./card.module.css";
import EventFormData from "../interface/eventFormData";
import Heart from "./heart";
import { useRouter } from "next/navigation";

interface Props {
  event: EventFormData;
  favs: EventFormData[];
  events: EventFormData[];
  setEvents: (events: EventFormData[]) => void;
  parentComponent: string;
  index: number;
}

const Card = ({
  event,
  favs,
  events,
  setEvents,
  parentComponent,
  index,
}: Props) => {
  const [heartClicked, setHeartClicked] = useState(false);
  const router = useRouter();

  const maxNameLength = 40;
  const maxDescLength = 80;
  const maxLocationLength = 40;

  const name =
    event.name.length > maxNameLength
      ? `${event.name.slice(0, maxNameLength)}...`
      : event.name;

  const description =
    event.description.length > maxDescLength
      ? `${event.description.slice(0, maxDescLength)}...`
      : event.description;

  const location =
    event.location.length > maxLocationLength
      ? `${event.location.slice(0, maxLocationLength)}...`
      : event.location;

  // Add 20 days to the event time
  console.log(event.time);
  const time: string = new Date(
    new Date(event.time).setDate(new Date(event.time).getDate() + 60)
  ).toDateString();

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.setItem("event", JSON.stringify(event));
    router.push("/events/detail");
  };

  useEffect(() => {
    if (favs.length) {
      const eventExists = (arr: EventFormData[], id: string) =>
        arr.some((favEvent) => favEvent.eventID === id);
      setHeartClicked(eventExists(favs, event.eventID));
    }
  }, [favs, event.eventID]);

  async function handleHeartClicked() {
    const newHeartState = !heartClicked;
    setHeartClicked(newHeartState);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await fetch(
        `https://ec2-34-229-185-121.compute-1.amazonaws.com/api/${
          newHeartState ? "addfav" : "delfav"
        }/${event.eventID}`,
        {
          method: newHeartState ? "POST" : "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to update favorites");

      // Remove event from list if it's being unfavorited and we're in the watchlist
      if (!newHeartState && parentComponent === "watchList") {
        const updatedEvents = events.filter((_, idx) => idx !== index);
        setEvents(updatedEvents);
      }
    } catch (err: any) {
      console.error("Error updating favorites:", err.message);
      setHeartClicked(!newHeartState);
    }
  }

  return (
    <div className={styles.card}>
      {event.imageUrl && (
        <img
          className={styles.cardImg}
          src={event.imageUrl}
          alt={event.name}
          onClick={handleCardClick}
        />
      )}

      <div className={styles.cardBody}>
        <h5 className={styles.cardTitle}>{name}</h5>
        <p className={styles.cardText}>{description}</p>
        <p className={styles.cardText}>{time}</p>
        <p className={styles.cardText}>{location}</p>

        <div className={styles.heart}>
          <Heart
            clicked={heartClicked}
            onClick={handleHeartClicked}
            size={30}
          />
        </div>
      </div>
      {event.link && (
        <a href={event.link} className={styles.link}>
          View More
        </a>
      )}
    </div>
  );
};

export default Card;
