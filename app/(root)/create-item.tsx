import React, { useEffect, useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, Pressable, TextInput, TouchableHighlight, Image, Alert, ActivityIndicator,StyleSheet } from 'react-native';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { MainButton } from '@/components/customButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import icons from '@/constants/icons';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import { API } from '@/constants/api';

import { useAuth } from '@/lib/useAuth';
import { useProfile } from '@/components/ProfileContext';
import { MultipleSelectList, SelectList } from 'react-native-dropdown-select-list';
import { itemTypes, itemColors, itemFormalities, itemMoods, itemPatterns, itemPurposes, itemSeasons, itemStyles, colorDarkness, colorWarmness, itemMaterials } from '@/constants/itemCharacteristics';
import { TopNavigation } from '@/components/topNavigation';

type ClothingItem = {
    id: string;
    favourite: boolean;
    category: string;
    colors: string[];
    color_darkness: string;
    color_warmness: string; 
    formality: string;
    image: string; 
    material: string; 
    mood: string; 
    pattern: string; 
    publicUrl: string;
    purpose: string;
    season:string
    style: string;
    temperature_max: number; 
    temperature_min: number; 
    type: string; 
    urlExpiryDate: string | Date;
};

const CreateItem = () => {
    const credentials = useAuth().auth;
    const {profile, loading:profileLoading } = useProfile();
    const { itemEdit } = useLocalSearchParams();
    
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    
    const [image, setImage] =useState<string | null>(null);
    const [mood, setMood]=useState("");
    const [type, setType]=useState("");
    const [category, setCategory] = useState("");

    const [itemToEdit, setItem] = useState<ClothingItem>();
    const [color, setColor] =useState<string[]>([]);
    const [colorWarm, setColorWarm]=useState("");
    const [colorDark, setColorDark]=useState("");
    const [pattern, setPattern]=useState("");
    const [material, setMaterial]=useState("");
    const [season, setSeason]=useState("");
    const [tempMin, setTempMin]=useState("");
    const [tempMax, setTempMax]=useState("");
    const [formality, setFormality]=useState("");
    const [purporse, setPurpose]=useState("");
    const [style, setStyle]=useState("");
    const [imgName, setImgName]=useState('');
    const [imgUrl, setImgUrl] = useState('');
    const [imgDate, setImgDate] = useState();

    const [showImgOptions, setImgOptions] = useState(false);
    const [inputDisabled, setInputDisabled] = useState(true);
    
    useEffect(() => {
        console.log(itemEdit);
        
        if (!itemEdit){
            return;
        }
            console.log('we are here');
            
            const itemString = Array.isArray(itemEdit) ? itemEdit[0] : itemEdit;
            const parsedItem = JSON.parse(itemString);
            
            setItem(parsedItem);

            console.log(parsedItem);
            

            setMood(parsedItem.mood);
            setType(parsedItem.type);
            setCategory(parsedItem.category);       
            setColor(parsedItem.colors);
            setColorDark(parsedItem.color_darkness);
            setColorWarm(parsedItem.color_warmness);
            setPattern(parsedItem.pattern);
            setMaterial(parsedItem.material);
            setSeason(parsedItem.season);
            setTempMin(String(parsedItem.temperature_min));
            setTempMax(String(parsedItem.temperature_max));
            setFormality(parsedItem.formality);
            setPurpose(parsedItem.purpose);
            setStyle(parsedItem.style);
            setImgName(parsedItem.image);
            setImgUrl(parsedItem.public_url);
            setImgDate(parsedItem.url_expiry_date);

            setImage(parsedItem.public_url);  
            setInputDisabled(false);
        
    },[itemEdit]);
    
    const toggleImgOptions = () =>{
        console.log(itemToEdit);
        
        if (!itemToEdit){
            setImgOptions(!showImgOptions);
        }
    };
    const uploadImage= async(mode:string)=>{
        try {
            let result : ImagePicker.ImagePickerResult;
            if(mode==="gallery"){
                await ImagePicker.requestMediaLibraryPermissionsAsync();
                result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes:ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect:[4,3],
                    quality: 1,
                })
            }else{
                await ImagePicker.requestCameraPermissionsAsync();
                result = await ImagePicker.launchCameraAsync({
                    cameraType: ImagePicker.CameraType.back,
                    allowsEditing: true,
                    aspect:[3,2],
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
            setImgOptions(false);
            setLoading(true);
            try {
                const formData = new FormData();                
                formData.append('file', { uri: image, name: 'img.png', type: 'image/png' } as any);
                const response = await fetch(API+'/item/new', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Basic ${credentials}`,
                        "Content-Type": "multipart/form-data",
                    },
                    body: formData,
                });
                if (!response.ok) {
                    console.log(response.status);
                    throw new Error('Помилка завантаження фото');
                }
    
                const responseJSON = await response.json();
                console.log('====================================');
                console.log(responseJSON);
                console.log('====================================');
                setMood(responseJSON.mood);
                setType(responseJSON.type);
                setCategory(responseJSON.category);       
                setColor(responseJSON.colors);
                setColorDark(responseJSON.color_darkness);
                setColorWarm(responseJSON.color_warmness);
                setPattern(responseJSON.pattern);
                setMaterial(responseJSON.material);
                setSeason(responseJSON.season);
                setTempMin(String(responseJSON.temperature_min));
                setTempMax(String(responseJSON.temperature_max));
                setFormality(responseJSON.formality);
                setPurpose(responseJSON.purpose);
                setStyle(responseJSON.style);
                setImgName(responseJSON.image);
                setImgUrl(responseJSON.publicUrl);
                setImgDate(responseJSON.urlExpiryDate);

                setImage(responseJSON.publicUrl); 
                
            } catch (error) {
                console.error('Помилка при завантаженні фото:', error);
            }finally{
                setInputDisabled(false);
                setErrorMessage("");
                setLoading(false);
            }
        } catch (error:any) {
            setErrorMessage("Проблеми з опрацюванням цього фото.");   
        }
    }
    
    const deleteImage=async()=>{
        try{
            saveImage(null);

        }catch(error:any){
            alert(error.message);
           setImgOptions(false);
        }
         
    };
    const goBack=async()=>{
        if (image){
            try{
                const response = await fetch(API+'/item/delete-image',{
                    method: 'DELETE',
                    headers:{
                        'Authorization': `Basic ${credentials}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(imgName)
                });
                if(!response.ok){
                    console.log(response.status);
                    
                    throw new Error("problems deleting image");
                }
            }catch (error:any){
                console.error(error.message);
            }
        }
        router.push("/wardrobe");
    };

    const submit = async()=>{
        setLoading(true);
        if (!image) {
            setLoading(false);
            setErrorMessage("Виберіть фото");
            return;
        }
        else {
            setErrorMessage("");

            if (!itemToEdit){
                const item={
                    "image":imgName,
                    "type":type,
                    "category":category,
                    "colors":color,
                    "color_warmness":colorWarm,
                    "color_darkness":colorDark,
                    "pattern":pattern,
                    "material" : material,
                    "season":season,
                    "temperature_min":Number(tempMin),
                    "temperature_max":Number(tempMax),
                    "formality":formality,
                    "style":style,
                    "mood":mood,
                    "purpose":purporse,
                    "publicUrl":imgUrl,
                    "urlExpiryDate":imgDate
                }
                try {
                    const response = await fetch(API+'/profile/'+profile.id+'/add-item',{
                        method: 'PUT',
                        headers: {
                            'Authorization': `Basic ${credentials}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(item),
                    });
                    if (!response.ok) {
                        throw new Error('Помилка add item');
                    }
                    
                } catch (error:any) {
                    console.error(error.message);
                }finally{
                    setLoading(false);
                    router.push('/wardrobe');
                }
            }else{
                try {
                    const item={
                        "id":itemToEdit.id,
                        "image":imgName,
                        "type":type,
                        "category":category,
                        "colors":color,
                        "color_warmness":colorWarm,
                        "color_darkness":colorDark,
                        "pattern":pattern,
                        "material" : material,
                        "season":season,
                        "temperature_min":Number(tempMin),
                        "temperature_max":Number(tempMax),
                        "formality":formality,
                        "style":style,
                        "mood":mood,
                        "purpose":purporse,
                        "publicUrl":imgUrl,
                        "urlExpiryDate":imgDate
                    }                    
                    const response = await fetch(API+'/item/edit/'+itemToEdit.id,{
                        method: 'PUT',
                        headers: {
                            'Authorization': `Basic ${credentials}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(item),
                    });
                    if (!response.ok) {
                        throw new Error('Помилка edit item');
                    }
                    
                } catch (error:any) {
                    console.error(error.message);
                }finally{
                    setLoading(false);
                    router.push('/wardrobe');
                }
            }
        }
    };


    return(
         <SafeAreaView className='px-5 h-full bg-primary ' >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                {loading && (
                    <View className="absolute top-0 left-0 right-0 bottom-0 bg-primary flex items-center justify-center z-50">
                        <ActivityIndicator size="large" color="#828282" />
                    </View>
                )}
                <ScrollView contentContainerStyle={{ flexGrow:1, justifyContent:'flex-start', alignContent:'center' }}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                >
                    <TopNavigation arrowAction={()=>goBack()} />
                    <View className='flex items-center gap-2 relative'>
                        <TouchableHighlight className=' bg-white mt-16 mb-8 rounded-xl relative border border-black-300 size-36 items-center justify-center' onPress={toggleImgOptions} underlayColor='#fff' activeOpacity={0.2}>
                            <Image source={image? {uri: image}: icons.outers} className='' style={image?{ width: 100, height: 100 }:{}} resizeMode='contain' />
                        </TouchableHighlight>
                        {errorMessage && (
                            <Text className="-mt-5 font-philosopher text-red-500 text-xl">{errorMessage}</Text>
                        )}
                        {showImgOptions && (
                            <View className='flex-column gap-6 bg-white rounded-xl p-4 absolute top-16 left-14'>
                                <TouchableHighlight className='bg-black-300 p-2 rounded-lg' onPress={()=>uploadImage('camera')}>
                                    <Feather name="camera" size={24} color="black" />
                                </TouchableHighlight> 
                                <TouchableHighlight  className='bg-black-300 p-2 rounded-lg' onPress={()=>uploadImage('gallery')}>
                                    <MaterialIcons name="insert-photo" size={24} color="black"  />
                                </TouchableHighlight>    
                            </View>                     
                        )}  
                        <View className='relative'>
                            {inputDisabled && (
                                <View className='w-full h-[46] bg-disabled rounded-xl z-50 absolute'></View>
                            )}
                            <SelectList data={itemTypes} setSelected={(val:string)=>setType(val)} defaultOption={type? {key:type, value:itemTypes.find(item => item.key === type)?.value }:undefined} placeholder='Тип' fontFamily='philosopher' search={false} boxStyles={{backgroundColor:"white", borderColor:"#D9D9D9", paddingHorizontal:12, width:"100%" }} dropdownStyles={{backgroundColor:"white"}} inputStyles={{fontSize:18}} save='key' />   
                        </View>
                        <View className='relative'>
                            {inputDisabled && (
                                <View className='w-full h-[46] bg-disabled rounded-xl z-50 absolute'></View>
                            )}                        
                            <SelectList data={itemMaterials} setSelected={(val:string)=>setMaterial(val)} defaultOption={material?{key:material, value:itemMaterials.find(item => item.key === material)?.value }:undefined} placeholder='Матеріал' fontFamily='philosopher' search={false} boxStyles={{backgroundColor:"white", borderColor:"#D9D9D9", paddingHorizontal:12, width:"100%" }} dropdownStyles={{backgroundColor:"white"}} inputStyles={{fontSize:18}} save='key' />
                        </View>
                        <View className='relative'>
                            {inputDisabled && (
                                <View className='w-full h-[46] bg-disabled rounded-xl z-50 absolute'></View>
                            )}
                            <SelectList data={itemPatterns} setSelected={(val:string)=>setPattern(val)} defaultOption={pattern?{key:pattern, value:itemPatterns.find(item => item.key === pattern)?.value }:undefined} placeholder='Принт' fontFamily='philosopher' search={false} boxStyles={{backgroundColor:"white", borderColor:"#D9D9D9", paddingHorizontal:12, width:"100%" }} dropdownStyles={{backgroundColor:"white"}} inputStyles={{fontSize:18}} save='key' />
                        </View>
                        <View className='flex-1 gap-0 relative'>
                            {inputDisabled && (
                                <View className='top-0 left-0 right-0 bottom-0 bg-disabled rounded-xl z-50 absolute'></View>
                            )}
                            <MultipleSelectList data={itemColors} setSelected={(val:string[])=>setColor(val)}  placeholder='Колір' label='Колір' fontFamily='philosopher' save='key' search={false} 
                                boxStyles={{backgroundColor:"white", borderColor:"#D9D9D9", borderBottomRightRadius:0, borderBottomLeftRadius:0, paddingHorizontal:12, minWidth:"100%"}} 
                                dropdownStyles={{backgroundColor:"white"}} 
                                inputStyles={{fontSize:18}}
                                labelStyles={{fontSize:18, fontStyle:'normal'}}
                                badgeStyles={{display:'none'}}
                                badgeTextStyles={{fontSize: 16}}
                             ///   disabledItemStyles={{backgroundColor:'white'}}
                            />
                            <View className='bg-white min-h-6 flex-row flex-wrap rounded-b-xl border-black-300 border border-t-0 -mt-3 py-1 px-3 gap-1'>
                                {color.map((colorKey) => {
                                const colorItem = itemColors.find((item) => item.key === colorKey);
                                if (!colorItem) return null;
                                return (
                                    <View key={colorKey} className='px-2 py-1 rounded-xl border' style={{ backgroundColor: colorItem.color, borderColor: colorKey==="white"? "#d9d9d9":"transparent" }}>
                                        <Text  className="text-lg font-philosopher" style={{ color: (colorKey === "black" ||colorKey === "blue" ||colorKey ==="brown" || colorKey ==="green" || colorKey ==="gray" ||colorKey ==="red"|| colorKey ==="purple" || colorKey ==="pink") ? "white" : "black" }}>
                                            {colorItem.value}
                                        </Text>
                                    </View>
                                );
                                })}
                            </View>
                        </View>
                        <View className='relative'>
                            {inputDisabled && (
                                <View className='w-full h-[46] bg-disabled rounded-xl z-50 absolute'></View>
                            )}
                            <SelectList data={colorDarkness} setSelected={(val:string)=>setColorDark(val)} defaultOption={colorDark?{key:colorDark, value:colorDarkness.find(item => item.key === colorDark)?.value }:undefined} placeholder='Світність кольору' fontFamily='philosopher' search={false} boxStyles={{backgroundColor:"white", borderColor:"#D9D9D9", paddingHorizontal:12, width:"100%" }} dropdownStyles={{backgroundColor:"white"}} inputStyles={{fontSize:18}} save='key'/>
                        </View>
                        <View className='relative'>
                            {inputDisabled && (
                                <View className='w-full h-[46] bg-disabled rounded-xl z-50 absolute'></View>
                            )}
                            <SelectList data={colorWarmness} setSelected={(val:string)=>setColorWarm(val)} defaultOption={colorWarm?{key:colorWarm, value:colorWarmness.find(item => item.key === colorWarm)?.value }:undefined} placeholder='Температура кольору' fontFamily='philosopher' search={false} boxStyles={{backgroundColor:"white", borderColor:"#D9D9D9", paddingHorizontal:12, width:"100%" }} dropdownStyles={{backgroundColor:"white"}} inputStyles={{fontSize:18}} save='key'/>
                        </View>
                        <View className='relative'>
                            {inputDisabled && (
                                <View className='w-full h-[46] bg-disabled rounded-xl z-50 absolute'></View>
                            )}
                            <SelectList data={itemFormalities} setSelected={(val:string)=>setFormality(val)} defaultOption={formality?{key:formality, value:itemFormalities.find(item => item.key === formality)?.value }:undefined} placeholder='Формальність' fontFamily='philosopher' search={false} boxStyles={{backgroundColor:"white", borderColor:"#D9D9D9", paddingHorizontal:12, width:"100%" }} dropdownStyles={{backgroundColor:"white"}} inputStyles={{fontSize:18}} save='key' />
                        </View>
                        <View className='relative'>
                            {inputDisabled && (
                                <View className='w-full h-[46] bg-disabled rounded-xl z-50 absolute'></View>
                            )}
                            <SelectList data={itemStyles} setSelected={(val:string)=>setStyle(val)} defaultOption={style?{key:style, value:itemStyles.find(item => item.key === style)?.value }:undefined} placeholder='Стиль' fontFamily='philosopher' search={false} boxStyles={{backgroundColor:"white", borderColor:"#D9D9D9", paddingHorizontal:12, width:"100%" }} dropdownStyles={{backgroundColor:"white"}} inputStyles={{fontSize:18}} save='key' />
                        </View>
                        <View className='relative'>
                            {inputDisabled && (
                                <View className='w-full h-[46] bg-disabled rounded-xl z-50 absolute'></View>
                            )}
                            <SelectList data={itemMoods} setSelected={(val:string)=>setMood(val)} defaultOption={mood?{key:mood, value:itemMoods.find(item => item.key === mood)?.value }:undefined} placeholder='Настрій' fontFamily='philosopher' search={false} boxStyles={{backgroundColor:"white", borderColor:"#D9D9D9", paddingHorizontal:12, width:"100%" }} dropdownStyles={{backgroundColor:"white"}} inputStyles={{fontSize:18}} save='key' />
                        </View>
                        <View className='relative'>
                            {inputDisabled && (
                                <View className='w-full h-[46] bg-disabled rounded-xl z-50 absolute'></View>
                            )}
                            <SelectList data={itemPurposes} setSelected={(val:string)=>setPurpose(val)} defaultOption={purporse?{key:purporse, value:itemPurposes.find(item => item.key === purporse)?.value }:undefined} placeholder='Мета' fontFamily='philosopher' search={false} boxStyles={{backgroundColor:"white", borderColor:"#D9D9D9", paddingHorizontal:12, width:"100%" }} dropdownStyles={{backgroundColor:"white"}} inputStyles={{fontSize:18}} save='key' />
                        </View>
                        <View className='relative'>
                            {inputDisabled && (
                                <View className='w-full h-[46] bg-disabled rounded-xl z-50 absolute'></View>
                            )}
                            <SelectList data={itemSeasons} setSelected={(val:string)=>setSeason(val)} defaultOption={season?{key:season, value:itemSeasons.find(item => item.key === season)?.value }:undefined} placeholder='Сезон' fontFamily='philosopher' search={false} boxStyles={{backgroundColor:"white", borderColor:"#D9D9D9", paddingHorizontal:12, width:"100%" }} dropdownStyles={{backgroundColor:"white"}} inputStyles={{fontSize:18}} save='key'/>
                        </View>
                        <View className='flex-row w-full gap-2'>
                            <View className='relative flex-1 flex-row items-center justify-start min-h-12 bg-white border border-black-300 border-solid rounded-xl px-3'>
                            {inputDisabled && (
                                <View className='top-0 left-0 right-0 bottom-0 bg-disabled rounded-xl z-50 absolute'></View>
                            )}
                                <TextInput value={tempMin} onChangeText={(val:string)=>setTempMin(val)} placeholder='Мін. температура' className='w-full h-full py-0 flex-1 leading-5  placeholder:text-black placeholder:font-philosopher placeholder:text-xl '/>
                            </View>
                            <View className='relative flex-1 flex-row items-center justify-start min-h-12  bg-white border border-black-300 border-solid rounded-xl px-3'>
                            {inputDisabled && (
                                <View className='top-0 left-0 right-0 bottom-0 bg-disabled rounded-xl z-50 absolute'></View>
                            )}
                                <TextInput value={tempMax} onChangeText={(val:string)=>setTempMax(val)} placeholder='Макс. температура' className='w-full h-full py-0 flex-1 leading-5  placeholder:text-black placeholder:font-philosopher placeholder:text-xl '/>
                            </View>
                        </View>
                        <MainButton text={itemToEdit? 'Змінити' :'Додати'} onPress={()=>submit()} />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default CreateItem;