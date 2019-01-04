import { createStackNavigator, createAppContainer } from 'react-navigation';

import Main from './pages/main';
import Debts from './pages/debts';
import DebtDetail from './pages/debtDetail'

const MainNavigator = createStackNavigator({
  Main,
  Debts,
  DebtDetail,
});

const Routes = createAppContainer(MainNavigator);

export default Routes;
