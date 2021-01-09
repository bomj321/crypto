import React, {Component} from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Http from '../../libs/http';
import CoinsItem from './CoinsItem';
import CoinSearch from './CoinSearch';
import Colors from '../../res/colors';

///Height of window
const {height} = Dimensions.get('window');
const marginTop = height / 2.5;

export class CoinsScreen extends Component {
  state = {
    coins: [],
    allCoins: [],
    loading: false,
  };

  componentDidMount = () => {
    this.getCoins();
  };

  getCoins = async () => {
    this.setState({loading: true});
    const res = await Http.instance.get(
      'https://api.coinlore.net/api/tickers/',
    );

    this.setState({coins: res.data, allCoins: res.data, loading: false});
  };

  handlePress = (coin) => {
    this.props.navigation.navigate('CoinDetail', {coin});
  };

  handleSearch = (query) => {
    const {allCoins} = this.state;
    const coinsFiltered = allCoins.filter((coin) => {
      return (
        coin.name.toLowerCase().includes(query.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(query.toLowerCase())
      );
    });

    this.setState({coins: coinsFiltered});
  };

  render() {
    const {coins, loading} = this.state;
    return (
      <View style={styles.container}>
        <CoinSearch onChange={this.handleSearch} />
        {loading ? (
          <ActivityIndicator color="black" size="large" style={styles.loader} />
        ) : null}
        <FlatList
          data={coins}
          renderItem={({item}) => (
            <CoinsItem
              item={item}
              onPress={() => this.handlePress(item)}></CoinsItem>
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.charade,
  },

  titleText: {
    color: '#fff',
    textAlign: 'center',
  },
  btn: {
    padding: 8,
    backgroundColor: 'blue',
    borderRadius: 8,
    margin: 16,
  },
  btnText: {
    color: '#fff',
    textAlign: 'center',
  },
  loader: {
    marginTop: marginTop,
  },
});

export default CoinsScreen;
