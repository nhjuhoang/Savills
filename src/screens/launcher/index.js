import Connect from '@stores';
import layout from './layout';

class Launcher extends layout {

    componentWillMount() {
        setTimeout(() => {
            this.props.navigation.navigate('MainTab')
        }, 100)
    }

}

export default Connect(Launcher);
