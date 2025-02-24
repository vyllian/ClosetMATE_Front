import { useProfile } from '@/components/ProfileContext';
import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

const Wardrobe = () => {
    const {profile, loading, setProfile } = useProfile();
  
    if (loading) return <ActivityIndicator size="large" color="#828282" />;
    if(profile) console.log(profile);
    return(
        <View>
            <Text>Wardrobe</Text>
        </View>
    )
}

export default Wardrobe;