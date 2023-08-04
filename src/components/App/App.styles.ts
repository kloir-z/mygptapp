import styled from "@emotion/styled";
import styledreact, { css, keyframes } from "@emotion/react";

export const MainContainer = styled.div`
  display: flex;
  flex-grow: 1;
  overflow: hidden;
`;

export const Placeholder = styled.div`
  color: #ebebeb;
  margin: 1rem;
  flex: 1;
`;

const slideIn = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(0);
  }
`;

const slideOut = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
`;

interface SidebarWrapperProps {
  open: boolean;
}

export const SidebarWrapper = styled.div<SidebarWrapperProps>`
  ${props => props.open ? css`
    animation: ${slideIn} 0.2s forwards;
  ` : css`
    animation: ${slideOut} 0.2s forwards;
  `}
`;