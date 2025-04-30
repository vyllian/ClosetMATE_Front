import React, { cloneElement, useEffect, useState } from 'react';
import { Image, ImageBackground, TouchableHighlight, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import Feather from '@expo/vector-icons/Feather';
import ClothingItem from '@/constants/clothingItem';
import { canvaImg } from '@/constants/canvasImages';
import AntDesign from '@expo/vector-icons/AntDesign';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';



export const Item = (
    {position,
    setActivePosition, 
    edit, 
    setEdit, 
    item, 
    scale,
    setScale,
    rotation,
    setRotation,
    flipVertical,
    setFlipVertical,
    flipHorizontal,
    setFlipHorizontal,
    deleteItem, 
    openSearch
  }:{
    position: number, 
    setActivePosition: any, 
    edit:boolean, setEdit:any, 
    item:ClothingItem | null,
    scale: number;
    setScale: (val: number) => void;
    rotation: number;
    setRotation: (val: number) => void; 
    flipVertical: boolean;
    setFlipVertical: (val: boolean) => void;
    flipHorizontal: boolean;
    setFlipHorizontal: (val: boolean) => void;
    deleteItem:() => void, 
    openSearch:() => void }
 )=>{
    const [bg, setBg] = useState(canvaImg.filter(el => el.position===position)) 
    const [size, setSize] = useState<{ width: number; height: number } | null>(null);   
    
    const scaleShared = useSharedValue(scale);
    const rotationShared = useSharedValue(rotation);

    // оновлювати внутрішній shared value при зміні scale/rotation з батьківського компонента
    useEffect(() => {
      scaleShared.value = scale;
    }, [scale]);

    useEffect(() => {
      rotationShared.value = rotation;
    }, [rotation]);

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

    const pinchGesture = Gesture.Pinch()
      .onUpdate((e) => {
        scaleShared.value = e.scale;
      })
      .onEnd(() => {
        runOnJS(setScale)(scaleShared.value);
      });
    
    const rotationGesture = Gesture.Rotation()
      .onUpdate((e) => {
        rotationShared.value = e.rotation;
      })
      .onEnd(() => {
        runOnJS(setRotation)(rotationShared.value);
      });
      
    const composedGesture = Gesture.Simultaneous(pinchGesture, rotationGesture);

    const containerAnimatedStyle =  useAnimatedStyle(() => {
      return {
        transform: [
          { scale: scaleShared.value },
          { rotateZ: `${rotationShared.value}rad` },

        ],
      };
    });
    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [
         
          { scaleY: flipVertical ? -1 : 1 },
          { scaleX: flipHorizontal ? -1 : 1 },
        ],
      };
    });

   
  return(
        <GestureDetector gesture={composedGesture}>
          <Animated.View style={containerAnimatedStyle}>

              <View className={`relative border p-1 ${edit ? 'border-black-200' : 'border-transparent'}`} >
                <Animated.View style={animatedStyle}>
  
                <TouchableHighlight onPress={()=>{setActivePosition(); if (!item) openSearch();}} onLongPress={item ? ()=>toggleEdit() : ()=>{}} underlayColor='trasperent'>
                    {item ? (
                    
                      <Image source={{uri: item.public_url}} style={{width: size?.width, height: size?.height}} resizeMode='contain'/>
                    ):(
                    <ImageBackground source={bg[0].image} style={{width: bg[0].width, height: bg[0].height}} className='justify-center items-center'>
                        <AntDesign name="pluscircleo" size={12} color="black" className='bg-white rounded-full  '/>
                    </ImageBackground>
                    )}
                </TouchableHighlight>
                </Animated.View>
                { (item && edit) && (
                  <>
                  <TouchableHighlight onPress={openSearch} underlayColor='trasperent' className='rounded-full bg-black size-8 justify-center items-center absolute left-0 top-0 -translate-x-3/4 -translate-y-2/3'>
                        <Ionicons name="shuffle" size={20} color="white" />
                    </TouchableHighlight>
                    <TouchableHighlight onPress={()=>{setEdit(false); deleteItem()}} underlayColor='trasperent' className='rounded-full bg-danger size-8 justify-center items-center absolute right-0 top-0 translate-x-3/4 -translate-y-2/3'>
                        <FontAwesome name="trash-o" size={20} color="white" />
                    </TouchableHighlight>
                    <TouchableHighlight onPress={() => setFlipVertical(!flipVertical)} underlayColor='trasperent' className='rounded-full bg-black size-8 justify-center items-center absolute right-0 bottom-0 translate-x-3/4 translate-y-2/3'>
                      <Ionicons name="swap-vertical-outline" size={20} color="white" />                    
                    </TouchableHighlight>
                    <TouchableHighlight onPress={() => setFlipHorizontal(!flipHorizontal)} underlayColor='trasperent' className='rounded-full bg-black size-8 justify-center items-center absolute left-0 bottom-0 -translate-x-3/4 translate-y-2/3'>
                        <Ionicons name="swap-horizontal" size={20} color="white" />                    
                    </TouchableHighlight>
                    </>
                )}
            </View>
          </Animated.View>
        </GestureDetector>
    )

}