import React, { useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import dayjs from "dayjs";

import { LocaleConfig } from "react-native-calendars";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";


// Встановлення української локалізації для днів тижня
LocaleConfig.locales["uk"] = {
  monthNames: [
    "Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень",
    "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"
  ],
  monthNamesShort: ["Січ", "Лют", "Бер", "Кві", "Тра", "Чер", "Лип", "Сер", "Вер", "Жов", "Лис", "Гру"],
  dayNames: ["Неділя", "Понеділок", "Вівторок", "Середа", "Четвер", "П’ятниця", "Субота"],
  dayNamesShort: ["Нд", "Пн", "Вт", "Ср", "Чт", " Пт", "Сб"],
  today: "Сьогодні"
};

LocaleConfig.defaultLocale = "uk";
// Основні кольори
const primaryColor = "#FB3F4A";
const textColor = "#000";
const inactiveColor = "#D3D3D3";




export const CalendarComponent = ({ plannedOutfits, selectedDate, setSelectedDate }:{ plannedOutfits:Record<string, { selected?: boolean }>, selectedDate:string, setSelectedDate:(date:string) => void }) => {
  const [currentMonth, setCurrentMonth] = useState(selectedDate);
  const translateX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const animateMonthChange = (direction: "left" | "right") => {
    translateX.value = direction === "left" ? -100 : 100;
    translateX.value = withSpring(0);
  };
  return (
    <View style={styles.container}>
      <Animated.View style={[animatedStyle]}>

      <Calendar
        locale={"uk"} 
        current={selectedDate}
        onDayPress={(day:DateData) => setSelectedDate(day.dateString)}
        markedDates={{
          ...plannedOutfits,
          [selectedDate]: {
            selected: true,
          },
        }}
        firstDay={1} // Починаємо тиждень з понеділка
        enableSwipeMonths={true}

        theme={{
            textSectionTitleColor: textColor,
            selectedDayBackgroundColor: primaryColor,
            selectedDayTextColor: "white",
            todayTextColor: primaryColor,
            dayTextColor: textColor,
            textDisabledColor: inactiveColor,
            dotColor: primaryColor,
            selectedDotColor: "white",
            arrowColor: "black",
            monthTextColor: textColor,
            textDayFontFamily: "philosopher",
            textMonthFontFamily: "philosopher-bold",
            textDayHeaderFontFamily: "philosopher-bold",
            textDayFontSize: 16,
            textMonthFontSize: 20,
            textDayHeaderFontSize: 16,
        }}
        
        renderDay={(day:DateData) => {
                if (!day) return <View />; 
              
                const isPlanned = !!plannedOutfits[day.dateString];
              
                return (
                  <View
                    style={[
                      styles.dayContainer,
                      isPlanned && styles.plannedDay, // Додає рамку, якщо є запланований аутфіт
                    ]}
                  >
                    <Text style={styles.dayText}>{day.day}</Text>
                  </View>
                );
        }}   
        onMonthChange={(month:{dateString: string}) => {
          const newMonth = month.dateString;
          animateMonthChange(new Date(newMonth) > new Date(currentMonth) ? "left" : "right");
          setCurrentMonth(newMonth);
        }}       
      />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 10,
    width: "100%",
    minHeight: 320,
  },
 
  dayContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex:1
  },
  dayText: {
    fontFamily: "philosopher",
    textAlign: 'center'
  },
  plannedDay: {
    borderWidth: 2,
    borderColor: "#FB3F4A", // Колір рамки
    borderRadius: 10,
  },
});
