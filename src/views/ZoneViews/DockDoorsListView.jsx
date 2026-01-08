import React, { useState, createContext, useContext } from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Users, MapPin, ClipboardList, Calendar, DollarSign, ChevronRight, ChevronLeft, ChevronDown, Clock, Package, Truck, AlertTriangle, ArrowRight, ArrowUpRight, ArrowDownRight, Zap, Sun, Moon, Star, UserCheck, UserX, UserPlus, Wrench, CheckCircle, Info, AlertOctagon, LayoutDashboard, Radio, TrendingUp, TrendingDown, Search, Filter, X, RotateCcw, GripVertical, Grid3X3, BoxSelect, Lightbulb, Coffee, MoreVertical, MoreHorizontal, Eye, RefreshCw, MapPinIcon, Settings, Trash2, Navigation, Route, Activity, Minus, Fuel, Play, Circle, Plus } from 'lucide-react';

// Import design system
import { C, sp } from '../../styles/designSystem';

// Import context
import { useTimeContext } from '../../context/TimeContext';

// Legacy dock doors list view - keeping for reference
const DockDoorsListView = ({ zoneId, onBack, onBackToZones, onBackToExec }) => {
  const { contextualTime, isContextualDifferent, isContextualPast, interpolateValue } = useTimeContext();

  const zoneName = zoneId === 'Z01' ? 'Inbound A' : 'Inbound B';
  const dockDoors = zoneId === 'Z01' ? ['D01', 'D02', 'D03', 'D04'] : ['D05', 'D06', 'D07', 'D08'];

  // Detailed dock door data
  const dockData = [
    { door: 'D01', status: 'occupied', trailer: 'TRL-1000', carrier: 'FedEx Ground', type: 'Inbound', arrived: '08:15', pallets: 18, unloaded: 15, progress: 83, eta: '10:30', dwellTime: 105, onTime: true },
    { door: 'D02', status: 'occupied', trailer: 'TRL-1001', carrier: 'UPS Freight', type: 'Inbound', arrived: '09:02', pallets: 24, unloaded: 10, progress: 42, eta: '11:15', dwellTime: 58, onTime: true },
    { door: 'D03', status: 'occupied', trailer: 'TRL-1002', carrier: 'ABC Freight', type: 'Inbound', arrived: '09:45', pallets: 32, unloaded: 5, progress: 16, eta: '12:00', dwellTime: 15, onTime: false },
    { door: 'D04', status: 'available', trailer: null, carrier: null, type: null, arrived: null, pallets: 0, unloaded: 0, progress: 0, eta: null, dwellTime: 0, onTime: null }
  ];

  // Timeline for dock utilization
  const dockUtilTimeline = [
    { time: '06:00', actual: 25, predicted: null },
    { time: '07:00', actual: 50, predicted: null },
    { time: '08:00', actual: 50, predicted: null },
    { time: '09:00', actual: 75, predicted: null },
    { time: '10:00', actual: 75, predicted: 75, now: true },
    { time: '11:00', actual: null, predicted: 100, upper: 100, lower: 75 },
    { time: '12:00', actual: null, predicted: 100, upper: 100, lower: 75 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: sp.lg, background: 'white', margin: `-${sp.lg}`, padding: sp.lg, minHeight: '100vh' }}>
      {/* Time Scrubber */}
      <TimeScrubber />

      {/* Breadcrumb */}
      <Breadcrumb items={[
        { label: 'Executive Summary', onClick: onBackToExec },
        { label: 'Zones', onClick: onBackToZones },
        { label: `${zoneId} - ${zoneName}`, onClick: onBack },
        { label: 'Dock Doors' }
      ]} />

      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${C.success[500]} 0%, ${C.success[700]} 100%)`, borderRadius: 12, padding: sp.lg, color: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: sp.lg }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: sp.md }}>
            <div style={{ padding: sp.sm, background: 'rgba(255,255,255,0.15)', borderRadius: 10 }}>
              <MapPin style={{ width: 28, height: 28 }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                <h2 style={{ fontSize: '26px', fontWeight: 300, margin: 0 }}>Dock Doors</h2>
                <Badge status="success" label={`${dockData.filter(d => d.status === 'occupied').length}/${dockDoors.length} occupied`} />
              </div>
              <p style={{ opacity: 0.8, fontSize: '14px', marginTop: 4 }}>{zoneId} - {zoneName} • Inbound Receiving</p>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ opacity: 0.7, fontSize: '12px' }}>Dock Utilization</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: sp.sm, flexWrap: 'wrap' }}>
              <span style={{ fontSize: '42px', fontWeight: 300 }}>75%</span>
              {isContextualDifferent && interpolateValue(dockUtilTimeline, contextualTime) && (
                <>
                  <ArrowRight style={{ width: 14, height: 14, opacity: 0.7 }} />
                  <span style={{ fontSize: '20px', fontWeight: 500, padding: '2px 8px', background: 'rgba(47, 114, 255, 0.4)', borderRadius: 4 }}>
                    {Math.round(interpolateValue(dockUtilTimeline, contextualTime))}%
                  </span>
                </>
              )}
              <ArrowRight style={{ width: 16, height: 16, opacity: 0.7 }} />
              <span style={{ fontSize: '24px', fontWeight: 500 }}>100%</span>
            </div>
            {isContextualDifferent && <p style={{ opacity: 0.7, fontSize: '11px', marginTop: 4 }}>@{contextualTime}</p>}
          </div>
        </div>
      </div>
      <p style={{ color: C.neutral[500], textAlign: 'center' }}>Legacy list view - kept for reference</p>
    </div>
  );
};

export default DockDoorsListView;
