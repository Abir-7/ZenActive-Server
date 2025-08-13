import axios from "axios";

const REVENUECAT_API_URL = "https://api.revenuecat.com/v1";
const API_KEY = process.env.REVENUECAT_API_KEY!;

export const getSubscriber = async (appUserId: string) => {
  const res = await axios.get(
    `${REVENUECAT_API_URL}/subscribers/${appUserId}`,
    {
      headers: { Authorization: `Bearer ${API_KEY}` },
    }
  );
  return res.data;
};
