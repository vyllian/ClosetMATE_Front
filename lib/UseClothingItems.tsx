import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import  ClothingItem  from '../constants/clothingItem';
import { API } from '../constants/api';
import { useAuth } from './useAuth';
import { useProfile } from '@/components/ProfileContext';

export const useClothingItems = () => {
  const { profile } = useProfile();
  const { category, title } = useLocalSearchParams();
  const { auth, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  const [clothes, setClothes] = useState<ClothingItem[]>([]);
  const [filteredClothes, setFilteredClothes] = useState<ClothingItem[]>([]);
  const [color, setColor] = useState<string[]>([]);
  const [type, setType] = useState('');
  const [favourite, setFavourite] = useState(false);
  const filtersAreActive = type !== '' || color.length > 0 || favourite;

  const fetchClothes = async (category: string) => {
    try {
      const response = await fetch(`${API}/profile/${profile.id}/items-by-category?category=${category}`, {
        method: 'GET',
        headers: {
          Authorization: `Basic ${auth}`,
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Помилка завантаження одягу:', error);
      return [];
    }
  };

  useEffect(() => {
    if (authLoading || !auth) return;

    const loadClothes = async () => {
      setLoading(true);
      const items = await fetchClothes(category ? (Array.isArray(category) ? category[0] : category) : 'all');
      const sortedItems = items.sort((a:ClothingItem, b:ClothingItem) => {
        if (a.category < b.category) return -1;
        if (a.category > b.category) return 1;
        return 0;
      });
      setClothes(sortedItems);
      setFilteredClothes(sortedItems);
      setLoading(false);
    };    
    loadClothes();
  }, [category, authLoading]);

  const handleSearch = (
    favChange: boolean = false,
    categChange: boolean = false,
    colChange: boolean = false
  ) => {
    const filtered = clothes.filter(item =>
      (!favChange || item.favourite === favourite) &&
      (!categChange || item.type === type) &&
      (!colChange || item.colors.some(c => color.includes(c)))
    );
    setFilteredClothes(filtered);
  };

  const fetchAndUpdateClothes = async () => {
    const items = await fetchClothes(Array.isArray(category) ? category[0] : category);
    const sortedItems = items.sort((a:ClothingItem, b:ClothingItem) => {
      if (a.category < b.category) return -1;
      if (a.category > b.category) return 1;
      return 0;
    });
    setClothes(sortedItems);
    setFilteredClothes(sortedItems);
  };
  
  return {
    loading,
    clothes,
    filteredClothes,
    setFilteredClothes,
    handleSearch,
    color,
    setColor,
    type,
    setType,
    favourite,
    setFavourite,
    fetchAndUpdateClothes,
    filtersAreActive,
    fetchClothes
  };
};
