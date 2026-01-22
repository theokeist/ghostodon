import { plugins, type GhostodonPlugin } from '@ghostodon/plugins';

function openInspector(detail: any) {
  window.dispatchEvent(new CustomEvent('ghostodon:open-inspector', { detail }));
}

const builtins: GhostodonPlugin = {
  id: 'ghostodon.builtins',
  name: 'Built-ins',
  navItems: [
    {
      id: 'connect',
      label: 'Connect',
      shortcutHint: 'UI',
      onSelect: () => openInspector({ type: 'connect' })
    },
    {
      id: 'stages',
      label: '28 Stages',
      shortcutHint: 'UI',
      onSelect: () => openInspector({ type: 'stages' })
    },
    {
      id: 'settings',
      label: 'Settings',
      shortcutHint: 'Ctrl+,',
      onSelect: () => openInspector({ type: 'settings' })
    }
  ]
};

plugins.register(builtins);
