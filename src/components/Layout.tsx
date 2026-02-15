import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, FolderOpen, Wrench, Settings } from 'lucide-react';

const navItems = [
  { path: '/', label: '仪表盘', icon: LayoutDashboard },
  { path: '/sessions', label: '会话历史', icon: MessageSquare },
  { path: '/projects', label: '项目分析', icon: FolderOpen },
  { path: '/tools', label: '工具使用', icon: Wrench },
  { path: '/settings', label: '设置', icon: Settings },
];

function Layout() {
  return (
    <div className="flex min-h-screen bg-bg-primary">
      {/* Sidebar */}
      <aside className="w-60 bg-bg-secondary border-r border-border-color flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-border-color">
          <h1 className="text-xl font-bold gradient-text">Claude Dashboard</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-accent-primary/20 text-accent-primary'
                        : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
                    }`
                  }
                >
                  <item.icon size={18} />
                  <span className="text-sm font-medium">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border-color">
          <NavLink
            to="/settings"
            className="flex items-center gap-2 text-text-muted text-xs hover:text-text-secondary transition-colors"
          >
            <Settings size={14} />
            <span>v1.0.0</span>
          </NavLink>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
