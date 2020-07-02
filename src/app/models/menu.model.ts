export interface MenuModel {
  display: MenuItemModel[];
  zoom: MenuItemModel[];
  tools: MenuItemModel[];
  edit: MenuItemModel[];
  file: MenuItemModel[];
  game: MenuItemModel[];
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
      tooltip: 'Lines'
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
    },
    {
      actionId: 'select',
      disabled: false,
      led: false,
      icon: 'screen',
      tooltip: 'Select Tool'
    }
  ],
  edit: [
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
      actionId: 'clear',
      disabled: false,
      led: false,
      icon: 'close',
      tooltip: 'Clear'
    }
  ],
  file: [
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
    },
    {
      actionId: 'play',
      disabled: false,
      led: false,
      icon: 'play',
      tooltip: 'Start'
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
