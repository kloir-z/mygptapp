import styled from "@emotion/styled";


export const ScrollWrapper = styled.div`
  overflow-y: scroll;
  height: 100vh;
  height: 100dvh;
`;

export const MainContainer = styled.div`
  display: flex;
  flex-grow: 1;
  overflow: hidden;
`;

export const SidebarContainer = styled.div<{ showMenu: boolean; sidebarWidth: number; sidebarTransition: boolean }>`
  display: flex;
  flex-direction: column;
  flex-grow: 0;
  flex-shrink: 0;
  height: calc(100vh - 2.26rem);
  height: calc(100dvh - 2.26rem);
  overflow-x: hidden;
  overflow-y: ${props => (props.showMenu ? 'scroll' : 'hidden')};
  width: ${props => (props.showMenu ? `${props.sidebarWidth}px` : '0')};
  min-width: ${props => (props.showMenu ? '10px' : '0px')};
  outline: none;
  position: relative;
  transition: ${props => (props.sidebarTransition ? 'all 0.2s ease' : 'none')};
`;

export const Placeholder = styled.div`
  color: #ebebeb;
  margin: 1rem;
  flex: 1;
`;