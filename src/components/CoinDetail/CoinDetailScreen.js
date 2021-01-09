import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  SectionList,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Pressable,
  Alert,
} from 'react-native';
import Http from '../../libs/http';
import Colors from '../../res/colors';
import Storage from '../../libs/storage';
import CoinMarketItem from './CoinMarketItem';
export class CoinDetailScreen extends Component {
  state = {
    coin: {},
    markets: [],
    isFavorite: false,
    loadingMarkets: false,
  };

  toogleFavorite = () => {
    if (this.state.isFavorite) {
      this.removeFavorite();
    } else {
      this.addFavorite();
    }
  };

  addFavorite = async () => {
    const coin = JSON.stringify(this.state.coin);
    const key = `favorite-${this.state.coin.id}`;
    const stored = await Storage.instance.store(key, coin);
    if (stored) {
      this.setState({isFavorite: true});
    }
  };

  removeFavorite = async () => {
    Alert.alert('Remove Favorite', 'Are you sure?', [
      {
        text: 'cancel',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Remove',
        onPress: async () => {
          const key = `favorite-${this.state.coin.id}`;
          await Storage.instance.remove(key);
          this.setState({isFavorite: false});
        },
        style: 'destructive',
      },
    ]);
  };

  getFavorite = async () => {
    try {
      const key = `favorite-${this.state.coin.id}`;
      const favStr = await Storage.instance.get(key);

      if (favStr != null) {
        this.setState({isFavorite: true});
      } else {
        this.setState({isFavorite: false});
      }
    } catch (error) {
      console.log('Get favorite err: ', err);
    }
  };

  getSymbolIcon = (coinNameId) => {
    if (coinNameId) {
      return `https://c1.coinlore.com/img/25x25/${coinNameId}.png`;
    }
  };

  getSections = (coin) => {
    const sections = [
      {
        title: 'Market cap',
        data: [coin.market_cap_usd],
      },
      {
        title: 'Volumen 24h',
        data: [coin.volume24],
      },
      {
        title: 'Change 24h',
        data: [coin.percent_change_24h],
      },
    ];

    return sections;
  };

  getMarkets = async (coinId) => {
    this.setState({loadingMarkets: true});

    const url = `https://api.coinlore.net/api/coin/markets/?id=${coinId}`;
    const markets = await Http.instance.get(url);
    this.setState({markets, loadingMarkets: false});
  };

  componentDidMount = async () => {
    const {coin} = this.props.route.params;
    this.props.navigation.setOptions({title: coin.symbol});

    this.getMarkets(coin.id);
    this.setState({coin}, () => {
      this.getFavorite();
    });
  };

  render() {
    const {coin, markets, loadingMarkets, isFavorite} = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.subHeader}>
          <View style={styles.row}>
            <Image
              style={styles.iconImg}
              source={{uri: this.getSymbolIcon(coin.nameid)}}
            />
            <Text style={styles.titleText}>{coin.name}</Text>
          </View>
          <Pressable
            onPress={this.toogleFavorite}
            style={[
              styles.btnFavorite,
              isFavorite ? styles.btnFavoriteRemove : styles.btnFavoriteAdd,
            ]}>
            <Text style={styles.btnFavoriteText}>
              {isFavorite ? 'Remove favorite' : 'Add favorite'}
            </Text>
          </Pressable>
        </View>

        <SectionList
          style={styles.section}
          sections={this.getSections(coin)}
          keyExtractor={(item) => item}
          renderSectionHeader={({section}) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionItem}>{section.title}</Text>
            </View>
          )}
          renderItem={({item}) => (
            <View style={styles.sectionItem}>
              <Text style={styles.itemText}>{item}</Text>
            </View>
          )}></SectionList>

        <Text style={styles.marketTitle}>Markets</Text>

        {loadingMarkets ? (
          <ActivityIndicator color="white" size="large" />
        ) : null}

        <FlatList
          style={styles.list}
          keyExtractor={(item) => `${item.base}-${item.name}-${item.quote}`}
          data={markets}
          horizontal={true}
          renderItem={({item}) => <CoinMarketItem item={item} />}></FlatList>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.charade,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },

  subHeader: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },

  iconImg: {
    width: 25,
    height: 25,
  },

  section: {
    maxHeight: 280,
  },
  list: {
    maxHeight: 100,
    // paddingLeft: 16,
  },
  sectionHeader: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: 8,
  },
  sectionItem: {
    padding: 8,
    color: Colors.white,
  },
  itemText: {
    color: Colors.white,
    fontSize: 14,
  },
  sectionText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  marketTitle: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    marginLeft: 16,
  },
  btnFavorite: {
    padding: 8,
    borderRadius: 8,
  },
  btnFavoriteText: {
    color: Colors.white,
  },
  btnFavoriteAdd: {
    backgroundColor: Colors.picton,
  },
  btnFavoriteRemove: {
    backgroundColor: Colors.carmine,
  },
});

export default CoinDetailScreen;
