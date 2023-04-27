export default () => ({

  select: {
    display:'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 40,
    background: 'transparent',
    border: "none" ,
    borderBottom: "2px solid #000",
    boxShadow: 'none',
    fontFamily: 'Nunito Sans, sans-serif',
    fontWeight: 600,
    fontSize: 18,
    padding: '0px 0px 0px 0px !important',
    lineheight: 25,
    boxSizing: "border-box",
    color: "#E52C32",
  },

  selectdisabled: {
    display:'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 40,
    background: 'transparent',
    border: "none" ,
    borderBottom: "2px solid #C4C4C4",
    boxShadow: 'none',
    fontFamily: 'Nunito Sans, sans-serif',
    fontWeight: 600,
    fontSize: 18,
    padding: '0px 0px 0px 0px !important',
    lineheight: 25,
    boxSizing: "border-box",
    color: "#C4C4C4",
  },
  icon:{
    display: 'none',
  },
  paper: {

    borderRadius: 5,
    marginTop: 5
  },  
  list: {
    height: '200px !important' ,
    overflowY: 'scroll',
    display:'flex',
    flexDirection: 'column',
    fontFamily: "Nunito Sans, sans-serif",
      fontWeight: 700,
      fontSize: '16px',
      lineHeight: '25px',
      padding: '0px 0px',
    background:'#F8FAFB !important',
    border: "none" ,

    "& li":{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Nunito Sans, sans-serif',
      fontWeight: '600',
      fontSize: '16px',
      lineHeight: '25px',
      padding: '15px 0px',
      color: '#e52c32',
      background:'#F8FAFB !important',
    },
    "& li:hover":{
      width: '100%',
      borderRadius: 5,
      background: '#949494 !important'
    },
    "& li.Mui-selected":{
      color: '#e52c32',
      background: '#F8FAFB !important'
    },
    "& li.Mui-selected:hover":{
      width: '100%',
      borderRadius: 5,
      background: '#949494 !important'
    }
  },

});