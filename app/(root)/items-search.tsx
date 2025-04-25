import { ClothesCategory } from '@/components/clothesCategory';
import { MainButton, PlusButton, SearchButton } from '@/components/customButton';
import { SmallItemPreview } from '@/components/itemsPreview';
import { useProfile } from '@/components/ProfileContext';
import { TopNavigation } from '@/components/topNavigation';
import { API } from '@/constants/api';
import ClothingItem from '@/constants/clothingItem';
import icons from '@/constants/icons';
import { colorDarkness, colorWarmness, itemColors, itemFormalities, itemMaterials, itemMoods, itemPatterns, itemPurposes, itemSeasons, itemStyles, itemTypes } from '@/constants/itemCharacteristics';
import { useAuth } from '@/lib/useAuth';
import { useClothingItems } from '@/lib/UseClothingItems';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, SafeAreaView, ScrollView, Image, TouchableHighlight, KeyboardAvoidingView, Platform } from 'react-native';
import { MultipleSelectList, SelectList } from 'react-native-dropdown-select-list';



const ItemsSearch = () => {
    const {category, title} = useLocalSearchParams();
    const {auth, loading:authLoading} = useAuth();
    const {profile} = useProfile();
    
    const {
        loading,
        clothes,
        filteredClothes,
        handleSearch,
        color,
        setColor,
        type,
        setType,
        favourite,
        setFavourite,
        filtersAreActive,
        fetchAndUpdateClothes,
    } = useClothingItems();

    const [item, setItem] = useState<ClothingItem>();
    const [detailsShown, setDetailsShown]= useState(false);
    const [filtersShown, setFilersShown] = useState(false);


    useEffect(() => {
        handleSearch(true, false, false);
    }, [favourite]);

    useEffect(()=>{
        if(!item){
            return;
        }
        toggleDetails();
    },[item]);

    const addItemToFav = async (item: ClothingItem) => {
        console.log('favourite');
        try {
          const response = await fetch(`${API}/profile/${profile.id}/set-item-fav?item-id=${item.id}`, {
            method: 'PUT',
            headers: {
              Authorization: `Basic ${auth}`,
            },
          });
          if (!response.ok) throw new Error('Помилка add to fav item');
        } catch (error: any) {
          console.error(error.message);
        }
        item.favourite = !item.favourite
        fetchAndUpdateClothes();
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
        } 
        fetchAndUpdateClothes();
      };

    const toggleDetails = async()=>{
        setDetailsShown(!detailsShown);
    }
    const toggleFilters = async()=>{
        setFilersShown(!filtersShown);
    }
    const toggleFavorite = async()=> {
        setFavourite(!favourite);
    }

    const resetFilters = () => {
        setType('');
        setColor([]);
        setFavourite(false);
        handleSearch();
        toggleFilters();
    };
     
      
    return(
        <SafeAreaView className='px-5 h-full bg-primary relative w-screen' >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1">
            { (authLoading || loading) && (
                <View className="absolute top-0 left-0 right-0 bottom-0 bg-primary flex items-center justify-center z-50 flex-1">
                    <ActivityIndicator size="large" color="#828282" />
                </View>
            )}
            <ScrollView contentContainerStyle={{ flexGrow:1, justifyContent:'flex-start', alignContent:'center' }}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag" >
                {/* <TouchableHighlight  underlayColor='transperent' onPress={()=>router.push('/')}>
                    <Image  source={icons.logo} className="size-32" resizeMode="contain"/>
                    </TouchableHighlight> */}
                <TopNavigation arrowAction={()=>router.push('/wardrobe')}/>
                <View className='mt-40 items-center gap-4 w-11/12 justify-center content-center mx-auto relative'>
                    <Text className="font-philosopher-bold text-2xl text-center">{title}</Text>
                    {filtersShown && (
                        <View className=' pt-16 pb-5 px-3 w-full  absolute -top-2 left-0 rounded-xl bg-white z-50'>
                            <TopNavigation arrowAction={()=>toggleFilters()}/>
                            <SelectList data={category === 'all' ? itemTypes : itemTypes.filter(item => item.category === category)} setSelected={(val:string)=>setType(val)}  defaultOption={type? {key:type, value:itemTypes.find(item => item.key === type)?.value }:undefined} placeholder='Тип' fontFamily='philosopher' search={false} boxStyles={{backgroundColor:"white", borderColor:"#D9D9D9", paddingHorizontal:12, width:"100%" }} dropdownStyles={{backgroundColor:"white"}} inputStyles={{fontSize:18}} save='key' />
                            <MultipleSelectList data={itemColors} setSelected={(val:string[])=>setColor(val)}  placeholder='Колір' label='Колір' fontFamily='philosopher' save='key' search={false} 
                                boxStyles={{backgroundColor:"white", borderColor:"#D9D9D9", borderBottomRightRadius:0, borderBottomLeftRadius:0, paddingHorizontal:12, minWidth:"100%", marginTop:32}} 
                                dropdownStyles={{backgroundColor:"white"}} 
                                inputStyles={{fontSize:18}}
                                labelStyles={{fontSize:18, fontStyle:'normal'}}
                                badgeStyles={{display:'none'}}
                            />
                            <View className='bg-white min-h-6 flex-row flex-wrap rounded-b-xl border-black-300 border border-t-0 -mt-3 py-1 px-3 gap-1 mb-8'>
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
                            <View className='flex-row gap-2'>
                                <MainButton text='Скинути фільтри' onPress={()=>resetFilters()} color='#828282'  />
                                <MainButton disabled={!filtersAreActive} text='Застосувати' onPress={()=>{type ? (color.length>0? handleSearch(false, true, true) : handleSearch(false, true, false)) : (color.length>0? handleSearch(false, false, true) : handleSearch(false, false, false)); toggleFilters()}} />
                            </View>
                        </View>
                    )}            
                    <View className='flex-row w-full justify-between items-center '>
                        <TouchableHighlight onPress={()=>toggleFilters()} underlayColor={'#d9d9d9'} className='bg-white rounded-lg p-2 self-end '>
                            <Feather name="sliders" size={30} color="black" />
                        </TouchableHighlight>                    
                        <TouchableHighlight onPress={()=>toggleFavorite()} underlayColor="transperent" className='rounded-lg bg-white p-2'>
                            {favourite ? (
                            <MaterialIcons name="favorite" size={30} color="#fb3f4a" />
                            ):(
                            <MaterialIcons name="favorite-border" size={30} color="#fb3f4a" />
                            )}
                        </TouchableHighlight>
                    </View>
                    
                    <View className='flex-row flex-wrap gap-6 content-start justify-start items-start self-start w-full min-h-[70%] relative'>
                        {filteredClothes.length > 0 ? 
                        (
                            filteredClothes.map(item => (
                                <SmallItemPreview key ={item.id} image={item.public_url} favourite={item.favourite} onPress={()=>setItem(item)}  />
                            ))
                        ):(
                            <Text className='font-philosopher text-xl text-black-200 absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2'>Одяг не знайдено</Text>
                        )}
                    </View>
                </View>
                
            </ScrollView>    
            </KeyboardAvoidingView>
                    {(detailsShown && item) && (
                        <View className='absolute  items-center justify-center  inset-0 bg-black/30 backdrop-blur-xl'>
                            <View className='bg-primary w-11/12 pt-8 pb-4 items-center justify-center  z-50 rounded-lg  shadow-xl shadow-black-200[06]'>
                                <TopNavigation arrowAction={()=>toggleDetails()} binAction={()=>deleteItem(item.id)}></TopNavigation>
                                <View className='bg-white w-full items-center p-2 pt-4 mt-5'>
                                    <Image  source={{uri:item?.public_url}} className='size-48' resizeMode='contain'/>
                                    <View className='flex-row justify-between w-full px-1'>
                                        <TouchableHighlight onPress={()=>router.push({pathname:'/(root)/create-item', params:{itemEdit: JSON.stringify(item)}})} underlayColor='transperent'>
                                            <Feather name="edit-3" size={30} color="black" />
                                        </TouchableHighlight>
                                        <TouchableHighlight onPress={()=>addItemToFav(item)} underlayColor='transperent'>
                                        {item.favourite ? (
                                            <MaterialIcons name="favorite" size={32} color="#fb3f4a" />
                                        ):(
                                            <MaterialIcons name="favorite-border" size={32} color="#fb3f4a" />
                                        )}
                                        </TouchableHighlight>
                                    </View>
                                </View>
                                <View className='gap-1'>
                                    <Text className='font-philosopher text-xl text-center'>
                                        <Text className='font-philosopher-bold'>Тип: </Text> 
                                        {itemTypes.find((val)=>val.key === item?.type)?.value}
                                    </Text>
                                    <Text className='font-philosopher text-xl text-center'>
                                        <Text className='font-philosopher-bold'>Матеріал: </Text>
                                        {itemMaterials.find((val)=>val.key === item?.material)?.value}
                                    </Text>
                                    <Text className='font-philosopher text-xl text-center'>
                                        <Text className='font-philosopher-bold'>Принт: </Text>
                                        {itemPatterns.find((val)=>val.key === item?.pattern)?.value}
                                    </Text>
                                    <View className='flex-row gap-1 items-center justify-center'>
                                        <Text className='font-philosopher-bold text-xl text-center'>Колір: </Text>
                                        {item?.colors.map((colorKey) => {
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
                                    <Text className='font-philosopher text-xl text-center'>
                                        <Text className='font-philosopher-bold'>Світність кольору: </Text> 
                                        {colorDarkness.find((val)=>val.key === item?.color_darkness)?.value}
                                    </Text>
                                    <Text className='font-philosopher text-xl text-center'>
                                        <Text className='font-philosopher-bold'>Теплота кольору: </Text>
                                        {colorWarmness.find((val)=>val.key === item?.color_warmness)?.value}
                                    </Text>
                                    <Text className='font-philosopher text-xl text-center'>
                                        <Text className='font-philosopher-bold'>Стиль: </Text>
                                        {itemStyles.find((val)=>val.key === item?.style)?.value}
                                    </Text>
                                    <Text className='font-philosopher text-xl text-center'>
                                        <Text className='font-philosopher-bold'>Настрій: </Text> 
                                        {itemMoods.find((val)=>val.key === item?.mood)?.value}
                                    </Text>
                                    <Text className='font-philosopher text-xl text-center'>
                                        <Text className='font-philosopher-bold'>Формальність: </Text>
                                        {itemFormalities.find((val)=>val.key === item?.formality)?.value}
                                    </Text>
                                    <Text className='font-philosopher text-xl text-center'>
                                        <Text className='font-philosopher-bold'>Призначення: </Text> 
                                        {itemPurposes.find((val)=>val.key === item?.purpose)?.value}
                                    </Text>
                                    <Text className='font-philosopher text-xl text-center'>
                                        <Text className='font-philosopher-bold'>Пора року: </Text> 
                                        {itemSeasons.find((val)=>val.key === item?.season)?.value}
                                    </Text>
                                    <Text className='font-philosopher text-xl text-center'>
                                        <Text className='font-philosopher-bold'>Мінімальна температура: </Text> 
                                        {item?.temperature_min}
                                    </Text>
                                    <Text className='font-philosopher text-xl text-center'>
                                        <Text className='font-philosopher-bold'>Максимальна температура: </Text> 
                                        {item?.temperature_max}
                                    </Text>
                                </View>
                                <View className='px-4 w-full mt-4 flex-row'>
                                    <MainButton text='Використати' onPress={()=>router.push('/')} />
                                </View>
                            </View>
                        </View>
                    )}
        </SafeAreaView>
    )
}

export default ItemsSearch;