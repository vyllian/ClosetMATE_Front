import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchProfileData } from '@/lib/useAuth';
import { useUser } from '@/lib/useUser';
import { router } from 'expo-router';

interface ProfileProviderProps {
    children: ReactNode;
}
interface ProfileContextProps {
    profile: any;  // Потрібно замінити на точний тип профілю
    loading: boolean;
    setProfile: React.Dispatch<React.SetStateAction<any>>; // Теж бажано замінити на точний тип
}

const ProfileContext = createContext<ProfileContextProps | null>(null);

export const ProfileProvider: React.FC<ProfileProviderProps> = ({children}) =>{
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, loading: userLoading, error } = useUser();
  
  useEffect(() => {
      const loadProfile = async () => {
          if(userLoading) return;
          try {
              const profileId = await AsyncStorage.getItem('selectedProfileId');
              if (!profileId) {
                 if (user.profiles.lenght===1){
                  const data = await fetchProfileData(user.profiles[0].id);
                  if (data) setProfile(data);            
                }
                else{
                  router.push({pathname:'/choose-profile', params: { profiles: user.profiles }});
                }
              }
              else{
                const data = await fetchProfileData(profileId);
                if (data) setProfile(data);
              }
          } catch (error) {
              console.error('Помилка завантаження профілю context:', error);
          } finally {
              setLoading(false);
          }
      };

      loadProfile();
  }, [user, userLoading]);

  return (
    <ProfileContext.Provider value={{ profile, loading, setProfile }}>
        {children}
    </ProfileContext.Provider>
    );
};

export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (!context) {
      throw new Error('useProfile must be used within a ProfileProvider');
    }
    return context;
};