import { View, Text, TouchableWithoutFeedback, Keyboard, Pressable, ScrollView, Modal } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, withSpring, useAnimatedStyle, runOnJS } from 'react-native-reanimated';
import { SmallItemPreview } from './itemsPreview';
import ClothingItem from '@/constants/clothingItem';

const ItemsSearch = ({ onClose, filteredClothes, setItem }:{ onClose:()=>void, filteredClothes:ClothingItem[], setItem:(it:ClothingItem)=>void}) => {

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
              className="h-3/5 absolute bottom-0 w-full rounded-t-3xl border border-black-200 bg-primary"
            >
              <View className="h-2 w-4/12 bg-black-200 rounded-full self-center my-2" /> 
              
              <ScrollView>
                <View className="  mx-auto flex-row flex-wrap gap-5 content-start justify-start items-center self-start w-11/12 min-h-[70%] relative">
                  {filteredClothes.length > 0 ? (
                    filteredClothes.map((item) => (
                      <SmallItemPreview
                        key={item.id}
                        image={item.public_url}
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