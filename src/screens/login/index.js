import Connect from '@stores';
import layout from './layout';
import { Platform, StatusBar } from 'react-native';

import { BackHandler } from 'react-native';

import _ from 'lodash';

class Login extends layout {
  constructor(props) {
    super(props);
    this.state = {
      isModalLanguage: false,
      selectedItem: this.props.app.languegeLocal,
      username: '',
      password: '',
      flag: true,
      loading: false,
      unMount: true
    };
    if (Platform.OS === 'android') {
      StatusBar.setHidden(false);
      StatusBar.setBackgroundColor('#000');
      StatusBar.setBarStyle('light-content');
    } else {
      StatusBar.setHidden(false);
      StatusBar.setBarStyle('dark-content');
    }

    this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
      BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    );
  }

  componentWillMount() {}

  componentDidMount() {
    this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
      BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    );
  }

  async componentWillReceiveProps(nextProps) {
    if (this.state.unMount) {
      if (nextProps.account.accessToken && nextProps.account.accessToken.length > 0 && !nextProps.account.isGetAccessToken) {
        let languages = this.props.app.listLanguage[this.props.app.languegeLocal].id;
        await this.props.actions.account.setAccessTokenLocal(nextProps.account.accessToken);
        await this.props.actions.account.getTenant(nextProps.account.accessToken, languages);
      }

      //check eror get tanent
      if (this.props.account.tenant !== nextProps.account.tenant && !nextProps.account.tenant.success) {
        await this.setState({ loading: false });
      }

      if (
        this.props.account.tenant.result !== nextProps.account.tenant.result &&
        nextProps.account.tenant.result.length > 0 &&
        !nextProps.account.isGetTenant
      ) {
        await this.props.actions.account.setTenantLocal(nextProps.account.tenant.result);
        let tenantList = nextProps.account.tenant.result;
        let languages = this.props.app.listLanguage[this.props.app.languegeLocal].id;
        if (tenantList && tenantList.length === 1) {
          await this.props.actions.account.switchToUserAccount(
            this.props.account.accessToken,
            tenantList[0].tenantId,
            tenantList[0].id,
            languages
          );
        } else {
          await this._gotoChooseProject();
          this.setState({ loading: false });
        }
      }

      if (
        this.props.account.switchAccount !== nextProps.account.switchAccount &&
        nextProps.account.switchAccount.success &&
        !nextProps.account.isGetSwichToUserAccount
      ) {
        let accessToken = this.props.account.accessToken;
        let Token = nextProps.account.switchAccount.result.switchAccountToken;
        await this.props.actions.account.linkedAccountAuthenticate(accessToken, Token);
      }

      if (
        this.props.account.linkedAccountAuthenticate !== nextProps.account.linkedAccountAuthenticate &&
        nextProps.account.linkedAccountAuthenticate.success &&
        !nextProps.account.isGetAccessTokenAPI
      ) {
        await this.props.actions.account.setAccessApiTokenLocal(nextProps.account.linkedAccountAuthenticate.result.accessToken);
        await this.props.actions.account.setEncTokenLocal(
          nextProps.account.linkedAccountAuthenticate.result.encryptedAccessToken
        );
        await this.props.actions.userProfile.getCurrentLoginInformations(
          nextProps.account.linkedAccountAuthenticate.result.accessToken
        );
        await this.props.actions.userProfile.getImageUserProfile(nextProps.account.linkedAccountAuthenticate.result.accessToken);
        await this.props.actions.units.getUnits(nextProps.account.linkedAccountAuthenticate.result.accessToken);
        await this.props.actions.notification.getUnreadCount(nextProps.account.linkedAccountAuthenticate.result.accessToken);
        await this.props.actions.account.setIsAccessTokenAPI(true);
      }

      if (
        this.props.units.listUnits !== nextProps.units.listUnits &&
        nextProps.units.listUnits.success &&
        !nextProps.units.isGetlisUnit
      ) {
        if (nextProps.units.listUnits.result.items && nextProps.units.listUnits.result.items.length === 1) {
          await this.props.actions.units.setUnitLocal(nextProps.units.listUnits.result.items[0]);
          await this.props.actions.notification.getListCountModule(
            nextProps.account.linkedAccountAuthenticate.result.accessToken,
            nextProps.units.listUnits.result.items[0].unitId
          );
          await this.setState({ loading: false, unMount: false });
          this.props.actions.units.setIsGetlisUnit(true);
          await this.props.navigation.navigate('Home');
        } else {
          let arrTemp = nextProps.units.listUnits.result.items;
          let unitTemp = null;
          arrTemp.map(item => {
            if (item.isDefault) {
              unitTemp = item;
            }
          });
          if (unitTemp && unitTemp !== null) {
            this.props.actions.units.setUnitLocal(unitTemp);
            this.props.actions.notification.getListCountModule(
              nextProps.account.linkedAccountAuthenticate.result.accessToken,
              unitTemp.unitId
            );
            await this.setState({ loading: false, unMount: false });
            this.props.actions.units.setIsGetlisUnit(true);
            this.props.navigation.navigate('Home');
          } else {
            await this.setState({ loading: false, unMount: false });
            this.props.actions.units.setIsGetlisUnit(true);
            this._gotoChooseApartment(this.props.account.tenantLocal);
          }
        }
      }

      if (
        this.props.units.listUnits !== nextProps.units.listUnits &&
        nextProps.units.listUnits.success &&
        !nextProps.units.isGetlisUnit
      ) {
        if (nextProps.units.listUnits.result.items && nextProps.units.listUnits.result.items.length === 1) {
          await this.props.actions.units.setUnitLocal(nextProps.units.listUnits.result.items[0]);
          await this.props.actions.notification.getListCountModule(
            nextProps.account.linkedAccountAuthenticate.result.accessToken,
            nextProps.units.listUnits.result.items[0].unitId
          );
          this.props.actions.units.setIsGetlisUnit(true);
          await this.setState({ loading: false, unMount: false });
          await this.props.navigation.navigate('Home');
        } else {
          let arrTemp = nextProps.units.listUnits.result.items;
          let unitTemp = null;
          arrTemp.map(item => {
            if (item.isDefault) {
              unitTemp = item;
            }
          });
          if (unitTemp && unitTemp !== null) {
            this.props.actions.units.setUnitLocal(unitTemp);
            this.props.actions.notification.getListCountModule(
              nextProps.account.linkedAccountAuthenticate.result.accessToken,
              unitTemp.unitId
            );
            await this.setState({ loading: false, unMount: false });
            this.props.navigation.navigate('Home');
            this.props.actions.units.setIsGetlisUnit(true);
          } else {
            await this.setState({ loading: false, unMount: false });
            this.props.actions.units.setIsGetlisUnit(true);
            this._gotoChooseApartment(this.props.account.tenantLocal);
          }
        }
      }

      if (this.props.account.error !== nextProps.account.error) {
        if (nextProps.account.error) {
          await this.setState({ loading: false });
        }
      }
    }
  }

  onBackButtonPressAndroid = () => {
    return true;
  };

  componentWillUnmount = () => {
    this.setState({ loading: false });
  };

  _login(username, password) {
    let languages = this.props.app.listLanguage[this.props.app.languegeLocal].id;
    this.props.actions.account.login(username, password, languages);
    if (!this.state.unMount) {
      this.setState({ unMount: true });
    }
    this.setState({ loading: true });
  }

  _toggleModalLanguage() {
    this.setState({ isModalLanguage: !this.state.isModalLanguage });
  }

  _gotoChooseProject() {
    this.props.navigation.navigate('SelectProject');
  }

  _gotoChooseApartment(project) {
    this.props.navigation.navigate('SelectApartment', { project: project, isLogin: true });
  }

  _gotoForgotPassword() {
    this.props.navigation.navigate('ForgotPassword');
  }
}

export default Connect(Login);
