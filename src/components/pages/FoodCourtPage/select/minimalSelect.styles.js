export default () => ({
  select: {
    display: 'flex',
    alignItems : "Center",
    width:"182px",
    minWidth: 120,
    maxWidth: 182,
    background: '#F8FAFB',
    borderRadius: 10,
    border: "none" ,
    height: "44px",
    boxShadow: 'none',
    fontFamily: 'Source Sans Pro',
    fontWeight: 400,
    fontSize: 20,
    lineheight: 24,
    padding: '0 10%',
    boxSizing: "border-box",
    color: "#838FA6",

    "&:focus":{
      borderRadius: 10,
      background: '#F8FAFB',
    },
    
    "& > div":{
      
      display:'inline-flex' // this shows the icon in the SelectInput but not the dropdown
    }
  },
  icon:{
    display: 'flex',
    alignItems : "Center",
    marginRight: 10,
    color: '#7764CA',
    userSelect: 'none',
    pointerEvents: 'none',
  },
  paper: {
    
    borderRadius: 10,
    marginTop: 5,

  },
  
  list: {
    width:"100%",
    minWidth: 120,
    maxWidth: 282,
    height: 'auto',
    paddingTop:0,
    paddingBottom:0,
    background:'#F8FAFB',
    border: "none" ,


    "& li":{
      fontFamily: 'Source Sans Pro',
      fontWeight: 400,
    fontSize: 18,
    lineheight: 20,
      paddingTop:8,
      paddingBottom:8,
    },
    "& li:hover":{
      borderRadius: 5,
      color: '#fff',
      background: '#7764CA'
    },
    "& li.Mui-selected":{
      color:'#424242',
      background: '#F8FAFB'
    },
    "& li.Mui-selected:hover":{
      borderRadius: 5,
      color: '#fff',
      background: '#7764CA'
    }
  },

});