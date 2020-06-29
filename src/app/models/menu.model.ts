export interface MenuModel {
  build: MenuItemModel[];
  fixed: MenuItemModel[];
  game: MenuItemModel[];
  mode: MenuMode;
  selector: MenuModeSelectorModel[];
}

interface MenuItemModel {
  actionId: string;
  disabled: boolean;
  led: boolean;
  icon: string;
  tooltip: string;
}

interface MenuModeSelectorModel {
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
    {
      actionId: 'draw',
      disabled: false,
      led: false,
      icon: 'draw',
      tooltip: 'Draw'
    },
    {
      actionId: 'select',
      disabled: false,
      led: false,
      icon: 'select',
      tooltip: 'Select'
    },
    {
      actionId: 'cut',
      disabled: false,
      led: false,
      icon: 'cut',
      tooltip: 'Cut'
    },
    {
      actionId: 'copy',
      disabled: false,
      led: false,
      icon: 'copy',
      tooltip: 'Copy'
    },
    {
      actionId: 'paste',
      disabled: false,
      led: false,
      icon: 'paste',
      tooltip: 'Paste'
    },
    {
      actionId: 'rotate_l',
      disabled: false,
      led: false,
      icon: 'rotate_left',
      tooltip: 'Rotate Left'
    },
    {
      actionId: 'rotate_r',
      disabled: false,
      led: false,
      icon: 'rotate_right',
      tooltip: 'Rotate Right'
    },
    {
      actionId: 'flip',
      disabled: false,
      led: false,
      icon: 'flip',
      tooltip: 'Flip'
    },
    {
      actionId: 'save',
      disabled: false,
      led: false,
      icon: 'save',
      tooltip: 'Save'
    },
    {
      actionId: 'clear',
      disabled: false,
      led: false,
      icon: 'close',
      tooltip: 'Clear'
    }
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
      tooltip: 'Lines'
    },
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
      tooltip: 'Restart'
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
      tooltip: 'Start'
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
