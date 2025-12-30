import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const DataContext = createContext();
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [carousel, setCarousel] = useState([]);
  const [events, setEvents] = useState([]);
  const [members, setMembers] = useState([]);
  const [councilmember, setCouncilmember] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);

      const [
        carouselRes,
        eventsRes,
        memberRes,
        councilmemberRes,
        galleryRes
      ] = await Promise.all([
        axios.get(`${BASE_URL}/carousel`),
        axios.get(`${BASE_URL}/events`),
        axios.get(`${BASE_URL}/member/allmember`),
        axios.get(`${BASE_URL}/councilmember`),
        axios.get(`${BASE_URL}/gallery`)
      ]);

      // Carousel images
      setCarousel(
        carouselRes?.data?.data?.map(item => item.imageUrl) || []
      );

      setEvents(eventsRes?.data?.events || []);
      setMembers(memberRes?.data?.members || []);
      setCouncilmember(councilmemberRes?.data?.data || []);
      setGallery(galleryRes?.data?.data || []);

      // console.log(eventsRes?.data?.events);
    } catch (error) {
      console.error("Data fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    carousel,
    events,
    members,
    councilmember,
    gallery,
    loading,
    refetchData: fetchAllData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
