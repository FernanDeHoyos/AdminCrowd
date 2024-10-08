import { useState } from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { mainListItems, secondaryListItems } from './ListItems';
import Chart from './Chart';
import { Orders } from './Orders';
import { useAuth } from '../../Hooks/useAuth';
import { Maps } from '../components/Maps';
import { useIncidentStore } from '../../Hooks/useIncidentStore';
import IncidentSummary from './IncidentSummary';
import IncidentBarChart from './IncidentBarChart';
import { DetailZoneMap } from '../components/DetailZoneMap';
import { PieCharts } from './PieChart';
import { HorizontalBars } from './HorizontalBars';
import { AddUser } from './AddUser';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const defaultTheme = createTheme();

export default function Dashboard() {
  const [open, setOpen] = useState(true);
  const { incidents } = useIncidentStore();
  const [selectedComponent, setSelectedComponent] = useState('Dashboard');
  const { starLogout } = useAuth();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const onLogout = () => {
    starLogout();
    console.log('ha salido');
  };

  const handleListItemClick = (item) => {
    setSelectedComponent(item);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar sx={{ pr: '24px' }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{ marginRight: '36px', ...(open && { display: 'none' }) }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Dashboard
            </Typography>
            <IconButton color="inherit" onClick={onLogout}>
              <LogoutOutlinedIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', px: [1] }}>
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            {mainListItems(handleListItemClick)}
            <Divider sx={{ my: 1 }} />
            {secondaryListItems(handleListItemClick)}
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {selectedComponent === 'Dashboard' && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={8} lg={9}>
                  <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 240 }}>
                    <Chart />
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4} lg={3}>
                  <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 240 }}>
                    <IncidentSummary />
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                    <Orders />
                  </Paper>
                </Grid>
              </Grid>
            )}
            {selectedComponent === 'Incidentes' && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '80vh' }}>
                    <Box sx={{ height: '100%', width: '100%' }}>
                      <Maps incidents={incidents} />
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            )}
            {selectedComponent === 'Detalles' && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={12} lg={12}>
                  <Paper sx={{ mb: 3, p: 2, display: 'flex', flexDirection: 'column', height: '70vh' }}>
                    <PieCharts incidents={incidents}  />
                  </Paper>
                  <Paper sx={{ mb: 3, p: 2, display: 'flex', flexDirection: 'column', height: '70vh' }}>
                    <IncidentBarChart />
                  </Paper>
                  <Paper sx={{ mb: 3, p: 2, display: 'flex', flexDirection: 'column', height: '70vh' }}>
                    <HorizontalBars />
                  </Paper>
                  <Paper sx={{ mb: 3, p: 2, display: 'flex', flexDirection: 'column', height: '70vh' }}>
                    <Chart />
                  </Paper>
                </Grid>
              </Grid>
            )}
            {selectedComponent === 'Integrations' && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '80vh' }}>
                    <Box sx={{ height: '100%', width: '100%' }}>
                      <DetailZoneMap incidents={incidents} />
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            )}
            {selectedComponent === 'user' && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '80vh' }}>
                    <Box sx={{ height: '100%', width: '100%' }}>
                      <AddUser />
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            )}



          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
