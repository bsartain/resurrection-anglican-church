import { ProPresenterData } from "../models/proPresenterModel";

export async function getProPresenterData(): Promise<ProPresenterData> {
  const url = "https://church-liturgy-default-rtdb.firebaseio.com/.json";

  const res = await fetch(url, { next: { revalidate: 60 } }); // Optional: Cache/revalidate every 60 seconds
  if (!res.ok) {
    throw new Error("Failed to fetch liturgy data");
  }

  return res.json();
}
