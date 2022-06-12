import '../styles/globals.css'
import type { AppProps } from 'next/app'
import withRedux from 'next-redux-wrapper';
import { Provider } from 'react-redux';
import { store } from '../store/index';
import { MoralisProvider } from "react-moralis";
import { NotificationProvider } from "web3uikit";

function MyApp({ Component, pageProps, ...rest }: AppProps) {


  return (
    <MoralisProvider initializeOnMount={false}>
      <NotificationProvider>
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </NotificationProvider>
    </MoralisProvider>
  );
}

export default MyApp
