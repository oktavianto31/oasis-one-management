export default () => ({
  select: {
    display:'flex',
    alignItems: 'center',
    minWidth: 217,
    background: '#F8FAFB',
    borderRadius: 10,
    border: "none" ,
    height:'39px',
    boxShadow: 'none',
    fontFamily: 'Nunito Sans, sans-serif',
    fontWeight: 600,
    fontSize: '18px',
    lineheight: '25px',
    paddingLeft: "8%",
    boxSizing: "border-box",
    color: "#424242",

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
    marginRight: 5,
    color: '#949494',
    userSelect: 'none',
    pointerEvents: 'none',
  },
  icondisabled:{
    display: 'flex',
    alignItems : "Center",
    marginRight: 5,
    color: '#C4C4C4',
    userSelect: 'none',
    pointerEvents: 'none',
  },
  paper: {
    borderRadius: 10,
    marginTop: 0,
    height: 200,
  },
  
  list: {
    display:'flex',
    flexDirection: 'column',
    height:'auto !important',
    fontFamily: "Nunito Sans, sans-serif",
      fontWeight: 600,
      fontSize: '16px',
      lineHeight: '25px',
      padding: '0px 0px',
    background:'#F8FAFB !important',
    border: "none" ,

    "& li":{
      paddingTop:12,
      paddingBottom:12,
      background:'#F8FAFB !important',
    },
    "& li:hover":{
      width: '100%',
      borderRadius: 5,
      background: '#949494 !important'
    },
    "& li.Mui-selected":{
      color:'#424242',
      background: '#F8FAFB !important'
    },
    "& li.Mui-selected:hover":{
      width: '100%',
      borderRadius: 5,
      background: '#949494 !important'
    }
  },

});