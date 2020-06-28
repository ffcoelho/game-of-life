export interface MenuModel {
  build: MenuItemModel[];
  fixed: MenuItemModel[];
  game: MenuItemModel[];
  mode: MenuMode;
  selector: SelectorItemModel[];
}

interface MenuItemModel {
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
      disabled: false,
      led: false,
      icon: 'colors',
      tooltip: 'Colors'
    },
    {
      disabled: false,
      led: false,
      icon: 'ruler',
      tooltip: 'Ruler'
    },
    {
      disabled: false,
      led: false,
      icon: 'lines',
      tooltip: 'Ruler lines'
    },
    {
      disabled: true,
      led: false,
      icon: 'zoom_in',
      tooltip: 'Zoom in'
    },
    {
      disabled: false,
      led: false,
      icon: 'zoom_out',
      tooltip: 'Zoom out'
    },
    {
      disabled: false,
      led: false,
      icon: 'pan',
      tooltip: 'Pan tool'
    }
  ],
  game: [
    {
      disabled: false,
      led: false,
      icon: 'speed',
      tooltip: 'Speed'
    },
    {
      disabled: false,
      led: false,
      icon: 'restart',
      tooltip: 'Restart'
    },
    {
      disabled: false,
      led: false,
      icon: 'skip_fwd',
      tooltip: 'Next'
    },
    {
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
