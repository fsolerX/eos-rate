import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import { connect } from 'react-redux'
import AppBar from '@material-ui/core/AppBar'
import CircularProgress from '@material-ui/core/CircularProgress'
import FingerprintIcon from '@material-ui/icons/Fingerprint'
import IconButton from '@material-ui/core/IconButton'
import LogoutIcon from '@material-ui/icons/ExitToApp'
import MenuIcon from '@material-ui/icons/Menu'
import SearchIcon from '@material-ui/icons/Search'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { fade } from '@material-ui/core/styles/colorManipulator'
import { withStyles } from '@material-ui/core/styles'
import { Link } from '@reach/router'

import InputAutocomplete from 'components/input-autocomplete'
import MobileSearch from 'components/mobile-search'
import LanguageSelect from 'components/language-select'
import FilterSelect from 'components/filter-select'

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  link: {
    color: 'white',
    textDecoration: 'none'
  },
  linkHover: {
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: 10
    }
  },
  grow: {
    flexGrow: 1
  },
  title: {
    width: 140,
    [theme.breakpoints.up('sm')]: {
      display: 'block',
      width: 210
    }
  },
  menuButton: {
    marginLeft: -18,
    [theme.breakpoints.up('sm')]: {
      marginRight: 10
    }
  },
  search: {
    position: 'relative',
    flexGrow: 1,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'block',
      width: 'auto'
    }
  },
  mobileSearch: {
    [theme.breakpoints.up('md')]: {
      display: 'none'
    }
  },
  inputRoot: {
    color: 'inherit',
    width: '100%'
  },
  inputInput: {
    paddingTop: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(10),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200
    }
  },
  sessionText: {
    marginLeft: 5,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'inline'
    }
  }
})

const MainTopBar = ({
  classes,
  isSearchOpen,
  handleDrawerToggle,
  handleSearchDialogOpen,
  handleSearchDialogClose,
  ual,
  getUserChainData,
  setUser,
  setSortBy,
  showSortSelected,
  setShowSortSelected
}) => {
  const { t } = useTranslation('translations')

  useEffect(() => {
    async function getData () {
      if (ual.activeUser) {
        await getUserChainData({ accountName: ual.activeUser.accountName })
      }
    }

    getData()
  }, [ual.loading])

  useEffect(() => {
    if (window.location.pathname !== '/block-producers' && showSortSelected) {
      setShowSortSelected(false)
    }
  })

  return (
    <AppBar position='absolute'>
      <Toolbar>
        <IconButton
          className={classes.menuButton}
          color='inherit'
          aria-label='Menu'
          onClick={handleDrawerToggle}
        >
          <MenuIcon />
        </IconButton>
        <Link to='/' className={classes.link}>
          <img src='/logo.png' alt='EOS Rate' className={classes.title} />
        </Link>
        <div className={classes.grow} />
        <div className={classes.search}>
          <InputAutocomplete />
        </div>
        <div className={classes.grow} />
        <IconButton
          className={classes.mobileSearch}
          color='inherit'
          disabled={isSearchOpen}
          onClick={handleSearchDialogOpen}
        >
          <SearchIcon />
        </IconButton>
        {showSortSelected && <FilterSelect onHandleApplySortBy={setSortBy} />}
        <LanguageSelect />
        {ual.activeUser ? (
          <>
            <Link to='/account' className={classes.link}>
              <IconButton color='inherit'>
                <AccountCircleIcon />
                <Typography className={classes.sessionText} variant='subtitle1'>
                  {ual.activeUser.accountName}
                </Typography>
              </IconButton>
            </Link>
            <IconButton
              color='inherit'
              onClick={() => {
                ual.logout()
                setUser()
              }}
            >
              <LogoutIcon />
            </IconButton>
          </>
        ) : (
          <>
            <IconButton color='inherit' onClick={() => ual.showModal()}>
              {ual.loading ? (
                <CircularProgress color='secondary' size={20} />
              ) : (
                <>
                  <FingerprintIcon />
                  <Typography
                    className={classes.sessionText}
                    variant='subtitle1'
                  >
                    {t('appBarSignIn')}
                  </Typography>
                </>
              )}
            </IconButton>
          </>
        )}
      </Toolbar>
      <MobileSearch onClose={handleSearchDialogClose} isOpen={isSearchOpen} />
    </AppBar>
  )
}

MainTopBar.propTypes = {
  classes: PropTypes.object,
  handleDrawerToggle: PropTypes.func,
  handleSearchDialogOpen: PropTypes.func,
  handleSearchDialogClose: PropTypes.func,
  isSearchOpen: PropTypes.bool,
  ual: PropTypes.object,
  getUserChainData: PropTypes.func,
  setUser: PropTypes.func,
  setSortBy: PropTypes.func,
  showSortSelected: PropTypes.bool,
  setShowSortSelected: PropTypes.func
}

const mapStatetoProps = ({ blockProducers }) => ({
  showSortSelected: blockProducers.showSortSelected
})

const mapDispatchToProps = ({ user, blockProducers }) => ({
  getUserChainData: user.getUserChainData,
  setUser: user.removeBlockProducersVotedByUser,
  setSortBy: blockProducers.setSortBy,
  setShowSortSelected: blockProducers.setShowSortSelected
})

export default withStyles(styles)(connect(mapStatetoProps, mapDispatchToProps)(MainTopBar))
