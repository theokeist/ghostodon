export type NavItem = {
  id: string;
  label: string;
  route?: string;
  shortcutHint?: string;
  onSelect?: () => void;
};

export type InspectorExtension = {
  id: string;
  title: string;
  render: () => unknown; // intentionally loose; web layer wraps in React
};

export type GhostodonPlugin = {
  id: string;
  name: string;
  // Optional contributions
  navItems?: NavItem[];
  inspectorPanels?: InspectorExtension[];
};

export class PluginRegistry {
  private plugins = new Map<string, GhostodonPlugin>();

  register(plugin: GhostodonPlugin) {
    if (this.plugins.has(plugin.id)) throw new Error(`Plugin already registered: ${plugin.id}`);
    this.plugins.set(plugin.id, plugin);
  }

  list(): GhostodonPlugin[] {
    return Array.from(this.plugins.values());
  }

  navItems(): NavItem[] {
    return this.list().flatMap((p) => p.navItems ?? []);
  }

  inspectorPanels(): InspectorExtension[] {
    return this.list().flatMap((p) => p.inspectorPanels ?? []);
  }
}

// Default singleton used by the app.
export const plugins = new PluginRegistry();
