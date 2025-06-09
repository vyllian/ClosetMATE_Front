import ClothingItem from "@/constants/clothingItem";
import React from "react";
import { View, Image, StyleSheet, TouchableHighlight } from "react-native";

export const OutfitBig = ({ items, onPress }: { items: any[], onPress:(itemsWithPosition: any[])=>void }) => {
  const positionMap: Record<string, number> = {
    top: 3,
    bottom: 6,
    outer: 5,
    shoes: 9,
    accessory: 0,
    overall: 3
  };
  const definePosition = (category: string, type: string) => {
    let position = positionMap[category];
    if (position === 0) {
      if (
        ["bag", "purse", "backpack", "tights", "bodychain", "belt"].includes(
          type
        )
      ) {
        position = 8;
      } else if (["gloves", "tie"].includes(type)) {
        position = 0;
      } else if (["glasses", "jewerly", "neckerchief"].includes(type)) {
        position = 1;
      } else if (["scarf"].includes(type)) {
        position = 2;
      } else position = 10;
    }
    return position;
  };
  const positionedItems = items.map((item) => {
    const pos = definePosition(item.category, item.type);
    return { ...item, position: pos };
  });
  console.log('items with positions',positionedItems);
  
  
  return (
    <TouchableHighlight underlayColor="black" onPress={()=>onPress(positionedItems)} style={styles.container}>
      <View>

      {positionedItems.map((item, i) => (
        <Image
          key={i}
          source={{ uri: item.publicUrl }}
          style={[styles.image, positionStyles[item.position]]}
          resizeMode="contain"
        />
      ))}
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 350,
    height: 350,
    position: "relative",
    backgroundColor:"white",
    borderRadius:18,
    marginBottom:30,
    marginInline:"auto",
    
  },
  image: {
    width: 90,
    height: 90,
    position: "absolute",
    zIndex:10,
  },
});

const positionStyles: { [key: number]: any } = {
  0: { top: 20, left: 20 },
  1: { top: 20, left: 135 },
  2: { top: 20, right: 20 },
  3: { top: 100, left: 135 },
  5: { top: 100, right: 20 },
  6: { top: 180, left: 135 },
  8: { top: 160, left: 20 },
  9: { top: 260, left: 135 },
  10: { top: 260, right: 20 },
};
