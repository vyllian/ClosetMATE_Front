import { MainButton, PlusButton } from "@/components/customButton";
import { Item } from "@/components/itemEdit";
import { SmallItemPreview } from "@/components/itemsPreview";
import ItemsSearch from "@/components/itemsToOutfit";
import { useProfile } from "@/components/ProfileContext";
import { TopNavigation } from "@/components/topNavigation";
import ClothingItem from "@/constants/clothingItem";
import { useAuth } from "@/lib/useAuth";
import { useClothingItems } from "@/lib/UseClothingItems";
import Feather from "@expo/vector-icons/Feather";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import ViewShot from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";

import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableHighlight,
  View,
  Text,
  Button,
  Pressable,
  Alert,
  TouchableWithoutFeedback,
} from "react-native";
import { API } from "@/constants/api";

const formatDate = (rawDate: Date) => {
  let year = rawDate.getFullYear();
  let month: string = (rawDate.getMonth() + 1).toString().padStart(2, "0");
  let day: string = rawDate.getDate().toString().padStart(2, "0");
  return `${day}-${month}-${year}`;
};

const CreateOutfit = () => {
  const { profile, loading: profileLoading, setProfile } = useProfile();
  const { auth, loading: authLoading } = useAuth();
  const { date, passedItems, itemsPositions } = useLocalSearchParams();

  const POSITIONS_NUM = 11;

  const [loading, setLoading] = useState(false);

  const [selectedDates, setDates] = useState<string[]>(
    date
      ? [formatDate(new Date(date as string))]
      : [dayjs().format("DD-MM-YYYY")]
  );
  const [newDate, setNewDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const [showSearch, setShowSearch] = useState(false);
  const [selectedItems, setSelectedItems] = useState<{
    [key: number]: ClothingItem | null;
  }>({});
  const [activePosition, setActivePosition] = useState<number | null>(null);

  const [zOrderMap, setZOrderMap] = useState<{ [key: number]: number }>({});
  const [zCounter, setZCounter] = useState(1);
  const [editMap, setEditMap] = useState<{ [key: number]: boolean }>({});
  const [text, setText] = useState("");

  const initialTransformMap = Array.from(
    { length: POSITIONS_NUM },
    (_, i) => i
  ).reduce((acc, pos) => {
    acc[pos] = { scale: 1, rotation: 0 };
    return acc;
  }, {} as { [key: number]: { scale: number; rotation: number } });

  const initialFlipMap = Array.from(
    { length: POSITIONS_NUM },
    (_, i) => i
  ).reduce((acc, pos) => {
    acc[pos] = { vertical: false, horizontal: false };
    return acc;
  }, {} as { [key: number]: { vertical: boolean; horizontal: boolean } });

  const [transformMap, setTransformMap] = useState(initialTransformMap);
  const [flipMap, setFlipMap] = useState(initialFlipMap);
//-------------------------------------------------------------------------------------
useEffect(() => {
  console.log('beeeeee');
  
  if (passedItems) {
    const parsedItems = JSON.parse(passedItems as string) as Record<string, ClothingItem>;
    console.log(parsedItems);
    
    if (itemsPositions) {
      setSelectedItems((prev) => ({ ...prev, ...parsedItems }));
      const parsedPositions = JSON.parse(itemsPositions as string);

      const [zOrder, editMap, transform, flip] = parsedPositions;

      if (zOrder) setZOrderMap((prev) => ({ ...prev, ...zOrder }));
      if (editMap) setEditMap((prev) => ({ ...prev, ...editMap }));
      if (transform) setTransformMap((prev) => ({ ...prev, ...transform }));
      if (flip) setFlipMap((prev) => ({ ...prev, ...flip }));
    } else{
      console.log('ceeeee');
      
      Object.entries(parsedItems).forEach(
        ([position, item]: [string, ClothingItem]) => {
          handleSetItem(item, Number(position));
        }
      );
    }
  }
}, []);

  const toggleDatepicker = () => {
    setShowPicker(!showPicker);
  };

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const { type } = event;
    if (type === "set" && selectedDate) {
      if (Platform.OS === "android") {
        const formatted = formatDate(selectedDate);
        if (!selectedDates.includes(formatted)) {
          setDates((prev) => {
            const all = [...prev, formatted];
            const unique = Array.from(new Set(all));
            unique.sort(
              (a, b) =>
                parseFormattedDate(a).getTime() -
                parseFormattedDate(b).getTime()
            );
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

  const confirmIOSDate = () => {
    const formatted = formatDate(newDate);
    if (!selectedDates.includes(formatted)) {
      setDates((prev) => {
        const all = [...prev, formatted];
        const unique = Array.from(new Set(all));
        unique.sort(
          (a, b) =>
            parseFormattedDate(a).getTime() - parseFormattedDate(b).getTime()
        );
        return unique;
      });
    }
    toggleDatepicker();
  };

  const parseFormattedDate = (str: string) => {
    const [day, month, year] = str.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const deleteDate = (i: number) => {
    Alert.alert(
      "Видалити дату?",
      "",
      [
        {
          text: "Скасувати",
          style: "cancel",
          onPress: () => {},
        },
        {
          text: "Видалити",
          style: "destructive",
          onPress: () => {
            const updatedDates = selectedDates.filter((_, index) => index != i);
            setDates(updatedDates);
          },
        },
      ],
      { cancelable: true }
    );
  };

  const goBack = async () => {
    Object.keys(selectedItems).length !== 0
      ? Alert.alert(
          "Повернутися?",
          "Ваші зміни будуть втрачені",
          [
            {
              text: "Скасувати",
              style: "cancel",
              onPress: () => {},
            },
            {
              text: "Повернутися",
              style: "destructive",
              onPress: () => {
                router.push("/");
              },
            },
          ],
          { cancelable: true }
        )
      : router.push("/");
  };

  const openItemSearch = (position: number) => {
    setActivePosition(position);
    setShowSearch(true);
  };

  const handleSetItem = (item: ClothingItem, position?:number) => {
    const pos = position ?? activePosition;
    if (pos !== null) {
      setSelectedItems((prev) => ({ ...prev, [pos]: item }));
      handlePress(pos);
      setTransformMap((prev) => ({
        ...prev,
        [pos]: { scale: 1, rotation: 0 },
      }));
      setFlipMap((prev) => ({
        ...prev,
        [pos]: { vertical: false, horizontal: false },
      }));
      setZOrderMap((prev) => ({
        ...prev,
        [pos]: zCounter+1,
      }))
      setShowSearch(false);
    }
  };

  const handlePress = (position: number) => {
    setZCounter((prev) => prev + 1);
    setZOrderMap((prev) => ({
      ...prev,
      [position]: zCounter,
    }));
    setActivePosition(position);
  };

  const setEdit = (position: number, value: boolean) => {
    setEditMap((prev) => ({ ...prev, [position]: value }));
  };

  const isEditing = (position: number) => {
    return !!editMap[position];
  };

  const setScaleAt = (position: number, newScale: number) => {
    setTransformMap((prev) => ({
      ...prev,
      [position]: { ...prev[position], scale: newScale },
    }));
  };

  const setRotationAt = (position: number, newRotation: number) => {
    setTransformMap((prev) => ({
      ...prev,
      [position]: { ...prev[position], rotation: newRotation },
    }));
  };

  const setVerFlipAt = (position: number, flip: boolean) => {
    setFlipMap((prev) => ({
      ...prev,
      [position]: { ...prev[position], vertical: flip },
    }));
  };

  const setHorFlipAt = (position: number, flip: boolean) => {
    setFlipMap((prev) => ({
      ...prev,
      [position]: { ...prev[position], horizontal: flip },
    }));
  };

  const handleDeleteItem = (position: number) => {
    setSelectedItems((prev) => ({ ...prev, [position]: null }));
    setTransformMap((prev) => ({
      ...prev,
      [position]: { scale: 1, rotation: 0 },
    }));
  };

  const viewShotRef = useRef<ViewShot>(null);

  const downloadImage = async () => {
    if (Object.keys(selectedItems).length === 0) {
      Alert.alert("Додайте одяг.");
      return;
    }
    setLoading(true);
    setTimeout(async () => {
      try {
        if (!viewShotRef.current) {
          Alert.alert("Помилка", "Знімок неможливий: елемент не готовий.");
          return;
        }
        const uri = await (viewShotRef.current as any).capture();
        if (!uri) {
          Alert.alert("Помилка", "Не вдалося створити зображення.");
          return;
        }
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Доступ заборонено",
            "Потрібен дозвіл на доступ до галереї."
          );
          return;
        }
        const asset = await MediaLibrary.createAssetAsync(uri);
        await MediaLibrary.createAlbumAsync("ClosetMate", asset, false);

        setLoading(false);
        Alert.alert("Зображення збережено в галереї.");
      } catch (error) {
        console.error("Помилка при збереженні зображення:", error);
        Alert.alert("Помилка", "Щось пішло не так під час збереження.");
      }
    }, 5);
  };

  const objtoArr = (obj: { [key: number]: number }) => {
    const arr = Array(POSITIONS_NUM).fill(1);
    Object.keys(zOrderMap).forEach((e) => {
      arr[Number(e)] = zOrderMap[Number(e)];
    });
    return arr;
  };

  const createOutfit = async() => {
    setLoading(true);

    setTimeout(async () => {
      let uri;

      try {
        if (!viewShotRef.current) {
          Alert.alert("Помилка", "Знімок неможливий: елемент не готовий.");
          return;
        }
        uri = await (viewShotRef.current as any).capture();
        if (!uri) {
          Alert.alert("Помилка", "Не вдалося створити зображення.");
          return;
        }
      } catch (error) {
        console.error("Помилка при збереженні зображення:", error);
        Alert.alert("Помилка", "Щось пішло не так під час збереження.");
      }
      try {
        const formData = new FormData();
        formData.append("file", {
        uri: uri,
        name: "img.png",
        type: "image/png",
      } as any);
      const response = await fetch(API + "/outfit/new", {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });
      if (!response.ok) {
        console.log(response.status);
        throw new Error("Помилка завантаження фото");
      }
      const responseJSON = await response.json();
      const outfit = {
        image: responseJSON.image,
        description: text,
        planningToWear: selectedDates,
        publicUrl: responseJSON.publicUrl,
        urlExpiryDate: responseJSON.urlExpiryDate,
      };
      
      const zOrder = objtoArr(zOrderMap);
      const scale = Object.values(transformMap).map((e) => e.scale);
      const rotation = Object.values(transformMap).map((e) => e.rotation);
      const verticalFlip = Object.values(flipMap).map((e) => e.vertical);
      const horizontalFlip = Object.values(flipMap).map((e) => e.horizontal);
      
      const outfitRequest = {
        outfit: outfit,
        items: selectedItems,
        zOrder: zOrder,
        scale: scale,
        rotation: rotation,
        verticalFlip: verticalFlip,
        horizontalFlip:horizontalFlip,
      }
      
      const response2 = await fetch(API + "/outfit/add", {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(outfitRequest),
      });
      if (!response2.ok) {
        console.log(response2.status);
        throw new Error("Помилка завантаження образу");
      }
      const responseJSON2 = await response2.json();
      
      const outfitId = responseJSON2;
      console.log('outfit id resp ', responseJSON2);
      const response3 = await fetch(API + "/profile/"+profile.id+"/add-outfit", {
        method: "PUT",
        headers: {
          Authorization: `Basic ${auth}`,
           "Content-Type": "application/json"
        },
        body: JSON.stringify(outfitId),
      });
      if (!response3.ok) {
        console.log(response3.status);
        throw new Error("Помилка add outfit to profile");
      }
      
    } catch (error) {
      console.error("Помилка ", error);
    } finally {
      setLoading(false);
      Alert.alert("Образ успішно створено!")
      router.push('/')
    }
    
  }, 5);
    
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        const newMap: { [key: number]: boolean } = {};
        Object.keys(editMap).forEach((key) => {
          newMap[Number(key)] = false;
        });
        setEditMap(newMap);
      }}
    >
      <SafeAreaView className="px-5 h-full bg-primary ">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          {(authLoading || profileLoading || loading) && (
            <View className="absolute top-0 left-0 right-0 bottom-0 bg-primary flex items-center justify-center z-50 flex-1">
              <ActivityIndicator size="large" color="#828282" />
            </View>
          )}
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "space-between",
              alignContent: "center",
              alignItems: "center",
              width: "95%",
              marginHorizontal: "auto",
            }}
          >
            <TopNavigation arrowAction={goBack} />
            <View className="mt-24">
              <ViewShot
                ref={viewShotRef}
                options={{ format: "jpg", quality: 1 }}
              >
                <View className="bg-white py-6 rounded-xl gap-y-3 mb-1.5">
                  <View className="flex-row w-full justify-around items-center">
                    <View
                      className={`${
                        selectedItems[0] || !loading
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    >
                      <Item
                        position={0}
                        setActivePosition={() => handlePress(0)}
                        edit={isEditing(0)}
                        setEdit={(value: boolean) => setEdit(0, value)}
                        item={selectedItems[0]}
                        scale={transformMap[0].scale}
                        setScale={(val) => setScaleAt(0, val)}
                        rotation={transformMap[0].rotation}
                        setRotation={(val) => setRotationAt(0, val)}
                        flipVertical={flipMap[0].vertical}
                        setFlipVertical={(val) => setVerFlipAt(0, val)}
                        flipHorizontal={flipMap[0].horizontal}
                        setFlipHorizontal={(val) => setHorFlipAt(0, val)}
                        deleteItem={() => handleDeleteItem(0)}
                        openSearch={() => openItemSearch(0)}
                      ></Item>
                    </View>
                    <View
                      className={`${
                        selectedItems[1] || !loading
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    >
                      <Item
                        position={1}
                        setActivePosition={() => handlePress(1)}
                        edit={isEditing(1)}
                        setEdit={(value: boolean) => setEdit(1, value)}
                        item={selectedItems[1]}
                        scale={transformMap[1].scale}
                        setScale={(val) => setScaleAt(1, val)}
                        rotation={transformMap[1].rotation}
                        setRotation={(val) => setRotationAt(1, val)}
                        flipVertical={flipMap[1].vertical}
                        setFlipVertical={(val) => setVerFlipAt(1, val)}
                        flipHorizontal={flipMap[1].horizontal}
                        setFlipHorizontal={(val) => setHorFlipAt(1, val)}
                        deleteItem={() => handleDeleteItem(1)}
                        openSearch={() => openItemSearch(1)}
                      ></Item>
                    </View>
                    <View
                      className={`${
                        selectedItems[2] || !loading
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    >
                      <Item
                        position={2}
                        setActivePosition={() => handlePress(2)}
                        edit={isEditing(2)}
                        setEdit={(value: boolean) => setEdit(2, value)}
                        scale={transformMap[2].scale}
                        setScale={(val) => setScaleAt(2, val)}
                        rotation={transformMap[2].rotation}
                        setRotation={(val) => setRotationAt(2, val)}
                        flipVertical={flipMap[2].vertical}
                        setFlipVertical={(val) => setVerFlipAt(2, val)}
                        flipHorizontal={flipMap[2].horizontal}
                        setFlipHorizontal={(val) => setHorFlipAt(2, val)}
                        item={selectedItems[2]}
                        deleteItem={() => handleDeleteItem(2)}
                        openSearch={() => openItemSearch(2)}
                      ></Item>
                    </View>
                  </View>
                  <View className="flex-row w-full justify-around items-center">
                    <View
                      className={`${
                        selectedItems[8] || !loading
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    >
                      <Item
                        position={8}
                        setActivePosition={() => handlePress(8)}
                        edit={isEditing(8)}
                        setEdit={(value: boolean) => setEdit(8, value)}
                        scale={transformMap[8].scale}
                        setScale={(val) => setScaleAt(8, val)}
                        rotation={transformMap[8].rotation}
                        setRotation={(val) => setRotationAt(8, val)}
                        flipVertical={flipMap[8].vertical}
                        setFlipVertical={(val) => setVerFlipAt(8, val)}
                        flipHorizontal={flipMap[8].horizontal}
                        setFlipHorizontal={(val) => setHorFlipAt(8, val)}
                        item={selectedItems[8]}
                        deleteItem={() => handleDeleteItem(8)}
                        openSearch={() => openItemSearch(8)}
                      ></Item>
                    </View>
                    <View className="relative w-[150px] h-[235px]">
                      <View
                        className={`absolute top-0 right-0 ${
                          selectedItems[4] || !loading
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                        style={{ zIndex: zOrderMap[4] ?? 1 }}
                      >
                        <Item
                          position={4}
                          setActivePosition={() => handlePress(4)}
                          edit={isEditing(4)}
                          setEdit={(value: boolean) => setEdit(4, value)}
                          item={selectedItems[4]}
                          scale={transformMap[4].scale}
                          setScale={(val) => setScaleAt(4, val)}
                          rotation={transformMap[4].rotation}
                          setRotation={(val) => setRotationAt(4, val)}
                          flipVertical={flipMap[4].vertical}
                          setFlipVertical={(val) => setVerFlipAt(4, val)}
                          flipHorizontal={flipMap[4].horizontal}
                          setFlipHorizontal={(val) => setHorFlipAt(4, val)}
                          deleteItem={() => handleDeleteItem(4)}
                          openSearch={() => openItemSearch(4)}
                        ></Item>
                      </View>
                      <View
                        className={`absolute bottom-0 right-0 -translate-y-1/4 ${
                          selectedItems[7] || !loading
                            ? "opacity-100"
                            : "opacity-0"
                        } ${selectedItems[7] ? "" : "-z-0"}`}
                        style={{ zIndex: zOrderMap[7] ?? 1 }}
                      >
                        <Item
                          position={7}
                          setActivePosition={() => handlePress(7)}
                          edit={isEditing(7)}
                          setEdit={(value: boolean) => setEdit(7, value)}
                          item={selectedItems[7]}
                          scale={transformMap[7].scale}
                          setScale={(val) => setScaleAt(7, val)}
                          rotation={transformMap[7].rotation}
                          setRotation={(val) => setRotationAt(7, val)}
                          flipVertical={flipMap[7].vertical}
                          setFlipVertical={(val) => setVerFlipAt(7, val)}
                          flipHorizontal={flipMap[7].horizontal}
                          setFlipHorizontal={(val) => setHorFlipAt(7, val)}
                          deleteItem={() => handleDeleteItem(7)}
                          openSearch={() => openItemSearch(7)}
                        ></Item>
                      </View>

                      <View
                        className={`absolute top-0 left-0 translate-y-1/4 ${
                          selectedItems[3] || !loading
                            ? "opacity-100"
                            : "opacity-0"
                        } ${
                          selectedItems[3] ? "" : "bg-white rounded-tr-[40%]"
                        }`}
                        style={{ zIndex: zOrderMap[3] ?? 1 }}
                      >
                        <Item
                          position={3}
                          setActivePosition={() => handlePress(3)}
                          edit={isEditing(3)}
                          setEdit={(value: boolean) => setEdit(3, value)}
                          item={selectedItems[3]}
                          scale={transformMap[3].scale}
                          setScale={(val) => setScaleAt(3, val)}
                          rotation={transformMap[3].rotation}
                          setRotation={(val) => setRotationAt(3, val)}
                          flipVertical={flipMap[3].vertical}
                          setFlipVertical={(val) => setVerFlipAt(3, val)}
                          flipHorizontal={flipMap[3].horizontal}
                          setFlipHorizontal={(val) => setHorFlipAt(3, val)}
                          deleteItem={() => handleDeleteItem(3)}
                          openSearch={() => openItemSearch(3)}
                        ></Item>
                      </View>
                      <View
                        className={`absolute bottom-0 left-0 ${
                          selectedItems[6] || !loading
                            ? "opacity-100"
                            : "opacity-0"
                        } ${selectedItems[6] ? "" : "bg-white"}`}
                        style={{ zIndex: zOrderMap[6] ?? 1 }}
                      >
                        <Item
                          position={6}
                          setActivePosition={() => handlePress(6)}
                          edit={isEditing(6)}
                          setEdit={(value: boolean) => setEdit(6, value)}
                          item={selectedItems[6]}
                          scale={transformMap[6].scale}
                          setScale={(val) => setScaleAt(6, val)}
                          rotation={transformMap[6].rotation}
                          setRotation={(val) => setRotationAt(6, val)}
                          flipVertical={flipMap[6].vertical}
                          setFlipVertical={(val) => setVerFlipAt(6, val)}
                          flipHorizontal={flipMap[6].horizontal}
                          setFlipHorizontal={(val) => setHorFlipAt(6, val)}
                          deleteItem={() => handleDeleteItem(6)}
                          openSearch={() => openItemSearch(6)}
                        ></Item>
                      </View>
                    </View>
                    <View
                      className={`${
                        selectedItems[5] || !loading
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    >
                      <Item
                        position={5}
                        setActivePosition={() => handlePress(5)}
                        edit={isEditing(5)}
                        setEdit={(value: boolean) => setEdit(5, value)}
                        item={selectedItems[5]}
                        scale={transformMap[5].scale}
                        setScale={(val) => setScaleAt(5, val)}
                        rotation={transformMap[5].rotation}
                        setRotation={(val) => setRotationAt(5, val)}
                        flipVertical={flipMap[5].vertical}
                        setFlipVertical={(val) => setVerFlipAt(5, val)}
                        flipHorizontal={flipMap[5].horizontal}
                        setFlipHorizontal={(val) => setHorFlipAt(5, val)}
                        deleteItem={() => handleDeleteItem(5)}
                        openSearch={() => openItemSearch(5)}
                      ></Item>
                    </View>
                  </View>
                  <View className="flex-row justify-center items-center">
                    <View
                      className={`${
                        selectedItems[9] || !loading
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    >
                      <Item
                        position={9}
                        setActivePosition={() => handlePress(9)}
                        edit={isEditing(9)}
                        setEdit={(value: boolean) => setEdit(9, value)}
                        item={selectedItems[9]}
                        scale={transformMap[9].scale}
                        setScale={(val) => setScaleAt(9, val)}
                        rotation={transformMap[9].rotation}
                        setRotation={(val) => setRotationAt(9, val)}
                        flipVertical={flipMap[9].vertical}
                        setFlipVertical={(val) => setVerFlipAt(9, val)}
                        flipHorizontal={flipMap[9].horizontal}
                        setFlipHorizontal={(val) => setHorFlipAt(9, val)}
                        deleteItem={() => handleDeleteItem(9)}
                        openSearch={() => openItemSearch(9)}
                      ></Item>
                    </View>
                    <View
                      className={`${
                        selectedItems[10] || !loading
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    >
                      <Item
                        position={10}
                        setActivePosition={() => handlePress(10)}
                        edit={isEditing(10)}
                        setEdit={(value: boolean) => setEdit(10, value)}
                        item={selectedItems[10]}
                        scale={transformMap[10].scale}
                        setScale={(val) => setScaleAt(10, val)}
                        rotation={transformMap[10].rotation}
                        setRotation={(val) => setRotationAt(10, val)}
                        flipVertical={flipMap[10].vertical}
                        setFlipVertical={(val) => setVerFlipAt(10, val)}
                        flipHorizontal={flipMap[10].horizontal}
                        setFlipHorizontal={(val) => setHorFlipAt(10, val)}
                        deleteItem={() => handleDeleteItem(10)}
                        openSearch={() => openItemSearch(10)}
                      ></Item>
                    </View>
                  </View>
                </View>
              </ViewShot>
              <TouchableHighlight
                onPress={downloadImage}
                underlayColor="transperent"
                className="self-end"
              >
                <Feather name="download" size={28} color="black" className="" />
              </TouchableHighlight>
            </View>
            <TextInput
              value={text}
              onChangeText={setText}
              multiline
              numberOfLines={1}
              placeholder="Додати опис..."
              className=" w-full leading-norma placeholder:text-black placeholder:font-philosopher placeholder:text-xl"
              style={{ textAlignVertical: "top" }}
            ></TextInput>
            <View className="flex-row gap-2 w-full flex-wrap items-center  justify-start">
              <Text className="font-philosopher-bold text-xl">
                Заплановано на:
              </Text>
              {selectedDates.map((selectedDate, i) => (
                <React.Fragment key={i}>
                  <Pressable onLongPress={() => deleteDate(i)}>
                    <Text className="font-philosopher text-xl">
                      {selectedDate}
                    </Text>
                  </Pressable>
                  {i !== selectedDates.length - 1 && (
                    <Text className="">/</Text>
                  )}
                </React.Fragment>
              ))}
              <PlusButton size={18} onPress={toggleDatepicker} />
            </View>
            <View className="flex-row">
              <MainButton text="Створити" onPress={createOutfit} />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        {showPicker && (
          <>
            <DateTimePicker
              mode="date"
              display="spinner"
              value={newDate}
              onChange={onChange}
              minimumDate={new Date()}
              textColor="black"
              style={{ marginHorizontal: "auto" }}
            />
            {showPicker && Platform.OS === "ios" && (
              <View className=" flex-row gap-1 w-11/12 mx-auto">
                <MainButton
                  text="Скасувати"
                  onPress={toggleDatepicker}
                  color="#c2c2c2"
                />
                <MainButton text="Вибрати" onPress={confirmIOSDate} />
              </View>
            )}
          </>
        )}
        {showSearch && (
          <ItemsSearch
            onClose={() => {
              setShowSearch(false);
              setActivePosition(null);
            }}
            setItem={handleSetItem}
          />
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default CreateOutfit;
