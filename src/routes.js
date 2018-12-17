import { createStackNavigator, createAppContainer } from 'react-navigation';

import Main from './pages/main';

const MainNavigator = createStackNavigator({
  Main,
});

const Routes = createAppContainer(MainNavigator);

export default Routes;