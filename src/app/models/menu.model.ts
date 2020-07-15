export interface MenuModel {
  display: MenuItemModel[];
  zoom: MenuItemModel[];
  edit: MenuItemModel[];
  save: MenuItemModel;
  tools: MenuItemModel[];
  selector: MenuItemModel[];
  game: MenuItemModel[];
  play: MenuItemModel[];
  mode: MenuMode;
}

interface MenuItemModel {
  actionId?: string;
  mode?: MenuMode;
  led?: boolean;
  disabled: boolean;
  icon?: string;
  label?: string;
  tooltip: string;
}

export interface RLEModel {
  x: number;
  y: number;
  code: string[];
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
  edit: [
    {
      actionId: 'RLE',
      disabled: false,
      led: false,
      label: 'RLE',
      tooltip: 'Import/Export'
    },
    {
      actionId: 'new',
      disabled: false,
      led: false,
      icon: 'new',
      tooltip: 'New'
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
      icon: 'save2',
      tooltip: 'Save as'
    }
  ],
  save: {
    actionId: 'quickSave',
    disabled: false,
    led: false,
    icon: 'save',
    tooltip: 'Save'
  },
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
  game: [
    {
      actionId: 'skip',
      disabled: false,
      led: false,
      icon: 'skip_fwd',
      tooltip: 'Next'
    },
    {
      actionId: 'restart',
      disabled: false,
      led: false,
      icon: 'restart',
      tooltip: 'Restart'
    },
    {
      actionId: 'speed',
      disabled: false,
      led: false,
      icon: 'timer',
      tooltip: 'Game speed'
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
  mode: MenuMode.BUILD
};
