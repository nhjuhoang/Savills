import React, { Component } from 'react';
import { Animated, Platform } from 'react-native';
import Connect from '@stores';
import layout from './layout';

import _ from 'lodash';
import OpenFile from 'react-native-doc-viewer';
class DetailLibary extends layout {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isRefresh: false,
      loadingMore: false,
      isShowModalDetail: false,
      itemSelected: null,
      scrollY: new Animated.Value(Platform.OS === 'ios' ? -60 : 0)
    };
  }

  componentWillMount() {
    this._getDetail();
  }

  async componentWillReceiveProps(nextProps) {
    if (
      this.props.library.detaiLibary.result !== nextProps.library.detaiLibary.result &&
      nextProps.library.detaiLibary.success &&
      this.state.isRefresh
    ) {
      await this.setState({ data: nextProps.library.detaiLibary.result });
      await this.setState({ isRefresh: false });
    }

    if (
      this.props.library.detaiLibary.result !== nextProps.library.detaiLibary.result &&
      nextProps.library.detaiLibary.success &&
      !this.state.isRefresh
    ) {
      await this.setState({ data: this.state.data.concat(nextProps.library.detaiLibary.result) });
      await this.setState({ loadingMore: false, isRefresh: false });
    }
  }

  _getDetail() {
    let accessTokenApi = this.props.account.accessTokenAPI;
    let languege = this.props.app.listLanguage[this.props.app.languegeLocal].id;
    let library = this.props.navigation.getParam('library', 'NO-ID');
    this.props.actions.library.getDetail(accessTokenApi, library.id, languege);
  }

  async _onRefresh() {
    if (this.state.isRefresh) {
      return;
    }
    await this.setState({ isRefresh: true });
    await this._getList();
  }

  _closeModalDetail() {
    this.setState({ isShowModalDetail: false });
  }

  _openModalDetail(item) {
    const encToken = this.props.account.encToken;
    const file = item.file && `${item.file.fileUrl}&encToken=${encodeURIComponent(encToken)}`;
    OpenFile.openDoc(
      [
        {
          url: file,
          fileName: 'sample',
          cache: false,
          fileType: 'pdf'
        }
      ],
      (error, url) => {
        if (error) {
          this.setState({ animating: false });
          console.error(error);
        } else {
          this.setState({ animating: false });
          console.log(url);
        }
      }
    );
  }

  _openModalSelectUnit() {
    this.setState({ isModalSelectUnit: true });
  }
}

export default Connect(DetailLibary);
