import { useProfile } from '@/components/ProfileContext';
import React from 'react';
import { View, Text, ActivityIndicator, SafeAreaView, ScrollView, TouchableHighlight } from 'react-native';

const Wardrobe = () => {
    const {profile, loading, setProfile } = useProfile();
      
    return(
        <SafeAreaView className='px-5 h-full bg-primary ' >
        {loading && (
            <View className="absolute top-0 left-0 right-0 bottom-0 bg-primary flex items-center justify-center z-50">
                <ActivityIndicator size="large" color="#828282" />
            </View>
        )}            
            <ScrollView contentContainerStyle={{ height:"100%", justifyContent:'flex-start', alignContent:'center' }} >
                
            </ScrollView>    
        </SafeAreaView>
    )
}

export default Wardrobe;