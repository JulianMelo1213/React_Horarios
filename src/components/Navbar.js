// src/components/Navbar.js
import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, IconButton, Drawer, List,
  ListItem, ListItemIcon, ListItemText, Collapse
} from '@mui/material';
import { Menu as MenuIcon, Home as HomeIcon, ExpandLess, ExpandMore, School as SchoolIcon, Build as BuildIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openMaintenance, setOpenMaintenance] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setOpenDrawer(open);
  };

  const handleMaintenanceClick = () => {
    setOpenMaintenance(!openMaintenance);
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Gestión de horarios
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={openDrawer} onClose={toggleDrawer(false)}>
        <div
          role="presentation"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={toggleDrawer(false)}
          style={{ width: 250 }}
        >
          <List>
            <ListItem button component={Link} to="/" onClick={toggleDrawer(false)}>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Inicio" />
            </ListItem>
            <ListItem button onClick={handleMaintenanceClick}>
              <ListItemIcon>
                <BuildIcon />
              </ListItemIcon>
              <ListItemText primary="Mantenimiento" />
              {openMaintenance ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openMaintenance} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem button component={Link} to="/aulas" onClick={toggleDrawer(false)} sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <SchoolIcon />
                  </ListItemIcon>
                  <ListItemText primary="Aulas" />
                </ListItem>
                <ListItem button component={Link} to="/estudiantes" onClick={toggleDrawer(false)} sx={{ pl: 4 }}>
                <ListItemIcon>
                    <SchoolIcon />
                  </ListItemIcon>
                  <ListItemText primary="Estudiantes" />
                </ListItem>
                {/* Agregar más enlaces de controladores aquí */}
              </List>
            </Collapse>
          </List>
        </div>
      </Drawer>
    </div>
  );
};

export default Navbar;
