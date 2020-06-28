export interface MenuModel {
  build: MenuItemModel[];
  fixed: MenuItemModel[];
  game: MenuItemModel[];
  mode: MenuMode;
  selector: SelectorItemModel[];
}

interface MenuItemModel {
  actionId: string;
  disabled: boolean;
  led: boolean;
  icon: string;
  tooltip: string;
}

interface SelectorItemModel {
  disabled: boolean;
  mode: MenuMode;
  icon: string;
  tooltip: string;
}

export enum MenuMode {
  NONE = 0,
  PLAY = 1,
  BUILD = 2
}

export const MENU: MenuModel = {
  build: [
  ],
  fixed: [
    {
      actionId: 'colors',
      disabled: false,
      led: false,
      icon: 'colors',
      tooltip: 'Colors'
    },
    {
      actionId: 'ruler',
      disabled: false,
      led: false,
      icon: 'ruler',
      tooltip: 'Ruler'
    },
    {
      actionId: 'lines',
      disabled: false,
      led: false,
      icon: 'lines',
      tooltip: 'Ruler lines'
    },
    {
      actionId: 'zoomIn',
      disabled: true,
      led: false,
      icon: 'zoom_in',
      tooltip: 'Zoom in'
    },
    {
      actionId: 'zoomOut',
      disabled: false,
      led: false,
      icon: 'zoom_out',
      tooltip: 'Zoom out'
    },
    {
      actionId: 'panTool',
      disabled: false,
      led: false,
      icon: 'pan',
      tooltip: 'Pan tool'
    }
  ],
  game: [
    {
      actionId: 'speed',
      disabled: false,
      led: false,
      icon: 'speed',
      tooltip: 'Speed'
    },
    {
      actionId: 'restart',
      disabled: false,
      led: false,
      icon: 'restart',
      tooltip: 'Load state'
    },
    {
      actionId: 'skip',
      disabled: false,
      led: false,
      icon: 'skip_fwd',
      tooltip: 'Next'
    },
    {
      actionId: 'play',
      disabled: false,
      led: false,
      icon: 'play',
      tooltip: 'Play'
    }
  ],
  mode: MenuMode.NONE,
  selector: [
    {
      disabled: false,
      mode: MenuMode.BUILD,
      icon: 'build',
      tooltip: 'Build mode'
    },
    {
      disabled: false,
      mode: MenuMode.PLAY,
      icon: 'game',
      tooltip: 'Game mode'
    }
  ]
};
