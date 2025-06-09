
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ImageSourcePropType, ActivityIndicator, TouchableHighlight } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { removeAuth } from '@/lib/authService';
import { useUser } from "@/lib/useUser";
import { Alert } from 'react-native';
import { router, Router } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useProfile } from '@/components/ProfileContext';
import icons from '@/constants/icons';
import { API } from '@/constants/api';
import { useAuth } from '@/lib/useAuth';
import Ionicons from '@expo/vector-icons/Ionicons';
import moment from 'moment';
import Outfit from '@/constants/outfitType';
import { SmallItemPreview } from '@/components/itemsPreview';
import { TopNavigation } from '@/components/topNavigation';
import Feather from '@expo/vector-icons/Feather';



const Profile = () => {
    const {profile, loading  } = useProfile();
    const {auth, loading:authLoading} = useAuth();
    const { user, loading:userLoading, error } = useUser();
    
    const [image, setImage] =useState<string | null>(null); 
    const [imageLoading, setImageLoading] =useState(true); 
    const [setShown, setSetShown] = useState(false);
    const [favourite, setFavourite] = useState(false);  
    const [outfits, setOutfits] = useState<Outfit[]>([]);
    const [filteredOutfits, setFilteredOutfits] = useState<Outfit[]>([]);
    const [showOutfitOptions, setShowOutfitOptions] = useState(false);
    const [chosenOutfit, setChosenOutfit] = useState<Outfit>();
    
    useEffect(()=>{
        if(!profile || authLoading){
            return;
        }

        if (!profile.image) {
            setImageLoading(false);
            return;
        }
        if(moment(profile.urlExpiryDate)>moment()){
            setImageLoading(false);
            setImage(profile.publicUrl);
            
        }else{
            const fetchUrl = async()=>{
                try {
                    console.log("1");
                    console.log(auth);
                    
                    const response = await fetch(API+'/profile/'+profile.id+'/photoUrl',{
                        method: 'GET',
                            headers: {
                                'Authorization': `Basic ${auth}`,
                            },
                    });
                    
                    if (!response.ok){
                        console.log(response.status);
                        
                        throw new Error("Помилка отримання фото for profile");
                    }
                    
                    const imageUrl = await response.text(); 
                    setImage(imageUrl);
                } catch (error) {
                    console.error("Помилка при отриманні посилання на фото:", error);
                }finally{
                    setImageLoading(false);
                }
            }
            fetchUrl();
            setImageLoading(false);
        }
        fetchOutfits();
        
    }, [ imageLoading, authLoading]);
    const fetchOutfits = async()=>{
        try {
            const response = await fetch(API + '/profile/'+profile.id+'/outfits', {
                method: "GET",
                headers: {
                Authorization: `Basic ${auth}`,
                },
            });

            if (!response.ok) {
                console.log(response.status, response);
                
                throw new Error('Cannot fetch outfits');
            }
            const data = await response.json();       
            setOutfits(data);  
            setFilteredOutfits(data);
            console.log(data);
        } catch (error) {
            console.log(error);
        }
        
    }
    
    useEffect(()=>{
        if(favourite){
            console.log(favourite);
            const out = outfits.filter((outfit)=>outfit.favourite)
            console.log(out);
            
            setFilteredOutfits(out);
        }else {
            console.log(favourite);
            setFilteredOutfits(outfits);
        }
    }, [favourite])
    
    const toggleSettings = async()=>{
        setSetShown(!setShown);
    }
    const toggleFavOutfits = async()=>{
        setFavourite(!favourite);
    }

    const handleLogout = async () => {
        await removeAuth();
        await AsyncStorage.removeItem('user');
        Alert.alert('Вихід виконано');
        router.replace('/sign-in');
    };
    
      const toggleOutfit = ()=>{
        setShowOutfitOptions(!showOutfitOptions)
      }
      const deleteOutfit = async (outfitId: string, onFinish?: () => void) => {
            try {
              const response = await fetch(`${API}/outfit/delete/${outfitId}`, {
                method: 'DELETE',
                headers: {
                  Authorization: `Basic ${auth}`,
                },
              });
              if (!response.ok) throw new Error('Помилка delete item');
            } catch (error: any) {
              console.error(error.message);
            } 
            setShowOutfitOptions(false);
            fetchOutfits();
      };
    
      const addOutfitToFav = async () => {
        if (!chosenOutfit) return;
        
            try {
              const response = await fetch(`${API}/profile/${profile.id}/set-outfit-fav?outfit-id=${chosenOutfit.id}&fav=${!chosenOutfit.favourite}`, {
                method: 'PUT',
                headers: {
                  Authorization: `Basic ${auth}`,
                },
              });
              if (!response.ok) throw new Error('Помилка add to fav item');
            } catch (error: any) {
              console.error(error.message);
            }
            chosenOutfit.favourite = !chosenOutfit.favourite
            fetchOutfits();
      };
    
      const editOutfit = ()=>{
        router.push({pathname:'/(root)/create-outfit', params:{passedItems: JSON.stringify(outfits)}});
      }
    

    return (
        <SafeAreaView className=' h-full bg-primary '>
            {loading || authLoading ? (
                
                <View className="absolute top-0 left-0 right-0 bottom-0 bg-primary flex items-center justify-center z-50">
                    <ActivityIndicator size="large" color="#828282" />
                </View>
            ):(
            <ScrollView contentContainerStyle={{ height:"100%", justifyContent:'center', alignContent:'center' }} >
                <View className='mx-4 flex-row items-start justify-between mb-2'>
                    <TouchableHighlight  underlayColor='transperent' onPress={()=>router.push('/')}>
                        <Image source={icons.logo} className='size-24' resizeMode='contain' />
                    </TouchableHighlight>
                    <TouchableHighlight onPress={toggleSettings} underlayColor='transperent' className='size-fit m-4'>
                        <Ionicons name="settings-outline" size={32} color="black" />
                    </TouchableHighlight>
                </View>
                {setShown && (
                    <View className='bg-white rounded-xl w-68 px-3 py-2 absolute top-14 right-12 z-50'>
                        <TouchableHighlight onPress={()=>{router.push('/edit-profile');}} underlayColor='#d9d9d9' className='border-black-300 border-b pb-1'>
                            <Text className='font-philosopher text-xl'>Редагувати профіль</Text>
                        </TouchableHighlight>
                        <TouchableHighlight onPress={()=>{router.push({pathname:'/choose-profile', params: { profiles: JSON.stringify(user.profiles)}})}} underlayColor='#d9d9d9' className='border-black-300 border-b pb-1'>
                            <Text className='font-philosopher text-xl'>Перейти в інший профіль</Text>
                        </TouchableHighlight>
                        <TouchableHighlight onPress={()=>router.push('/sign-up-profile')}  underlayColor='#D9D9D9' className='border-black-300 border-b py-1'>
                            <Text className='font-philosopher text-xl'>Додати профіль</Text>
                        </TouchableHighlight>
                        <TouchableHighlight onPress={()=>router.push('/edit-user')}  underlayColor='#D9D9D9' className='border-black-300 border-b py-1'>
                            <Text className='font-philosopher-bold text-xl'>Налаштування користувача</Text>
                        </TouchableHighlight>
                        <TouchableHighlight onPress={handleLogout}  underlayColor='#D9D9D9' className='pt-1'>
                            <View className='flex-row justify-between items-center'>
                                <Text className='font-philosopher text-xl text-danger'>Вийти</Text>
                                <MaterialIcons name="logout" size={20} color="#BC4444" />
                            </View>
                        </TouchableHighlight>
                    </View>
                )}
                <View className='items-center min-h-64 gap-2 '>
                    {image ?(
                        <Image source={{uri: image}} className='size-36 rounded-full border-white border-solid border-4' resizeMode='contain' />
                    ):(
                        <View className='flex items-center justify-center rounded-full border-white border-solid border-4 size-36 bg-white'>
                            <MaterialCommunityIcons name='star-face' size={96}  />
                        </View>
                    )}
                    <Text className='font-philosopher-bold text-lg'>
                        @{profile.username}
                    </Text>
                    {profile.bio &&(
                        <Text className='font-philosopher text-center text-base text-black-100 max-w-36 '>
                            {profile.bio}
                        </Text>
                    )}
                </View>
                <View className='bg-white border-b  border-black-200 flex-row justify-between items-center h-16 px-4'>
                    <Text className='font-philosopher text-2xl'>
                        Мої образи
                    </Text>
                    <TouchableHighlight onPress={toggleFavOutfits} underlayColor="transperent" className='rounded-full'>
                        {favourite ? (
                            <MaterialIcons name="favorite" size={32} color="#fb3f4a" />
                        ):(
                            <MaterialIcons name="favorite-border" size={32} color="#fb3f4a" />
                        )}
                    </TouchableHighlight>
                </View>
                <ScrollView style={{flexGrow:1, height:'100%', backgroundColor:"white", paddingTop: 10, width:"100%"}}>
                <View className=' flex-row flex-wrap gap-6 content-start justify-start items-start w-11/12  mx-auto'>
                    {filteredOutfits.length===0 ? (
                        <Text className="font-philosopher text-black-100 text-xl self-center ml-28">Немає створених образів</Text>
                    ):(
                        filteredOutfits.reverse().map((outfit, i)=>(
                            <SmallItemPreview image={outfit.publicUrl} favourite={outfit.favourite} onPress={()=>{setChosenOutfit(outfit),toggleOutfit()}} />
                        ))
                    )}

                </View>
                </ScrollView>
            </ScrollView>
            )}
             {(showOutfitOptions && chosenOutfit) && (
                        <View className='absolute  items-center justify-center  inset-0 bg-black/30 backdrop-blur-xl'>
                            <View className='bg-primary w-11/12 pt-8 pb-4 items-center justify-center  z-50 rounded-lg  shadow-xl shadow-black-200[06]'>
                                <TopNavigation arrowAction={()=>{toggleOutfit(), fetchOutfits()}} binAction={()=>deleteOutfit(chosenOutfit.id)}></TopNavigation>
                                <View className='bg-white w-full items-center p-2 pt-4 mt-5'>
                                    <Image  source={{uri:chosenOutfit?.publicUrl}} className='size-48' resizeMode='contain'/>
                                    <View className='flex-row justify-between w-full px-1'>
                                        <TouchableHighlight onPress={()=>editOutfit()} underlayColor='transperent'>
                                            <Feather name="edit-3" size={30} color="black" />
                                        </TouchableHighlight>
                                        <TouchableHighlight onPress={()=>addOutfitToFav()} underlayColor='transperent'>
                                        {chosenOutfit.favourite ? (
                                            <MaterialIcons name="favorite" size={32} color="#fb3f4a" />
                                        ):(
                                            <MaterialIcons name="favorite-border" size={32} color="#fb3f4a" />
                                        )}
                                        </TouchableHighlight>
                                    </View>
                                </View>
                                <View className='gap-1 mx-4'>
                                    <Text className='font-philosopher text-xl'>
                                                                            <Text className='font-philosopher-bold text-center'>Опис: </Text> 
                                                                            {chosenOutfit.description.length===0 ? 
                                                                            "-" :
                                                                            chosenOutfit.description}
                                                                        </Text>
                                    <Text className='font-philosopher text-xl text-center'>
                                        <Text className='font-philosopher-bold'>Дати: </Text>
                                        {chosenOutfit.planningToWear.map((date, i)=>(
                                          <Text key={i}>{date.toString()}</Text>
                                        ))}
                                    </Text>
                                    
                                </View>
                                
                            </View>
                        </View>
                    )}
        </SafeAreaView>
    )
}

export default Profile;