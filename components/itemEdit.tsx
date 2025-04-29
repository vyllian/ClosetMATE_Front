import React, { cloneElement, useEffect, useState } from 'react';
import { Image, ImageBackground, TouchableHighlight, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import Feather from '@expo/vector-icons/Feather';
import ClothingItem from '@/constants/clothingItem';
import { canvaImg } from '@/constants/canvasImages';
import AntDesign from '@expo/vector-icons/AntDesign';



export const Item = (
    {position, activePosition, setActivePosition, edit, setEdit, item, deleteItem, openSearch}
    :{position: number,activePosition: number | null, setActivePosition: any, edit:boolean, setEdit:any, item?:ClothingItem | null, deleteItem:() => void, openSearch:() => void }
 )=>{
    const [bg, setBg] = useState(canvaImg.filter(el => el.position===position)) 
    const [size, setSize] = useState<{ width: number; height: number } | null>(null);    

    useEffect(() => {
        if (!item) return;
        Image.getSize(
          item.public_url,
          (width, height) => {
            const newSize = resizeImage(width, height, {width: bg[0].width})
            setSize(newSize);
          },
          (error) => {
            console.error('Помилка завантаження зображення:', error);
          }
        );
    }, [item]);

    const resizeImage = (
        originalWidth: number,
        originalHeight: number,
        options: {width?:number, height?:number}
      ) => {
        if (options.width) {
          const ratio = options.width / originalWidth;
          return {
            width: options.width,
            height: originalHeight * ratio,
          };
        } else if (options.height) {
          const ratio = options.height / originalHeight;
          return {
            width: originalWidth * ratio,
            height: options.height,
          };
        } else {
          return {
            width: originalWidth,
            height: originalHeight,
          };
        }
      };

    const toggleEdit = ()=>{

        setEdit(!edit)
    }
    
    const resizeItem = ()=>{

    }
    const rotateItem = ()=>{

    }

    return(
        <>
        <View className={`relative border ${edit ? 'border-black-100' : 'border-transparent '}`} >
            <TouchableHighlight onPress={()=>{setActivePosition(); if (!item) openSearch();}} onLongPress={item ? ()=>setEdit(true) : ()=>{}} underlayColor='trasperent'>
                {item ? (
                <Image source={{uri: item.public_url}} style={{width: size?.width, height: size?.height}} resizeMode='contain'/>
                ):(
                <ImageBackground source={bg[0].image} style={{width: bg[0].width, height: bg[0].height}} className='justify-center items-center'>
                    <AntDesign name="pluscircleo" size={12} color="black" className='bg-white rounded-full  '/>
                </ImageBackground>
                )}
            </TouchableHighlight>
            { (item && edit) && (
                <>
                <TouchableHighlight onPress={openSearch} underlayColor='trasperent' className='rounded-full bg-black size-8 justify-center items-center absolute left-0 top-0 -translate-x-1/3 -translate-y-1/3'>
                    <Ionicons name="shuffle" size={20} color="white" />
                </TouchableHighlight>
                <TouchableHighlight onPress={()=>{setEdit(false); deleteItem()}} underlayColor='trasperent' className='rounded-full bg-danger size-8 justify-center items-center absolute right-0 top-0 translate-x-1/3 -translate-y-1/3'>
                    <FontAwesome name="trash-o" size={20} color="white" />
                </TouchableHighlight>
                <TouchableHighlight onPress={resizeItem} underlayColor='trasperent' className='rounded-full bg-black size-8 justify-center items-center absolute right-0 bottom-0 translate-x-1/3 translate-y-1/3'>
                    <SimpleLineIcons name="size-fullscreen" size={16} color="white" />
                </TouchableHighlight>
                <TouchableHighlight onPress={rotateItem} underlayColor='trasperent' className='rounded-full bg-black size-8 justify-center items-center absolute left-0 bottom-0 -translate-x-1/3 translate-y-1/3'>
                    <Feather name="rotate-cw" size={18} color="white" />
                </TouchableHighlight>
                </>
            )}
        </View>
        </>

    )

}