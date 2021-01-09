import React, {Component} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import FavoriteEmptyState from './FavoriteEmptyState';
import CoinsItem from '../coins/CoinsItem';
import Colors from '../../res/colors';
import Storage from '../../libs/storage';
export class FavoritesScreen extends Component {
  state = {favorites: []};

  getFavorites = async () => {
    try {
      const allKeys = await Storage.instance.getAllkeys();
      const keys = allKeys.filter((key) => key.includes('favorite-'));

      const favs = await Storage.instance.multiGet(keys);

      const favorites = favs.map((fav) => JSON.parse(fav[1]));

      this.setState({favorites});
    } catch (err) {}
  };

  handlePress = (coin) => {
    this.props.navigation.navigate('CoinDetail', {coin});
  };

  componentDidMount() {
    this.getFavorites();

    this.props.navigation.addListener('focus', this.getFavorites);
  }

  componentWillUnmount() {
    this.props.navigation.removeListener('focus', this.getFavorites);
  }

  render() {
    const {favorites} = this.state;
    return (
      <View style={styles.container}>
        {favorites.length === 0 ? (
          <FavoriteEmptyState />
        ) : (
          <FlatList
            data={favorites}
            renderItem={({item}) => (
              <CoinsItem item={item} onPress={() => this.handlePress(item)} />
            )}
          />
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.charade,
  },
});

export default FavoritesScreen;
