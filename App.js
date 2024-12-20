import React, {Suspense} from 'react';
import { LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Main from './src/Main';
import { ToastProvider } from 'react-native-toast-notifications';
import Toast from "react-native-toast-notifications";
import { Provider } from 'react-redux';
import configureStore from './src/store/reducers/configureStore';
import { PaperProvider,  MD3LightTheme as DefaultTheme, MD3DarkTheme as Dark, adaptNavigationTheme   } from 'react-native-paper';
import { fr, registerTranslation } from 'react-native-paper-dates'
import Loader from './src/components/Loader';
registerTranslation('fr-FR', fr)

LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
const { LightTheme } = adaptNavigationTheme({ reactNavigationLight: DefaultTheme });
const { DarkTheme } = adaptNavigationTheme({ reactNavigationDark: Dark });
const store = configureStore()
export default function App() {
  // const [isDarkTheme, setIsDarkTheme] = React.useState(false)
  const [usedTheme, setUsedTheme] = React.useState({
    appTheme: DefaultTheme,
    navTheme: LightTheme
  })

  const switchTheme = (theme) =>{

    if(theme === 'dark'){
      setUsedTheme({
        appTheme: Dark,
        navTheme: DarkTheme
      })
    } else {
      setUsedTheme({
        appTheme: DefaultTheme,
        navTheme: LightTheme
      })
    }
  }
  // console.log(usedTheme)

   return (
    <Provider store={store}>
      <PaperProvider
        settings={{
          rippleEffectEnabled: false
        }}
        theme={usedTheme.appTheme}
      >
        <ToastProvider
          swipeEnabled={true}
        >
          <NavigationContainer theme={usedTheme.navTheme}>
            <Suspense fallback={<Loader/>}>
              <Main setUsedTheme={switchTheme} theme={usedTheme.appTheme}/>
              <Toast 
                ref={(ref) => global['toast'] = ref}
                onPress={(id)=> toast.hide(id)}
              />
            </Suspense>
          </NavigationContainer>
        </ToastProvider>
      </PaperProvider>
    </Provider>
  );
}