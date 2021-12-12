import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { DefaultTheme, Provider } from "react-native-paper";
import * as Font from "expo-font";
import StackNavigation from "./components/navigation/StackNavigation";

import inter from "./assets/fonts/Inter-Regular.ttf";
import interBold from "./assets/fonts/Inter-Bold.ttf";
import interLight from "./assets/fonts/Inter-Light.ttf";
import interMedium from "./assets/fonts/Inter-Medium.ttf";
import jetBrainsMono from "./assets/fonts/Raleway-Regular.ttf";
import jetBrainsMonoBold from "./assets/fonts/JetBrainsMono-Bold.ttf";
import notoSans from "./assets/fonts/NotoSansMono/NotoSansMono-Regular.ttf";
import notoSansBold from "./assets/fonts/NotoSansMono/NotoSansMono-Bold.ttf";
import karla from "./assets/fonts/Karla-Regular.ttf";
import azeret from "./assets/fonts/Azeret_Mono/AzeretMono-Bold.ttf";
import poppins from "./assets/fonts/Poppins-Regular.ttf";
import readex from "./assets/fonts/readex/ReadexPro-Regular.ttf";
import roboto from "./assets/fonts/roboto/Roboto-Regular.ttf";

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: "#181D31",
    accent: "#678983",
  },
};

const customFonts = {
  inter,
  interBold,
  interLight,
  interMedium,
  jetBrainsMono,
  jetBrainsMonoBold,
  notoSans,
  notoSansBold,
  karla,
  azeret,
  poppins,
  readex,
  roboto,
};

export default function App() {
  const [fontLoaded, setFontLoaded] = React.useState(false);
  React.useEffect(() => {
    (() => {
      Font.loadAsync(customFonts).then(() => {
        setFontLoaded(true);
      });
    })();
  }, []);
  if (!fontLoaded) return null;
  return (
    <Provider theme={theme}>
      <StackNavigation />
      <StatusBar hidden />
    </Provider>
  );
}
