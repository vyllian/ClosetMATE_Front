import React, { useEffect, useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, Pressable, TextInput, TouchableHighlight, Image, Alert, ActivityIndicator } from 'react-native';
import { Link, router } from 'expo-router';
import { MainButton } from '@/components/customButton';
import { CustomInput, CustomPassword } from '@/components/customInput';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { SelectList } from 'react-native-dropdown-select-list'
import icons from '@/constants/icons';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import AntDesign from '@expo/vector-icons/AntDesign';
import { API } from '@/constants/api';

import { useAuth } from '@/lib/useAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '@/lib/useUser';
import { useProfile } from '@/components/ProfileContext';
import { TopNavigation } from '@/components/topNavigation';


const EditProfile = () => {
    const credentials = useAuth().auth;
    const { user, loading:userLoading, error } = useUser();
    const [loading, setLoading] = useState(false);
    const {profile, loading:profileLoadinf  } = useProfile();
    

    const [username, setUsername]=useState('');
    const [bio, setBio]=useState<string | null>(null);
    const [gender, setGender]=useState('');
    const [image, setImage] =useState<string | null>(null);
    const [dateOfBirth, setDateOfBirth]=useState('');

    const [allComplete, setAllComplete] = useState(true);
    const [date, setDate]=useState(new Date());
    const [showPicker, setShowPicker]=useState(false);
    const [showImgOptions, setImgOptions] = useState(false);

    const genderOptions = [
        {'key':'FEMALE', 'value':'Жіноча'},
        {'key':'MALE', 'value':'Чоловіча'},
        {'key':'OTHER', 'value':'Інша'},
    ]

    useEffect(()=>{
        setUsername(profile.username);
        setBio(profile.bio || '');
        setGender(profile.gender);
        setImage(profile.publicUrl || null);
        setDateOfBirth(profile.dateOfBirth);
    }, []);

    const toggleDatepicker = () =>{
        setShowPicker(!showPicker);
    };
    const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        const { type } = event;
        let currentDate = selectedDate;
        if (type === 'set' && currentDate) {
            setDate(currentDate);
            if (Platform.OS === 'android') {
                toggleDatepicker();
                setDateOfBirth(formatDate(currentDate));
            }
        } else {
            toggleDatepicker();
        }
    };
    const confirmIOSDate = ()=>{
        setDateOfBirth(formatDate(date));
        toggleDatepicker();
    };
    const formatDate = (rawDate:Date)=>{
        let year= rawDate.getFullYear();
        let month: string = (rawDate.getMonth() + 1).toString().padStart(2, "0");
        let day: string = rawDate.getDate().toString().padStart(2, "0");
        return `${day}-${month}-${year}`;
    };
    const toggleImgOptions = () =>{
        setImgOptions(!showImgOptions);
    };
    const uploadImage= async(mode:string)=>{
        try {
            let result : ImagePicker.ImagePickerResult;
            if(mode==="gallery"){
                await ImagePicker.requestMediaLibraryPermissionsAsync();
                result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes:ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect:[1,1],
                    quality: 1,
                })
            }else{
                await ImagePicker.requestCameraPermissionsAsync();
                result = await ImagePicker.launchCameraAsync({
                    cameraType: ImagePicker.CameraType.front,
                    allowsEditing: true,
                    aspect:[1,1],
                    quality: 1,
                });
            }    
            if (!result.canceled){
                saveImage(result.assets[0].uri);
            }
            
        } catch (error:any) {
            alert("Помилка завантаження фото: "+ error.message);
            setImgOptions(false);
        }
    };
    const saveImage = async (image:string | null)=>{
        try {
            setImage(image);
            setImgOptions(false);
        } catch (error) {
            throw new Error("Помилка при збереженні фото");   
        }
    }
    const deleteImage=()=>{
        try{
            saveImage(null);
        }catch(error:any){
            alert(error.message);
           setImgOptions(false);
        }
         
    };

    const submit = async()=>{
        if (!username || !gender || !dateOfBirth){
            setAllComplete(false);
            return;
        } 
        setAllComplete(true);
        let imgUrl=null;
        let imgName = null;
        let urlExp=null;
        setLoading(true);
        if (image) {
            try {
                const formData = new FormData();
                
                formData.append('file', { uri: image, name: 'img.png', type: 'image/png' } as any);
                const response = await fetch(API+'/profile/uploadPhoto', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Basic ${credentials}`,
                        "Content-Type": "multipart/form-data",
                    },
                    body: formData,
                });
                
                if (!response.ok) {
                    throw new Error('Помилка завантаження фото');
                }
    
                const responseJSON = await response.json();
                imgName = responseJSON.name;
                imgUrl = responseJSON.publicUrl;
                urlExp = responseJSON.expirationDate;
            } catch (error) {
                console.error('Помилка при завантаженні фото:', error);
            }
        }
        
        try {
            const newProfile ={
                "image":imgName,
                "username": username,
                "bio":bio,
                "gender":gender,
                "dateOfBirth":dateOfBirth,
                "publicUrl":imgUrl,
                "urlExpiryDate": urlExp,
                "user":user,
            }
            console.log(newProfile);
            
            const response = await fetch(API+'/profile/edit/'+profile.id,{
                method: 'PUT',
                headers: {
                     'Authorization': `Basic ${credentials}`,
                     'Content-Type': 'application/json',
                },
                body: JSON.stringify(newProfile),
            });
            if (!response.ok) {
                throw new Error('Помилка edit профілю');
            }
            //await AsyncStorage.setItem('selectedProfileId', profile.id);
            router.push('/profile');
        } catch (error) {
            console.error('Помилка при створенні профілю:', error);
        }finally{
            setLoading(false);
        }

    };

    const deleteProfile = async()=>{
        Alert.alert(
            "Видалити цей профіль?",
            "Цю дію неможливо скасувати.",
            [
                {text:"Видалити",style:'destructive', onPress: async()=>{
                    try {
                        const response = await fetch(API+'/profile/delete/'+profile.id,{
                            method: 'DELETE',
                            headers: {
                                 'Authorization': `Basic ${credentials}`
                            },
                        }); 
                        if (!response.ok) {
                            throw new Error('Помилка delete профілю');
                        }
                    } catch (error) {
                        console.error('Помилка при видаленні профілю:', error);
                    }finally{
                        router.push('/choose-profile');
                    }
                }},
                {text:"Скасувати",style:'cancel'}
            ]
        );

    };

    

    return(
         <SafeAreaView className='px-5 h-full bg-primary ' >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                {loading ? (
                    <View className="absolute top-0 left-0 right-0 bottom-0 bg-primary flex items-center justify-center z-50">
                        <ActivityIndicator size="large" color="#828282" />
                    </View>
                ):(
                <ScrollView contentContainerStyle={{ height:"100%", justifyContent:'flex-start', alignContent:'center' }} >
                    
                    <View className='flex items-center gap-2 relative w-full'>
                        <TopNavigation arrowAction={()=>router.push('/(root)/(tabs)/profile')} binAction={()=>deleteProfile()} />
                        <TouchableHighlight className='mt-14 mb-8 items-end relative size-fit rounded-full' underlayColor='#D9D9D9' onPress={toggleImgOptions}>
                            <View className='items-end relative'>
                                <Image source={image? {uri: image}: icons.avatar} className='size-36 rounded-full border-white border-solid border-4' resizeMode='contain' />
                                <Feather name="edit-3" size={24} color="black" className='absolute bottom-2 right-2' />
                            </View>
                        </TouchableHighlight>
                        {showImgOptions && (
                            <View className='flex-column gap-6 bg-white rounded-xl p-4 absolute top-20 left-14'>
                                <TouchableHighlight className='bg-black-300 p-2 rounded-lg' underlayColor='#fbcce7' onPress={()=>uploadImage('camera')}>
                                    <Feather name="camera" size={24} color="black" />
                                </TouchableHighlight> 
                                <TouchableHighlight  className='bg-black-300 p-2 rounded-lg' underlayColor='#fbcce7' onPress={()=>uploadImage('gallery')}>
                                    <MaterialIcons name="insert-photo" size={24} color="black"  />
                                </TouchableHighlight>    
                                <TouchableHighlight  className='bg-black-300 p-2 rounded-lg' underlayColor='#fbcce7' onPress={()=>deleteImage()}>
                                    <MaterialCommunityIcons name="trash-can-outline" size={24} color="black" />
                                </TouchableHighlight>       
                            </View>                     
                        )}  
                        <Text className=' font-philosopher-bold text-2xl'>Дані про профіль</Text>
                        <CustomInput label='Назва профілю:*' placeholder='username' value={username} setValue={setUsername} />
                        <CustomInput label='Опис:' placeholder='опис' value={bio} setValue={setBio} />
                        <View className="my-0">
                            <Text className="font-philosopher text-xl">Дата народження:*</Text>
                            {showPicker && (
                                <DateTimePicker mode='date' display='spinner' value={date} onChange={onChange} minimumDate={new Date(1925,0,1)} maximumDate={new Date()} textColor='black'  />
                            )}
                            {showPicker && Platform.OS==='ios'&&(
                                <View>
                                    <MainButton text='Вибрати' onPress={confirmIOSDate} />
                                </View>
                            )}
                            {!showPicker && (
                                <Pressable onPress={toggleDatepicker} className='w-full'>
                                     <View className='relative flex flex-row items-center justify-start min-h-12 w-full bg-white border border-black-300 border-solid rounded-lg px-3'>
                                        <TextInput value={dateOfBirth} onChangeText={setDateOfBirth} placeholder='12-01-2004' editable={false} onPressIn={toggleDatepicker} className='w-full h-full py-0 flex-1 leading-5  placeholder:text-black-200 placeholder:font-philosopher placeholder:text-xl ' />
                                    </View>
                                </Pressable>                        
                            )}
                        </View>
                        <View className="mb-4">
                            <Text className="font-philosopher text-xl">Стать:*</Text>
                            <SelectList data={genderOptions} setSelected={(val:string) => setGender(val)} defaultOption={{ key: profile.gender, value: genderOptions.find(option => option.key === profile.gender)?.value || "Невідомо" }}  placeholder='Стать' fontFamily='philosopher' search={false} boxStyles={{backgroundColor:"white", borderColor:"#D9D9D9", paddingHorizontal:12, width:"100%" }} dropdownStyles={{backgroundColor:"white"}} inputStyles={{fontSize:18}} />
                        </View>
                        {!allComplete &&( <Text className="absolute top-full font-philosopher text-red-500 text-xl">Заповніть обов'язкові (*) поля!</Text> )}
                        <MainButton text='Внести зміни' onPress={()=>submit()} />
                    </View>
                    {/* <View className='absolute bottom-0 w-full'>
                        <MainButton text='Видалити профіль' onPress={()=>deleteProfile()} color='#bc4444' />
                    </View> */}
                </ScrollView>
                )}
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default EditProfile;