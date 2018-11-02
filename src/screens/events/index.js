import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import Connect from '@stores';
import Header from '@components/header'
import IC_BACK from "@resources/icons/back-light.png";

import LinearGradient from 'react-native-linear-gradient';
import { Calendar } from "../../components/calendars";
import Layout from './layout';

class Events extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            dateSelected: '',
            overViewDate: {},
            items: {},
            myEvent: [],
            isShowModalDetail: false,
            isShowModalFull: false,
            itemEventSelect: null
        };

    }

    static navigationOptions = ({ navigation }) => ({
        header: <Header
            LinearGradient={true}
            leftIcon={IC_BACK}
            leftAction={() => navigation.goBack()}
            headercolor={'transparent'}
        // center={function () {
        //     return <View><Text>{this.app.test}</Text></View>
        // }}
        // rightIcon={IC_MENU}
        // rightAction={() => alert('Notify')}
        />
    })

    componentWillMount() {
        const accessTokenApi = this.props.account.accessTokenAPI;
        const buildingID = this.props.units.unitActive.buildingId;
        let date = new Date();
        let firstDay = new Date(date.getFullYear(), 0, 1);
        let lastDay = new Date(date.getFullYear(), 12, 31);
        this.props.actions.events.getMyEvents(accessTokenApi, buildingID, this.timeToString(firstDay), this.timeToString(lastDay));
        this.props.actions.events.getOverviewMyEvents(accessTokenApi, this.timeToString(firstDay), this.timeToString(lastDay));

    }

    async componentWillReceiveProps(nextProps) {
        if (this.props.events.myEvents !== nextProps.events.myEvents && nextProps.events.myEvents.success) {
            this.setState({ myEvent: nextProps.events.myEvents.result.items });
        }
        if (this.props.events.overView !== nextProps.events.overView && nextProps.events.overView.success) {
            let tempOverView = await nextProps.events.overView.result;
            let objectOverview = this.mapObjectSelected(tempOverView);
            this.setState({ overViewDate: objectOverview })

        }
    }

    async _openModalDetail(item) {
        // if (this.state.isShowModalFull) {
        //     this.setState({ isShowModalFull: false })
        // }
        await this.setState({ itemEventSelect: item })
        await this.setState({ isShowModalDetail: true })
    }
    _closeModalDetail() {
        this.setState({ isShowModalDetail: false })
    }

    _openModalFull() {
        this.setState({ isShowModalFull: true })
    }
    _closeModalFull() {
        this.setState({ isShowModalFull: false })
    }
    timeToString(time) {
        const date = new Date(time);
        return date.toISOString().split('T')[0];
    }

    mapObjectSelected(arrDate) {
        let markedDateMap = {};
        let tempEvents = []
        arrDate.map((item) => {
            if (item.isEvent) {
                tempEvents.push(item);
            }
        })

        tempEvents.map(item => {
            let date = this.timeToString(item.eventDate);
            markedDateMap[date] = {
                selected: true,
                // disableTouchEvent: true,
                // selectedDotColor: 'orange',
                customStyles: {
                    container: {
                        backgroundColor: 'white',
                        elevation: 2
                    },
                    text: {
                        color: '#4A89E8',
                        fontWeight: 'bold'
                    },
                }
            }
        })
        return markedDateMap;
    }
}

export default Connect(Events);