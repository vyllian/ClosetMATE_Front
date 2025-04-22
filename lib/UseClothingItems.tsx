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
      const items = await fetchClothes(Array.isArray(category) ? category[0] : category);
      setClothes(items);
      setFilteredClothes(items);
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
    setClothes(items);
    setFilteredClothes(items);
  };
  
  const addItemToFav = async (itemId: string, onFinish?: () => void) => {
    try {
      const response = await fetch(`${API}/profile/${profile.id}/set-item-fav?item-id=${itemId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Basic ${auth}`,
        },
      });
      if (!response.ok) throw new Error('Помилка add to fav item');
    } catch (error: any) {
      console.error(error.message);
    } finally {
      await fetchAndUpdateClothes();
      onFinish?.();
    }
  };
  
  const deleteItem = async (itemId: string, onFinish?: () => void) => {
    try {
      const response = await fetch(`${API}/item/delete/${itemId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Basic ${auth}`,
        },
      });
      if (!response.ok) throw new Error('Помилка delete item');
    } catch (error: any) {
      console.error(error.message);
    } finally {
      const updated = clothes.filter(cloth => cloth.id != itemId);
      setClothes(updated);
      setFilteredClothes(updated);
      onFinish?.();
    }
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
    addItemToFav,
    deleteItem,
  };
};
