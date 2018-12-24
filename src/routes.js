import { createStackNavigator, createAppContainer } from 'react-navigation';

import Main from './pages/main';
import Debts from './pages/debts';

const MainNavigator = createStackNavigator({
  Main,
  Debts
});

const Routes = createAppContainer(MainNavigator);

export default Routes;
