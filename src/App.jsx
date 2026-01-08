import React, { useState } from 'react';
import {
  Package, LayoutDashboard, ClipboardList, Users, MapPin, Wrench,
  Calendar, DollarSign, Lightbulb, Filter, Info
} from 'lucide-react';

// Context
import { TimeProvider } from './context/TimeContext';

// Components
import AppLayout from './components/AppLayout';
import ContextualSidepanel from './components/ContextualSidepanel';
import CanvasPlaceholder from './components/CanvasPlaceholder';
import LLMSidebar from './components/LLMSidebar';
import TabLayout from './components/TabLayout';
import GlobalNavbar from './components/GlobalNavbar';
import HamburgerMenu from './components/HamburgerMenu';
import FacilityHeader from './components/FacilityHeader';

// Styles
import './styles/fonts.css';
import { C, sp, styles } from './styles/designSystem';

// Views
import Executive from './views/Executive';

// War Room Views
import DayShift from './views/WarRoom/DayShift';
import SwingShift from './views/WarRoom/SwingShift';
import NightShift from './views/WarRoom/NightShift';

// Category Views
import StaffView from './views/CategoryViews/StaffView';
import ZonesView from './views/CategoryViews/ZonesView';
import WorkView from './views/CategoryViews/WorkView';
import SchedView from './views/CategoryViews/SchedView';
import FinView from './views/CategoryViews/FinView';

// Zone Detail Views
import InboundZoneDetail from './views/ZoneViews/InboundZoneDetail';
import StorageZoneDetail from './views/ZoneViews/StorageZoneDetail';
import DockDoorsDetail from './views/ZoneViews/DockDoorsDetail';

// UI Components
import { Card, Breadcrumb } from './components/UI';

// ===== MAIN APP =====
const App = () => {
  const [view, setView] = useState('exec');
  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [targetTab, setTargetTab] = useState('dashboard');
  const [selectedItem, setSelectedItem] = useState(null);
  const [sidepanelData, setSidepanelData] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showLLMSidebar, setShowLLMSidebar] = useState(false);
  const [llmWidth, setLlmWidth] = useState(null); // null when collapsed, pixel value when expanded
  const [sidepanelWidth, setSidepanelWidth] = useState(null); // null = default 50%
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [sidepanelActiveTab, setSidepanelActiveTab] = useState('details');

  // Handler for drilling into specific nouns/items
  const handleNavigate = (type, id) => {
    console.log(`Navigate to: ${type} / ${id}`);
    setSelectedItem({ type, id });
    setView('item-detail');
  };

  // Handler for navigating to dock/location detail with optional target tab
  const handleDockDetail = (locationId, tab = 'dashboard') => {
    setSelectedLocation(locationId || 'D01');
    setTargetTab(tab);
    setView('dock-detail');
  };

  // Facility-level tabs for left navigation
  const facilityTabs = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'plans', icon: ClipboardList, label: 'Plans' },
    { id: 'staff', icon: Users, label: 'Staff' },
    { id: 'work', icon: Package, label: 'Work Content' },
    { id: 'zones', icon: MapPin, label: 'Zones' },
    { id: 'equipment', icon: Wrench, label: 'Equipment' },
    { id: 'schedule', icon: Calendar, label: 'Schedule' },
    { id: 'financial', icon: DollarSign, label: 'Financial' },
    { id: 'insights', icon: Lightbulb, label: 'Insights' },
    { id: 'config', icon: Filter, label: 'Config' }
  ];

  // Sidepanel tabs configuration
  const sidepanelTabs = [
    { id: 'details', label: 'Details', icon: Info }
  ];

  // Generate breadcrumb items based on sidepanel data
  const getSidepanelBreadcrumbs = (data) => {
    if (!data) return [];

    const items = [
      { label: 'Facility Overview', onClick: () => { setView('exec'); setSidepanelData(null); } }
    ];

    if (data.type === 'zone') {
      items.push(
        { label: 'Zones', onClick: () => { setView('zones'); setSidepanelData(null); } },
        { label: data.name || data.id }
      );
    } else if (data.type === 'alert') {
      items.push(
        { label: 'Alerts', onClick: () => { setView('exec'); setActiveTab('dashboard'); setSidepanelData(null); } },
        { label: `Alert #${data.id}` }
      );
    } else if (data.type === 'staff') {
      items.push(
        { label: 'Staff', onClick: () => { setView('staff'); setSidepanelData(null); } },
        { label: data.name || data.id }
      );
    } else if (data.type === 'equipment') {
      items.push(
        { label: 'Equipment', onClick: () => { setView('exec'); setActiveTab('equipment'); setSidepanelData(null); } },
        { label: data.name || data.id }
      );
    }

    return items;
  };

  // Render left navigation (only for Executive view)
  const renderLeftNav = () => {
    if (view !== 'exec') return null;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', paddingTop: sp.md }}>
        {facilityTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <div
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              title={tab.label}
              style={{
                width: 40,
                height: 40,
                margin: '0 auto',
                marginBottom: 4,
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                background: isActive ? C.brand[100] : 'transparent',
                border: isActive ? `2px solid ${C.brand[500]}` : '2px solid transparent',
                transition: 'all 0.15s'
              }}
            >
              <Icon style={{ width: 18, height: 18, color: isActive ? C.brand[600] : C.neutral[500] }} />
            </div>
          );
        })}
      </div>
    );
  };

  // Render LLM sidebar
  const renderLLMSidebar = () => {
    return (
      <LLMSidebar
        isExpanded={showLLMSidebar}
        onToggle={() => setShowLLMSidebar(!showLLMSidebar)}
        chatHistory={[]}
        favorites={[]}
        width={llmWidth}
        onWidthChange={setLlmWidth}
        onNewChat={() => {
          console.log('New chat started');
          // Future: Initialize new chat session
        }}
        onSelectChat={(chat) => {
          console.log('Selected chat:', chat);
          // Future: Load selected chat session
        }}
      />
    );
  };

  // Render sidepanel content - NOW RETURNS EXECUTIVE WRAPPED IN TAB LAYOUT OR CONTEXTUAL SIDEPANEL
  const renderSidepanel = () => {
    // If sidepanelData exists, show ContextualSidepanel instead of Executive
    if (sidepanelData) {
      return (
        <ContextualSidepanel
          data={sidepanelData}
          onClose={() => setSidepanelData(null)}
          facilityName="Acme Distribution"
          breadcrumbItems={getSidepanelBreadcrumbs(sidepanelData)}
          onBreadcrumbNavigate={(item) => {
            if (item.onClick) {
              item.onClick();
            }
          }}
          tabs={sidepanelTabs}
          activeTab={sidepanelActiveTab}
          onTabChange={setSidepanelActiveTab}
        />
      );
    }

    // Default: Show Executive view wrapped in TabLayout with FacilityHeader
    switch (view) {
      case 'exec':
      default:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
            {/* Fixed Header */}
            <FacilityHeader facilityName="Acme Distribution" />

            {/* Scrollable TabLayout */}
            <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
              <TabLayout
                tabs={facilityTabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              >
                <Executive
                  onCat={setView}
                  onShift={setView}
                  onZone={(zoneId) => { setSelectedZone(zoneId); setView('zone-detail'); }}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  setSidepanelData={setSidepanelData}
                />
              </TabLayout>
            </div>
          </div>
        );
    }
  };

  // Render main content area - NOW RETURNS CANVAS (swapped from renderSidepanel)
  const renderView = () => {
    switch (view) {
      case 'exec': return <CanvasPlaceholder />;
      case 'day': return <DayShift onBack={() => setView('exec')} />;
      case 'swing': return <SwingShift onBack={() => setView('exec')} />;
      case 'night': return <NightShift onBack={() => setView('exec')} />;
      case 'staff': return <StaffView onBack={() => setView('exec')} />;
      case 'zones': return <ZonesView onBack={() => setView('exec')} onZone={(zoneId) => { setSelectedZone(zoneId); setView('zone-detail'); }} />;
      case 'zone-detail':
        // Route to appropriate zone detail component (legacy full-page views)
        if (selectedZone === 'Z04') {
          return <StorageZoneDetail zoneId={selectedZone} onBack={() => setView('zones')} onBackToExec={() => setView('exec')} onNavigate={handleNavigate} />;
        }
        return <InboundZoneDetail zoneId={selectedZone} onBack={() => setView('zones')} onBackToExec={() => setView('exec')} onDockDetail={handleDockDetail} />;
      case 'item-detail':
        // Placeholder for item detail pages
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: sp.lg }}>
            <Breadcrumb items={[
              { label: 'Executive Summary', onClick: () => setView('exec') },
              { label: 'Zones', onClick: () => setView('zones') },
              { label: selectedZone, onClick: () => setView('zone-detail') },
              { label: `${selectedItem?.type}: ${selectedItem?.id}` }
            ]} />
            <Card>
              <div style={{ padding: sp.xl, textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: 16, background: C.brand[100], display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', marginBottom: sp.md }}>
                  <Package style={{ width: 32, height: 32, color: C.brand[600] }} />
                </div>
                <h2 style={{ fontSize: '24px', fontWeight: 500, marginBottom: sp.sm }}>{selectedItem?.type}</h2>
                <p style={{ fontSize: '18px', color: C.brand[600], fontFamily: 'monospace', marginBottom: sp.lg }}>{selectedItem?.id}</p>
                <p style={{ fontSize: '14px', color: C.neutral[500], marginBottom: sp.lg }}>Detail page placeholder — will be implemented based on your mockup pattern</p>
                <div style={{ display: 'flex', gap: sp.md, justifyContent: 'center' }}>
                  <button
                    onClick={() => setView('zone-detail')}
                    style={{ padding: `${sp.sm} ${sp.lg}`, background: C.brand[500], color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: '14px' }}
                  >
                    ← Back to Zone
                  </button>
                </div>
              </div>
            </Card>
          </div>
        );
      case 'work': return <WorkView onBack={() => setView('exec')} />;
      case 'dock-detail': return <DockDoorsDetail zoneId={selectedZone} locationId={selectedLocation} initialTab={targetTab} onBack={() => setView('zone-detail')} onBackToZones={() => setView('zones')} onBackToExec={() => setView('exec')} />;
      case 'sched': return <SchedView onBack={() => setView('exec')} />;
      case 'fin': return <FinView onBack={() => setView('exec')} />;
      default: return <Executive onCat={setView} onShift={setView} />;
    }
  };

  return (
    <TimeProvider>
      <style>{styles}</style>
      {/* Global navbar at top */}
      <GlobalNavbar
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
        isMenuOpen={isMenuOpen}
      />

      {/* Hamburger menu overlay */}
      <HamburgerMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />

      {/* Main application layout with top margin for fixed navbar */}
      <AppLayout
        llmSidebar={renderLLMSidebar()}
        showLLMSidebar={showLLMSidebar}
        llmWidth={llmWidth}
        leftNav={null}
        sidepanelContent={renderSidepanel()}
        showSidepanel={true}
        sidepanelWidth={sidepanelWidth}
        onSidepanelWidthChange={setSidepanelWidth}
        style={{ marginTop: 56 }}
      >
        {renderView()}
      </AppLayout>
    </TimeProvider>
  );
};

export default App;
