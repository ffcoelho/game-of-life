export interface MenuModel {
  display: MenuItemModel[];
  zoom: MenuItemModel[];
  tools: MenuItemModel[];
  edit: MenuItemModel[];
  game: MenuItemModel[];
  play: MenuItemModel[];
  selector: MenuItemModel[];
  mode: MenuMode;
}

interface MenuItemModel {
  actionId?: string;
  mode?: MenuMode;
  led?: boolean;
  disabled: boolean;
  icon: string;
  tooltip: string;
}

export enum MenuMode {
  PLAY = 0,
  BUILD = 1
}

export const MENU: MenuModel = {
  display: [
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
    }
  ],
  zoom: [
    {
      actionId: 'zoomIn',
      disabled: false,
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
    }
  ],
  tools: [
    {
      actionId: 'pan',
      disabled: false,
      led: false,
      icon: 'pan',
      tooltip: 'Pan tool'
    },
    {
      actionId: 'draw',
      disabled: false,
      led: false,
      icon: 'draw',
      tooltip: 'Draw tool'
    }
  ],
  edit: [
    {
      actionId: 'clear',
      disabled: false,
      led: false,
      icon: 'close',
      tooltip: 'Clear'
    },
    {
      actionId: 'load',
      disabled: false,
      led: false,
      icon: 'folder',
      tooltip: 'Load'
    },
    {
      actionId: 'save',
      disabled: false,
      led: false,
      icon: 'save',
      tooltip: 'Save'
    }
  ],
  game: [
    {
      actionId: 'restart',
      disabled: false,
      led: false,
      icon: 'restart',
      tooltip: 'Restart'
    },
    {
      actionId: 'skip',
      disabled: false,
      led: false,
      icon: 'skip_fwd',
      tooltip: 'Next'
    }
  ],
  play: [
    {
      actionId: 'play',
      disabled: false,
      led: false,
      icon: 'play',
      tooltip: 'Play'
    },
    {
      actionId: 'play',
      disabled: false,
      led: false,
      icon: 'pause',
      tooltip: 'Pause'
    }
  ],
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
  ],
  mode: MenuMode.BUILD
};
