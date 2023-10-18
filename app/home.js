import { useState } from "react";
import { SafeAreaView, StatusBar, ScrollView, View, Image, Text } from "react-native";
import { Stack, useRouter } from "expo-router";

import { COLORS, icons, images, SIZES } from "../constants";
import {
  Nearbyjobs,
  Popularjobs,
  ScreenHeaderBtn,
  Welcome,
} from "../components";

const Home = () => {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.backgroung }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.red1 },
          headerShadowVisible: false,
          headerLeft: () => (
            <Image source={icons.LOGO_4U_White} style={{resizeMode: 'contain', height: 40, width: 40}}/>
          ),
          headerRight: () => (
            <>
                <ScreenHeaderBtn iconUrl={icons.AccountCircle} dimension='40' />
                <Text style={{ color: COLORS.white }}>user@host.com</Text>
            </>
          ),
          headetIconColor: "#F3F4F8",
          headerTitleStyle: { color: "#F3F4F8" },
          headerTitle: "",
        }}
      />
      <StatusBar
        barStyle={'light-content'}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            flex: 1,
            padding: SIZES.medium,
          }}
        >
          <Text>Bla bla bla</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
