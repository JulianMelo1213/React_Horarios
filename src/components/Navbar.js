// src/components/Navbar.js
import React, { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Typography, IconButton, Drawer, List,
  ListItem, ListItemIcon, ListItemText, Collapse
} from '@mui/material';
import { Menu as MenuIcon, Home as HomeIcon, ExpandLess, ExpandMore, School as SchoolIcon, Build as BuildIcon, BarChart as BarChartIcon, CalendarToday as CalendarIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import authService from "../services/authServices";

const Navbar = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openMaintenance, setOpenMaintenance] = useState(false);
  const [openReports, setOpenReports] = useState(false);
  const [role, setRole] = useState(null);


  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setOpenDrawer(open);
  };

  const handleMaintenanceClick = () => {
    setOpenMaintenance(!openMaintenance);
  };

  const handleReportsClick = () => {
    setOpenReports(!openReports);
  };

  useEffect(() => {
    const handleRoleUpdate = () => {
      const userRole = authService.getRole();
      setRole(userRole);
    };  console.log(authService.getRole())

    // Set the role when the component mounts
    handleRoleUpdate();

    // Add event listener for role updates
    window.addEventListener('roleUpdated', handleRoleUpdate);

    // Clean up the event listener
    return () => {
      window.removeEventListener('roleUpdated', handleRoleUpdate);
    };
    
  }, []);

  return (
    <div>
      <AppBar position="fixed">
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
          onClick={toggleDrawer(false)}
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
            {role === 'Administrador' && (
              <>
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
                    <ListItem button component={Link} to="/profesores" onClick={toggleDrawer(false)} sx={{ pl: 4 }}>
                      <SchoolIcon />
                      <ListItemText primary="Profesores" />
                    </ListItem>
                    <ListItem button component={Link} to="/inscripciones" onClick={toggleDrawer(false)} sx={{ pl: 4 }}>
                      <SchoolIcon />
                      <ListItemText primary="Inscripciones" />
                    </ListItem>
                    <ListItem button component={Link} to="/clases" onClick={toggleDrawer(false)} sx={{ pl: 4 }}>
                      <SchoolIcon />
                      <ListItemText primary="Clases" />
                    </ListItem>
                    <ListItem button component={Link} to="/horarios" onClick={toggleDrawer(false)} sx={{ pl: 4 }}>
                      <SchoolIcon />
                      <ListItemText primary="Horarios" />
                    </ListItem>
                    <ListItem button component={Link} to="/horarioDia" onClick={toggleDrawer(false)} sx={{ pl: 4 }}>
                      <SchoolIcon />
                      <ListItemText primary="Horario-Dias" />
                    </ListItem>
                    <ListItem button component={Link} to="/horarioAsignatura" onClick={toggleDrawer(false)} sx={{ pl: 4 }}>
                      <SchoolIcon />
                      <ListItemText primary="Horario-Asignatura" />
                    </ListItem>
                    <ListItem button component={Link} to="/dias" onClick={toggleDrawer(false)} sx={{ pl: 4 }}>
                      <SchoolIcon />
                      <ListItemText primary="Dias" />
                    </ListItem>
                  </List>
                </Collapse>
                <ListItem button onClick={handleReportsClick}>
                  <ListItemIcon>
                    <BarChartIcon />
                  </ListItemIcon>
                  <ListItemText primary="Reportes" />
                  {openReports ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={openReports} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItem button component={Link} to="/reporteUtilizacionAulas" onClick={toggleDrawer(false)} sx={{ pl: 4 }}>
                      <BarChartIcon />
                      <ListItemText primary="Utilización de Aulas" />
                    </ListItem>
                    <ListItem button component={Link} to="/reporteHorariosProfesores" onClick={toggleDrawer(false)} sx={{ pl: 4 }}>
                      <BarChartIcon />
                      <ListItemText primary="Horarios de Profesores" />
                    </ListItem>
                    <ListItem button component={Link} to="/reporteHorariosEstudiantes" onClick={toggleDrawer(false)} sx={{ pl: 4 }}>
                      <BarChartIcon />
                      <ListItemText primary="Horarios de Estudiantes" />
                    </ListItem>
                  </List>
                </Collapse>
              </>
            )}
            {role === 'Estudiante' && (
              <ListItem button component={Link} to="/calendarioHorarios" onClick={toggleDrawer(false)}>
                <ListItemIcon>
                  <CalendarIcon />
                </ListItemIcon>
                <ListItemText primary="Calendario de clases" />
              </ListItem>
            )}
            {role === 'Profesor' && (
              <ListItem button component={Link} to="/calendarioHorarios" onClick={toggleDrawer(false)}>
                <ListItemIcon>
                  <CalendarIcon />
                </ListItemIcon>
                <ListItemText primary="Calendario de clases" />
              </ListItem>
            )}
          </List>
        </div>
      </Drawer>
    </div>
    
  );
};

export default Navbar;

