import { ClothesCategory } from '@/components/clothesCategory';
import { PlusButton, SearchButton } from '@/components/customButton';
import { useProfile } from '@/components/ProfileContext';
import icons from '@/constants/icons';
import React from 'react';
import { View, Text, ActivityIndicator, SafeAreaView, ScrollView, Image, TouchableHighlight } from 'react-native';

const Wardrobe = () => {
    const {profile, loading, setProfile } = useProfile();

    const tem= async()=>{

    }
      
    return(
        <SafeAreaView className='px-5 h-full bg-primary ' >
        {loading && (
            <View className="absolute top-0 left-0 right-0 bottom-0 bg-primary flex items-center justify-center z-50">
                <ActivityIndicator size="large" color="#828282" />
            </View>
        )}            
            <ScrollView contentContainerStyle={{  height:"95%", justifyContent:'space-evenly', alignContent:'center',  alignItems:'center' }} >
                <Image  source={icons.logo} className="size-32" resizeMode="contain"/>
                <Text className="font-philosopher-bold text-2xl text-center">
                    Моя шафа
                </Text>
                <View className='flex-row justify-between w-9/12 items-center'>
                    <SearchButton onPress={tem}/> {/*пошук-> всі позиції одягу */}
                    <PlusButton size={30} onPress={tem} />
                </View>
                <View className='flex flex-row flex-wrap gap-x-12 gap-y-5 items-center justify-center mb-6'>
                    <ClothesCategory type='outter' onPress={tem}/>
                    <ClothesCategory type='top' onPress={tem}/>
                    <ClothesCategory type='bottom' onPress={tem}/>
                    <ClothesCategory type='overall' onPress={tem}/>
                    <ClothesCategory type='shoes' onPress={tem}/>
                    <ClothesCategory type='accessory' onPress={tem}/>
                </View>
            </ScrollView>    
        </SafeAreaView>
    )
}

export default Wardrobe;