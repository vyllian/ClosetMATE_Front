import { OutfitBig } from "@/components/outfitPreview";
import { TopNavigation } from "@/components/topNavigation";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { KeyboardAvoidingView, Platform, SafeAreaView, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const ChooseOutfit = () => {
 const { outfits, date} = useLocalSearchParams();
 const parsedOutfits = typeof outfits === 'string' ? JSON.parse(outfits) : outfits;
 console.log(parsedOutfits);
 
    
    const chooseOutfit = (itemsWithPosition: any[])=>{
        const passedItemsObj: { [position: number]: any } = {};
        itemsWithPosition.forEach((el) => {
          passedItemsObj[el.position] = el.item ?? el;
        });
        router.push({pathname:"/(root)/create-outfit", params:{date:date, passedItems:JSON.stringify(passedItemsObj)}})
    }

  return (
    <SafeAreaView className="px-5 h-full bg-primary relative w-screen">
      <View className="mt-5">
        <TopNavigation arrowAction={() => router.push("/test")} />
      </View>
        <ScrollView
        style={{flex:1}}
          contentContainerStyle={{
            // justifyContent: "flex-end",
            alignContent: "center",
            marginTop:40,
          }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
            {parsedOutfits.map((outfit:any, index:number)=>(
                <OutfitBig key={index} items={outfit} onPress={(itemsWithPositions)=>chooseOutfit(itemsWithPositions)}></OutfitBig>
            ))}
        </ScrollView>
    </SafeAreaView>
  );
};
export default ChooseOutfit;
