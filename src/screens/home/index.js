import React, { Component } from 'react';
import { Text, StatusBar, Platform, Animated } from "react-native";
import Connect from '@stores';
import layout from './layout';
import _ from "lodash";

let DATA = [
    { id: 1, key: 'Pages.Resident', title: 'Events', screen: 'Events' },
    { id: 2, key: 'Pages.Resident.Booking', title: 'Booking', screen: '' },
    { id: 3, key: 'Pages.Resident.WorkOrder', title: 'Work Order', screen: 'WorkOrder' },
    { id: 4, key: 'invoice', title: 'Invoice', screen: '' },
    { id: 5, key: 'Pages.Resident.Inbox', title: 'Inbox', screen: '' },
    { id: 6, key: 'Pages.Resident.Feedback', title: 'Feed back', screen: '' },
    { id: 7, key: 'Pages.Libraries', title: 'E-labary', screen: '' },
    { id: 8, key: 'Pages.Resident.Contacts', title: 'Contacts', screen: 'Contacts' },
    { id: 9, key: 'Pages.Resident.FrontDesk', title: 'Frontdesk', screen: '' },
    { id: 10, key: 'Pages.Resident.Fee', title: 'Free', screen: '' },
    { id: 11, key: 'Pages.FAQ', title: 'FAQ', screen: 'FAQ' },
]


class Home extends layout {

    constructor(props) {
        super(props);
        this.state = {
            scrollY: new Animated.Value(0), // Animated event scroll,
            isShowProfile: false,
            loading: false,
            dataModule: [],
            profile: null,
            numcolumn: 2
        }
        this.showCenter = false;
        if (Platform.OS === 'android') {
            StatusBar.setHidden(false);
            StatusBar.setBackgroundColor('#000');
            StatusBar.setBarStyle('light-content');
        } else {
            StatusBar.setHidden(false);
            StatusBar.setBarStyle('dark-content');
        }
    }

    async componentWillReceiveProps(nextProps) {
        if (this.props.account.userSettings !== nextProps.account.userSettings && nextProps.account.userSettings.success) {
            let dataGrantedPermissions = nextProps.account.userSettings.result.auth.grantedPermissions;
            let accessTokenApi = this.props.account.accessTokenAPI;
            let arrTemp = [];
            DATA.map(item => {
                if (item.key in dataGrantedPermissions && dataGrantedPermissions[item.key]) {
                    arrTemp.push(item);
                }
            })
            await this.setState({ dataModule: arrTemp })
        }
    }


    async componentWillMount() {
        let accessTokenApi = this.props.account.accessTokenAPI;
        await this.props.navigation.setParams({ openProfileHome: this._openProfile.bind(this) });
        await this.props.actions.userProfile.getCurrentLoginInformations(accessTokenApi);
        await this.props.actions.userProfile.getImageUserProfile(accessTokenApi);
        await this.props.actions.account.getUserSettings(accessTokenApi);
        await this.props.actions.account.getTenantActive();
    }

    componentDidMount() {
        let accessTokenAPI = this.props.account.accessTokenAPI;
        this.props.actions.utilities.getFAQ(accessTokenAPI);
        this.props.actions.notification.getListNotification(accessTokenAPI);
    }

    _gotoChangePassword() {
        if (this.state.isShowProfile)
            this.setState({ isShowProfile: false })
        this.props.navigation.navigate('ChangePassword', { status: 'change' })
    }

    _openProfile() {
        this.setState({ isShowProfile: true })
    }

    _closeProfile() {
        this.setState({ isShowProfile: false })
    }

    _openFAQ() {
        this.setState({ isShowFAQ: true })
    }

    _closeFAQ() {
        this.setState({ isShowFAQ: false })
    }

    _gotoModule(screen) {
        if (screen === 'FAQ') {
            this._openFAQ();
        } else {
            this.props.navigation.navigate(screen);
        }
    }

    _openNoti() {
        this.setState({ isShowNoti: true });
    }

    _closeNoti() {
        this.setState({ isShowNoti: false });
    }

    async _logOut() {
        await this.setState({ loading: true });
        await this.props.actions.account.logOut('');
        await this.props.actions.units.setUnitLocal({});
        await this.props.actions.account.setTenantLocal({});
        await this.props.actions.account.setAccessTokenLocal('');
        await this.props.actions.account.setAccessApiTokenLocal('');
        await this.props.actions.account.setEncTokenLocal('');

        await this.setState({ loading: false });
        if (this.state.isShowProfile)
            await this.setState({ isShowProfile: false })
        await this.props.navigation.navigate('Login');
    }



}

export default Connect(Home);
