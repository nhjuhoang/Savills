import Connect from '@stores';
import layout from './layout';
import { StatusBar, Platform, NetInfo } from 'react-native';
import CodePush from 'react-native-code-push';
import _ from 'lodash';

class Launcher extends layout {
  constructor(props) {
    super(props);
    StatusBar.setHidden(true);
    this.state = {
      language: 0
    };
  }

  componentDidMount() {
    CodePush.sync({ updateDialog: true, installMode: CodePush.InstallMode.IMMEDIATE });
  }

  async componentWillMount() {
    await this.props.actions.account.getAccessTokenLocal();
    await this.props.actions.account.getTenantLocal();
    await this.props.actions.account.getAccessApiTokenLocal();
    await this.props.actions.account.getEncTokenLocal();
    await this.props.actions.app.getLanguageApp();
    await this.props.actions.units.getUnitLocal();
    await this.props.actions.app.getLanguageLocal();
    if (this.props.app.languegeLocal.length <= 0) {
      await this.props.actions.app.setLanguageLocal('0');
    }
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);
  }

  handleConnectionChange = isConnected => {
    if (isConnected) {
    } else alert(his.props.app.listLanguage[this.props.app.languegeLocal].data.NO_INTERNET);
  };

  componentWillReceiveProps(nextProps) {
    if (this.state.language === 0 && nextProps.app.listLanguage && nextProps.app.listLanguage.length > 0) {
      this.setState({ language: 1 });
      if (
        this.props.account.accessToken.length > 0 &&
        this.props.account.accessTokenAPI.length > 0 &&
        this.props.account.encToken.length > 0 &&
        !_.isEmpty(this.props.account.tenantLocal) &&
        !_.isEmpty(this.props.units.unitActive)
      ) {
        this.props.navigation.navigate('Home');
      } else {
        this.props.navigation.navigate('Login');
      }
    }
  }
}

export default CodePush(Connect(Launcher));
