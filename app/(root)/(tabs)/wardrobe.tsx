import { ClothesCategory } from '@/components/clothesCategory';
import { PlusButton, SearchButton } from '@/components/customButton';
import { useProfile } from '@/components/ProfileContext';
import icons from '@/constants/icons';
import { router } from 'expo-router';
import React from 'react';
import { View, Text, ActivityIndicator, SafeAreaView, ScrollView, Image, TouchableHighlight } from 'react-native';

const Wardrobe = () => {
    const {profile, loading, setProfile } = useProfile();

    
      
    return(
        <SafeAreaView className='px-5 h-full bg-primary ' >
        {loading && (
            <View className="absolute top-0 left-0 right-0 bottom-0 bg-primary flex items-center justify-center z-50">
                <ActivityIndicator size="large" color="#828282" />
            </View>
        )}            
            <ScrollView contentContainerStyle={{  height:"95%", justifyContent:'space-evenly', alignContent:'center',  alignItems:'center' }} >
                <TouchableHighlight  underlayColor='transperent' onPress={()=>router.push('/')}>
                    <Image  source={icons.logo} className="size-32" resizeMode="contain"/>
                </TouchableHighlight>
                <Text className="font-philosopher-bold text-2xl text-center">
                    Моя шафа
                </Text>
                <View className='flex-row justify-between w-9/12 items-center'>
                    <SearchButton onPress={()=>router.push({pathname:'/items-search', params: { category: "all",title:"Весь одяг" }})}/> 
                    <PlusButton size={30} onPress={()=>{router.push('/create-item');}} />
                </View>
                <View className='flex flex-row flex-wrap gap-x-12 gap-y-5 items-center justify-center mb-6'>
                    <ClothesCategory type='outter' onPress={()=>router.push({pathname:'/items-search', params: { category: "outer", title:"Верхній одяг" }})}/>
                    <ClothesCategory type='top' onPress={()=>router.push({pathname:'/items-search', params: { category: "top",title:"Верх" }})}/>
                    <ClothesCategory type='bottom' onPress={()=>router.push({pathname:'/items-search', params: { category: "bottom",title:"Низ" }})}/>
                    <ClothesCategory type='overall' onPress={()=>router.push({pathname:'/items-search', params: { category: "overall",title:"Суцільне" }})}/>
                    <ClothesCategory type='shoes' onPress={()=>router.push({pathname:'/items-search', params: { category: "shoes",title:"Взуття" }})}/>
                    <ClothesCategory type='accessory' onPress={()=>router.push({pathname:'/items-search', params: { category: "accessory",title:"Аксесуари" }})}/>
                </View>
            </ScrollView>    
        </SafeAreaView>
    )
}

export default Wardrobe;