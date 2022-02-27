import '../styles/globals.css'
import type { AppProps } from 'next/app'
import withRedux from 'next-redux-wrapper';
import { Provider } from 'react-redux';
import {store} from '../store/index';

function MyApp({ Component, pageProps, ...rest}: AppProps) {


  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp
