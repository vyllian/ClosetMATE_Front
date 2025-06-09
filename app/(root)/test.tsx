import { useProfile } from "@/components/ProfileContext";
import { Question } from "@/components/test-question";
import { TopNavigation } from "@/components/topNavigation";
import { API } from "@/constants/api";
import { testQuestions } from "@/constants/test-questions";
import { useAuth } from "@/lib/useAuth";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  TouchableHighlight,
  View,
} from "react-native";
import * as Location from "expo-location";
import { MainButton } from "@/components/customButton";

const formatDate = (rawDate: Date) => {
  let year = rawDate.getFullYear();
  let month: string = (rawDate.getMonth() + 1).toString().padStart(2, "0");
  let day: string = rawDate.getDate().toString().padStart(2, "0");
  return `${day}-${month}-${year}`;
};

const Test = () => {
  const SCREEN_WIDTH = Dimensions.get("window").width;
  const { profile, loading: profileLoading, setProfile } = useProfile();
  const { auth, loading: authLoading } = useAuth();
  const { date } = useLocalSearchParams();
  
  const [selectedDate, setSelected] = useState<string>(formatDate(new Date(date as string)));

  const [activeSlide, setActiveSlide] = useState(0);
  const [showButton, setShowButton] = useState(false);

  const [answers, setAnswers] = useState<number[]>([]);
  const flatListRef = useRef<FlatList<any>>(null);
  const [lat, setLat] = useState<number | null>(null);
  const [lon, setLon] = useState<number | null>(null);
  const [includeWeather, setIncludeWeather] = useState<boolean>(false);

  const chooseOption = async (index: number, num: number) => {
    setAnswers((prev) => {
      const updatedAnswers = [...prev];
      updatedAnswers[index] = num;
      return updatedAnswers;
    });

    if (index < testQuestions.length - 1) {
      flatListRef.current?.scrollToIndex({ index: index + 1 });
      setActiveSlide(index + 1);
    } else {
      setIncludeWeather(num === 1);
    }

  };

  useEffect(() => {
    if (
      answers.filter((item) => item !== undefined).length ===
      testQuestions.length
    ) {
      flatListRef.current?.scrollToIndex({
        index: testQuestions.length - 1,
        animated: true,
      });
      setActiveSlide(testQuestions.length - 1);
      setShowButton(true);
    }
  }, [answers]);

  const sendResults = async () => {
    let location;
    if (includeWeather) {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Доступ до локації заборонено");
      } else {
        location = await Location.getCurrentPositionAsync({});
        
      }
    }
    const answersBody: { [key: string]: number } = {};
    answers.slice(0, answers.length - 1).forEach((value, index) => {
      answersBody[`q${index + 1}`] = value;
    });
    try {
      const response = await fetch(
        API +
          "/outfit/generate?id=" +
          profile.id +
          "&date=" +
          selectedDate.toString() +
          "&lat=" +
          (location ? location.coords.latitude : 0 )+
          "&lon=" +
          (location ? location.coords.longitude :0) +
          "&weather=" +
          includeWeather,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(answersBody),
        }
      );
      if (!response.ok) {
        throw new Error("Помилка generate");
      }else{
        const responseJSON = await response.json();
        router.push({pathname:"/(root)/choose-outfit", params:{outfits: JSON.stringify(responseJSON), date:date}})
      }
    } catch (error: any) {
      console.log(error.message);
    } 
  };
  

  return (
    <SafeAreaView className="px-5 h-full bg-primary relative w-screen">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {authLoading && (
          <View className="absolute top-0 left-0 right-0 bottom-0 bg-primary flex items-center justify-center z-50 flex-1">
            <ActivityIndicator size="large" color="#828282" />
          </View>
        )}
        <TopNavigation arrowAction={() => router.push("/")} />
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "flex-end",
            alignContent: "center",
            height: "90%",
          }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <FlatList
            ref={flatListRef}
            data={testQuestions}
            keyExtractor={(_, i) => i.toString()}
            horizontal
            pagingEnabled
            scrollEnabled={true}
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / SCREEN_WIDTH
              );
              setActiveSlide(index);
            }}
            renderItem={({ item, index }) => (
              <View className="w-screen px-5 relative">
                <Question
                  question={item.question}
                  options={item.options}
                  onPress={(num) => chooseOption(index, num)}
                  selectedAnswer={answers[index]}
                />
                {activeSlide === testQuestions.length - 1 && showButton && (
                  <View className="absolute bottom-0 w-full left-5">
                    <MainButton
                      text={"Генерувати"}
                      onPress={() => sendResults()}
                    ></MainButton>
                  </View>
                )}
              </View>
            )}
          />
        </ScrollView>
        <View className="flex-row justify-center mt-4">
          {testQuestions.map((_, index) => (
            <TouchableHighlight
              key={index}
              onPress={() => {
                flatListRef.current?.scrollToIndex({ index, animated: true });
                setActiveSlide(index);
              }}
              underlayColor="transparent"
            >
              <View
                className={`w-4 h-2 m-1.5 rounded-full ${
                  index === activeSlide ? "bg-black" : "bg-black-200"
                }`}
              />
            </TouchableHighlight>
          ))}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
export default Test;
