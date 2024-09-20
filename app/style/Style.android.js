import { StyleSheet } from 'react-native';

export default Styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    Header: {
        flexDirection: 'row',
        backgroundColor: '#104c87',
        height: 55,
        width: '100%',
        borderBottomColor:'#e0e0e2',
        borderBottomWidth:1,
        borderStyle:'solid',
        alignItems: 'center',
    },
    Header_left:{flex:5},
    Header_left_IconLeft:{ width: 25, height: 25, resizeMode: 'contain' },
    Header_center:{flex:7,justifyContent:'center',alignItems:'center'},
    Header_right:{flex:5,alignItems:'flex-end',justifyContent:'flex-end'},
    Header_Title_Text:{fontSize:18,color:'#fff'},
    Header_Button:{padding:10},
    Header_Icon : { width: 20, height: 20, resizeMode: 'contain' },
    DrawerMenuItem:{
        padding:10,
        borderBottomWidth:1,
        borderBottomColor:'#d6d6d650',
        borderStyle:'solid',
    },
    DrawerMenuItem_Text: {
        fontSize:14,
    },

    Button:{paddingLeft:10,paddingRight:10,paddingTop:5,paddingBottom:5,marginLeft:7},
    ButtonSuccess:{backgroundColor:'#80bc7a',},
    ButtonDanger:{backgroundColor:'#e07070',},

    LoadingView :{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#a8a8a860' },
    
    card_header: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        backgroundColor: '#f0f3fb',
    
        borderStyle: 'solid',
        borderBottomWidth: 1,
        borderBottomColor: '#c1c1c1',
      },
      card_header_title: { width: '50%', },
      card_header_title_text: { fontSize: 20, },
      card_header_button: { width: '50%', flexDirection: 'row', justifyContent: 'flex-end' },
      card_header_button_TouchableHighlight: { padding: 10, },
      card_header_button_TouchableHighlight_Text: { fontSize: 18, color: '#3f5a72' },
    
      card_body_content_item: {
        flexDirection: 'row', height: 80, alignItems: 'center', padding: 10, borderStyle: 'solid',
        borderBottomWidth: 1,
        borderBottomColor: '#c1c1c1',
      },
      card_body_content_item_view_logo: { width: '15%', },
      card_body_content_item_logo: { resizeMode: 'contain', width: 50, height: 50, },
      card_body_content_item_view_shortname: { width: '20%', },
      card_body_content_item_shortname: { fontSize: 20, fontWeight: 'bold', },
      card_body_content_item_view_name: { width: '25%', },
      card_body_content_item_view_price: { width: '40%', alignItems: 'flex-end', },
      card_body_content_item_price: { fontSize: 16, fontWeight: 'bold' },
});