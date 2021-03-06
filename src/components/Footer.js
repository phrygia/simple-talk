import React, { useState } from 'react';
import styled from 'styled-components';
import { BsPersonFill } from 'react-icons/bs';
import { IoChatbubbleSharp, IoSettingsSharp } from 'react-icons/io5';
import { NavLink } from 'react-router-dom';
import { Menu, MenuItem } from '@material-ui/core';
import firebase from '../firebase';
import { useRef } from 'react';
import { useSelector } from 'react-redux';

const FooterContainer = styled.footer`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 0;
  bottom: 0;
  height: 58px;
  width: 100%;
  background-color: #15325b;
  overflow: hidden;
  padding-top: 7px;
  z-index: 99;
  & > button {
    transition: color 0.1s;
    cursor: pointer;
    background-color: transparent;
    border: 0;
  }
  & > a,
  & > button {
    * {
      color: #fff;
      transition: color 0.1s;
    }
    &.active {
      * {
        color: #f7be16;
      }
    }
  }
  .chatBtn {
    margin: 0 20%;
  }
`;

const SettingButton = styled.button`
  bottom: 20px;
  font-size: 1.1rem;
`;

const SettingsSharp = styled(IoSettingsSharp)`
  font-size: 1.6rem;
  &:hover,
  &.active {
    color: #343740;
  }
`;

const SettingMenu = styled(Menu)`
  margin: -81px 0 0 -84px;
  li,
  a {
    font-size: 0.9rem;
    font-weight: 700;
  }
`;

function Footer() {
  const [anchorEl, setAnchorEl] = useState(null);
  const user = useSelector(state => state.user.currentUser);
  const settingBtn = useRef();
  const usersRef = firebase.database().ref('users');

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleSettingClick = e => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    setAnchorEl(null);
    // 로그아웃되면 현재채팅중인 친구정보 삭제
    usersRef.child(`${user.uid}/currentChatFriend`).remove();
    firebase.auth().signOut();
  };

  return (
    <FooterContainer>
      <NavLink to="/" exact activeClassName="active" className="userBtn">
        <BsPersonFill style={{ fontSize: '1.9rem' }} />
      </NavLink>
      <NavLink to="/chat" activeClassName="active" className="chatBtn">
        <IoChatbubbleSharp style={{ fontSize: '1.6rem' }} />
      </NavLink>
      <SettingButton onClick={handleClick} ref={settingBtn}>
        <SettingsSharp />
      </SettingButton>
      <SettingMenu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem>
          <NavLink
            to="/edit/profile"
            onClick={handleSettingClick}
            activeClassName="active"
          >
            프로필 수정
          </NavLink>
        </MenuItem>
        <MenuItem onClick={handleLogout}>로그아웃</MenuItem>
      </SettingMenu>
    </FooterContainer>
  );
}

export default Footer;
