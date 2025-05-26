import React from "react";
import { Text, TouchableHighlight, View, Image } from "react-native";

export const Question = ({
  question,
  options,
  onPress,
  selectedAnswer,
}: {
  question: string;
  options: { text: string; image: any; result: {} }[];
  onPress: (num: number) => void;
  selectedAnswer?: number;
}) => {
  return (
    <>
      <Text className="font-philosopher-bold text-2xl text-center mt-7 mx-4 mb-2">
        {question}
      </Text>
      <View className="flex-row flex-wrap justify-between items-center px-4 gap-4">
        {options.map((option, index) => (
          <TouchableHighlight
            key={index}
            onPress={() => onPress(index + 1)}
            className={`bg-white rounded-xl w-full border ${
              selectedAnswer === index + 1
                ? "border-black border-2"
                : "border-black-300"
            }`}
          >
            <View className="justify-center items-center pb-1">
              <Image
                source={option.image}
                className="w-32 h-40 "
                resizeMode="contain"
              ></Image>
              <Text className="font-philosopher text-lg">{option.text}</Text>
            </View>
          </TouchableHighlight>
        ))}
      </View>
    </>
  );
};
