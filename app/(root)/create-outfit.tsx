import { MainButton, PlusButton } from '@/components/customButton';
import { Item } from '@/components/itemEdit';
import { SmallItemPreview } from '@/components/itemsPreview';
import ItemsSearch from '@/components/itemsToOutfit';
import { useProfile } from '@/components/ProfileContext';
import { TopNavigation } from '@/components/topNavigation';
import ClothingItem from '@/constants/clothingItem';
import { useAuth } from '@/lib/useAuth';
import { useClothingItems } from '@/lib/UseClothingItems';
import Feather from '@expo/vector-icons/Feather';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, TextInput, TouchableHighlight, View, Text, Button, Pressable, Alert, TouchableWithoutFeedback } from 'react-native';

const formatDate = (rawDate:Date)=>{
    let year= rawDate.getFullYear();
    let month: string = (rawDate.getMonth() + 1).toString().padStart(2, "0");
    let day: string = rawDate.getDate().toString().padStart(2, "0");
    return `${day}-${month}-${year}`;
};

const CreateOutfit = () =>  {
    const {profile, loading:profileLoading, setProfile } = useProfile();
    const {auth, loading:authLoading} = useAuth();
    const {date} = useLocalSearchParams();

    const [selectedDates, setDates] = useState<string[]>(date ? [formatDate(new Date(date as string))] : [dayjs().format("DD-MM-YYYY")]);
    const [newDate, setNewDate]=useState(new Date());
    const [showPicker, setShowPicker]=useState(false);

    const [showSearch, setShowSearch] = useState(false);
    const [selectedItems, setSelectedItems] = useState<{ [key: number]: ClothingItem | null }>({});
    const [activePosition, setActivePosition] = useState<number | null>(null);    
    
    const [zOrderMap, setZOrderMap] = useState<{ [key: number]: number }>({});
    const [zCounter, setZCounter] = useState(1);
    const [editMap, setEditMap] = useState<{[key:number]: boolean }>({});

    const [text, setText] = useState('')
    
    const {
        loading,
        filteredClothes,
        handleSearch,
        color,
        setColor,
        type,
        setType,
        favourite,
        setFavourite,
        fetchClothes
    } = useClothingItems();
    
    const toggleDatepicker = () =>{
        setShowPicker(!showPicker);
    };
    
    const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        const { type } = event;
        if (type === 'set' && selectedDate) {
            if (Platform.OS === 'android') {
              const formatted = formatDate(selectedDate);
              if (!selectedDates.includes(formatted)) {
                setDates(prev => {
                    const all = [...prev, formatted];
                    const unique = Array.from(new Set(all));
                    unique.sort((a, b) => parseFormattedDate(a).getTime() - parseFormattedDate(b).getTime());
                    return unique;
                });
              }
              toggleDatepicker();
            } else {
              setNewDate(selectedDate);
            }
        } else {
            toggleDatepicker();
        }
    };
    
    const confirmIOSDate = ()=>{
        const formatted = formatDate(newDate);
        if (!selectedDates.includes(formatted)) {
          setDates(prev => {
            const all = [...prev, formatted];
            const unique = Array.from(new Set(all));
            unique.sort((a, b) => parseFormattedDate(a).getTime() - parseFormattedDate(b).getTime());
            return unique;
        });
        }
        toggleDatepicker();
    };

    const parseFormattedDate = (str: string) => {
        const [day, month, year] = str.split("-").map(Number);
        return new Date(year, month - 1, day);
    };

    const deleteDate = (i:number)=>{
        Alert.alert('Видалити дату?', '', [{
            text: 'Скасувати',
            style: 'cancel',
            onPress: () => {},
          },
          {
            text: 'Видалити',
            style: 'destructive',
            onPress: () => {const updatedDates = selectedDates.filter((_, index) => index!=i)
                    setDates(updatedDates);},
          },
        ], {cancelable: true})
        
    }
    
    const goBack = async()=>{
        router.push('/')
    }

    const openItemSearch = (position: number) => {
        setActivePosition(position);
        setShowSearch(true);
      };
    
    const handleSetItem = (item: ClothingItem) => {
        if (activePosition !== null) {
          setSelectedItems(prev => ({ ...prev, [activePosition]: item }));
          setShowSearch(false);
        }
    };

    const handlePress = (position: number) => {
        setZCounter(prev => prev + 1);
        setZOrderMap(prev => ({
          ...prev,
          [position]: zCounter
        }));
        setActivePosition(position);
    };

    const setEdit = (position:number, value:boolean) => {
        setEditMap(prev => ({ ...prev, [position]: value }));
    };
      
    const isEditing = (position:number) => {
        return !!editMap[position];
    };
    
    const handleDeleteItem = (position: number) => {
        setSelectedItems(prev => ({ ...prev, [position]: null }));
    };

    const downloadImage = async()=>{

    }

    const createOutfit = async()=>{

    }

    return (
        <TouchableWithoutFeedback onPress={() => {
            const newMap: { [key: number]: boolean } = {};
            Object.keys(editMap).forEach(key => {
            newMap[Number(key)] = false;
            });
            setEditMap(newMap);
        }}>
        <SafeAreaView className='px-5 h-full bg-primary ' >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
           { (authLoading || profileLoading) && (
                <View className="absolute top-0 left-0 right-0 bottom-0 bg-primary flex items-center justify-center z-50 flex-1">
                    <ActivityIndicator size="large" color="#828282" />
                </View>
            )}
            <ScrollView 
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{flexGrow: 1, justifyContent:'space-between', alignContent:'center',  alignItems:'center', width:'95%', marginHorizontal:'auto' }} 
            >
                <TopNavigation arrowAction={goBack} />
                <View className='mt-24'>
                    <View className='bg-white py-6 rounded-xl gap-y-3 mb-1.5'>
                        <View className='flex-row w-full justify-around items-center'>
                            <Item position={0} activePosition={activePosition} setActivePosition={()=>handlePress(0)}  edit={isEditing(0)} setEdit={(value:boolean) => setEdit(0, value)} item={selectedItems[0]} deleteItem={()=>handleDeleteItem(0)} openSearch={()=> openItemSearch(0)}></Item>
                            <Item position={1} activePosition={activePosition} setActivePosition={()=>handlePress(1)}  edit={isEditing(1)} setEdit={(value:boolean) => setEdit(1, value)} item={selectedItems[1]} deleteItem={()=>handleDeleteItem(1)} openSearch={()=> openItemSearch(1)}></Item>
                            <Item position={2} activePosition={activePosition} setActivePosition={()=>handlePress(2)}  edit={isEditing(2)} setEdit={(value:boolean) => setEdit(2, value)}item={selectedItems[2]} deleteItem={()=>handleDeleteItem(2)} openSearch={()=> openItemSearch(2)}></Item>
                        </View>
                        <View className='flex-row w-full justify-around items-center'>
                            <Item position={8} activePosition={activePosition} setActivePosition={()=>handlePress(8)}  edit={isEditing(8)} setEdit={(value:boolean) => setEdit(8, value)} item={selectedItems[8]} deleteItem={()=>handleDeleteItem(8)} openSearch={()=> openItemSearch(8)}></Item>
                            <View className='relative w-[130px] h-[235px]'>
                                <View className={`absolute top-0 right-0 `} style={{ zIndex: zOrderMap[4] ?? 1 }}>
                                    <Item position={4} activePosition={activePosition} setActivePosition={()=>handlePress(4)}  edit={isEditing(4)} setEdit={(value:boolean) => setEdit(4, value)} item={selectedItems[4]} deleteItem={()=>handleDeleteItem(4)} openSearch={()=> openItemSearch(4)}></Item>
                                </View>
                                <View className={`absolute bottom-0 right-0 -translate-y-1/4 ${selectedItems[7] ? '':'-z-0'}`} style={{ zIndex: zOrderMap[7] ?? 1 }}>
                                    <Item position={7} activePosition={activePosition} setActivePosition={()=>handlePress(7)}  edit={isEditing(7)} setEdit={(value:boolean) => setEdit(7, value)} item={selectedItems[7]} deleteItem={()=>handleDeleteItem(7)} openSearch={()=> openItemSearch(7)}></Item>
                                </View>
                                <View className={`absolute bottom-0 left-0 ${selectedItems[6] ? '':'bg-white'}`} style={{ zIndex: zOrderMap[6] ?? 1 }}>
                                    <Item position={6} activePosition={activePosition} setActivePosition={()=>handlePress(6)}  edit={isEditing(6)} setEdit={(value:boolean) => setEdit(6, value)} item={selectedItems[6]} deleteItem={()=>handleDeleteItem(6)} openSearch={()=> openItemSearch(6)}></Item>
                                </View>
                                <View className={`absolute top-0 left-0 translate-y-1/4 ${selectedItems[3] ? '':'bg-white rounded-tr-[40%]'}`} style={{ zIndex: zOrderMap[3] ?? 1 }} >
                                    <Item position={3} activePosition={activePosition} setActivePosition={()=>handlePress(3)}  edit={isEditing(3)} setEdit={(value:boolean) => setEdit(3, value)} item={selectedItems[3]} deleteItem={()=>handleDeleteItem(3)} openSearch={()=> openItemSearch(3)}></Item>
                                </View>
                            </View>
                            <Item position={5} activePosition={activePosition} setActivePosition={()=>handlePress(5)} edit={isEditing(5)} setEdit={(value:boolean) => setEdit(5, value)} item={selectedItems[5]} deleteItem={()=>handleDeleteItem(5)} openSearch={()=> openItemSearch(5)}></Item>
                        </View>
                        <View className='flex-row justify-center items-center'>
                            <Item position={9} activePosition={activePosition} setActivePosition={()=>handlePress(9)}  edit={isEditing(9)} setEdit={(value:boolean) => setEdit(9, value)} item={selectedItems[9]} deleteItem={()=>handleDeleteItem(9)} openSearch={()=> openItemSearch(9)}></Item>
                            <Item position={10} activePosition={activePosition} setActivePosition={()=>handlePress(10)}  edit={isEditing(10)} setEdit={(value:boolean) => setEdit(10, value)} item={selectedItems[10]} deleteItem={()=>handleDeleteItem(10)} openSearch={()=> openItemSearch(10)}></Item>
                        </View>
                    </View>
                    <TouchableHighlight onPress={downloadImage} underlayColor='transperent' className='self-end'>
                        <Feather name="download" size={28} color="black" className='' />
                    </TouchableHighlight>
                </View>
                <TextInput value={text} onChangeText={setText} multiline numberOfLines={1} placeholder='Додати опис...' className=' w-full leading-norma placeholder:text-black placeholder:font-philosopher placeholder:text-xl' style={{ textAlignVertical: 'top' }}></TextInput>
                <View className='flex-row gap-2 w-full flex-wrap items-center  justify-start'>
                    <Text className='font-philosopher-bold text-xl'>Заплановано на:</Text>
                    {selectedDates.map((selectedDate, i) =>
                        < >
                        <Pressable key={i} onLongPress={()=>deleteDate(i)}>
                            <Text  className='font-philosopher text-xl'>{selectedDate}</Text>
                        </Pressable>
                        {i !== selectedDates.length-1 && (
                            <Text className=''>/</Text>
                        )}
                        </>
                    )}
                    <PlusButton size={18} onPress={toggleDatepicker} />
                </View>
                <View className='flex-row'>
                    <MainButton text='Створити' onPress={createOutfit} />
                </View>

            </ScrollView>
            </KeyboardAvoidingView>
                {showPicker && (
                    <>
                    <DateTimePicker mode='date' display='spinner' value={newDate} onChange={onChange} minimumDate={new Date()} textColor='black' style={{marginHorizontal:'auto'}} />
                    {showPicker && Platform.OS==='ios'&&(
                        <View className= ' flex-row gap-1 w-11/12 mx-auto'>
                            <MainButton text='Скасувати' onPress={toggleDatepicker} color='#c2c2c2'/>
                            <MainButton text='Вибрати' onPress={confirmIOSDate} />
                        </View>
                    )}
                    </>
                )}
            {showSearch && (
                <ItemsSearch onClose={()=>{setShowSearch(false); setActivePosition(null);}} filteredClothes={filteredClothes} setItem={handleSetItem} />     
            )}
        </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}

export default CreateOutfit;