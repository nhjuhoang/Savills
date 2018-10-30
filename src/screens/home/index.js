import React, { Component } from 'react';
import { Text, View, Image, Animated } from "react-native";
import Connect from '@stores';
import layout from './layout';

import Header from '@components/header'
import Button from "@components/button";
import IC_EDIT from "@resources/icons/edit-profile.png";
import IC_NOTIFY from "@resources/icons/notify.png";

class Home extends layout {

    static navigationOptions = ({ navigation }) => ({
        header: <Header
            headercolor={'#F6F8FD'}
            leftIcon={IC_EDIT}
            leftAction={navigation.getParam('openProfileHome')}
            customViewLeft={navigation.getParam('isHidenHeaderHome')}
            renderViewLeft={
                <Button
                    onPress={navigation.getParam('openProfileHome')}
                    style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center', marginLeft: 20 }}>
                    <Image source={{ uri: 'https://scontent.fsgn5-6.fna.fbcdn.net/v/t1.0-9/26168307_1832573663480180_5899833810848274293_n.jpg?_nc_cat=109&_nc_ht=scontent.fsgn5-6.fna&oh=fa469d9c20f13899bd5f8757b5b675e1&oe=5C84EE81' }}
                        style={{ width: 30, height: 30, borderRadius: 30 / 2 }}
                    />
                    <View style={{ flexDirection: 'column', marginLeft: 10 }}>
                        <Text style={{ fontSize: 15, fontFamily: 'OpenSans-Bold' }}>{'Hey!! Toan Tam'}</Text>
                        <Text style={{ fontSize: 12, fontFamily: 'OpenSans-Regular', color: '#BABFC8' }}>{'T1-A03-01'}</Text>
                    </View>
                </Button>
            }
            // center={function () {
            //     return <View><Text>{this.app.test}</Text></View>
            // }}
            // rightIconL={navigation.getParam('isHidenHeaderHome') ? IC_EDIT : null}
            // rightActionL={() => alert('Edit L')}
            rightIcon={IC_NOTIFY}
            rightAction={() => alert('Notify')}
        />
    })

    constructor(props) {
        super(props);
        this.state = {
            scrollY: new Animated.Value(0), // Animated event scroll,
            isShowProfile: false,
            loading: false
        }
        this.showCenter = false;

    }


    async componentWillMount() {
        await this.props.navigation.setParams({ openProfileHome: this._openProfile.bind(this) });
    }

    componentDidMount() {
        this.props.actions.account.setTenantLocal(this.props.account.tenant).then(() => {
            console.log('SET XONG ')
        })
    }

    _openProfile() {
        this.setState({ isShowProfile: true })
    }

    _closeProfile() {
        this.setState({ isShowProfile: false })
    }

    async _logOut() {
        this.setState({ loading: true });
        await this.props.actions.account.logOut('');
        await this.props.actions.units.setUnitLocal({}).then(() => {
            this.setState({ loading: false })
            this.props.navigation.navigate('Login');
        })
    }



}

export default Connect(Home);
