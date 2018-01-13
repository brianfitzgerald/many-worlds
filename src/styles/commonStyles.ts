import { StyleSheet, Platform, ViewStyle } from 'react-native'

import colors from './colors'

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.black,
        paddingTop: 25,
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 15
    },
    textInput: {
        height: 50,
        paddingLeft: 15,
        paddingRight: 15,
        fontSize: 24,
        width: 250,
        color: colors.white
    },
    headerText: {
        fontSize: 28,
        fontFamily: 'edmondsans',
        fontWeight: 'bold',
        color: colors.white,
        textAlign: 'center'
    },
    bodyText: {
        fontSize: 18,
        color: colors.white,
    },
    PlayerListContainer: {
        marginTop: 25,
        marginBottom: 25
    },
    PlayerListItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 50,
        marginBottom: 25,
        backgroundColor: colors.white,
        borderRadius: 10,
        minWidth: 200
    },
    PlayerListAddon: {
        fontSize: 16,
        color: colors.black,
        paddingRight: 15
    },
    PlayerListName: {
        fontSize: 24,
        color: colors.black,
        paddingLeft: 15
    },
    HeroButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 50,
        marginBottom: 25,
        backgroundColor: colors.white,
        borderRadius: 10,
        minWidth: 200
    },
    HeroButtonTitle: {
        textAlign: 'center',
        fontSize: 24,
        color: colors.black,
    },
});

export default styles