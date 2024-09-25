interface EventFormData {
  eventID: string;
  name: string;
  description: string;
  location: string;
  time: string;
  date: string;
  source: string;
  link?: string | null; // Optional field, allow null
  category?: string | null; // Optional field, allow null
  imageUrl?: string | null; // Optional field, allow null
}

export default EventFormData;
