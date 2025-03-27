import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FaBars } from "react-icons/fa";

const Nav = styled.nav`
  background: #1e1e1e;
  padding: 1rem 2rem;
  color: #fafafa;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const MenuIcon = styled(FaBars)`
  display: none;
  font-size: 1.75rem;
  cursor: pointer;
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    display: block;
  }
`;

const NavMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    display: ${props => (props.open ? 'flex' : 'none')};
    flex-direction: column;
    background: #1e1e1e;
    position: absolute;
    top: 100%;
    right: 0;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
`;

const NavItem = styled(Link)`
  color: #fafafa;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(prev => !prev);

  return (
    <Nav>
      <NavItem to="/">Home</NavItem>

      <MenuIcon onClick={toggleMenu} />

      <NavMenu open={menuOpen}>
        <NavItem to="/Leaderboard" onClick={() => setMenuOpen(false)}>Leaderboard</NavItem>
        <NavItem to="/Teams" onClick={() => setMenuOpen(false)}>Teams</NavItem>
        <NavItem to="/AdjustPunch" onClick={() => setMenuOpen(false)}>Adjust Punch</NavItem>
        <NavItem to="/AttendanceHistory" onClick={() => setMenuOpen(false)}>Attendance History</NavItem>
        <NavItem to="/UserSettings" onClick={() => setMenuOpen(false)}>Settings</NavItem>
      </NavMenu>
    </Nav>
  );
};

export default NavBar;
