import { View, Text, TouchableWithoutFeedback, Keyboard, Pressable, ScrollView, Modal, TouchableHighlight } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, withSpring, useAnimatedStyle, runOnJS } from 'react-native-reanimated';
import { SmallItemPreview } from './itemsPreview';
import ClothingItem from '@/constants/clothingItem';
import { MultipleSelectList, SelectList } from 'react-native-dropdown-select-list';
import { itemCategories, itemColors, itemTypes } from '@/constants/itemCharacteristics';
import { useEffect, useState } from 'react';
import { useClothingItems } from '@/lib/UseClothingItems';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const ItemsSearch = ({ onClose, setItem }:{ onClose:()=>void, setItem:(it:ClothingItem)=>void}) => {
    
    const {
      loading,
      clothes,
      filteredClothes,
      handleSearch,
      color,
      setColor,
      type,
      setType,
      cat,
      setCat,
      favourite,
      setFavourite,
      filtersAreActive,
      fetchAndUpdateClothes,
    } = useClothingItems();

    const toggleFavorite = ()=>{
      setFavourite(!favourite);
    }

    useEffect(() => {
      handleSearch();
    }, [cat, type, favourite, color]);

  

    const translateY = useSharedValue(0);
    const gesture = Gesture.Pan()
      .onUpdate((e) => {
        if (e.translationY > 0) {
          translateY.value = e.translationY;
        }
      })
      .onEnd((e) => {
        if (e.translationY > 100) {
          runOnJS(onClose)(); 
        } else {
          translateY.value = withSpring(0);
        }
      });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (

      <View className="absolute top-0 bottom-0 left-0 right-0 bg-black/25">
        <Pressable onPress={() => {}} className="flex-1">
          <GestureDetector gesture={gesture}>
            <Animated.View
              style={animatedStyle}
              className="h-3/5 absolute bottom-0 w-full rounded-t-3xl px-[17px] border border-black-200 bg-primary"
            >
              <View className="h-1.5 w-4/12 bg-black-200 rounded-full self-center my-3" /> 
              <View className='w-full flex-row gap-2 items-center '>
                <View className='flex-1'>
                  <SelectList data={itemCategories} 
                  setSelected={(val:string)=>setCat(val)}  
                    defaultOption={cat? {key:cat, value:itemCategories.find(item => item.key === cat)?.value }:undefined} 
                    placeholder='Категорія' 
                    fontFamily='philosopher' 
                    search={false} 
                    boxStyles={{backgroundColor:"white", borderColor:"#D9D9D9", paddingHorizontal:12, height:45}} 
                    dropdownStyles={{backgroundColor:"white"}} 
                    inputStyles={{fontSize:18}} 
                    save='key' />
                </View>
                <View className='flex-1'>
                  <SelectList data={cat === 'all' ? itemTypes : itemTypes.filter(item => item.category === cat)} 
                    setSelected={(val:string)=>setType(val)}  
                    defaultOption={type? {key:type, value:itemTypes.find(item => item.key === type)?.value }:undefined} 
                    placeholder='Тип' 
                    fontFamily='philosopher' 
                    search={false} 
                    boxStyles={{backgroundColor:"white", borderColor:"#D9D9D9", paddingHorizontal:12,  height:45}} 
                    dropdownStyles={{backgroundColor:"white"}} 
                    inputStyles={{fontSize:18}} 
                    save='key' />
                </View>
                <TouchableHighlight onPress={()=>toggleFavorite()} underlayColor="transperent" className='rounded-xl border-black-300 border bg-white p-2'>
                  {favourite ? (
                    <MaterialIcons name="favorite" size={28} color="#fb3f4a" />
                    ):(
                    <MaterialIcons name="favorite-border" size={28} color="#fb3f4a" />
                  )}
                </TouchableHighlight>
              </View>
              <MultipleSelectList data={itemColors} setSelected={(val:string[])=>setColor(val)}  placeholder='Колір' label='Колір' fontFamily='philosopher' save='key' search={false} 
                boxStyles={{backgroundColor:"white", borderColor:"#D9D9D9", borderBottomRightRadius:0, borderBottomLeftRadius:0, paddingHorizontal:12, minWidth:"100%", marginTop:12,  height:45}} 
                dropdownStyles={{backgroundColor:"white"}} 
                inputStyles={{fontSize:18}}
                labelStyles={{fontSize:18, fontStyle:'normal'}}
                badgeStyles={{display:'none'}}
              />
              <View className='bg-white min-h-6 flex-row flex-wrap rounded-b-xl border-black-300 border border-t-0 -mt-3 py-1 px-3 gap-1 mb-6'>
                {color.map((colorKey) => {
                  const colorItem = itemColors.find((item) => item.key === colorKey);
                  if (!colorItem) return null;
                  return (
                    <Pressable key={colorKey} onPress={()=>setColor(prev => prev.filter(col => col !== colorKey))}>
                      <View className='px-2 py-1 rounded-xl border' style={{ backgroundColor: colorItem.color, borderColor: colorKey==="white"? "#d9d9d9":"transparent" }}>
                          <Text  className="text-lg font-philosopher" style={{ color: (colorKey === "black" ||colorKey === "blue" ||colorKey ==="brown" || colorKey ==="green" || colorKey ==="gray" ||colorKey ==="red"|| colorKey ==="purple" || colorKey ==="pink") ? "white" : "black" }}>
                              {colorItem.value}
                          </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
              <ScrollView>
                <View className="mx-auto flex-row flex-wrap gap-6 content-start justify-start items-center self-start w-full min-h-[70%] relative">
                  {filteredClothes.length > 0 ? (
                    filteredClothes.map((item) => (
                      <SmallItemPreview
                        key={item.id}
                        image={item.publicUrl}
                        favourite={item.favourite}
                        onPress={() => setItem(item)}
                      />
                    ))
                  ) : (
                    <Text className="font-philosopher text-xl text-black-200 absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      Одяг не знайдено
                    </Text>
                  )}
                </View>
              </ScrollView>
            </Animated.View>
          </GestureDetector>
        </Pressable>
      </View>
  );
};

export default ItemsSearch;